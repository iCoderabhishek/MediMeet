import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doctorService } from '../../services/doctorService';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Doctor } from '../../types';

const SPECIALTIES = [
  'All',
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'Ophthalmology',
];

export const DoctorsListScreen = ({ navigation, route }: any) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialty = route?.params?.specialty;

  useEffect(() => {
    if (specialty) {
      setSelectedSpecialty(specialty);
    }
    loadDoctors();
  }, [specialty]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty]);

  const loadDoctors = async () => {
    try {
      let response;
      if (specialty && specialty !== 'All') {
        response = await doctorService.getDoctorsBySpecialty(specialty);
      } else {
        response = await doctorService.getAllDoctors();
      }
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doctor => 
        doctor.specialty === selectedSpecialty
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDoctors();
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
        <Text style={styles.title}>Find Doctors</Text>
        <Text style={styles.subtitle}>
          {filteredDoctors.length} verified doctors available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors or specialties..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Specialty Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specialtyFilter}
        contentContainerStyle={styles.specialtyFilterContent}
      >
        {SPECIALTIES.map((spec) => (
          <TouchableOpacity
            key={spec}
            style={[
              styles.specialtyChip,
              selectedSpecialty === spec && styles.specialtyChipActive,
            ]}
            onPress={() => setSelectedSpecialty(spec)}
          >
            <Text
              style={[
                styles.specialtyChipText,
                selectedSpecialty === spec && styles.specialtyChipTextActive,
              ]}
            >
              {spec}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctors List */}
      <ScrollView
        style={styles.doctorsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
            >
              <Card style={styles.doctorCard}>
                <View style={styles.doctorHeader}>
                  <View style={styles.doctorAvatar}>
                    <Text style={styles.doctorInitial}>
                      {doctor.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                    <Text style={styles.doctorExperience}>
                      {doctor.experience} years experience
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                </View>
                
                {doctor.description && (
                  <Text style={styles.doctorDescription} numberOfLines={2}>
                    {doctor.description}
                  </Text>
                )}
                
                <View style={styles.doctorFooter}>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
                  >
                    <Text style={styles.bookButtonText}>View Profile & Book</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>👨‍⚕️</Text>
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedSpecialty !== 'All'
                ? 'Try adjusting your search or filter criteria'
                : 'No verified doctors available at the moment'}
            </Text>
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#334155',
  },
  specialtyFilter: {
    marginBottom: 16,
  },
  specialtyFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  specialtyChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  specialtyChipText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  specialtyChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  doctorsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  doctorCard: {
    marginBottom: 16,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doctorInfo: {
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
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  doctorDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  },
});

export default DoctorsListScreen