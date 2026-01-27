
import React, { useState, useEffect } from 'react';
import type { Medication, User } from '../types';
import { MEXICO_STATES } from '../data/mexico-states';

interface DonationFormProps {
  onAddMedication: (medication: Medication) => void;
  showSuccessMessage: () => void;
  user: User | null;
}

const DonationForm: React.FC<DonationFormProps> = ({ onAddMedication, showSuccessMessage, user }) => {
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [storageConditions, setStorageConditions] = useState('');
  const [location, setLocation] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) setDonorEmail(user.email);
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!expirationDate) newErrors.expirationDate = 'La fecha de caducidad es obligatoria.';
    if (!quantity.trim()) newErrors.quantity = 'La cantidad es obligatoria.';
    if (!location.trim()) newErrors.location = 'La ubicación es obligatoria.';
    if (!storageConditions.trim()) newErrors.storageConditions = 'Las condiciones son obligatorias.';
    if (!donorEmail.trim()) {
      newErrors.donorEmail = 'El correo electrónico es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(donorEmail)) {
      newErrors.donorEmail = 'El correo electrónico no es válido.';
    }
    if (!termsAccepted) newErrors.termsAccepted = 'Debes aceptar los términos y condiciones.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const newMedication: Medication = {
      id: Date.now().toString(),
      name,
      expirationDate,
      quantity,
      storageConditions,
      location,
      requiresPrescription,
      photo,
      donorEmail,
      donorPhone,
    };

    onAddMedication(newMedication);
    showSuccessMessage();
    
    // Reset form
    setName('');
    setExpirationDate('');
    setQuantity('');
    setStorageConditions('');
    setLocation('');
    setRequiresPrescription(false);
    setPhoto(undefined);
    setPhotoPreview(undefined);
    setDonorPhone('');
    setTermsAccepted(false);
    setErrors({});
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto animate-fade-in-up border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Publicar un Medicamento</h2>
      <p className="text-slate-500 mb-8 text-sm">Asegúrate de que el medicamento esté sellado y en buen estado.</p>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Medicamento</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ej: Metformina 850mg" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Caducidad</label>
            <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} min={today} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
            {errors.expirationDate && <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Cantidad</label>
            <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ej: 15 cápsulas" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación (Estado)</label>
            <select 
              value={location} 
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            >
              <option value="">Selecciona un estado...</option>
              {MEXICO_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Almacenamiento</label>
            <input type="text" value={storageConditions} onChange={e => setStorageConditions(e.target.value)} placeholder="Ej: No requiere refrigeración" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Receta requerida:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={requiresPrescription} onChange={e => setRequiresPrescription(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          
          <div className="md:col-span-2 border-t pt-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Información de contacto</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                    <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50" readOnly={!!user} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                    <input type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
             </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
              <span className="text-xs text-slate-600">Confirmo que el medicamento es original, no ha caducado y acepto que esta plataforma es únicamente de enlace entre particulares.</span>
            </label>
            {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
          </div>
        </div>
        
        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
          Confirmar Donación
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
