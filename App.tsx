
import React, { useState, useEffect } from 'react';
import type { Medication, AppView, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import DonationForm from './components/DonationForm';
import MedicationList from './components/MedicationList';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';

const initialMedications: Medication[] = [
    {
        id: '1',
        name: 'Paracetamol 500mg',
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0],
        quantity: '1 caja de 20 comprimidos',
        storageConditions: 'Lugar fresco y seco',
        location: 'Jalisco',
        requiresPrescription: false,
        photo: 'https://picsum.photos/seed/paracetamol/400/300',
        donorEmail: 'juan.perez@email.com',
        donorPhone: '3311223344',
    },
    {
        id: '2',
        name: 'Ibuprofeno 600mg',
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0],
        quantity: '1 blíster con 8 pastillas',
        storageConditions: 'Temperatura ambiente',
        location: 'Ciudad de México',
        requiresPrescription: true,
        photo: 'https://picsum.photos/seed/ibuprofeno/400/300',
        donorEmail: 'ana.gomez@email.com',
        donorPhone: '5522334455',
    },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('search');
  const [medications, setMedications] = useLocalStorage<Medication[]>('medications', initialMedications);
  const [user, setUser] = useLocalStorage<User | null>('user_session', null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode }>({ title: '', body: null });

  const handleAddMedication = (medication: Medication) => {
    setMedications(prevMeds => [medication, ...prevMeds]);
  };

  const handleDeleteMedication = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      setMedications(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('search');
  };
  
  const showSuccessMessage = () => {
    setModalContent({
      title: '¡Publicado con éxito!',
      body: <p className="text-slate-600">Gracias por tu generosidad. Tu donación ya está disponible para la comunidad.</p>
    });
    setIsModalOpen(true);
    setCurrentView('search');
  };

  const handleContact = (medication: Medication) => {
    setModalContent({
      title: `Donación de ${medication.name}`,
      body: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Para coordinar la entrega de este medicamento, contacta directamente al donador:</p>
          <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <a href={`mailto:${medication.donorEmail}`} className="text-teal-700 font-bold hover:underline break-all">{medication.donorEmail}</a>
            </div>
            {medication.donorPhone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                </div>
                <a href={`tel:${medication.donorPhone}`} className="text-teal-700 font-bold hover:underline">{medication.donorPhone}</a>
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100 italic">
            Importante: No entregues dinero por estas donaciones y acuerda puntos de reunión públicos y seguros.
          </div>
        </div>
      )
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {currentView === 'login' && <LoginForm onLogin={handleLogin} />}
        
        {currentView === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            medications={medications} 
            onDeleteMedication={handleDeleteMedication} 
          />
        )}

        {currentView === 'donate' && (
            <DonationForm 
              onAddMedication={handleAddMedication} 
              showSuccessMessage={showSuccessMessage}
              user={user}
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
          className="mt-6 w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-900 transition-colors"
        >
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default App;
