import React, { useState } from 'react';
import {
  PetState,
  PetMood,
  EvolutionStage,
  PetColorPalette,
  Accessory,
  PlanetBiomeItem,
} from '../types/gamification';
import { PET_PALETTES, ACCESSORIES, BIOME_ITEMS } from '../utils/gamificationDefaults';
import { Heart, Sparkles, Smile, Droplets } from 'lucide-react';

interface CozyPlanetPetProps {
  pet: PetState;
  mood?: PetMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onPetClick?: () => void;
  showSpeechBubble?: boolean;
  customSpeech?: string;
}

export const CozyPlanetPet: React.FC<CozyPlanetPetProps> = ({
  pet,
  mood = 'happy',
  size = 'lg',
  interactive = true,
  onPetClick,
  showSpeechBubble = false,
  customSpeech,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const [internalSpeech, setInternalSpeech] = useState<string | null>(null);

  const palette =
    PET_PALETTES.find((p) => p.id === pet.colorPaletteId) || PET_PALETTES[0];

  // Equipped accessories lookups
  const headAcc = ACCESSORIES.find((a) => a.id === pet.equippedAccessories.head);
  const faceAcc = ACCESSORIES.find((a) => a.id === pet.equippedAccessories.face);
  const bodyAcc = ACCESSORIES.find((a) => a.id === pet.equippedAccessories.body);
  const handAcc = ACCESSORIES.find((a) => a.id === pet.equippedAccessories.hand);
  const ambientAcc = ACCESSORIES.find((a) => a.id === pet.equippedAccessories.ambient);

  // Dimension scaling
  const sizeConfig = {
    sm: {
      wrapper: 'w-24 h-24',
      planet: 'w-20 h-20',
      faceSize: 'text-base',
      blushSize: 'w-2 h-1',
      sparkles: false,
    },
    md: {
      wrapper: 'w-40 h-40',
      planet: 'w-32 h-32',
      faceSize: 'text-2xl',
      blushSize: 'w-3.5 h-1.5',
      sparkles: true,
    },
    lg: {
      wrapper: 'w-56 h-56',
      planet: 'w-44 h-44',
      faceSize: 'text-4xl',
      blushSize: 'w-5 h-2',
      sparkles: true,
    },
    xl: {
      wrapper: 'w-64 h-64',
      planet: 'w-52 h-52',
      faceSize: 'text-5xl',
      blushSize: 'w-6 h-2.5',
      sparkles: true,
    },
  }[size];

  const handleInteraction = () => {
    if (!interactive) return;
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 900);

    const cozyMessages = [
      '¡Me encanta cuando reciclamos juntos! 💚',
      '¡Qué lindo huele el aire limpio! 🌱',
      '¡Gracias por cuidarme, che! ✨',
      '¡Mirá cómo brilla mi atmósfera! 🌊',
      '¿Qué vamos a escanear hoy? 🔍',
      '¡Sos el mejor guardián del mundo! 🌍',
    ];
    const randomMsg = cozyMessages[Math.floor(Math.random() * cozyMessages.length)];
    setInternalSpeech(randomMsg);
    setTimeout(() => setInternalSpeech(null), 3500);

    if (onPetClick) {
      onPetClick();
    }
  };

  const currentSpeech = customSpeech || internalSpeech;

  return (
    <div className={`relative ${sizeConfig.wrapper} flex items-center justify-center select-none`}>
      {/* Ambient accessory effect (Rainbow / Butterflies / Sparkles) */}
      {ambientAcc && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-spin" style={{ animationDuration: '24s' }}>
          <div className="absolute -top-2 left-6 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            {ambientAcc.icon}
          </div>
          <div className="absolute -bottom-2 right-6 text-xl animate-pulse">
            {ambientAcc.icon}
          </div>
        </div>
      )}

      {/* Halo Glow according to mood and palette */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: palette.atmosphere,
          transform: isWiggling ? 'scale(1.2)' : 'scale(1)',
        }}
      />

      {/* Orbiting ring for Sprout, Bloom and Guardian */}
      {pet.stage !== 'seed' && (
        <div
          className="absolute inset-1 rounded-full border-2 border-dashed opacity-35 animate-spin pointer-events-none"
          style={{
            borderColor: palette.continent,
            animationDuration: pet.stage === 'guardian' ? '18s' : '36s',
          }}
        />
      )}

      {/* Evolution Stage: Little satellites/leaves orbiting */}
      {pet.stage === 'bloom' && (
        <>
          <span className="absolute -top-1 right-8 text-base animate-float-slow">🌸</span>
          <span className="absolute bottom-4 -left-1 text-sm animate-float-slow" style={{ animationDelay: '1.2s' }}>🌷</span>
        </>
      )}
      {pet.stage === 'guardian' && (
        <>
          <span className="absolute -top-3 -right-1 text-lg animate-float-slow">✨</span>
          <span className="absolute -bottom-2 left-4 text-base animate-float-slow" style={{ animationDelay: '1.5s' }}>🌟</span>
          <div className="absolute -inset-2 rounded-full border border-amber-300/60 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Placed Biome Items in background mini icons */}
      {size !== 'sm' && pet.placedBiomeItems && (
        <div className="absolute inset-0 pointer-events-none">
          {pet.placedBiomeItems.slice(0, 3).map((itemId, idx) => {
            const item = BIOME_ITEMS.find((b) => b.id === itemId);
            if (!item) return null;
            const positions = [
              '-top-2 left-3',
              'top-1/2 -right-3',
              '-bottom-1 right-8',
            ];
            return (
              <span
                key={itemId}
                className={`absolute ${positions[idx % positions.length]} text-xl drop-shadow-sm animate-float-slow`}
                style={{ animationDelay: `${idx * 0.7}s` }}
                title={item.name}
              >
                {item.icon}
              </span>
            );
          })}
        </div>
      )}

      {/* Speech Bubble */}
      {(showSpeechBubble || currentSpeech) && (
        <div className="absolute -top-14 z-20 px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200 text-stone-800 text-xs font-semibold shadow-lg shadow-emerald-950/10 whitespace-nowrap animate-in fade-in zoom-in duration-200 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse shrink-0" />
          <span>{currentSpeech || '¡Hola! Cuidemos el planeta 🌿'}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-emerald-200 rotate-45" />
        </div>
      )}

      {/* PLANET BODY SPHERE */}
      <div
        onClick={handleInteraction}
        className={`relative ${sizeConfig.planet} rounded-full shadow-xl shadow-emerald-900/20 flex items-center justify-center overflow-hidden border-4 border-white/90 cursor-pointer transition-transform duration-300 ${
          isWiggling ? 'animate-bounce scale-105' : 'hover:scale-105 active:scale-95'
        }`}
        style={{
          background: `radial-gradient(circle at 35% 35%, ${palette.atmosphere} 0%, ${palette.ocean} 50%, #0369A1 100%)`,
        }}
        title="¡Tocá a tu Che Planeta para darle cariño!"
      >
        {/* Continent patches (Procedural SVGs with organic shapes) */}
        <div
          className="absolute -top-4 -left-6 w-3/4 h-2/3 rounded-full opacity-90 transform rotate-12 transition-colors duration-500"
          style={{ backgroundColor: palette.continent }}
        />
        <div
          className="absolute -bottom-6 -right-4 w-2/3 h-2/3 rounded-full opacity-90 transform -rotate-12 transition-colors duration-500"
          style={{ backgroundColor: palette.continent }}
        />
        <div
          className="absolute top-1/3 -right-2 w-1/3 h-1/4 rounded-full opacity-80 transition-colors duration-500"
          style={{ backgroundColor: palette.continent }}
        />

        {/* Atmosphere Shine Highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/35 rounded-full pointer-events-none" />

        {/* COZY EMOJI/SVG FACE */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Eyes & Blushing cheeks */}
          <div className="flex items-center gap-4">
            {/* Left Eye */}
            <div className="relative flex flex-col items-center">
              {mood === 'sleepy' ? (
                <div className="w-3.5 h-1.5 border-b-2 border-stone-900 rounded-full" />
              ) : mood === 'excited' ? (
                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full -top-0.5 -left-0.5 relative" />
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-stone-900 flex items-center justify-center shadow-xs">
                  <div className="w-1 h-1 bg-white rounded-full -top-0.5 -left-0.5 relative" />
                </div>
              )}
            </div>

            {/* Right Eye */}
            <div className="relative flex flex-col items-center">
              {mood === 'sleepy' ? (
                <div className="w-3.5 h-1.5 border-b-2 border-stone-900 rounded-full" />
              ) : mood === 'excited' ? (
                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full -top-0.5 -left-0.5 relative" />
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-stone-900 flex items-center justify-center shadow-xs">
                  <div className="w-1 h-1 bg-white rounded-full -top-0.5 -left-0.5 relative" />
                </div>
              )}
            </div>
          </div>

          {/* Cheeks / Blush */}
          <div className="flex items-center justify-between w-14 mt-0.5">
            <div className={`${sizeConfig.blushSize} rounded-full bg-rose-400/80 blur-[0.5px]`}>
              {faceAcc?.id === 'acc-blush' && <span className="opacity-0">.</span>}
            </div>
            <div className={`${sizeConfig.blushSize} rounded-full bg-rose-400/80 blur-[0.5px]`}>
              {faceAcc?.id === 'acc-blush' && <span className="opacity-0">.</span>}
            </div>
          </div>

          {/* Cute Mouth */}
          <div className="-mt-1 flex items-center justify-center">
            {mood === 'sleepy' ? (
              <div className="w-2 h-2 rounded-full border border-stone-900" />
            ) : mood === 'excited' ? (
              <div className="w-3.5 h-2.5 bg-stone-900 rounded-b-full border-t border-rose-400 flex items-end justify-center pb-0.5">
                <div className="w-2 h-1 bg-rose-400 rounded-full" />
              </div>
            ) : (
              <div className="w-2.5 h-1.5 border-b-2 border-stone-900 rounded-full" />
            )}
          </div>
        </div>

        {/* Head Accessory (Hat, Flower Crown, Sprout) */}
        {headAcc && (
          <div className="absolute -top-3 z-20 text-3xl animate-float-slow drop-shadow-md">
            {headAcc.icon}
          </div>
        )}

        {/* Face Accessory (Glasses, Mask) */}
        {faceAcc && faceAcc.id !== 'acc-blush' && (
          <div className="absolute top-1/2 -translate-y-1/2 z-20 text-xl pointer-events-none">
            {faceAcc.icon}
          </div>
        )}

        {/* Body Accessory (Scarf, Bag) */}
        {bodyAcc && (
          <div className="absolute -bottom-2 z-20 text-2xl drop-shadow-md">
            {bodyAcc.icon}
          </div>
        )}

        {/* Hand Accessory */}
        {handAcc && (
          <div className="absolute -right-2 top-1/2 z-20 text-2xl drop-shadow-md animate-float-slow">
            {handAcc.icon}
          </div>
        )}
      </div>
    </div>
  );
};
