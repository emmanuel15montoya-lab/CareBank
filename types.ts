export interface Medication {
  id: string;
  name: string;
  expirationDate: string;
  quantity: string;
  storageConditions: string;
  location: string;
  requiresPrescription: boolean;
  photo?: string; // base64 encoded image
  donorEmail: string;
  donorPhone?: string;
}

export type AppView = 'search' | 'donate';