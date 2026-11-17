import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, Recycle, Lightbulb, Compass, Zap, Flame, Award, ChevronRight } from 'lucide-react';
import { SAMPLE_OBJECTS, SampleObject } from '../utils/sampleImages';
import { EcoAnalysisResult } from '../types/chePlaneta';
import { PetState, EcoStreak, UserProfile } from '../types/gamification';
import { CozyPlanetPet } from './CozyPlanetPet';
import { getStageName } from '../utils/gamificationDefaults';

interface HomeScreenProps {
  onStartScan: () => void;
  onSelectSample: (sample: SampleObject) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  recentScans: EcoAnalysisResult[];
  onSelectRecent: (result: EcoAnalysisResult) => void;
  pet: PetState;
  streak: EcoStreak;
  profile: UserProfile;
  onNavigateMyPlanet: () => void;
  onNavigateMissions: () => void;
  onPetPet: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartScan,
  onSelectSample,
  onUploadFile,
  recentScans,
  onSelectRecent,
  pet,
  streak,
  profile,
  onNavigateMyPlanet,
  onNavigateMissions,
  onPetPet,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const xpProgressPercent = Math.min(100, Math.round((pet.xp / pet.xpToNextLevel) * 100));

  return (
    <div className="max-w-md mx-auto px-4 pt-2 pb-24 flex flex-col items-center">
      {/* Mini Companion Cozy Greeting Bar */}
      <div
        onClick={onNavigateMyPlanet}
        className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 shadow-2xs flex items-center justify-between cursor-pointer hover:shadow-xs transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <CozyPlanetPet pet={pet} size="sm" interactive={false} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xs text-stone-900 group-hover:text-emerald-800 transition-colors">
                {pet.name}
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                Nv. {pet.level}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-medium -mt-0.5">
              {getStageName(pet.stage)} &bull; {pet.happiness}% Feliz
            </p>
            {/* Tiny XP progress */}
            <div className="w-24 h-1 bg-stone-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-xl border border-emerald-200/70">
          <span>Ver mi planeta</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Hero Welcome with Official Che Planeta Logo */}
      <div className="w-full text-center mt-1 mb-4 flex flex-col items-center">
        {/* Official Che Planeta Logo Emblem */}
        <div className="relative w-24 h-24 mb-2 rounded-3xl bg-white p-1.5 shadow-md shadow-emerald-900/10 border border-emerald-900/10 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_12.43.19_PM_8a61524e.jpeg"
            alt="Che Planeta - Menos residuos, más futuro"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Inteligencia Artificial Verde</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
          ¿Dudar antes de tirar? <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
            Escaneá con Che Planeta
          </span>
        </h1>
        <p className="mt-1.5 text-stone-700 text-sm max-w-xs mx-auto leading-relaxed">
          Sacale una foto a cualquier residuo u objeto para descubrir ideas DIY creativas, cómo reciclarlo y hacer crecer a tu planeta.
        </p>
      </div>

      {/* Central Interactive Cozy Planet Showcase */}
      <div className="relative w-56 h-56 my-2 flex items-center justify-center">
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-200/50 via-sky-200/40 to-emerald-300/30 blur-2xl animate-pulse" />

        {/* Orbiting ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin"
          style={{ animationDuration: '30s' }}
        />

        {/* The cozy planet pet itself */}
        <CozyPlanetPet
          pet={pet}
          size="lg"
          showSpeechBubble={false}
          onPetClick={onPetPet}
        />

        {/* Floating eco badges around the planet */}
        <div className="absolute -top-1 -right-2 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-emerald-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 animate-float-slow">
          <Recycle className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Circular</span>
        </div>

        <div
          className="absolute -bottom-2 -left-2 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-sky-100 flex items-center gap-1.5 text-[11px] font-bold text-sky-800 animate-float-slow"
          style={{ animationDelay: '1.5s' }}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Ideas DIY</span>
        </div>
      </div>

      {/* BIG PRIMARY BUTTON: «Escaneá un objeto» */}
      <div className="w-full mt-6 flex flex-col items-center">
        <button
          onClick={onStartScan}
          className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-heading font-bold text-lg shadow-lg shadow-emerald-700/30 hover:shadow-xl hover:shadow-emerald-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden border border-emerald-400/30 cursor-pointer"
        >
          {/* Ripple effect */}
          <span className="absolute -inset-1 rounded-2xl bg-emerald-400/20 blur-sm group-hover:bg-emerald-400/30 transition-all pointer-events-none" />

          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Camera className="w-6 h-6 text-white drop-shadow-sm" />
          </div>

          <span className="tracking-wide">Escaneá un objeto</span>

          <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary upload from files / gallery */}
        <div className="w-full mt-2.5 flex items-center justify-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onUploadFile}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-white/80 hover:bg-emerald-50/80 border border-emerald-800/15 text-stone-700 hover:text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>O subí una foto de tu galería</span>
          </button>
        </div>
      </div>

      {/* Quick Mission Teaser Banner */}
      <div
        onClick={onNavigateMissions}
        className="w-full mt-6 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-stone-900 block leading-tight">
              Misión diaria: ¡Completá tu escaneo de hoy!
            </span>
            <span className="text-[10px] text-amber-700 font-medium">
              Sumá +60 XP y mantené tu racha de {streak.currentDays} días
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-700" />
      </div>

      {/* Quick Test Samples */}
      <div className="w-full mt-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="font-heading font-bold text-sm text-stone-900">
              Probar con objetos de muestra
            </h2>
          </div>
          <span className="text-[11px] text-stone-600 font-medium">
            1 toque para analizar
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {SAMPLE_OBJECTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group p-2.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200/80 hover:border-emerald-300 text-left transition-all hover:shadow-md shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-100 mb-2 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                <img
                  src={sample.dataUrl}
                  alt={sample.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="font-heading font-bold text-xs text-stone-800 leading-tight group-hover:text-emerald-700 truncate">
                  {sample.name}
                </p>
                <p className="text-[10px] text-stone-600 truncate mt-0.5">
                  {sample.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Scans list if available */}
      {recentScans && recentScans.length > 0 && (
        <div className="w-full mt-7">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="font-heading font-bold text-sm text-stone-900">
              Tus últimos escaneos
            </h2>
            <span className="text-xs text-emerald-700 font-semibold">
              {recentScans.length} guardados
            </span>
          </div>

          <div className="space-y-2">
            {recentScans.slice(0, 2).map((item, index) => (
              <button
                key={index}
                onClick={() => onSelectRecent(item)}
                className="w-full p-2.5 rounded-xl bg-white/90 hover:bg-emerald-50 border border-emerald-900/10 flex items-center gap-3 text-left transition-all shadow-xs group cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.objectName}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-xs text-stone-800 truncate group-hover:text-emerald-700">
                    {item.objectName}
                  </h3>
                  <p className="text-[11px] text-stone-600 truncate mt-0.5">
                    {item.probableMaterial}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                    {item.recyclabilityBadge}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Daily Eco Tip Card */}
      <div className="w-full mt-7 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-sky-50 border border-emerald-200/80 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-700">
            <Compass className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-900">
              Dato Che Planeta del Día
            </h3>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              Reciclar una sola lata de aluminio ahorra suficiente energía para hacer funcionar una televisión durante 3 horas. ¡El aluminio se puede reciclar indefinidamente sin perder pureza!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
