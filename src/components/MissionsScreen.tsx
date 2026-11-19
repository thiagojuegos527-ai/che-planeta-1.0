import React, { useState } from 'react';
import {
  Flame,
  Shield,
  CheckCircle2,
  Calendar as CalendarIcon,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Info,
  Gift
} from 'lucide-react';
import { EcoStreak, EcoMission } from '../types/gamification';

interface MissionsScreenProps {
  missions: EcoMission[];
  streak: EcoStreak;
  onClaimMissionReward: (missionId: string) => void;
  onTogglePauseStreak: () => void;
  onUseShield: () => void;
  onNavigateScan: () => void;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({
  missions,
  streak,
  onClaimMissionReward,
  onTogglePauseStreak,
  onUseShield,
  onNavigateScan,
}) => {
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  const filteredMissions = missions.filter(
    (m) => filter === 'all' || m.frequency === filter
  );

  // Helper calendar days for current week
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-28 flex flex-col items-center">
      {/* Title */}
      <div className="w-full text-left mb-3">
        <h1 className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight">
          Misiones & Racha Verde
        </h1>
        <p className="text-xs text-stone-600">
          Ganá experiencia y EcoPuntos completando acciones ecológicas reales.
        </p>
      </div>

      {/* RACHA DIARIA HERO CARD */}
      <div className="w-full p-4 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-md relative overflow-hidden mb-4">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded-full text-amber-100">
              Racha Ecológica Activa
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-7 h-7 text-yellow-300 fill-yellow-300 animate-bounce" />
              <span className="font-heading font-extrabold text-3xl tracking-tight">
                {streak.currentDays} {streak.currentDays === 1 ? 'Día' : 'Días'}
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-0.5 font-medium">
              Récord histórico: {streak.longestDays} días seguidos
            </p>
          </div>

          {/* Streak shields and pause actions */}
          <div className="flex flex-col items-end gap-1.5">
            <div
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold"
              title="Escudos protectores: si te olvidás de abrir la app un día, el escudo absorbe la falta sin romper tu racha."
            >
              <Shield className="w-3.5 h-3.5 fill-current text-yellow-200" />
              <span>{streak.shieldsAvailable} {streak.shieldsAvailable === 1 ? 'Escudo' : 'Escudos'}</span>
            </div>

            <button
              onClick={onTogglePauseStreak}
              className="flex items-center gap-1 text-[10px] font-bold bg-black/25 hover:bg-black/35 px-2 py-0.5 rounded-lg transition-colors text-white/95"
              title="¿De viaje o sin conexión? Pausá tu racha sin perder el progreso ni castigos."
            >
              {streak.isPaused ? (
                <>
                  <PlayCircle className="w-3 h-3 text-emerald-300" />
                  <span>Reanudar racha</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3 h-3 text-amber-200" />
                  <span>Pausar racha</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Visual Weekly Calendar */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-100 mb-2">
            Tu Semana Verde:
          </p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysOfWeek.map((dayName, idx) => {
              const isToday = idx === currentDayOfWeek;
              // Check if completed in history
              const hasActivity = idx <= currentDayOfWeek;

              return (
                <div
                  key={dayName}
                  className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isToday
                      ? 'bg-white text-orange-600 font-extrabold shadow-sm scale-105'
                      : hasActivity
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-black/15 text-white/60 font-medium'
                  }`}
                >
                  <span className="text-[9px] uppercase">{dayName}</span>
                  <div className="mt-1">
                    {hasActivity ? (
                      <span className="text-xs">🔥</span>
                    ) : (
                      <span className="text-[10px] opacity-40">🌱</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {streak.isPaused && (
          <div className="mt-2.5 p-2 rounded-xl bg-black/30 text-amber-100 text-[11px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Racha en pausa activa. Podés reanudarla cuando vuelvas sin penalización.</span>
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <h2 className="font-heading font-extrabold text-sm text-stone-900">
          Desafíos Activos ({filteredMissions.length})
        </h2>

        <div className="flex items-center gap-1 bg-stone-200/60 p-0.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'daily' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Diarias
          </button>
          <button
            onClick={() => setFilter('weekly')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'weekly' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Semanales
          </button>
        </div>
      </div>

      {/* Missions List */}
      <div className="w-full space-y-2.5">
        {filteredMissions.map((mission) => {
          const progressPercent = Math.min(
            100,
            Math.round((mission.currentCount / mission.targetCount) * 100)
          );
          const isComplete = mission.currentCount >= mission.targetCount;

          return (
            <div
              key={mission.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                mission.rewardClaimed
                  ? 'bg-stone-50 border-stone-200 opacity-60'
                  : isComplete
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white border-stone-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-2xl shrink-0">
                  {mission.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600">
                      {mission.frequency === 'daily' ? 'Diaria' : 'Semanal'}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700">
                      +{mission.xpReward} XP &bull; +{mission.pointsReward} pts
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xs text-stone-900 leading-snug">
                    {mission.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {mission.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-stone-600">
                      {mission.currentCount}/{mission.targetCount}
                    </span>
                  </div>
                </div>

                {/* Claim / Status Button */}
                <div className="shrink-0 self-center">
                  {mission.rewardClaimed ? (
                    <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Listo
                    </span>
                  ) : isComplete ? (
                    <button
                      onClick={() => onClaimMissionReward(mission.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs shadow-xs animate-bounce flex items-center gap-1 cursor-pointer"
                    >
                      <Gift className="w-3 h-3" />
                      <span>Reclamar</span>
                    </button>
                  ) : mission.category === 'scan' ? (
                    <button
                      onClick={onNavigateScan}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] font-bold border border-stone-200 transition-colors"
                    >
                      Ir a escanear
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-stone-400">
                      En curso
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
