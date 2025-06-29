import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppStore } from '../store/useAppStore';

// Import screens
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import DoctorsListScreen from '../screens/patient/DoctorsListScreen';
import DoctorProfileScreen from '../screens/patient/DoctorProfileScreen';
import AppointmentsScreen from '../screens/patient/AppointmentsScreen';
import BookingScreen from '../screens/patient/BookingScreen';

import DoctorHomeScreen from '../screens/doctor/DoctorHomeScreen';
import DoctorAppointmentsScreen from '../screens/doctor/DoctorAppointmentsScreen';
import AvailabilityScreen from '../screens/doctor/AvailabilityScreen';
import EarningsScreen from '../screens/doctor/EarningsScreen';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import PendingDoctorsScreen from '../screens/admin/PendingDoctorsScreen';
import ManageDoctorsScreen from '../screens/admin/ManageDoctorsScreen';
import PayoutsScreen from '../screens/admin/PayoutsScreen';

import ProfileScreen from '../screens/common/ProfileScreen';
import VideoCallScreen from '../screens/common/VideoCallScreen';

export type MainStackParamList = {
  TabNavigator: undefined;
  DoctorProfile: { doctorId: string };
  Booking: { doctorId: string };
  VideoCall: { sessionId: string; token: string; appointmentId: string };
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Doctors: undefined;
  Appointments: undefined;
  Earnings: undefined;
  PendingDoctors: undefined;
  ManageDoctors: undefined;
  Payouts: undefined;
  Availability: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const PatientTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Doctors':
            iconName = 'local-hospital';
            break;
          case 'Appointments':
            iconName = 'event';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#10B981',
      tabBarInactiveTintColor: '#6B7280',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={PatientHomeScreen} />
    <Tab.Screen name="Doctors" component={DoctorsListScreen} />
    <Tab.Screen name="Appointments" component={AppointmentsScreen} />
  </Tab.Navigator>
);

const DoctorTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = 'dashboard';
            break;
          case 'Appointments':
            iconName = 'event';
            break;
          case 'Availability':
            iconName = 'schedule';
            break;
          case 'Earnings':
            iconName = 'attach-money';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#10B981',
      tabBarInactiveTintColor: '#6B7280',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={DoctorHomeScreen} />
    <Tab.Screen name="Appointments" component={DoctorAppointmentsScreen} />
    <Tab.Screen name="Availability" component={AvailabilityScreen} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
  </Tab.Navigator>
);

const AdminTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = 'admin-panel-settings';
            break;
          case 'PendingDoctors':
            iconName = 'pending';
            break;
          case 'ManageDoctors':
            iconName = 'people';
            break;
          case 'Payouts':
            iconName = 'payment';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#10B981',
      tabBarInactiveTintColor: '#6B7280',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={AdminHomeScreen} />
    <Tab.Screen name="PendingDoctors" component={PendingDoctorsScreen} />
    <Tab.Screen name="ManageDoctors" component={ManageDoctorsScreen} />
    <Tab.Screen name="Payouts" component={PayoutsScreen} />
  </Tab.Navigator>
);

const TabNavigator: React.FC = () => {
  const { user } = useAppStore();

  switch (user?.role) {
    case 'PATIENT':
      return <PatientTabs />;
    case 'DOCTOR':
      return <DoctorTabs />;
    case 'ADMIN':
      return <AdminTabs />;
    default:
      return <PatientTabs />; // Default fallback
  }
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TabNavigator" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DoctorProfile" 
        component={DoctorProfileScreen}
        options={{ 
          title: 'Doctor Profile',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ 
          title: 'Book Appointment',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCallScreen}
        options={{ 
          title: 'Video Consultation',
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;