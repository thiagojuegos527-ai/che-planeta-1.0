import React from 'react';
import {
  Flame,
  Shield,
  Calendar,
  Sparkles,
  Award,
  Coins,
  History,
  Info
} from 'lucide-react';
import { PetState, EcoStreak, UserProfile } from '../types/gamification';

interface TopGamificationBarProps {
  streak: EcoStreak;
  profile: UserProfile;
  pet: PetState;
  onOpenStreakModal: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const TopGamificationBar: React.FC<TopGamificationBarProps> = ({
  streak,
  profile,
  pet,
  onOpenStreakModal,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <div className="w-full bg-[#F5F2E9] border-b border-emerald-900/10 px-4 py-2 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Streak Pill */}
        <button
          onClick={onOpenStreakModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 hover:bg-amber-50 border border-amber-300/80 text-xs font-bold text-stone-800 shadow-2xs transition-transform active:scale-95 cursor-pointer"
          title="Ver racha ecológica y calendario"
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/15 text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600 animate-pulse" />
          </span>
          <span>{streak.currentDays} días</span>
          {streak.shieldsAvailable > 0 && (
            <span title="Escudo protector de racha activo" className="flex items-center text-[10px] text-sky-600 bg-sky-100 px-1 py-0.2 rounded-full">
              <Shield className="w-2.5 h-2.5 fill-sky-500" />
            </span>
          )}
        </button>

        {/* Eco Points */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-emerald-300/80 text-xs font-bold text-emerald-900 shadow-2xs"
          title="EcoPuntos acumulados"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-extrabold text-[11px]">
            🌱
          </span>
          <span>{profile.ecoPoints}</span>
          <span className="text-[10px] text-stone-400 font-medium">pts</span>
        </div>

        {/* Pet Level Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-emerald-900/10 text-xs font-bold text-stone-800 shadow-2xs"
          title={`Nivel ${pet.level} - ${pet.name}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-700 font-extrabold">Nv. {pet.level}</span>
        </div>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="relative w-8 h-8 rounded-full bg-white/90 hover:bg-emerald-50 border border-emerald-900/10 flex items-center justify-center text-stone-700 hover:text-emerald-800 transition-colors shadow-2xs cursor-pointer"
          title="Ver historial de escaneos guardados"
        >
          <History className="w-4 h-4 text-emerald-700" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
