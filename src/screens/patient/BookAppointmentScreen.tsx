import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appointmentService } from '../../services/appointmentService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAppStore } from '../../store/useAppStore';

export const BookAppointmentScreen = ({ navigation, route }: any) => {
  const { doctorId, doctor, slot } = route.params;
  const { user } = useAppStore();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const startDateTime = formatDateTime(slot.startTime);
  const endDateTime = formatDateTime(slot.endTime);

  const handleBookAppointment = async () => {
    if (user?.credits < 2) {
      Alert.alert(
        'Insufficient Credits',
        'You need at least 2 credits to book an appointment. Please purchase more credits.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy Credits', onPress: () => navigation.navigate('Pricing') },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('doctorId', doctorId);
      formData.append('startTime', slot.startTime);
      formData.append('endTime', slot.endTime);
      formData.append('description', description);

      await appointmentService.bookAppointment(formData);
      
      Alert.alert(
        'Appointment Booked!',
        'Your appointment has been successfully booked. You will receive a confirmation shortly.',
        [
          {
            text: 'View Appointments',
            onPress: () => navigation.navigate('Appointments'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Booking Failed', error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Confirm Appointment</Text>
        
        {/* Appointment Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Date:</Text>
            <Text style={styles.detailValue}>{startDateTime.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🕐 Time:</Text>
            <Text style={styles.detailValue}>
              {startDateTime.time} - {endDateTime.time}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💳 Cost:</Text>
            <Text style={styles.detailValue}>2 credits</Text>
          </View>
        </Card>

        {/* Doctor Information */}
        <Card style={styles.doctorCard}>
          <Text style={styles.sectionTitle}>Doctor Information</Text>
          
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorInitial}>
                {doctor.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <Text style={styles.doctorExperience}>
                {doctor.experience} years experience
              </Text>
            </View>
          </View>
        </Card>

        {/* Medical Concern */}
        <Card style={styles.concernCard}>
          <Text style={styles.sectionTitle}>Describe your medical concern</Text>
          <Text style={styles.concernSubtitle}>
            Please provide any details about your medical concern or what you'd like to discuss in the appointment.
          </Text>
          
          <TextInput
            style={styles.textArea}
            placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          <Text style={styles.concernNote}>
            This information will be shared with the doctor before your appointment.
          </Text>
        </Card>

        {/* Credit Balance Warning */}
        {user?.credits < 2 && (
          <Card style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ Insufficient Credits</Text>
            <Text style={styles.warningText}>
              You currently have {user?.credits || 0} credits. You need at least 2 credits to book this appointment.
            </Text>
            <Button
              title="Purchase Credits"
              onPress={() => navigation.navigate('Pricing')}
              style={styles.warningButton}
            />
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Change Time Slot"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Button
            title="Confirm Booking"
            onPress={handleBookAppointment}
            disabled={user?.credits < 2}
            style={styles.confirmButton}
          />
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  detailsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  doctorCard: {
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 2,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  concernCard: {
    marginBottom: 16,
  },
  concernSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 120,
    marginBottom: 8,
  },
  concernNote: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 16,
    color: '#92400E',
    marginBottom: 16,
  },
  warningButton: {
    backgroundColor: '#F59E0B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  backButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});