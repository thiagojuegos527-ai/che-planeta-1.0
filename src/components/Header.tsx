import React from 'react';
import { Sparkles, History, Globe2, Leaf } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, historyCount, onNavigateHome }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F3]/90 backdrop-blur-md border-b border-emerald-900/10 px-4 py-3 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand logo & title with official logo image */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          title="Ir al inicio de Che Planeta"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-white p-0.5 shadow-md shadow-emerald-900/10 border border-emerald-900/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_12.43.19_PM_8a61524e.jpeg"
              alt="Logo oficial Che Planeta"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-emerald-950">
                Che<span className="text-emerald-600">Planeta</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                IA
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-700 -mt-0.5">
              Menos residuos, más futuro
            </p>
          </div>
        </button>

        {/* Right side: History button & badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-emerald-50 border border-emerald-800/15 text-stone-700 hover:text-emerald-800 text-xs font-semibold shadow-xs transition-colors"
            title="Ver escaneos guardados"
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Historial</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
