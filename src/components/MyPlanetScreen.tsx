import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Shirt,
  TreePine,
  Heart,
  Droplets,
  Edit2,
  Check,
  Award,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  PetState,
  UserProfile,
  PetMood,
  EvolutionStage,
} from '../types/gamification';
import {
  PET_PALETTES,
  ACCESSORIES,
  BIOME_ITEMS,
  getStageName,
  getStageDescription,
} from '../utils/gamificationDefaults';
import { CozyPlanetPet } from './CozyPlanetPet';

interface MyPlanetScreenProps {
  pet: PetState;
  profile: UserProfile;
  onUpdatePetName: (newName: string) => void;
  onSelectPalette: (paletteId: string) => void;
  onEquipAccessory: (accId: string, slot: 'head' | 'face' | 'body' | 'hand' | 'ambient') => void;
  onUnequipAccessory: (slot: 'head' | 'face' | 'body' | 'hand' | 'ambient') => void;
  onToggleBiomeItem: (biomeId: string) => void;
  onPetPet: () => void;
  onCleanPet: () => void;
  onNavigateScan: () => void;
}

type TabType = 'status' | 'custom' | 'biome' | 'evolution';

export const MyPlanetScreen: React.FC<MyPlanetScreenProps> = ({
  pet,
  profile,
  onUpdatePetName,
  onSelectPalette,
  onEquipAccessory,
  onUnequipAccessory,
  onToggleBiomeItem,
  onPetPet,
  onCleanPet,
  onNavigateScan,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(pet.name);
  const [accFilter, setAccFilter] = useState<'all' | 'head' | 'face' | 'body' | 'hand' | 'ambient'>('all');

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdatePetName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const xpProgressPercent = Math.min(100, Math.round((pet.xp / pet.xpToNextLevel) * 100));

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-28 flex flex-col items-center">
      {/* Title & Pet Name Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={16}
                  className="px-2 py-0.5 rounded-lg border border-emerald-400 bg-white text-sm font-heading font-bold text-stone-900 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight">
                  {pet.name}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-6 h-6 rounded-md hover:bg-emerald-100/60 text-stone-400 hover:text-emerald-800 flex items-center justify-center transition-colors"
                  title="Cambiar nombre de la mascota"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-stone-600 font-medium">
            {getStageName(pet.stage)} &bull; Nivel {pet.level}
          </p>
        </div>

        {/* Eco points badge */}
        <div className="px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
          <span>🌱</span>
          <span>{profile.ecoPoints} pts</span>
        </div>
      </div>

      {/* CENTRAL COZY PET SHOWCASE */}
      <div className="w-full relative my-3 p-5 rounded-3xl bg-gradient-to-b from-sky-100/60 via-emerald-50/50 to-amber-50/40 border border-emerald-200/60 shadow-xs flex flex-col items-center overflow-hidden">
        {/* Sky / Biome Elements */}
        <div className="absolute top-2 left-4 text-xs font-semibold text-emerald-800/60 uppercase tracking-widest">
          Biosfera Personalizada
        </div>

        {/* The Cozy Planet Pet */}
        <div className="my-2">
          <CozyPlanetPet
            pet={pet}
            size="lg"
            showSpeechBubble={false}
            onPetClick={onPetPet}
          />
        </div>

        {/* Quick Caring Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onPetPet}
            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Mimar (+Felicidad)</span>
          </button>

          <button
            onClick={onCleanPet}
            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span>Regar atmósfera</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-500 mt-2 text-center">
          ¡Tocá a tu Che Planeta en cualquier momento para acariciarlo!
        </p>
      </div>

      {/* TABS SELECTOR */}
      <div className="w-full flex items-center gap-1 p-1 rounded-2xl bg-stone-200/60 mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'status'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Estado & XP</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Shirt className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accesorios</span>
        </button>

        <button
          onClick={() => setActiveTab('biome')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'biome'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <TreePine className="w-3.5 h-3.5 text-teal-600" />
          <span>Espacio Virtual</span>
        </button>

        <button
          onClick={() => setActiveTab('evolution')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'evolution'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>Evolución</span>
        </button>
      </div>

      {/* TAB 1: ESTADO, XP Y PROGRESO */}
      {activeTab === 'status' && (
        <div className="w-full space-y-3.5 animate-in fade-in">
          {/* Level Progress Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-heading font-extrabold text-sm text-stone-900">
                Progreso a Nivel {pet.level + 1}
              </span>
              <span className="text-xs font-extrabold text-emerald-700">
                {pet.xp} / {pet.xpToNextLevel} XP ({xpProgressPercent}%)
              </span>
            </div>

            {/* XP Bar */}
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Faltan <span className="font-bold text-emerald-700">{pet.xpToNextLevel - pet.xp} XP</span> para subir de nivel.
              ¡Escaneá objetos y completá misiones para que tu planeta crezca!
            </p>

            <button
              onClick={onNavigateScan}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Escanear un objeto para sumar +60 XP</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vitals Grid (Happiness & Cleanliness) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
                <span className="flex items-center gap-1 text-rose-600">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  Felicidad
                </span>
                <span>{pet.happiness}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all"
                  style={{ width: `${pet.happiness}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1.5">
                Aumenta con mimos y escaneos nuevos.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
                <span className="flex items-center gap-1 text-sky-600">
                  <Droplets className="w-3.5 h-3.5" />
                  Limpieza
                </span>
                <span>{pet.cleanliness}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all"
                  style={{ width: `${pet.cleanliness}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1.5">
                Refleja la separación de residuos secos.
              </p>
            </div>
          </div>

          {/* Color Palettes Picker */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>Colores de la Biosfera</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {PET_PALETTES.map((palette) => {
                const isSelected = pet.colorPaletteId === palette.id;
                const isUnlocked = pet.level >= palette.unlockedAtLevel;

                return (
                  <button
                    key={palette.id}
                    disabled={!isUnlocked}
                    onClick={() => onSelectPalette(palette.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : isUnlocked
                        ? 'border-stone-200 hover:border-emerald-300 bg-white'
                        : 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: palette.ocean }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: palette.continent }}
                      />
                    </div>
                    <p className="font-bold text-[11px] text-stone-900 truncate">
                      {palette.name}
                    </p>
                    {!isUnlocked && (
                      <span className="flex items-center gap-1 text-[9px] text-stone-500 mt-0.5">
                        <Lock className="w-2.5 h-2.5" /> Nv. {palette.unlockedAtLevel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONALIZACIÓN DE ACCESORIOS */}
      {activeTab === 'custom' && (
        <div className="w-full space-y-3.5 animate-in fade-in">
          {/* Subfilter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'head', label: 'Cabeza' },
              { id: 'face', label: 'Rostro' },
              { id: 'body', label: 'Cuerpo' },
              { id: 'hand', label: 'Mano' },
              { id: 'ambient', label: 'Ambiente' },
            ].map((slot) => (
              <button
                key={slot.id}
                onClick={() => setAccFilter(slot.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  accFilter === slot.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>

          {/* Accessories Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {ACCESSORIES.filter(
              (acc) => accFilter === 'all' || acc.type === accFilter
            ).map((acc) => {
              const isEquipped = pet.equippedAccessories[acc.type] === acc.id;
              const isUnlocked =
                pet.unlockedAccessories.includes(acc.id) ||
                pet.level >= acc.unlockedAtLevel;

              return (
                <div
                  key={acc.id}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isEquipped
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                      : isUnlocked
                      ? 'border-stone-200 bg-white hover:border-emerald-300'
                      : 'border-stone-200 bg-stone-50/80 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl mb-1">{acc.icon}</span>
                      {isEquipped && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                          Puesto
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Nv. {acc.unlockedAtLevel}
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs text-stone-900 leading-tight">
                      {acc.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-1 leading-snug line-clamp-2">
                      {acc.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-stone-400 capitalize">
                      {acc.type}
                    </span>

                    {isUnlocked ? (
                      isEquipped ? (
                        <button
                          onClick={() => onUnequipAccessory(acc.type)}
                          className="px-2 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold"
                        >
                          Quitar
                        </button>
                      ) : (
                        <button
                          onClick={() => onEquipAccessory(acc.id, acc.type)}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                        >
                          Equipar
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] text-stone-400 font-bold">
                        {acc.costEcoPoints} pts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DECORAR ESPACIO VIRTUAL (BIOMA) */}
      {activeTab === 'biome' && (
        <div className="w-full space-y-3.5 animate-in fade-in">
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
            <TreePine className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              ¡Decorá la biosfera que rodea a tu planeta! Los elementos activos aparecerán flotando alrededor de tu Che Planeta en su hábitat.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {BIOME_ITEMS.map((item) => {
              const isPlaced = pet.placedBiomeItems.includes(item.id);
              const isUnlocked =
                pet.unlockedBiomeItems.includes(item.id) ||
                pet.level >= item.unlockedAtLevel;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isPlaced
                      ? 'border-teal-500 bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20'
                      : isUnlocked
                      ? 'border-stone-200 bg-white hover:border-teal-300'
                      : 'border-stone-200 bg-stone-50 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl mb-1">{item.icon}</span>
                      {isPlaced && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-teal-600 text-white">
                          Activo
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Nv. {item.unlockedAtLevel}
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs text-stone-900 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-stone-400 capitalize">
                      {item.type}
                    </span>

                    {isUnlocked ? (
                      <button
                        onClick={() => onToggleBiomeItem(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          isPlaced
                            ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                            : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                      >
                        {isPlaced ? 'Guardar' : 'Colocar'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-bold">
                        Nv. {item.unlockedAtLevel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ETAPAS DE EVOLUCIÓN */}
      {activeTab === 'evolution' && (
        <div className="w-full space-y-3.5 animate-in fade-in">
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-stone-900 mb-1">
              Etapas del Ciclo Planetario
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Cada acción ecológica real alimenta la atmósfera y la corteza de tu planeta.
            </p>
          </div>

          {[
            {
              stage: 'seed',
              name: 'Semillita Cósmica',
              levelReq: 'Nivel 1',
              icon: '🌱',
              desc: 'Recién nacida en el cosmos, con valles esperando tus primeros escaneos.',
            },
            {
              stage: 'sprout',
              name: 'Brotecito Terrestre',
              levelReq: 'Nivel 2 - 3',
              icon: '🌿',
              desc: 'Despiertan ríos y continentes verdes. Tu mascota aprende a sonreír y comunicarse.',
            },
            {
              stage: 'bloom',
              name: 'Biosfera en Flor',
              levelReq: 'Nivel 4 - 5',
              icon: '🌸',
              desc: 'Ecosistemas frondosos, mariposas y ríos cristalinos rodean a tu planeta.',
            },
            {
              stage: 'guardian',
              name: 'Guardián Planetario',
              levelReq: 'Nivel 6+',
              icon: '🌟',
              desc: 'La evolución suprema. Un planeta sabio, radiante y protector de toda la comunidad.',
            },
          ].map((st) => {
            const isCurrent = pet.stage === st.stage;
            return (
              <div
                key={st.stage}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl shrink-0">
                  {st.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-heading font-bold text-xs text-stone-900">
                      {st.name}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {st.levelReq}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-snug">
                    {st.desc}
                  </p>
                  {isCurrent && (
                    <span className="inline-block mt-2 text-[10px] font-extrabold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                      ¡Tu estadio actual!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
