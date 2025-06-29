import { apiCall } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Doctor, Appointment, Availability, AvailableDay, ApiResponse } from '../types';

export interface SetAvailabilityData {
  startTime: string;
  endTime: string;
}

class DoctorService {
  async getDoctors(): Promise<ApiResponse<Doctor[]>> {
    return apiCall<Doctor[]>('GET', API_ENDPOINTS.DOCTORS.LIST);
  }
  
  async getDoctorsBySpecialty(specialty: string): Promise<ApiResponse<Doctor[]>> {
    return apiCall<Doctor[]>('GET', `${API_ENDPOINTS.DOCTORS.BY_SPECIALTY}/${specialty}`);
  }
  
  async getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    return apiCall<Doctor>('GET', `${API_ENDPOINTS.DOCTORS.BY_ID}/${id}`);
  }
  
  async getDoctorAvailability(): Promise<ApiResponse<Availability[]>> {
    return apiCall<Availability[]>('GET', API_ENDPOINTS.DOCTORS.AVAILABILITY);
  }
  
  async setAvailability(data: SetAvailabilityData): Promise<ApiResponse<Availability>> {
    return apiCall<Availability>('POST', API_ENDPOINTS.DOCTORS.SET_AVAILABILITY, data);
  }
  
  async getDoctorAppointments(): Promise<ApiResponse<Appointment[]>> {
    return apiCall<Appointment[]>('GET', API_ENDPOINTS.DOCTORS.APPOINTMENTS);
  }
  
  async getAvailableTimeSlots(doctorId: string): Promise<ApiResponse<AvailableDay[]>> {
    return apiCall<AvailableDay[]>('GET', `${API_ENDPOINTS.APPOINTMENTS.AVAILABLE_SLOTS}/${doctorId}`);
  }
}

export const doctorService = new DoctorService();