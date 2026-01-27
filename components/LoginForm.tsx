
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { PillIcon } from './Icons';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Lógica de simulación de roles
    let user: User;
    if (email === 'admin@carebank.org' && password === 'admin123') {
      user = { email, role: 'admin', name: 'Administrador Carebank' };
    } else {
      user = { email, role: 'guest', name: email.split('@')[0] };
    }

    onLogin(user);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl animate-fade-in-up border border-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
          <PillIcon className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Bienvenido de nuevo</h2>
        <p className="text-slate-500 mt-2">Ingresa tus datos para acceder a tu panel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-teal-600/20"
        >
          Iniciar Sesión
        </button>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Credenciales Demo:</p>
          <p className="text-xs text-slate-600">Admin: <span className="font-mono bg-white px-1 border rounded">admin@carebank.org</span> / <span className="font-mono bg-white px-1 border rounded">admin123</span></p>
          <p className="text-xs text-slate-600 mt-1">Invitado: Cualquier otro correo/pass</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
