
import React from 'react';
import { User, Medication } from '../types';
import { PackageIcon, CalendarIcon, LocationMarkerIcon } from './Icons';

interface DashboardProps {
  user: User;
  medications: Medication[];
  onDeleteMedication: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, medications, onDeleteMedication }) => {
  const isAdmin = user.role === 'admin';
  
  const userMedications = isAdmin 
    ? medications 
    : medications.filter(m => m.donorEmail === user.email);

  const stats = {
    total: userMedications.length,
    expiringSoon: userMedications.filter(m => {
      const diff = new Date(m.expirationDate).getTime() - new Date().getTime();
      return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000);
    }).length,
    prescription: userMedications.filter(m => m.requiresPrescription).length,
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Panel de {isAdmin ? 'Administración' : 'Control'}</h2>
        <p className="text-slate-600">Hola, {user.name}. Aquí tienes un resumen de la actividad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
              <PackageIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-4xl font-bold text-slate-800">{stats.total}</h3>
          <p className="text-slate-500 text-sm mt-1">Medicamentos registrados</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Alerta</span>
          </div>
          <h3 className="text-4xl font-bold text-slate-800">{stats.expiringSoon}</h3>
          <p className="text-slate-500 text-sm mt-1">Por vencer (&lt;30 días)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <LocationMarkerIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Ubicación</span>
          </div>
          <h3 className="text-4xl font-bold text-slate-800">
            {Array.from(new Set(userMedications.map(m => m.location))).length}
          </h3>
          <p className="text-slate-500 text-sm mt-1">Regiones activas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {isAdmin ? 'Todos los Registros' : 'Mis Donaciones Recientes'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Medicamento</th>
                <th className="px-6 py-4 font-semibold">Ubicación</th>
                <th className="px-6 py-4 font-semibold">Vencimiento</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userMedications.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{med.name}</div>
                    <div className="text-xs text-slate-500">{med.quantity}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{med.location}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(med.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDeleteMedication(med.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      {isAdmin ? 'Eliminar' : 'Retirar'}
                    </button>
                  </td>
                </tr>
              ))}
              {userMedications.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No hay registros para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
