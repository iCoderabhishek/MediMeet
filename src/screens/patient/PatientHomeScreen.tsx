import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types';

const SPECIALTIES = [
  { name: 'General Medicine', icon: '🩺', color: '#10B981' },
  { name: 'Cardiology', icon: '❤️', color: '#EF4444' },
  { name: 'Dermatology', icon: '🧴', color: '#F59E0B' },
  { name: 'Neurology', icon: '🧠', color: '#8B5CF6' },
  { name: 'Pediatrics', icon: '👶', color: '#06B6D4' },
  { name: 'Orthopedics', icon: '🦴', color: '#84CC16' },
];

export const PatientHomeScreen = ({ navigation }: any) => {
  const { user } = useAppStore();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUpcomingAppointments = async () => {
    try {
      const response = await appointmentService.getPatientAppointments();
      const upcoming = response.appointments
        .filter((apt: Appointment) => apt.status === 'SCHEDULED')
        .slice(0, 3);
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUpcomingAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUpcomingAppointments();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
          </View>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsLabel}>Credits</Text>
            <Text style={styles.creditsValue}>{user?.credits || 0}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#10B981' }]}
              onPress={() => navigation.navigate('Doctors')}
            >
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={styles.actionText}>Find Doctors</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#3B82F6' }]}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>My Appointments</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => {
              const dateTime = formatDateTime(appointment.startTime);
              return (
                <Card key={appointment.id} style={styles.appointmentCard}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.doctorInfo}>
                      <View style={styles.doctorAvatar}>
                        <Text style={styles.doctorInitial}>
                          {appointment.doctor.name.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.doctorName}>
                          Dr. {appointment.doctor.name}
                        </Text>
                        <Text style={styles.doctorSpecialty}>
                          {appointment.doctor.specialty}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.appointmentTime}>
                      <Text style={styles.appointmentDate}>{dateTime.date}</Text>
                      <Text style={styles.appointmentTimeText}>{dateTime.time}</Text>
                    </View>
                  </View>
                </Card>
              );
            })
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No upcoming appointments</Text>
              <Text style={styles.emptyText}>
                Book your first consultation with our verified doctors
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Doctors')}
              >
                <Text style={styles.emptyButtonText}>Find Doctors</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>

        {/* Browse Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Specialties</Text>
          <View style={styles.specialtiesGrid}>
            {SPECIALTIES.map((specialty) => (
              <TouchableOpacity
                key={specialty.name}
                style={styles.specialtyCard}
                onPress={() => navigation.navigate('DoctorsBySpecialty', { 
                  specialty: specialty.name 
                })}
              >
                <Text style={styles.specialtyIcon}>{specialty.icon}</Text>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  creditsContainer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  creditsLabel: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
  },
  creditsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  appointmentCard: {
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  appointmentTimeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specialtyCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  specialtyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  specialtyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});