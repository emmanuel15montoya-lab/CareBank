import React, { useState, useMemo } from 'react';
import type { Medication } from '../types';
import MedicationCard from './MedicationCard';
import { SearchIcon, PackageIcon } from './Icons';

interface MedicationListProps {
  medications: Medication[];
  onContact: (medication: Medication) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const filteredMedications = useMemo(() => {
    return medications
      .filter(med => {
        const searchTermLower = searchTerm.toLowerCase();
        const locationTermLower = locationTerm.toLowerCase();
        
        const nameMatch = med.name.toLowerCase().includes(searchTermLower);
        const locationMatch = med.location.toLowerCase().includes(locationTermLower);

        return nameMatch && locationMatch;
      })
      .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
  }, [medications, searchTerm, locationTerm]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Encuentra un Medicamento</h2>
        <p className="text-slate-600 mb-4">Busca por nombre y filtra por ubicación para ver las donaciones disponibles.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre del medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar por ubicación..."
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {filteredMedications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedications.map((med) => (
            <MedicationCard key={med.id} medication={med} onContact={onContact} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in-up">
          <PackageIcon className="w-24 h-24 text-slate-300 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-slate-800">No se encontraron medicamentos</h3>
          <p className="mt-1 text-slate-500">Intenta ajustar tus filtros de búsqueda o vuelve a revisar más tarde.</p>
        </div>
      )}
    </div>
  );
};

export default MedicationList;