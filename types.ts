
export interface Medication {
  id: string;
  name: string;
  expirationDate: string;
  quantity: string;
  storageConditions: string;
  location: string;
  requiresPrescription: boolean;
  photo?: string;
  donorEmail: string;
  donorPhone?: string;
}

export type UserRole = 'admin' | 'guest';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

export type AppView = 'search' | 'donate' | 'login' | 'dashboard';
