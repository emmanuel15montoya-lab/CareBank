import React, { useState } from 'react';
import type { Medication } from '../types';

interface DonationFormProps {
  onAddMedication: (medication: Medication) => void;
  showSuccessMessage: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onAddMedication, showSuccessMessage }) => {
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [storageConditions, setStorageConditions] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    else if (new Date(expirationDate) < new Date()) newErrors.expirationDate = 'La fecha no puede ser en el pasado.';
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
    setPhoto(undefined);
    setPhotoPreview(undefined);
    setDonorEmail('');
    setDonorPhone('');
    setTermsAccepted(false);
    setErrors({});
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Publicar un Medicamento para Donar</h2>
      <p className="text-slate-600 mb-6">Completa el formulario para ayudar a alguien que lo necesita. ¡Tu gesto cuenta!</p>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre del Medicamento</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-slate-700">Fecha de Caducidad</label>
            <input type="date" id="expirationDate" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} min={today} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            {errors.expirationDate && <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Cantidad Disponible</label>
            <input type="text" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ej: 1 caja de 20 pastillas" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Ubicación (Ciudad, Provincia)</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ej: Madrid, España" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="storageConditions" className="block text-sm font-medium text-slate-700">Condiciones de Almacenamiento</label>
            <input type="text" id="storageConditions" value={storageConditions} onChange={e => setStorageConditions(e.target.value)} placeholder="Ej: Lugar fresco y seco" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            {errors.storageConditions && <p className="text-red-500 text-xs mt-1">{errors.storageConditions}</p>}
          </div>

          <div className="md:col-span-2 border-t border-slate-200 pt-6 mt-2">
             <p className="text-base font-semibold text-slate-800 mb-4">Tu Información de Contacto</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="donorEmail" className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
                    <input type="email" id="donorEmail" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="tu@email.com" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    {errors.donorEmail && <p className="text-red-500 text-xs mt-1">{errors.donorEmail}</p>}
                </div>
                <div>
                    <label htmlFor="donorPhone" className="block text-sm font-medium text-slate-700">Teléfono (Opcional)</label>
                    <input type="tel" id="donorPhone" value={donorPhone} onChange={e => setDonorPhone(e.target.value)} placeholder="Ej: 600123456" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                </div>
             </div>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="photo" className="block text-sm font-medium text-slate-700">Foto del Medicamento (Opcional)</label>
            <div className="mt-1 flex items-center gap-4">
              {photoPreview && <img src={photoPreview} alt="Vista previa" className="h-16 w-16 object-cover rounded-md" />}
              <input type="file" id="photo" onChange={handlePhotoChange} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1" />
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">Acepto los Términos Legales</label>
                <p className="text-gray-500">Confirmo que este medicamento está en buen estado y no ha caducado. Entiendo que esta es una donación voluntaria sin fines de lucro.</p>
              </div>
            </div>
            {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
          </div>
        </div>
        
        <button type="submit" className="mt-8 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-slate-400">
          Publicar Donación
        </button>
      </form>
    </div>
  );
};

export default DonationForm;