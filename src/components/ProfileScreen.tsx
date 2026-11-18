import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  User,
  Award,
  Flame,
  Camera,
  History,
  CheckCircle2,
  Calendar,
  Sparkles,
  TreePine,
  Edit2,
  Check,
  TrendingUp,
  ArrowLeft,
  LogOut,
  UserPlus,
  Shirt,
  Target,
  Activity,
  Image as ImageIcon,
  X
} from 'lucide-react';
import {
  UserProfile,
  PetState,
  EcoStreak,
  Badge,
  EcoActivityLog,
} from '../types/gamification';
import { EcoAnalysisResult } from '../types/chePlaneta';
import { ACCESSORIES, getStageName } from '../utils/gamificationDefaults';
import { CozyPlanetPet } from './CozyPlanetPet';

interface ProfileScreenProps {
  profile: UserProfile;
  pet: PetState;
  streak: EcoStreak;
  history: EcoAnalysisResult[];
  activities: EcoActivityLog[];
  badges: Badge[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSelectHistoryItem: (item: EcoAnalysisResult) => void;
  onOpenHistoryModal: () => void;
  onNavigateHome: () => void;
  onNavigateMyPlanet: () => void;
  onEquipAccessory: (accId: string, slot: 'head' | 'face' | 'body' | 'hand' | 'ambient') => void;
  onPetPet: () => void;
  onLogout: () => void;
  onOpenUpgradeGuest: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  pet,
  streak,
  history,
  activities,
  badges,
  onUpdateProfile,
  onSelectHistoryItem,
  onOpenHistoryModal,
  onNavigateHome,
  onNavigateMyPlanet,
  onEquipAccessory,
  onPetPet,
  onLogout,
  onOpenUpgradeGuest,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.username);
  const [selectedEmoji, setSelectedEmoji] = useState(profile.avatarEmoji);
  const [selectedBgColor, setSelectedBgColor] = useState(profile.avatarBgColor || '#10B981');
  const [selectedTitle, setSelectedTitle] = useState(profile.title);
  const [avatarImagePreview, setAvatarImagePreview] = useState<string | undefined>(profile.avatarImageUrl);
  const [activityTab, setActivityTab] = useState<'activities' | 'scans'>('activities');
  const [celebratingBadges, setCelebratingBadges] = useState<Badge[]>([]);
  const [confettiBurstKey, setConfettiBurstKey] = useState(0);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const confettiTimerRef = useRef<number | null>(null);

  const emojiOptions = ['🌍', '🌱', '🦊', '🌿', '🌻', '🐢', '🐝', '🐳', '🍀', '🦋'];
  const colorOptions = [
    { name: 'Verde Eco', hex: '#10B981' },
    { name: 'Celeste', hex: '#38BDF8' },
    { name: 'Teal Bosque', hex: '#0D9488' },
    { name: 'Ámbar Sol', hex: '#F59E0B' },
    { name: 'Índigo', hex: '#6366F1' },
    { name: 'Rosa Flor', hex: '#EC4899' },
  ];
  const titleOptions = [
    'Guardián de Semillas 🌱',
    'Eco Alquimista ♻️',
    'Protector Puntano ⛰️',
    'Cazador de Residuos 🔍',
    'Amigo del Planeta 🌍',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarImagePreview(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = () => {
    setUsernameInput(profile.username);
    setSelectedEmoji(profile.avatarEmoji);
    setSelectedBgColor(profile.avatarBgColor || '#10B981');
    setSelectedTitle(profile.title);
    setAvatarImagePreview(profile.avatarImageUrl);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (usernameInput.trim()) {
      onUpdateProfile({
        username: usernameInput.trim(),
        avatarEmoji: selectedEmoji,
        avatarBgColor: selectedBgColor,
        profileFrameColor: selectedBgColor,
        title: selectedTitle,
        avatarImageUrl: avatarImagePreview,
      });
    }
    setIsEditing(false);
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const xpProgressPercent = Math.min(100, Math.round((pet.xp / pet.xpToNextLevel) * 100));

  const unlockedAccessories = ACCESSORIES.filter(
    (acc) => pet.unlockedAccessories.includes(acc.id) || pet.level >= acc.unlockedAtLevel
  );

  const CONFETTI_COLORS = [
    '#10B981', // emerald
    '#34D399', // mint
    '#38BDF8', // celeste
    '#0284C7', // deep sky
    '#F59E0B', // amber
    '#FBBF24', // gold
    '#FB7185', // coral rose
  ];

  const confettiParticles = React.useMemo(
    () =>
      Array.from({ length: 42 }, (_, idx) => {
        const left = ((idx * 23 + 7) % 94) + 3; // 3% to 97%
        const sway = ((idx % 2 === 0 ? 1 : -1) * (24 + (idx * 13) % 55));
        const duration = 2.1 + ((idx * 7) % 12) * 0.1;
        const delay = ((idx * 5) % 10) * 0.045;
        const size = 6 + (idx % 4) * 2;
        const rotation = 260 + ((idx * 47) % 360);
        const shape = idx % 3 === 0 ? 'rounded-full' : idx % 3 === 1 ? 'rounded-xs' : 'rounded-sm rotate-45';
        const color = CONFETTI_COLORS[idx % CONFETTI_COLORS.length];
        return {
          id: idx,
          left,
          sway,
          duration,
          delay,
          size,
          rotation,
          shape,
          color,
        };
      }),
    []
  );

  const triggerConfettiCelebration = useCallback((unlockedList: Badge[]) => {
    if (confettiTimerRef.current) {
      window.clearTimeout(confettiTimerRef.current);
    }
    setCelebratingBadges(unlockedList);
    setConfettiBurstKey((k) => k + 1);
    setIsConfettiActive(true);
    confettiTimerRef.current = window.setTimeout(() => {
      setIsConfettiActive(false);
    }, 3400);
  }, []);

  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) {
        window.clearTimeout(confettiTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const storageKey = `che_planeta_celebrated_badges_${profile.id}`;
    const unlockedIds = badges.filter((b) => b.unlocked).map((b) => b.id);

    let knownIds: string[] | null = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          knownIds = parsed;
        }
      }
    } catch {
      knownIds = null;
    }

    if (knownIds === null) {
      // Seed baseline badges that come unlocked on account creation so real earned unlocks still celebrate
      knownIds =
        profile.id === 'user-che-1'
          ? ['badge-first-scan', 'badge-customizer']
          : ['badge-customizer'];
    }

    const newlyUnlocked = badges.filter(
      (b) => b.unlocked && !knownIds!.includes(b.id)
    );

    if (newlyUnlocked.length > 0) {
      triggerConfettiCelebration(newlyUnlocked);
    }

    try {
      const merged = Array.from(new Set([...knownIds, ...unlockedIds]));
      localStorage.setItem(storageKey, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
  }, [badges, profile.id, triggerConfettiCelebration]);

  const formatRelativeTime = (iso: string) => {
    try {
      const date = new Date(iso);
      const diffMs = Date.now() - date.getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Recién';
      if (mins < 60) return `Hace ${mins} min`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `Hace ${hrs} h`;
      const days = Math.floor(hrs / 24);
      return `Hace ${days} d`;
    } catch {
      return 'Reciente';
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-28 flex flex-col items-center relative">
      {/* CSS Keyframes for Badge Unlock Confetti */}
      <style>{`
        @keyframes che-confetti-fall {
          0% {
            transform: translate3d(0, -18px, 0) rotate(0deg) scale(0.75);
            opacity: 0;
          }
          12% {
            opacity: 1;
            transform: translate3d(calc(var(--sway) * 0.15), 10vh, 0) rotate(90deg) scale(1.05);
          }
          75% {
            opacity: 0.95;
          }
          100% {
            transform: translate3d(var(--sway), 88vh, 0) rotate(var(--rot)) scale(0.85);
            opacity: 0;
          }
        }
        @keyframes che-confetti-burst {
          0% {
            transform: translate3d(0, 0, 0) scale(0.3) rotate(0deg);
            opacity: 1;
          }
          65% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--bx), var(--by), 0) scale(1) rotate(var(--rot));
            opacity: 0;
          }
        }
        @keyframes che-badge-pop {
          0% {
            transform: scale(0.92);
          }
          50% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
          }
        }
        .che-confetti-piece {
          animation: che-confetti-fall var(--dur) cubic-bezier(0.22, 0.61, 0.36, 1) var(--delay) forwards;
          will-change: transform, opacity;
        }
        .che-confetti-burst-piece {
          animation: che-confetti-burst 1.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .che-badge-pop {
          animation: che-badge-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Fullscreen Confetti Particle Overlay on Badge Unlock */}
      {isConfettiActive && (
        <div
          key={confettiBurstKey}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {confettiParticles.map((p) => (
            <span
              key={p.id}
              className={`che-confetti-piece absolute top-0 ${p.shape}`}
              style={
                {
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.id % 3 === 1 ? Math.round(p.size * 1.55) : p.size}px`,
                  backgroundColor: p.color,
                  opacity: 0,
                  '--sway': `${p.sway}px`,
                  '--dur': `${p.duration}s`,
                  '--delay': `${p.delay}s`,
                  '--rot': `${p.rotation}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Top Profile Navigation Row */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-50 border border-emerald-900/10 text-stone-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 text-stone-600 hover:text-rose-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          title="Cerrar sesión o cambiar de cuenta"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{profile.isGuest ? 'Cambiar cuenta' : 'Cerrar sesión'}</span>
        </button>
      </div>

      {/* Guest Conversion Banner */}
      {profile.isGuest && (
        <div className="w-full mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-emerald-50 to-teal-50 border border-emerald-300/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading font-bold text-xs text-emerald-950">
              Estás usando el modo invitado
            </p>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
              Creá tu cuenta gratis para guardar tu nivel, mascota y puntos verdes.
            </p>
          </div>
          <button
            onClick={onOpenUpgradeGuest}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear cuenta</span>
          </button>
        </div>
      )}

      {/* USER HERO CARD */}
      <div
        className="w-full p-4 rounded-3xl bg-white border-2 shadow-xs flex flex-col items-center text-center relative mb-4 transition-colors"
        style={{ borderColor: `${profile.profileFrameColor || '#10B981'}35` }}
      >
        <button
          onClick={isEditing ? handleSave : handleStartEdit}
          className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer"
          title={isEditing ? 'Guardar cambios' : 'Personalizar perfil'}
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Listo</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3 h-3" />
              <span>Editar</span>
            </>
          )}
        </button>

        {/* Avatar with level badge */}
        <div className="relative mb-2">
          <div
            className="w-22 h-22 rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-white overflow-hidden"
            style={{ backgroundColor: isEditing ? selectedBgColor : profile.avatarBgColor }}
          >
            {(isEditing ? avatarImagePreview : profile.avatarImageUrl) ? (
              <img
                src={isEditing ? avatarImagePreview : profile.avatarImageUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{isEditing ? selectedEmoji : profile.avatarEmoji}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] shadow-xs border-2 border-white">
            Nv. {pet.level}
          </div>
        </div>

        {isEditing ? (
          <div className="w-full max-w-xs space-y-3 mt-2 text-left">
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Custom Profile Picture */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Subir foto de perfil</span>
              </button>
              {avatarImagePreview && (
                <button
                  type="button"
                  onClick={() => setAvatarImagePreview(undefined)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Usar emoji</span>
                </button>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                maxLength={24}
                className="w-full px-3 py-1.5 rounded-xl border border-emerald-400 bg-stone-50 text-center font-heading font-bold text-sm text-stone-900 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Emoji Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Avatar ecológico
              </label>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      setAvatarImagePreview(undefined);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-transform cursor-pointer ${
                      selectedEmoji === emoji && !avatarImagePreview
                        ? 'bg-emerald-100 scale-110 ring-2 ring-emerald-500'
                        : 'bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Color de perfil y marco
              </label>
              <div className="flex items-center justify-center gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setSelectedBgColor(c.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedBgColor === c.hex ? 'border-stone-900 scale-115 shadow-sm' : 'border-white'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Eco Title Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Título ecológico
              </label>
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-500"
              >
                {titleOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs cursor-pointer"
            >
              Guardar cambios del perfil
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-heading font-extrabold text-xl text-stone-900">
              {profile.username}
            </h1>
            {profile.email && !profile.isGuest && (
              <p className="text-[11px] text-stone-500 font-medium">{profile.email}</p>
            )}
            <p className="text-xs font-semibold text-emerald-700 mt-0.5">
              {profile.title} &bull; Compañero de {pet.name}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Miembro desde {profile.joinedDate}</span>
            </p>
          </>
        )}

        {/* Global Stats Grid (Puntos verdes, Racha, Misiones, Escaneos) */}
        <div className="w-full grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-stone-100">
          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[9px] uppercase font-bold text-stone-400 block">Puntos</span>
            <span className="font-heading font-extrabold text-sm text-emerald-800">
              {profile.ecoPoints}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[9px] uppercase font-bold text-stone-400 block">Racha</span>
            <span className="font-heading font-extrabold text-sm text-amber-600 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 fill-amber-500" />
              {streak.currentDays}d
            </span>
          </div>

          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[9px] uppercase font-bold text-stone-400 block">Misiones</span>
            <span className="font-heading font-extrabold text-sm text-teal-700">
              {profile.completedMissionsCount}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[9px] uppercase font-bold text-stone-400 block">Escaneos</span>
            <span className="font-heading font-extrabold text-sm text-sky-700">
              {profile.totalScans}
            </span>
          </div>
        </div>
      </div>

      {/* SISTEMA DE PROGRESO VISUAL (Nivel & Barra de Experiencia) */}
      <div className="w-full p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-heading font-extrabold text-sm text-stone-900">
              Nivel {pet.level} &rarr; Nivel {pet.level + 1}
            </span>
          </div>
          <span className="text-xs font-extrabold text-emerald-700">
            {pet.xp} / {pet.xpToNextLevel} XP ({xpProgressPercent}%)
          </span>
        </div>

        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${xpProgressPercent}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-600">
          <span>Faltan {Math.max(0, pet.xpToNextLevel - pet.xp)} XP para subir</span>
          <span className="font-bold text-emerald-700">
            {unlockedBadgesCount} insignias &bull; {profile.completedMissionsCount} misiones
          </span>
        </div>
      </div>

      {/* MI MASCOTA ECOLÓGICA PERSONAL EN EL PERFIL */}
      <div className="w-full p-4 rounded-3xl bg-gradient-to-br from-sky-50/90 via-emerald-50/70 to-amber-50/50 border border-emerald-200/80 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
              Tu Mascota Ecológica
            </span>
            <h2 className="font-heading font-extrabold text-base text-stone-900">
              {pet.name} &bull; <span className="text-emerald-700 text-xs">{getStageName(pet.stage)}</span>
            </h2>
          </div>
          <button
            onClick={onNavigateMyPlanet}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Personalizar</span>
          </button>
        </div>

        <div className="flex flex-col items-center py-2">
          <CozyPlanetPet
            pet={pet}
            size="md"
            onPetClick={onPetPet}
          />
          <p className="text-[11px] text-stone-600 mt-1">
            Felicidad: <span className="font-bold text-rose-600">{pet.happiness}%</span> &bull; Limpieza: <span className="font-bold text-sky-600">{pet.cleanliness}%</span>
          </p>
        </div>

        {/* Quick Accessory Switcher inside Profile */}
        <div className="mt-2 pt-2.5 border-t border-emerald-900/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Accesorios desbloqueados (toca para equipar):
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {unlockedAccessories.map((acc) => {
              const isEquipped = pet.equippedAccessories[acc.type] === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => onEquipAccessory(acc.id, acc.type)}
                  className={`shrink-0 px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isEquipped
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white hover:bg-emerald-50 text-stone-800 border-stone-200'
                  }`}
                  title={acc.description}
                >
                  <span>{acc.icon}</span>
                  <span className="text-[10px]">{acc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* COZY REAL-WORLD ENVIRONMENTAL IMPACT CARD */}
      <div className="w-full p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 shadow-xs mb-4">
        <h2 className="font-heading font-extrabold text-xs uppercase tracking-wider text-emerald-950 flex items-center gap-1.5 mb-2.5">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span>Tu Huella Positiva en el Planeta</span>
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200/60">
            <span className="text-2xl">🌱</span>
            <p className="font-heading font-extrabold text-base text-stone-900 mt-1">
              ~{profile.co2SavedKg} kg
            </p>
            <p className="text-[10px] text-stone-500">
              CO₂ evitado mediante reciclaje y reutilización estimada.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200/60">
            <span className="text-2xl">🧴</span>
            <p className="font-heading font-extrabold text-base text-stone-900 mt-1">
              {profile.plasticDivertedItems} envases
            </p>
            <p className="text-[10px] text-stone-500">
              Desviados de rellenos sanitarios o basurales abiertos.
            </p>
          </div>
        </div>
      </div>

      {/* INSIGNIAS Y LOGROS */}
      <div className="w-full mb-4 relative">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="font-heading font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Insignias y Logros ({unlockedBadgesCount}/{badges.length})</span>
          </h2>
          {unlockedBadgesCount > 0 && (
            <span className="text-[10px] font-semibold text-stone-400">
              Tocá una insignia para celebrar
            </span>
          )}
        </div>

        {/* Newly Unlocked Badge Celebration Banner with Local Confetti Burst */}
        {isConfettiActive && celebratingBadges.length > 0 && (
          <div
            key={`banner-${confettiBurstKey}`}
            className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50 to-sky-50 border border-amber-300 shadow-xs flex items-center gap-3 relative overflow-hidden che-badge-pop"
          >
            {/* Local radial confetti burst inside banner */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {confettiParticles.slice(0, 14).map((p, idx) => {
                const angle = (idx / 14) * Math.PI * 2;
                const distance = 55 + (idx % 3) * 28;
                const bx = Math.round(Math.cos(angle) * distance);
                const by = Math.round(Math.sin(angle) * (distance * 0.55));
                return (
                  <span
                    key={`burst-${p.id}`}
                    className={`che-confetti-burst-piece absolute ${p.shape}`}
                    style={
                      {
                        width: `${Math.max(5, p.size - 1)}px`,
                        height: `${Math.max(5, p.size - 1)}px`,
                        backgroundColor: p.color,
                        '--bx': `${bx}px`,
                        '--by': `${by}px`,
                        '--rot': `${p.rotation}deg`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>

            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs relative z-10">
              {celebratingBadges[0].icon}
            </div>
            <div className="min-w-0 flex-1 relative z-10">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>
                  {celebratingBadges.length > 1
                    ? `¡${celebratingBadges.length} insignias desbloqueadas!`
                    : '¡Insignia desbloqueada!'}
                </span>
              </p>
              <p className="font-heading font-extrabold text-xs text-stone-900 truncate">
                {celebratingBadges.map((b) => b.title).join(' • ')}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => {
            const isCelebratingThis =
              isConfettiActive && celebratingBadges.some((cb) => cb.id === badge.id);

            return (
              <div
                key={badge.id}
                onClick={
                  badge.unlocked ? () => triggerConfettiCelebration([badge]) : undefined
                }
                role={badge.unlocked ? 'button' : undefined}
                tabIndex={badge.unlocked ? 0 : undefined}
                onKeyDown={
                  badge.unlocked
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          triggerConfettiCelebration([badge]);
                        }
                      }
                    : undefined
                }
                className={`p-3 rounded-2xl border transition-all text-left flex items-start gap-2.5 ${
                  badge.unlocked
                    ? isCelebratingThis
                      ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/70 shadow-sm cursor-pointer che-badge-pop'
                      : 'bg-white border-amber-200 hover:border-emerald-300 shadow-2xs cursor-pointer'
                    : 'bg-stone-50 border-stone-200 opacity-50'
                }`}
              >
                <span className={`text-2xl shrink-0 ${badge.unlocked ? '' : 'grayscale'}`}>
                  {badge.icon}
                </span>
                <div>
                  <h4 className="font-heading font-bold text-xs text-stone-900 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                  {badge.unlocked && badge.unlockedAt && (
                    <span className="inline-block text-[9px] font-bold text-emerald-700 mt-1 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Desbloqueado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORIAL DE ACTIVIDADES ECOLÓGICAS Y ESCANEOS */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-stone-200/60 text-xs font-bold">
            <button
              onClick={() => setActivityTab('activities')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activityTab === 'activities' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Actividades ({activities.length})</span>
            </button>
            <button
              onClick={() => setActivityTab('scans')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activityTab === 'scans' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Escaneos ({history.length})</span>
            </button>
          </div>

          {activityTab === 'scans' && history.length > 2 && (
            <button
              onClick={onOpenHistoryModal}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Ver todos
            </button>
          )}
        </div>

        {activityTab === 'activities' ? (
          activities.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
              Aún no hay actividades registradas. ¡Escaneá un objeto o completá una misión para comenzar!
            </div>
          ) : (
            <div className="space-y-2">
              {activities.slice(0, 8).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-white border border-stone-200/80 flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-lg shrink-0">
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading font-bold text-xs text-stone-900 truncate">
                        {act.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                      {act.description}
                    </p>
                    {(act.xpDelta || act.pointsDelta) && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {act.xpDelta && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                            +{act.xpDelta} XP
                          </span>
                        )}
                        {act.pointsDelta && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            +{act.pointsDelta} Puntos Verdes
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : history.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
            Aún no guardaste escaneos. ¡Escaneá tu primer objeto para llenar tu historial!
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 4).map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectHistoryItem(item)}
                className="w-full p-2.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 flex items-center gap-3 text-left transition-all shadow-2xs group cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.objectName}
                  className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800">
                    {item.category}
                  </span>
                  <h4 className="font-heading font-bold text-xs text-stone-900 group-hover:text-emerald-700 truncate mt-0.5">
                    {item.objectName}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {item.probableMaterial}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-700">
                    {item.recyclabilityScore}/100
                  </span>
                  <p className="text-[10px] text-stone-400">Score</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
