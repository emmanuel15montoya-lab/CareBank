import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Carebank. Todos los derechos reservados.</p>
        <p className="text-xs mt-2">
          Esta plataforma es un proyecto de demostración. Consulte siempre a un profesional de la salud.
        </p>
      </div>
    </footer>
  );
};

export default Footer;