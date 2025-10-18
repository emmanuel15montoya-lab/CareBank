import React, { useState } from 'react';
import type { Medication, AppView } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import DonationForm from './components/DonationForm';
import MedicationList from './components/MedicationList';
import Modal from './components/Modal';

const initialMedications: Medication[] = [
    {
        id: '1',
        name: 'Paracetamol 500mg',
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0],
        quantity: '1 caja de 20 comprimidos',
        storageConditions: 'Lugar fresco y seco',
        location: 'Barcelona, España',
        requiresPrescription: false,
        photo: 'https://picsum.photos/seed/paracetamol/400/300',
        donorEmail: 'juan.perez@email.com',
        donorPhone: '611223344',
    },
    {
        id: '2',
        name: 'Ibuprofeno 600mg',
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0],
        quantity: '1 blíster con 8 pastillas',
        storageConditions: 'Temperatura ambiente',
        location: 'Madrid, España',
        requiresPrescription: true,
        photo: 'https://picsum.photos/seed/ibuprofeno/400/300',
        donorEmail: 'ana.gomez@email.com',
        donorPhone: '622334455',
    },
    {
        id: '3',
        name: 'Amoxicilina 500mg',
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 180)).toISOString().split('T')[0],
        quantity: 'Tratamiento completo sin empezar',
        storageConditions: 'Proteger de la luz',
        location: 'Valencia, España',
        requiresPrescription: true,
        photo: 'https://picsum.photos/seed/amoxicilina/400/300',
        donorEmail: 'carlos.ruiz@email.com',
    },
];


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('search');
  const [medications, setMedications] = useLocalStorage<Medication[]>('medications', initialMedications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode }>({ title: '', body: null });

  const handleAddMedication = (medication: Medication) => {
    setMedications(prevMeds => [medication, ...prevMeds]);
  };
  
  const showSuccessMessage = () => {
    setModalContent({
      title: '¡Donación Publicada!',
      body: <p className="text-slate-600">Gracias por tu generosidad. Tu donación ya está visible para quienes la necesitan.</p>
    });
    setIsModalOpen(true);
    setCurrentView('search');
  };

  const handleContact = (medication: Medication) => {
    setModalContent({
      title: `Contactar al donador de ${medication.name}`,
      body: (
        <div>
          <p className="text-slate-600 mb-4">Para solicitar este medicamento, puedes usar los siguientes medios:</p>
          <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="font-semibold text-slate-700">Correo:</span>
              <a href={`mailto:${medication.donorEmail}`} className="text-teal-600 hover:underline ml-2 break-all">{medication.donorEmail}</a>
            </p>
            {medication.donorPhone && (
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <span className="font-semibold text-slate-700">Teléfono:</span>
                <a href={`tel:${medication.donorPhone}`} className="text-teal-600 hover:underline ml-2">{medication.donorPhone}</a>
              </p>
            )}
          </div>
          <p className="text-slate-500 mt-4 text-xs">Recuerda coordinar un punto de entrega seguro y nunca compartas información personal sensible.</p>
        </div>
      )
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'donate' && (
            <DonationForm 
              onAddMedication={handleAddMedication} 
              showSuccessMessage={showSuccessMessage} 
            />
        )}
        {currentView === 'search' && (
            <MedicationList 
              medications={medications}
              onContact={handleContact}
            />
        )}
      </main>

      <Footer />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalContent.title}
      >
        {modalContent.body}
        <button 
          onClick={() => setIsModalOpen(false)}
          className="mt-6 w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Entendido
        </button>
      </Modal>
    </div>
  );
};

export default App;