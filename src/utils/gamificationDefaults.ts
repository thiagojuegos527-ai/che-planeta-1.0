import {
  PetState,
  EcoStreak,
  EcoMission,
  Badge,
  UserProfile,
  PetColorPalette,
  Accessory,
  PlanetBiomeItem,
  EvolutionStage
} from '../types/gamification';

export const PET_PALETTES: PetColorPalette[] = [
  {
    id: 'classic-earth',
    name: 'Tierra Clásica',
    ocean: '#38BDF8', // celeste
    continent: '#10B981', // verde esmeralda
    atmosphere: '#BAE6FD',
    unlockedAtLevel: 1,
  },
  {
    id: 'sunset-oasis',
    name: 'Atardecer Cálido',
    ocean: '#06B6D4',
    continent: '#F59E0B',
    atmosphere: '#FED7AA',
    unlockedAtLevel: 2,
  },
  {
    id: 'deep-ocean',
    name: 'Abisal Puro',
    ocean: '#0284C7',
    continent: '#059669',
    atmosphere: '#7DD3FC',
    unlockedAtLevel: 3,
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Boreal',
    ocean: '#6366F1',
    continent: '#14B8A6',
    atmosphere: '#C7D2FE',
    unlockedAtLevel: 4,
  },
  {
    id: 'sakura-blossom',
    name: 'Primavera Rosa',
    ocean: '#38BDF8',
    continent: '#F472B6',
    atmosphere: '#FCE7F3',
    unlockedAtLevel: 5,
  },
  {
    id: 'golden-sun',
    name: 'Guardián Dorado',
    ocean: '#0D9488',
    continent: '#EAB308',
    atmosphere: '#FEF08A',
    unlockedAtLevel: 6,
  },
];

export const ACCESSORIES: Accessory[] = [
  // Head
  {
    id: 'acc-leaf-sprout',
    name: 'Brotecito Tierno',
    type: 'head',
    icon: '🌱',
    description: 'Una plantita recién nacida que se balancea feliz en tu cabecita.',
    unlockedAtLevel: 1,
    costEcoPoints: 0,
  },
  {
    id: 'acc-flower-crown',
    name: 'Corona de Flores Silvestres',
    type: 'head',
    icon: '🌸',
    description: 'Tejida a mano con margaritas y tréboles recolectados con respeto.',
    unlockedAtLevel: 2,
    costEcoPoints: 40,
  },
  {
    id: 'acc-gardener-hat',
    name: 'Sombrero de Huertista',
    type: 'head',
    icon: '👒',
    description: 'Ideal para protegerse del sol mientras regás las plantitas.',
    unlockedAtLevel: 3,
    costEcoPoints: 80,
  },
  {
    id: 'acc-chef-toque',
    name: 'Gorro Cero Desperdicio',
    type: 'head',
    icon: '👨‍🍳',
    description: 'Para crear recetas deliciosas con cáscaras y sobras orgánicas.',
    unlockedAtLevel: 4,
    costEcoPoints: 120,
  },
  {
    id: 'acc-eco-crown',
    name: 'Corona de Hojas Doradas',
    type: 'head',
    icon: '👑',
    description: 'Distinción ancestral para los guardianes del planeta.',
    unlockedAtLevel: 5,
    costEcoPoints: 200,
  },

  // Face
  {
    id: 'acc-blush',
    name: 'Mejillas Sonrojadas',
    type: 'face',
    icon: '😊',
    description: 'Un rubor adorable que refleja la felicidad de un planeta limpio.',
    unlockedAtLevel: 1,
    costEcoPoints: 0,
  },
  {
    id: 'acc-glasses-reader',
    name: 'Gafas de Eco-Investigador',
    type: 'face',
    icon: '👓',
    description: 'Permiten leer códigos de reciclaje microscópicos con agudeza.',
    unlockedAtLevel: 2,
    costEcoPoints: 50,
  },
  {
    id: 'acc-cool-shades',
    name: 'Lentes de Bambú Upcycled',
    type: 'face',
    icon: '🕶️',
    description: '100% biodegradables y con un estilo muy canchero.',
    unlockedAtLevel: 3,
    costEcoPoints: 90,
  },
  {
    id: 'acc-leaf-mask',
    name: 'Parche de Trébol Suerte',
    type: 'face',
    icon: '🍀',
    description: 'Atrae la buena fortuna a cada punto de reciclaje barrial.',
    unlockedAtLevel: 4,
    costEcoPoints: 110,
  },

  // Body
  {
    id: 'acc-scarf-green',
    name: 'Bufanda de Lana Recuperada',
    type: 'body',
    icon: '🧣',
    description: 'Tejida con retazos textiles sobrantes, súper abrigadita.',
    unlockedAtLevel: 1,
    costEcoPoints: 0,
  },
  {
    id: 'acc-satchel-canvas',
    name: 'Bolsita de Tela Tote',
    type: 'body',
    icon: '👜',
    description: '¡Jamás vuelvas a pedir una bolsa plástica descartable!',
    unlockedAtLevel: 2,
    costEcoPoints: 60,
  },
  {
    id: 'acc-cape-leaf',
    name: 'Capa de Hojas Protectoras',
    type: 'body',
    icon: '🍃',
    description: 'Ondea al viento como un superhéroe del clima.',
    unlockedAtLevel: 4,
    costEcoPoints: 130,
  },

  // Hand
  {
    id: 'acc-magnifier',
    name: 'Lupa Botánica',
    type: 'hand',
    icon: '🔍',
    description: 'Para examinar fibras de papel, texturas de hojas y polímeros.',
    unlockedAtLevel: 1,
    costEcoPoints: 0,
  },
  {
    id: 'acc-watering-can',
    name: 'Regadera Turquesa',
    type: 'hand',
    icon: '🚿',
    description: 'Agua de lluvia recolectada lista para mimar a las plantitas.',
    unlockedAtLevel: 2,
    costEcoPoints: 70,
  },
  {
    id: 'acc-wooden-wand',
    name: 'Ramita de Sauce Mágica',
    type: 'hand',
    icon: '🪄',
    description: 'Hechiza la basura para convertirla en abono fértil.',
    unlockedAtLevel: 5,
    costEcoPoints: 180,
  },

  // Ambient
  {
    id: 'acc-butterflies',
    name: 'Mariposas Monarca',
    type: 'ambient',
    icon: '🦋',
    description: 'Tres mariposas revolotean suavemente alrededor de tu planeta.',
    unlockedAtLevel: 3,
    costEcoPoints: 100,
  },
  {
    id: 'acc-sparkle-stars',
    name: 'Brillos Cósmicos Cozy',
    type: 'ambient',
    icon: '✨',
    description: 'Destellos estelares cálidos que iluminan tu atmósfera.',
    unlockedAtLevel: 4,
    costEcoPoints: 140,
  },
  {
    id: 'acc-rainbow-ring',
    name: 'Halo Arcoíris Circular',
    type: 'ambient',
    icon: '🌈',
    description: 'Un arcoíris suave que rodea tu biosfera en señal de esperanza.',
    unlockedAtLevel: 5,
    costEcoPoints: 220,
  },
];

export const BIOME_ITEMS: PlanetBiomeItem[] = [
  {
    id: 'biome-little-tree',
    name: 'Arbolito Nativo',
    type: 'flora',
    icon: '🌳',
    description: 'Atrae pajaritos y absorbe carbono día tras día.',
    unlockedAtLevel: 1,
    costEcoPoints: 0,
  },
  {
    id: 'biome-flower-patch',
    name: 'Cantero de Flores',
    type: 'flora',
    icon: '🌷',
    description: 'Para que las abejas tengan néctar fresco todo el año.',
    unlockedAtLevel: 1,
    costEcoPoints: 30,
  },
  {
    id: 'biome-mushroom-family',
    name: 'Honguitos del Bosque',
    type: 'flora',
    icon: '🍄',
    description: 'Descomponedores naturales vitales para el ciclo del suelo.',
    unlockedAtLevel: 2,
    costEcoPoints: 50,
  },
  {
    id: 'biome-little-pond',
    name: 'Estanque de Agua Cristalina',
    type: 'decor',
    icon: '💧',
    description: 'Un espejo de agua donde descansan libélulas y ranitas.',
    unlockedAtLevel: 2,
    costEcoPoints: 75,
  },
  {
    id: 'biome-cozy-tent',
    name: 'Carpita de Explorador',
    type: 'decor',
    icon: '⛺',
    description: 'Refugio para acampar bajo las estrellas sin dejar rastro.',
    unlockedAtLevel: 3,
    costEcoPoints: 90,
  },
  {
    id: 'biome-bird-nest',
    name: 'Nidito de Picaflor',
    type: 'fauna',
    icon: '🪺',
    description: 'Hogar cálido para pajaritos urbanos.',
    unlockedAtLevel: 3,
    costEcoPoints: 85,
  },
  {
    id: 'biome-wind-turbine',
    name: 'Mini Molino Eólico',
    type: 'decor',
    icon: '🌬️',
    description: 'Genera brisa limpia y energía 100% renovable para tu mundo.',
    unlockedAtLevel: 4,
    costEcoPoints: 120,
  },
  {
    id: 'biome-compost-bin',
    name: 'Compostera Feliz',
    type: 'decor',
    icon: '🪴',
    description: 'Convierte restos de fruta y café en tierra viva y fértil.',
    unlockedAtLevel: 4,
    costEcoPoints: 110,
  },
  {
    id: 'biome-cute-whale',
    name: 'Ballenita Amiga',
    type: 'fauna',
    icon: '🐳',
    description: 'Nada feliz en tus mares limpios de plásticos.',
    unlockedAtLevel: 5,
    costEcoPoints: 160,
  },
  {
    id: 'biome-sun-smile',
    name: 'Sol Cálido Sonriente',
    type: 'sky',
    icon: '☀️',
    description: 'Baña tu pequeño planeta de luz y fotosíntesis.',
    unlockedAtLevel: 5,
    costEcoPoints: 150,
  },
];

export const INITIAL_MISSIONS: EcoMission[] = [
  // Dailies
  {
    id: 'daily-scan-1',
    title: 'Ojo Ecológico',
    description: 'Escaneá 1 objeto que pensabas tirar para ver si se reutiliza o recicla.',
    category: 'scan',
    frequency: 'daily',
    xpReward: 60,
    pointsReward: 35,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardClaimed: false,
    icon: '🔍',
  },
  {
    id: 'daily-diy-check',
    title: 'Chusmear Upcycling',
    description: 'Explorá al menos 1 idea DIY en el análisis de un objeto escaneado.',
    category: 'diy',
    frequency: 'daily',
    xpReward: 40,
    pointsReward: 25,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardClaimed: false,
    icon: '💡',
  },
  {
    id: 'daily-clean-pet',
    title: 'Cariño al Planeta',
    description: 'Acariciá o limpiá a tu mascota terrestre en «Mi planeta».',
    category: 'community',
    frequency: 'daily',
    xpReward: 30,
    pointsReward: 20,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardClaimed: false,
    icon: '✨',
  },
  {
    id: 'daily-green-point',
    title: 'Mapeo Barrial',
    description: 'Abrí la guía de Puntos Verdes para ubicar un centro de reciclaje.',
    category: 'disposal',
    frequency: 'daily',
    xpReward: 40,
    pointsReward: 25,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardClaimed: false,
    icon: '🗺️',
  },

  // Weeklies
  {
    id: 'weekly-scans-3',
    title: 'Inspector Circular Semanal',
    description: 'Escaneá 3 objetos distintos a lo largo de la semana.',
    category: 'scan',
    frequency: 'weekly',
    xpReward: 150,
    pointsReward: 90,
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardClaimed: false,
    icon: '📦',
  },
  {
    id: 'weekly-streak-3',
    title: 'Compromiso Sostenido',
    description: 'Mantené una racha de al menos 3 días consecutivos.',
    category: 'community',
    frequency: 'weekly',
    xpReward: 180,
    pointsReward: 110,
    targetCount: 3,
    currentCount: 1,
    completed: false,
    rewardClaimed: false,
    icon: '🔥',
  },
  {
    id: 'weekly-learn-sources',
    title: 'Conocimiento Científico',
    description: 'Revisá las fuentes confiables en el análisis de un objeto.',
    category: 'learn',
    frequency: 'weekly',
    xpReward: 100,
    pointsReward: 60,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardClaimed: false,
    icon: '📚',
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-scan',
    title: 'Primer Destello',
    description: 'Escaneaste tu primer objeto contaminante con IA.',
    icon: '🌱',
    unlocked: true,
    unlockedAt: 'Hoy',
    category: 'explorer',
  },
  {
    id: 'badge-streak-3',
    title: 'Chispa Verde',
    description: 'Alcanzaste 3 días consecutivos de racha ecológica.',
    icon: '🔥',
    unlocked: false,
    category: 'guardian',
  },
  {
    id: 'badge-streak-7',
    title: 'Guardián Constante',
    description: 'Completaste 7 días de racha sin perder el ritmo.',
    icon: '⚡',
    unlocked: false,
    category: 'guardian',
  },
  {
    id: 'badge-diy-maker',
    title: 'Mano Creativa',
    description: 'Guardaste un proyecto de upcycling en tus favoritos.',
    icon: '🎨',
    unlocked: false,
    category: 'maker',
  },
  {
    id: 'badge-pet-evolve',
    title: 'Metamorfosis Planetaria',
    description: 'Evolucionaste a tu mascota Che Planeta al estadio Brote.',
    icon: '🌿',
    unlocked: false,
    category: 'guardian',
  },
  {
    id: 'badge-pet-bloom',
    title: 'Jardín en Órbita',
    description: 'Llegaste a la etapa Floración cuidando tu biosfera.',
    icon: '🌸',
    unlocked: false,
    category: 'guardian',
  },
  {
    id: 'badge-pet-guardian',
    title: 'Guardián Cósmico',
    description: 'Alcanzaste la evolución máxima de tu Che Planeta.',
    icon: '🌟',
    unlocked: false,
    category: 'guardian',
  },
  {
    id: 'badge-divert-5',
    title: 'Salvador de Vertederos',
    description: 'Separaste correctamente 5 materiales para reciclaje.',
    icon: '♻️',
    unlocked: false,
    category: 'recycler',
  },
  {
    id: 'badge-customizer',
    title: 'Diseñador Cósmico',
    description: 'Equipaste a tu mascota con su primer accesorio.',
    icon: '👒',
    unlocked: true,
    unlockedAt: 'Hoy',
    category: 'maker',
  },
  {
    id: 'badge-eco-scholar',
    title: 'Sabio de la Tierra',
    description: 'Consultaste fuentes verificadas para comprobar datos de impacto.',
    icon: '📖',
    unlocked: false,
    category: 'explorer',
  },
];

export const INITIAL_PET_STATE: PetState = {
  name: 'Chepito',
  stage: 'sprout',
  level: 2,
  xp: 140,
  xpToNextLevel: 250,
  happiness: 85,
  cleanliness: 90,
  colorPaletteId: 'classic-earth',
  equippedAccessories: {
    head: 'acc-leaf-sprout',
    face: 'acc-blush',
    body: 'acc-scarf-green',
  },
  placedBiomeItems: ['biome-little-tree', 'biome-flower-patch'],
  unlockedAccessories: [
    'acc-leaf-sprout',
    'acc-blush',
    'acc-scarf-green',
    'acc-magnifier',
    'acc-flower-crown',
  ],
  unlockedPalettes: ['classic-earth', 'sunset-oasis'],
  unlockedBiomeItems: ['biome-little-tree', 'biome-flower-patch', 'biome-mushroom-family'],
};

export const INITIAL_STREAK: EcoStreak = {
  currentDays: 3,
  longestDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  isPaused: false,
  shieldsAvailable: 1, // 1 escudo protector para no frustrar
  historyDates: [
    // Pre-populate last 3 days
    new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0],
  ],
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'user-che-1',
  username: 'EcoAmigo',
  email: 'ecoamigo@cheplaneta.com',
  isGuest: false,
  title: 'Guardián de Semillas 🌱',
  avatarEmoji: '🌍',
  avatarBgColor: '#10B981',
  profileFrameColor: '#10B981',
  ecoPoints: 180,
  totalScans: 4,
  completedMissionsCount: 3,
  co2SavedKg: 1.8,
  plasticDivertedItems: 6,
  joinedDate: 'Noviembre 2026',
};

export const INITIAL_ACTIVITIES: import('../types/gamification').EcoActivityLog[] = [
  {
    id: 'act-init-1',
    type: 'scan',
    title: 'Escaneaste Botella de Plástico PET',
    description: 'Separación recomendada en Punto Verde Parque de las Naciones (San Luis Capital).',
    pointsDelta: 35,
    xpDelta: 60,
    timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    icon: '🔍',
  },
  {
    id: 'act-init-2',
    type: 'mission',
    title: 'Misión diaria completada',
    description: 'Completaste «Ojo Ecológico» y sumaste experiencia para tu mascota.',
    pointsDelta: 35,
    xpDelta: 60,
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    icon: '🎯',
  },
  {
    id: 'act-init-3',
    type: 'badge',
    title: 'Insignia «Primer Destello» desbloqueada',
    description: '¡Diste tu primer paso identificando residuos con IA!',
    timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    icon: '🏅',
  },
];

export function createAccountState(params: {
  id: string;
  username: string;
  email: string;
  password: string;
  isGuest: boolean;
}): import('../types/gamification').UserAccountRecord {
  const todayStr = new Date().toISOString().split('T')[0];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const now = new Date();
  const joinedLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  return {
    id: params.id,
    username: params.username,
    email: params.email,
    password: params.password,
    isGuest: params.isGuest,
    profile: {
      id: params.id,
      username: params.username,
      email: params.isGuest ? undefined : params.email,
      isGuest: params.isGuest,
      title: params.isGuest ? 'Explorador Invitado 🌱' : 'Guardián de Semillas 🌱',
      avatarEmoji: params.isGuest ? '🌱' : '🌍',
      avatarBgColor: '#10B981',
      profileFrameColor: '#10B981',
      ecoPoints: params.isGuest ? 50 : 80,
      totalScans: 0,
      completedMissionsCount: 0,
      co2SavedKg: 0,
      plasticDivertedItems: 0,
      joinedDate: joinedLabel,
    },
    pet: {
      name: params.isGuest ? 'Brotesito' : `Planeta de ${params.username.split(' ')[0]}`,
      stage: 'seed',
      level: 1,
      xp: 25,
      xpToNextLevel: 100,
      happiness: 90,
      cleanliness: 95,
      colorPaletteId: 'classic-earth',
      equippedAccessories: {
        head: 'acc-leaf-sprout',
        face: 'acc-blush',
      },
      placedBiomeItems: ['biome-little-tree'],
      unlockedAccessories: ['acc-leaf-sprout', 'acc-blush', 'acc-scarf-green', 'acc-magnifier'],
      unlockedPalettes: ['classic-earth'],
      unlockedBiomeItems: ['biome-little-tree', 'biome-flower-patch'],
    },
    streak: {
      currentDays: 1,
      longestDays: 1,
      lastActiveDate: todayStr,
      isPaused: false,
      shieldsAvailable: 1,
      historyDates: [todayStr],
    },
    missions: INITIAL_MISSIONS.map((m) => ({
      ...m,
      currentCount: m.id === 'weekly-streak-3' ? 1 : 0,
      completed: false,
      rewardClaimed: false,
    })),
    badges: INITIAL_BADGES.map((b) => ({
      ...b,
      unlocked: b.id === 'badge-customizer',
      unlockedAt: b.id === 'badge-customizer' ? 'Hoy' : undefined,
    })),
    scans: [],
    activities: [
      {
        id: `act-join-${Date.now()}`,
        type: 'account',
        title: params.isGuest
          ? 'Ingresaste en modo invitado'
          : `¡Bienvenido/a a Che Planeta, ${params.username}!`,
        description: params.isGuest
          ? 'Recibiste tu Semillita Cósmica y 50 puntos verdes de bienvenida.'
          : 'Creaste tu cuenta personal y recibiste 80 puntos verdes de bienvenida.',
        pointsDelta: params.isGuest ? 50 : 80,
        xpDelta: 25,
        timestamp: now.toISOString(),
        icon: '🌍',
      },
    ],
  };
}

// Evolution Stage Requirements
export function getStageForLevel(level: number): EvolutionStage {
  if (level >= 6) return 'guardian';
  if (level >= 4) return 'bloom';
  if (level >= 2) return 'sprout';
  return 'seed';
}

export function getStageName(stage: EvolutionStage): string {
  switch (stage) {
    case 'seed':
      return 'Semillita Cósmica';
    case 'sprout':
      return 'Brotecito Terrestre';
    case 'bloom':
      return 'Biosfera en Flor';
    case 'guardian':
      return 'Guardián Planetario';
  }
}

export function getStageDescription(stage: EvolutionStage): string {
  switch (stage) {
    case 'seed':
      return 'Tu planeta es pequeñito y curioso. Necesita tus primeros escaneos para despertar su vegetación.';
    case 'sprout':
      return '¡Brotan sus primeros valles verdes y arroyos! Ya tiene una atmósfera tierna y carita sonriente.';
    case 'bloom':
      return 'Ecosistemas frondosos, mariposas y ríos cristalinos rodean a tu planeta. ¡Tu constancia se nota!';
    case 'guardian':
      return 'Un planeta sabio, resplandeciente y lleno de vida abundante. ¡Inspiración para toda la comunidad!';
  }
}

export function calculateXpForLevel(level: number): number {
  return Math.round(100 * Math.pow(1.35, level - 1));
}
