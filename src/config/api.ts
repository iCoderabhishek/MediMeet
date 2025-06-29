// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-domain.com/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_ROLE: '/users/role',
  },
  
  // Doctors
  DOCTORS: {
    LIST: '/doctors',
    BY_SPECIALTY: '/doctors/specialty',
    BY_ID: '/doctors',
    AVAILABILITY: '/doctors/availability',
    SET_AVAILABILITY: '/doctors/availability/set',
    APPOINTMENTS: '/doctors/appointments',
  },
  
  // Appointments
  APPOINTMENTS: {
    BOOK: '/appointments/book',
    LIST: '/appointments',
    CANCEL: '/appointments/cancel',
    UPDATE_NOTES: '/appointments/notes',
    COMPLETE: '/appointments/complete',
    VIDEO_TOKEN: '/appointments/video-token',
    AVAILABLE_SLOTS: '/appointments/available-slots',
  },
  
  // Admin
  ADMIN: {
    PENDING_DOCTORS: '/admin/doctors/pending',
    VERIFIED_DOCTORS: '/admin/doctors/verified',
    UPDATE_DOCTOR_STATUS: '/admin/doctors/status',
    PENDING_PAYOUTS: '/admin/payouts/pending',
    APPROVE_PAYOUT: '/admin/payouts/approve',
  },
  
  // Payouts
  PAYOUTS: {
    REQUEST: '/payouts/request',
    HISTORY: '/payouts/history',
    EARNINGS: '/payouts/earnings',
  },
};

export const SPECIALTIES = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
  'Other',
];