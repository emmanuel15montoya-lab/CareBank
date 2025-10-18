import React from 'react';
import type { Medication } from '../types';
import { CalendarIcon, LocationMarkerIcon, ThermometerIcon, PackageIcon } from './Icons';

interface MedicationCardProps {
  medication: Medication;
  onContact: (medication: Medication) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onContact }) => {
  const { name, expirationDate, quantity, storageConditions, location, photo } = medication;

  const getExpirationStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { text: 'Expirado', color: 'bg-red-100 text-red-800 border-red-500' };
    } else if (diffDays <= 30) {
      return { text: `Expira en ${diffDays} días`, color: 'bg-yellow-100 text-yellow-800 border-yellow-500' };
    } else {
      return { text: new Date(expirationDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), color: 'bg-green-100 text-green-800 border-green-500' };
    }
  };

  const expiration = getExpirationStatus();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col animate-fade-in-up">
      <div className="h-48 bg-slate-200 flex items-center justify-center">
        {photo ? (
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        ) : (
          <PackageIcon className="w-20 h-20 text-slate-400" />
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800">{name}</h3>
        <p className="text-sm text-slate-500 mb-4">{quantity}</p>

        <div className="space-y-3 text-sm flex-grow">
          <div className="flex items-center gap-2">
            <LocationMarkerIcon className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThermometerIcon className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700">{storageConditions}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-slate-500" />
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${expiration.color} border`}>
              {expiration.text}
            </span>
          </div>
        </div>

        <button
          onClick={() => onContact(medication)}
          className="mt-6 w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
        >
          Contactar al Donador
        </button>
      </div>
    </div>
  );
};

export default MedicationCard;