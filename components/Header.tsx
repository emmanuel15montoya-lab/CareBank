
import React from 'react';
import { AppView, User } from '../types';
import { PlusCircleIcon, SearchIcon, PillIcon } from './Icons';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, user, onLogout }) => {
  const baseButtonClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none";
  const activeButtonClasses = "bg-teal-600 text-white shadow-md";
  const inactiveButtonClasses = "bg-white text-slate-700 hover:bg-slate-100";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('search')}>
            <PillIcon className="w-8 h-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-800">
              Care<span className="text-teal-600">bank</span>
            </h1>
          </div>
          
          <nav className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setCurrentView('search')}
              className={`${baseButtonClasses} ${currentView === 'search' ? activeButtonClasses : inactiveButtonClasses}`}
            >
              <SearchIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
            <button
              onClick={() => setCurrentView('donate')}
              className={`${baseButtonClasses} ${currentView === 'donate' ? activeButtonClasses : inactiveButtonClasses}`}
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Donar</span>
            </button>
            
            <div className="w-px h-8 bg-slate-200 mx-1" />

            {user ? (
              <>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`${baseButtonClasses} ${currentView === 'dashboard' ? activeButtonClasses : inactiveButtonClasses}`}
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs opacity-70 font-normal">Panel de</span>
                    <span>{user.role === 'admin' ? 'Admin' : 'Invitado'}</span>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-slate-500 hover:text-red-600 font-semibold transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className={`${baseButtonClasses} ${currentView === 'login' ? activeButtonClasses : inactiveButtonClasses}`}
              >
                Acceder
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
