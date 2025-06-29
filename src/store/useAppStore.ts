import { create } from 'zustand';
import { User, Appointment, Doctor } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Appointments state
  appointments: Appointment[];
  
  // Doctors state
  doctors: Doctor[];
  
  // UI state
  activeTab: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
  setDoctors: (doctors: Doctor[]) => void;
  setActiveTab: (tab: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  appointments: [],
  doctors: [],
  activeTab: 'Home',
  
  // Actions
  setUser: (user) => set({ user }),
  
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setAppointments: (appointments) => set({ appointments }),
  
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, appointment]
  })),
  
  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    )
  })),
  
  removeAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter(apt => apt.id !== id)
  })),
  
  setDoctors: (doctors) => set({ doctors }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    appointments: [],
    doctors: [],
    activeTab: 'Home',
  }),
}));