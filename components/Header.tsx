import React from 'react';
import { AppView } from '../types';
import { PlusCircleIcon, SearchIcon, PillIcon } from './Icons';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const baseButtonClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const activeButtonClasses = "bg-teal-600 text-white shadow-md";
  const inactiveButtonClasses = "bg-white text-slate-700 hover:bg-slate-100 focus:ring-teal-500";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <PillIcon className="w-10 h-10 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              Care<span className="text-teal-600">bank</span>
            </h1>
          </div>
          <nav className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setCurrentView('search')}
              className={`${baseButtonClasses} ${currentView === 'search' ? activeButtonClasses : inactiveButtonClasses}`}
            >
              <SearchIcon className="w-5 h-5" />
              Buscar Medicamentos
            </button>
            <button
              onClick={() => setCurrentView('donate')}
              className={`${baseButtonClasses} ${currentView === 'donate' ? activeButtonClasses : inactiveButtonClasses}`}
            >
              <PlusCircleIcon className="w-5 h-5" />
              Donar Medicamento
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;