import { apiCall } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Appointment, ApiResponse } from '../types';

export interface BookAppointmentData {
  doctorId: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface UpdateNotesData {
  appointmentId: string;
  notes: string;
}

export interface VideoTokenData {
  appointmentId: string;
}

class AppointmentService {
  async bookAppointment(data: BookAppointmentData): Promise<ApiResponse<Appointment>> {
    return apiCall<Appointment>('POST', API_ENDPOINTS.APPOINTMENTS.BOOK, data);
  }
  
  async getPatientAppointments(): Promise<ApiResponse<Appointment[]>> {
    return apiCall<Appointment[]>('GET', API_ENDPOINTS.APPOINTMENTS.LIST);
  }
  
  async cancelAppointment(appointmentId: string): Promise<ApiResponse<void>> {
    return apiCall<void>('POST', API_ENDPOINTS.APPOINTMENTS.CANCEL, { appointmentId });
  }
  
  async addAppointmentNotes(data: UpdateNotesData): Promise<ApiResponse<Appointment>> {
    return apiCall<Appointment>('POST', API_ENDPOINTS.APPOINTMENTS.UPDATE_NOTES, data);
  }
  
  async markAppointmentCompleted(appointmentId: string): Promise<ApiResponse<Appointment>> {
    return apiCall<Appointment>('POST', API_ENDPOINTS.APPOINTMENTS.COMPLETE, { appointmentId });
  }
  
  async generateVideoToken(data: VideoTokenData): Promise<ApiResponse<{ videoSessionId: string; token: string }>> {
    return apiCall<{ videoSessionId: string; token: string }>(
      'POST',
      API_ENDPOINTS.APPOINTMENTS.VIDEO_TOKEN,
      data
    );
  }
}

export const appointmentService = new AppointmentService();