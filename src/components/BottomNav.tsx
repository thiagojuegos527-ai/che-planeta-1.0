import React from 'react';
import { Home, Camera, Globe, CheckSquare, User } from 'lucide-react';
import { MainNavTab } from '../types/gamification';

interface BottomNavProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  unclaimedMissionsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unclaimedMissionsCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#FBF9F3]/95 backdrop-blur-md border-t border-emerald-900/15 py-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Inicio */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center py-1 transition-all ${
            currentTab === 'home'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Inicio</span>
        </button>

        {/* Misiones */}
        <button
          onClick={() => onSelectTab('missions')}
          className={`relative flex-1 flex flex-col items-center py-1 transition-all ${
            currentTab === 'missions'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Misiones</span>
          {unclaimedMissionsCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
              {unclaimedMissionsCount}
            </span>
          )}
        </button>

        {/* ESCANEAR (Centro destacado, acción principal) */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onSelectTab('scan')}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 text-white shadow-lg shadow-emerald-700/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-[#FBF9F3] cursor-pointer"
            title="Escanear un objeto contaminante"
          >
            <Camera className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <div className="absolute -inset-1 rounded-full border border-emerald-300/40 animate-ping pointer-events-none" />
          </button>
        </div>

        {/* Mi planeta */}
        <button
          onClick={() => onSelectTab('my-planet')}
          className={`flex-1 flex flex-col items-center py-1 transition-all ${
            currentTab === 'my-planet'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Globe className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Mi planeta</span>
        </button>

        {/* Mi perfil */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 flex flex-col items-center py-1 transition-all cursor-pointer ${
            currentTab === 'profile'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Mi perfil</span>
        </button>
      </div>
    </nav>
  );
};
