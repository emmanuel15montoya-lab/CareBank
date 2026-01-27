
import React, { useState, useMemo } from 'react';
import type { Medication } from '../types';
import MedicationCard from './MedicationCard';
import { SearchIcon, PackageIcon } from './Icons';

type SortOption = 'expiration' | 'relevance';

interface MedicationListProps {
  medications: Medication[];
  onContact: (medication: Medication) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const filteredAndSortedMedications = useMemo(() => {
    // 1. Filtrado
    const filtered = medications.filter(med => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = med.name.toLowerCase().includes(searchTermLower);
      
      const locationTermLower = locationTerm.toLowerCase();
      const locationMatch = med.location.toLowerCase().includes(locationTermLower);

      // Si hay un término de ubicación, filtramos estrictamente por él.
      // Si no hay término, mostramos todo lo que coincida con el nombre.
      return nameMatch && (locationTerm === '' || locationMatch);
    });

    // 2. Ordenamiento
    return [...filtered].sort((a, b) => {
      if (sortBy === 'expiration') {
        // Orden simple por fecha: el más próximo a expirar primero
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      } else {
        // Lógica de Relevancia:
        // Prioridad 1: Coincidencia de ubicación (si se ha buscado una ubicación específica)
        // Prioridad 2: Urgencia (fecha de caducidad más cercana)
        
        const locA = a.location.toLowerCase();
        const locB = b.location.toLowerCase();
        const searchLoc = locationTerm.toLowerCase();

        // Si el usuario escribió una ubicación, priorizamos los que coinciden exactamente o contienen el término
        const aMatchesLocation = searchLoc !== '' && locA.includes(searchLoc);
        const bMatchesLocation = searchLoc !== '' && locB.includes(searchLoc);

        if (aMatchesLocation && !bMatchesLocation) return -1;
        if (!aMatchesLocation && bMatchesLocation) return 1;

        // Si ambos están en la misma categoría de ubicación (o no se buscó ubicación),
        // desempatamos por la fecha de caducidad más próxima (urgencia).
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      }
    });
  }, [medications, searchTerm, locationTerm, sortBy]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Encuentra un Medicamento</h2>
            <p className="text-slate-600">Explora donaciones disponibles cerca de ti.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ordenar por</label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setSortBy('relevance')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${sortBy === 'relevance' ? 'bg-white text-teal-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Relevancia
              </button>
              <button 
                onClick={() => setSortBy('expiration')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${sortBy === 'expiration' ? 'bg-white text-teal-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Caducidad
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Nombre del medicamento (ej: Ibuprofeno)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Ciudad o Estado (ej: CDMX)"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>
      </div>

      {filteredAndSortedMedications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMedications.map((med) => (
            <MedicationCard key={med.id} medication={med} onContact={onContact} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in-up bg-white rounded-2xl shadow-inner border border-dashed border-slate-200">
          <PackageIcon className="w-20 h-20 text-slate-200 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-slate-800">No se encontraron resultados</h3>
          <p className="mt-2 text-slate-500 max-w-xs mx-auto">Prueba a cambiar los términos de búsqueda o revisa las opciones de filtrado.</p>
          {(searchTerm || locationTerm) && (
            <button 
              onClick={() => { setSearchTerm(''); setLocationTerm(''); }}
              className="mt-6 text-teal-600 font-medium hover:text-teal-700 underline underline-offset-4"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationList;
