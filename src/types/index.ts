export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl?: string;
  role: 'UNASSIGNED' | 'PATIENT' | 'DOCTOR' | 'ADMIN';
  credits: number;
  specialty?: string;
  experience?: number;
  credentialUrl?: string;
  description?: string;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface Doctor extends User {
  role: 'DOCTOR';
  specialty: string;
  experience: number;
  credentialUrl: string;
  description: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  patientDescription?: string;
  videoSessionId?: string;
  videoSessionToken?: string;
  createdAt: string;
  updatedAt: string;
  patient?: User;
  doctor?: Doctor;
}

export interface Availability {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  formatted: string;
  day: string;
}

export interface AvailableDay {
  date: string;
  displayDate: string;
  slots: TimeSlot[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}