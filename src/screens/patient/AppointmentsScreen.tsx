import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appointmentService } from '../../services/appointmentService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Appointment } from '../../types';

export const AppointmentsScreen = ({ navigation }: any) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getPatientAppointments();
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return '#F59E0B';
      case 'COMPLETED':
        return '#10B981';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return '🕐';
      case 'COMPLETED':
        return '✅';
      case 'CANCELLED':
        return '❌';
      default:
        return '📅';
    }
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelAppointment(appointment.id),
        },
      ]
    );
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointmentId);
      await appointmentService.cancelAppointment(formData);
      loadAppointments(); // Refresh the list
      Alert.alert('Success', 'Appointment cancelled successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to cancel appointment');
    }
  };

  const handleJoinVideoCall = async (appointment: Appointment) => {
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointment.id);
      const response = await appointmentService.generateVideoToken(formData);
      
      if (response.success) {
        navigation.navigate('VideoCall', {
          sessionId: response.videoSessionId,
          token: response.token,
          appointmentId: appointment.id,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join video call');
    }
  };

  const isAppointmentActive = (appointment: Appointment) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);
    
    // Can join 30 minutes before start until end time
    return (
      (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 &&
        now < appointmentTime) ||
      (now >= appointmentTime && now <= appointmentEndTime)
    );
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
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Doctors')}>
          <Text style={styles.findDoctorsText}>Find Doctors</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appointments.length > 0 ? (
          appointments.map((appointment) => {
            const startDateTime = formatDateTime(appointment.startTime);
            const endDateTime = formatDateTime(appointment.endTime);
            const statusColor = getStatusColor(appointment.status);
            const statusIcon = getStatusIcon(appointment.status);
            const canJoinCall = appointment.status === 'SCHEDULED' && isAppointmentActive(appointment);

            return (
              <Card key={appointment.id} style={styles.appointmentCard}>
                {/* Appointment Header */}
                <View style={styles.appointmentHeader}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorAvatar}>
                      <Text style={styles.doctorInitial}>
                        {appointment.doctor.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.doctorDetails}>
                      <Text style={styles.doctorName}>
                        Dr. {appointment.doctor.name}
                      </Text>
                      <Text style={styles.doctorSpecialty}>
                        {appointment.doctor.specialty}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>
                      {statusIcon} {appointment.status}
                    </Text>
                  </View>
                </View>

                {/* Appointment Time */}
                <View style={styles.timeInfo}>
                  <Text style={styles.timeLabel}>📅 {startDateTime.date}</Text>
                  <Text style={styles.timeValue}>
                    🕐 {startDateTime.time} - {endDateTime.time}
                  </Text>
                </View>

                {/* Patient Description */}
                {appointment.patientDescription && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Your concern:</Text>
                    <Text style={styles.descriptionText}>
                      {appointment.patientDescription}
                    </Text>
                  </View>
                )}

                {/* Doctor Notes */}
                {appointment.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Doctor's notes:</Text>
                    <Text style={styles.notesText}>{appointment.notes}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  {appointment.status === 'SCHEDULED' && (
                    <>
                      {canJoinCall ? (
                        <Button
                          title="Join Video Call"
                          onPress={() => handleJoinVideoCall(appointment)}
                          style={styles.joinButton}
                        />
                      ) : (
                        <View style={styles.callInfoContainer}>
                          <Text style={styles.callInfoText}>
                            📹 Video call will be available 30 minutes before appointment
                          </Text>
                        </View>
                      )}
                      
                      <Button
                        title="Cancel Appointment"
                        variant="outline"
                        onPress={() => handleCancelAppointment(appointment)}
                        style={styles.cancelButton}
                      />
                    </>
                  )}
                </View>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No appointments scheduled</Text>
            <Text style={styles.emptyText}>
              You don't have any appointments scheduled yet. Browse our doctors and book your first consultation.
            </Text>
            <Button
              title="Find Doctors"
              onPress={() => navigation.navigate('Doctors')}
              style={styles.emptyButton}
            />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  findDoctorsText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    marginBottom: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  doctorDetails: {
    flex: 1,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeInfo: {
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    color: '#64748B',
  },
  descriptionContainer: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 8,
  },
  joinButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    borderColor: '#EF4444',
  },
  callInfoContainer: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  callInfoText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});