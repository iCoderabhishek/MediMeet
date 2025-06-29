import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Doctor, TimeSlot } from '../../types';

export const DoctorProfileScreen = ({ navigation, route }: any) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    loadDoctorData();
  }, [doctorId]);

  const loadDoctorData = async () => {
    try {
      const [doctorResponse, slotsResponse] = await Promise.all([
        doctorService.getDoctorById(doctorId),
        appointmentService.getAvailableTimeSlots(doctorId),
      ]);
      
      setDoctor(doctorResponse.doctor);
      setAvailableSlots(slotsResponse.days || []);
    } catch (error) {
      console.error('Failed to load doctor data:', error);
      Alert.alert('Error', 'Failed to load doctor information');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const totalSlots = availableSlots.reduce((total, day) => total + day.slots.length, 0);

  const handleBookAppointment = () => {
    if (totalSlots === 0) {
      Alert.alert(
        'No Available Slots',
        'This doctor doesn\'t have any available appointment slots for the next 4 days.'
      );
      return;
    }
    setShowBooking(true);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    navigation.navigate('BookAppointment', {
      doctorId,
      doctor,
      slot,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Doctor not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Doctor Header */}
        <Card style={styles.doctorHeader}>
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorInitial}>
                {doctor.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{doctor.specialty}</Text>
              </View>
              <Text style={styles.experienceText}>
                {doctor.experience} years experience
              </Text>
            </View>
          </View>
          
          <Button
            title={showBooking ? "Hide Booking" : "Book Appointment"}
            onPress={() => setShowBooking(!showBooking)}
            style={styles.bookButton}
          />
        </Card>

        {/* About Doctor */}
        <Card style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About Dr. {doctor.name}</Text>
          <Text style={styles.aboutText}>{doctor.description}</Text>
        </Card>

        {/* Availability */}
        <Card style={styles.availabilityCard}>
          <Text style={styles.sectionTitle}>Availability</Text>
          {totalSlots > 0 ? (
            <View style={styles.availabilityInfo}>
              <Text style={styles.availabilityText}>
                📅 {totalSlots} time slots available for booking over the next 4 days
              </Text>
            </View>
          ) : (
            <View style={styles.noAvailability}>
              <Text style={styles.noAvailabilityText}>
                ⚠️ No available slots for the next 4 days. Please check back later.
              </Text>
            </View>
          )}
        </Card>

        {/* Booking Section */}
        {showBooking && (
          <Card style={styles.bookingCard}>
            <Text style={styles.sectionTitle}>Book an Appointment</Text>
            <Text style={styles.bookingSubtitle}>
              Select a time slot and provide details for your consultation
            </Text>
            
            {totalSlots > 0 ? (
              <View style={styles.slotsContainer}>
                {availableSlots.map((day, dayIndex) => (
                  <View key={day.date} style={styles.dayContainer}>
                    <Text style={styles.dayTitle}>{day.displayDate}</Text>
                    {day.slots.length > 0 ? (
                      <View style={styles.slotsGrid}>
                        {day.slots.map((slot: TimeSlot, slotIndex: number) => (
                          <TouchableOpacity
                            key={`${dayIndex}-${slotIndex}`}
                            style={styles.slotButton}
                            onPress={() => handleSlotSelect(slot)}
                          >
                            <Text style={styles.slotTime}>
                              {new Date(slot.startTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noSlotsText}>No available slots</Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noSlotsContainer}>
                <Text style={styles.noSlotsIcon}>📅</Text>
                <Text style={styles.noSlotsTitle}>No available slots</Text>
                <Text style={styles.noSlotsDescription}>
                  This doctor doesn't have any available appointment slots for the next 4 days. 
                  Please check back later or try another doctor.
                </Text>
              </View>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  doctorHeader: {
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  specialtyBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  experienceText: {
    fontSize: 14,
    color: '#64748B',
  },
  bookButton: {
    marginTop: 8,
  },
  aboutCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
  },
  availabilityCard: {
    marginBottom: 16,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  noAvailability: {
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  noAvailabilityText: {
    fontSize: 14,
    color: '#92400E',
  },
  bookingCard: {
    marginBottom: 16,
  },
  bookingSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  slotsContainer: {
    gap: 20,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 100,
  },
  slotTime: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  noSlotsText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noSlotsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noSlotsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noSlotsDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  },
});