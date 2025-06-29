import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { authService } from '../../services/authService';
import { useAppStore } from '../../store/useAppStore';
import { SPECIALTIES } from '../../config/api';
import { Picker } from '@react-native-picker/picker';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<'role' | 'doctor-form'>('role');
  const [loading, setLoading] = useState(false);
  const [doctorData, setDoctorData] = useState({
    specialty: '',
    experience: '',
    credentialUrl: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { setUser, setAuthenticated } = useAppStore();

  const handlePatientSelection = async () => {
    setLoading(true);
    try {
      const response = await authService.setUserRole({ role: 'PATIENT' });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setAuthenticated(true);
      } else {
        Alert.alert('Error', response.error || 'Failed to set role');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validateDoctorForm = () => {
    const newErrors: Record<string, string> = {};

    if (!doctorData.specialty) {
      newErrors.specialty = 'Specialty is required';
    }

    if (!doctorData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(Number(doctorData.experience)) || Number(doctorData.experience) < 1) {
      newErrors.experience = 'Experience must be a valid number (minimum 1 year)';
    }

    if (!doctorData.credentialUrl) {
      newErrors.credentialUrl = 'Credential URL is required';
    } else if (!/^https?:\/\/.+/.test(doctorData.credentialUrl)) {
      newErrors.credentialUrl = 'Please enter a valid URL';
    }

    if (!doctorData.description || doctorData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDoctorSubmit = async () => {
    if (!validateDoctorForm()) return;

    setLoading(true);
    try {
      const response = await authService.setUserRole({
        role: 'DOCTOR',
        specialty: doctorData.specialty,
        experience: Number(doctorData.experience),
        credentialUrl: doctorData.credentialUrl,
        description: doctorData.description,
      });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setAuthenticated(true);
        Alert.alert(
          'Application Submitted',
          'Your doctor application has been submitted for review. You will be notified once verified.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to submit application');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorData = (field: string, value: string) => {
    setDoctorData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (step === 'role') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to MediMeet</Text>
            <Text style={styles.subtitle}>How would you like to use the platform?</Text>
          </View>

          <View style={styles.roleCards}>
            <Card style={styles.roleCard}>
              <Text style={styles.roleTitle}>Join as a Patient</Text>
              <Text style={styles.roleDescription}>
                Book appointments, consult with doctors, and manage your healthcare journey
              </Text>
              <Button
                title="Continue as Patient"
                onPress={handlePatientSelection}
                loading={loading}
                style={styles.roleButton}
              />
            </Card>

            <Card style={styles.roleCard}>
              <Text style={styles.roleTitle}>Join as a Doctor</Text>
              <Text style={styles.roleDescription}>
                Create your professional profile, set your availability, and provide consultations
              </Text>
              <Button
                title="Continue as Doctor"
                onPress={() => setStep('doctor-form')}
                disabled={loading}
                style={styles.roleButton}
              />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Doctor Profile</Text>
          <Text style={styles.subtitle}>
            Please provide your professional details for verification
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Medical Specialty *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={doctorData.specialty}
                onValueChange={(value) => updateDoctorData('specialty', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select your specialty" value="" />
                {SPECIALTIES.map((specialty) => (
                  <Picker.Item key={specialty} label={specialty} value={specialty} />
                ))}
              </Picker>
            </View>
            {errors.specialty && <Text style={styles.errorText}>{errors.specialty}</Text>}
          </View>

          <Input
            label="Years of Experience"
            value={doctorData.experience}
            onChangeText={(value) => updateDoctorData('experience', value)}
            placeholder="e.g. 5"
            keyboardType="numeric"
            error={errors.experience}
            required
          />

          <Input
            label="Link to Credential Document"
            value={doctorData.credentialUrl}
            onChangeText={(value) => updateDoctorData('credentialUrl', value)}
            placeholder="https://example.com/my-medical-degree.pdf"
            keyboardType="url"
            autoCapitalize="none"
            error={errors.credentialUrl}
            required
          />

          <Input
            label="Description of Your Services"
            value={doctorData.description}
            onChangeText={(value) => updateDoctorData('description', value)}
            placeholder="Describe your expertise, services, and approach to patient care..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
            error={errors.description}
            required
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={() => setStep('role')}
              variant="outline"
              disabled={loading}
              style={styles.backButton}
            />
            <Button
              title="Submit for Verification"
              onPress={handleDoctorSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  roleCards: {
    gap: 16,
  },
  roleCard: {
    alignItems: 'center',
    padding: 24,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  roleButton: {
    width: '100%',
  },
  formCard: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  backButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default OnboardingScreen;