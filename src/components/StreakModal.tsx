import React from 'react';
import {
  Flame,
  Shield,
  Calendar,
  X,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { EcoStreak } from '../types/gamification';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: EcoStreak;
  onTogglePause: () => void;
  onUseShield: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streak,
  onTogglePause,
  onUseShield,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const daysOfWeek = [
    { label: 'Dom', full: 'Domingo' },
    { label: 'Lun', full: 'Lunes' },
    { label: 'Mar', full: 'Martes' },
    { label: 'Mié', full: 'Miércoles' },
    { label: 'Jue', full: 'Jueves' },
    { label: 'Vie', full: 'Viernes' },
    { label: 'Sáb', full: 'Sábado' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-[#FBF9F3] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 flex flex-col">
        {/* Header with Flame Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-extrabold tracking-wider uppercase bg-black/20 px-2 py-0.5 rounded-full text-amber-100">
              Racha Ecológica Che Planeta
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Flame className="w-8 h-8 text-yellow-300 fill-yellow-300 animate-bounce" />
              <h3 className="font-heading font-extrabold text-3xl">
                {streak.currentDays} {streak.currentDays === 1 ? 'Día' : 'Días'}
              </h3>
            </div>
            <p className="text-xs text-amber-100 mt-0.5">
              ¡Cada escaneo y reciclaje diario mantiene viva la llama!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar & Details */}
        <div className="p-4 space-y-4">
          {/* Weekly Grid */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs text-stone-900">
                Esta Semana
              </span>
              <span className="text-[11px] font-bold text-amber-600">
                {streak.currentDays}/7 días activos
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {daysOfWeek.map((d, idx) => {
                const isToday = idx === currentDayOfWeek;
                const isPastOrToday = idx <= currentDayOfWeek;

                return (
                  <div
                    key={d.label}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isToday
                        ? 'bg-amber-100 border-2 border-amber-400 text-amber-900 font-extrabold'
                        : isPastOrToday
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'bg-stone-50 text-stone-400 font-medium border border-stone-100'
                    }`}
                  >
                    <span className="text-[9px] uppercase">{d.label}</span>
                    <span className="text-sm mt-1">
                      {isPastOrToday ? '🔥' : '🌱'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cozy Protection Shield Card */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-200 text-sky-800 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 fill-sky-600" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-xs text-sky-900">
                  Escudo Anti-Frustración
                </h4>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-sky-200 text-sky-900">
                  {streak.shieldsAvailable} disponible
                </span>
              </div>
              <p className="text-[11px] text-sky-800 mt-1 leading-snug">
                Si un día no podés abrir la app por examen, trabajo o viaje, el escudo protegerá tu racha automáticamente sin penalizaciones.
              </p>
            </div>
          </div>

          {/* Pause / Resume Feature */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-xs text-stone-900">
                Pausa Consciente
              </h4>
              <p className="text-[10px] text-stone-500 mt-0.5">
                {streak.isPaused
                  ? 'Tu racha está congelada. Reanudala cuando vuelvas.'
                  : '¿Te vas de vacaciones? Pausá tu racha sin perder tus días.'}
              </p>
            </div>
            <button
              onClick={onTogglePause}
              className={`px-3 py-1.5 rounded-xl font-heading font-bold text-xs flex items-center gap-1.5 transition-colors ${
                streak.isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {streak.isPaused ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Reanudar</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-heading font-bold text-xs transition-colors"
          >
            ¡Entendido, sigamos cuidando el planeta!
          </button>
        </div>
      </div>
    </div>
  );
};
