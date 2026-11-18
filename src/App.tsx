import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopGamificationBar } from './components/TopGamificationBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CameraScreen } from './components/CameraScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { HistoryDrawer } from './components/HistoryDrawer';
import { MyPlanetScreen } from './components/MyPlanetScreen';
import { MissionsScreen } from './components/MissionsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { StreakModal } from './components/StreakModal';
import { AuthScreen, AuthMode } from './components/AuthScreen';
import { OnboardingSlider } from './components/OnboardingSlider';
import { EcoAnalysisResult } from './types/chePlaneta';
import { SampleObject } from './utils/sampleImages';
import { prepareImageForAnalysis } from './utils/imageUtils';
import {
  MainNavTab,
  PetState,
  EcoStreak,
  UserProfile,
  EcoMission,
  Badge,
  EcoActivityLog,
  UserAccountRecord,
} from './types/gamification';
import {
  INITIAL_PET_STATE,
  INITIAL_STREAK,
  INITIAL_PROFILE,
  INITIAL_MISSIONS,
  INITIAL_BADGES,
  INITIAL_ACTIVITIES,
  createAccountState,
  calculateXpForLevel,
  getStageForLevel,
  getStageName,
} from './utils/gamificationDefaults';

type ScreenState = 'home' | 'camera' | 'analyzing' | 'results';

const STORAGE_KEY_ACCOUNTS = 'che_planeta_accounts_v1';
const STORAGE_KEY_ACTIVE_ID = 'che_planeta_active_account_id_v1';
const STORAGE_KEY_ONBOARDING_USERS = 'che_planeta_onboarding_seen_users_v1';

const getSeenOnboardingUsers = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ONBOARDING_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const hasSeenOnboarding = (userId: string): boolean => {
  return getSeenOnboardingUsers().includes(userId);
};

const markOnboardingSeen = (userId: string): void => {
  try {
    const existing = getSeenOnboardingUsers();
    if (!existing.includes(userId)) {
      localStorage.setItem(STORAGE_KEY_ONBOARDING_USERS, JSON.stringify([...existing, userId]));
    }
  } catch {
    // ignore storage errors
  }
};

const DEFAULT_DEMO_ACCOUNT: UserAccountRecord = {
  id: 'user-che-1',
  username: 'EcoAmigo',
  email: 'ecoamigo@cheplaneta.com',
  password: '1234',
  isGuest: false,
  profile: INITIAL_PROFILE,
  pet: INITIAL_PET_STATE,
  streak: INITIAL_STREAK,
  missions: INITIAL_MISSIONS,
  badges: INITIAL_BADGES,
  scans: [],
  activities: INITIAL_ACTIVITIES,
};

export default function App() {
  // Accounts & Session state
  const [accounts, setAccounts] = useState<UserAccountRecord[]>([DEFAULT_DEMO_ACCOUNT]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [authModalMode, setAuthModalMode] = useState<AuthMode | null>(null);

  // Screen and Scan flows
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [currentTab, setCurrentTab] = useState<MainNavTab>('home');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<EcoAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<{
    message: string;
    lastImage: string;
    lastHint?: string;
  } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active user's states
  const [history, setHistory] = useState<EcoAnalysisResult[]>([]);
  const [activities, setActivities] = useState<EcoActivityLog[]>(INITIAL_ACTIVITIES);
  const [pet, setPet] = useState<PetState>(INITIAL_PET_STATE);
  const [streak, setStreak] = useState<EcoStreak>(INITIAL_STREAK);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [missions, setMissions] = useState<EcoMission[]>(INITIAL_MISSIONS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);

  // Load saved accounts & active session on mount
  useEffect(() => {
    try {
      let loadedAccounts: UserAccountRecord[] = [DEFAULT_DEMO_ACCOUNT];
      const storedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (storedAccounts) {
        const parsed = JSON.parse(storedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedAccounts = parsed;
        }
      } else {
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(loadedAccounts));
      }
      setAccounts(loadedAccounts);

      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (storedActiveId) {
        const found = loadedAccounts.find((a) => a.id === storedActiveId);
        if (found) {
          applyAccountToState(found);
          setActiveAccountId(found.id);
          if (!hasSeenOnboarding(found.id)) {
            setShowOnboarding(true);
          }
        }
      }
    } catch (e) {
      console.warn('Could not load accounts from localStorage:', e);
    }
  }, []);

  const applyAccountToState = (acc: UserAccountRecord) => {
    setProfile(acc.profile);
    setPet(acc.pet);
    setStreak(acc.streak);
    setMissions(acc.missions);
    setBadges(acc.badges);
    setHistory(acc.scans || []);
    setActivities(acc.activities || []);
  };

  // Persist changes to active account record
  const syncActiveAccount = (overrides: {
    profile?: UserProfile;
    pet?: PetState;
    streak?: EcoStreak;
    missions?: EcoMission[];
    badges?: Badge[];
    scans?: EcoAnalysisResult[];
    activities?: EcoActivityLog[];
  }) => {
    if (!activeAccountId) return;

    const nextProfile = overrides.profile ?? profile;
    const nextPet = overrides.pet ?? pet;
    const nextStreak = overrides.streak ?? streak;
    const nextMissions = overrides.missions ?? missions;
    const nextBadges = overrides.badges ?? badges;
    const nextScans = overrides.scans ?? history;
    const nextActivities = overrides.activities ?? activities;

    setAccounts((prev) => {
      const updated = prev.map((acc) =>
        acc.id === activeAccountId
          ? {
              ...acc,
              username: nextProfile.username,
              profile: nextProfile,
              pet: nextPet,
              streak: nextStreak,
              missions: nextMissions,
              badges: nextBadges,
              scans: nextScans,
              activities: nextActivities,
            }
          : acc
      );
      try {
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist accounts:', e);
      }
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Auth handlers
  const handleRegister = (
    username: string,
    email: string,
    password: string
  ): { ok: boolean; error?: string } => {
    const emailExists = accounts.some(
      (a) => !a.isGuest && a.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      return { ok: false, error: 'Ya existe una cuenta registrada con ese correo electrónico.' };
    }

    // If converting an active guest session, preserve current progress
    if (authModalMode === 'register' && profile.isGuest && activeAccountId) {
      const upgradedProfile: UserProfile = {
        ...profile,
        username,
        email,
        isGuest: false,
        title: profile.title === 'Explorador Invitado 🌱' ? 'Guardián de Semillas 🌱' : profile.title,
      };
      const newActivity: EcoActivityLog = {
        id: `act-upgrade-${Date.now()}`,
        type: 'account',
        title: '¡Cuenta personal creada!',
        description: `Guardaste todo tu progreso de invitado bajo el usuario ${username}.`,
        timestamp: new Date().toISOString(),
        icon: '🎉',
      };
      const nextActivities = [newActivity, ...activities].slice(0, 40);

      setProfile(upgradedProfile);
      setActivities(nextActivities);

      setAccounts((prev) => {
        const updated = prev.map((acc) =>
          acc.id === activeAccountId
            ? {
                ...acc,
                username,
                email,
                password,
                isGuest: false,
                profile: upgradedProfile,
                activities: nextActivities,
              }
            : acc
        );
        try {
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated));
        } catch (e) {
          // ignore
        }
        return updated;
      });

      setAuthModalMode(null);
      showToast(`🎉 ¡Cuenta creada! Bienvenido/a, ${username}`);
      return { ok: true };
    }

    const newAcc = createAccountState({
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      isGuest: false,
    });

    const nextAccounts = [newAcc, ...accounts];
    setAccounts(nextAccounts);
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(nextAccounts));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, newAcc.id);
    } catch (e) {
      // ignore
    }

    applyAccountToState(newAcc);
    setActiveAccountId(newAcc.id);
    setAuthModalMode(null);
    setCurrentScreen('home');
    setCurrentTab('home');
    setShowOnboarding(!hasSeenOnboarding(newAcc.id));
    showToast(`🌱 ¡Cuenta creada! Bienvenido/a a Che Planeta, ${username}`);
    return { ok: true };
  };

  const handleLogin = (
    identifier: string,
    password: string
  ): { ok: boolean; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const matched = accounts.find(
      (a) =>
        !a.isGuest &&
        (a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId)
    );

    if (!matched) {
      return { ok: false, error: 'No encontramos una cuenta con ese correo o nombre de usuario.' };
    }
    if (matched.password !== password) {
      return { ok: false, error: 'Contraseña incorrecta. Revisala e intentá nuevamente.' };
    }

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, matched.id);
    } catch (e) {
      // ignore
    }

    applyAccountToState(matched);
    setActiveAccountId(matched.id);
    setAuthModalMode(null);
    setCurrentScreen('home');
    setCurrentTab('home');
    setShowOnboarding(!hasSeenOnboarding(matched.id));
    showToast(`🌿 ¡Hola de nuevo, ${matched.username}!`);
    return { ok: true };
  };

  const handleContinueAsGuest = () => {
    const existingGuest = accounts.find((a) => a.isGuest);
    const guestAcc =
      existingGuest ||
      createAccountState({
        id: `guest-${Date.now()}`,
        username: 'Invitado Eco',
        email: 'invitado@cheplaneta.local',
        password: '',
        isGuest: true,
      });

    const nextAccounts = existingGuest ? accounts : [guestAcc, ...accounts];
    setAccounts(nextAccounts);
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(nextAccounts));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, guestAcc.id);
    } catch (e) {
      // ignore
    }

    applyAccountToState(guestAcc);
    setActiveAccountId(guestAcc.id);
    setAuthModalMode(null);
    setCurrentScreen('home');
    setCurrentTab('home');
    setShowOnboarding(!hasSeenOnboarding(guestAcc.id));
    showToast('🌱 Ingresaste como invitado. ¡Escaneá tu primer objeto!');
  };

  const handleCompleteOnboarding = () => {
    if (activeAccountId) {
      markOnboardingSeen(activeAccountId);
    }
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    } catch (e) {
      // ignore
    }
    setActiveAccountId(null);
    setAuthModalMode(null);
    setShowOnboarding(false);
    setCurrentScreen('home');
    setCurrentTab('home');
  };

  // Award XP, EcoPuntos and record activity
  const applyProgressUpdate = (params: {
    xpAmount: number;
    pointsAmount: number;
    activity?: EcoActivityLog;
    extraProfile?: Partial<UserProfile>;
    extraStreak?: EcoStreak;
    extraMissions?: EcoMission[];
    extraScans?: EcoAnalysisResult[];
  }) => {
    let nextXp = pet.xp + params.xpAmount;
    let nextLevel = pet.level;
    let nextXpNeeded = pet.xpToNextLevel;
    let leveledUp = false;

    while (nextXp >= nextXpNeeded) {
      nextXp -= nextXpNeeded;
      nextLevel += 1;
      nextXpNeeded = calculateXpForLevel(nextLevel);
      leveledUp = true;
    }

    const nextStage = getStageForLevel(nextLevel);
    const evolved = nextStage !== pet.stage;

    const updatedPet: PetState = {
      ...pet,
      xp: nextXp,
      level: nextLevel,
      xpToNextLevel: nextXpNeeded,
      stage: nextStage,
      happiness: Math.min(100, pet.happiness + 5),
    };

    const nextScans = params.extraScans ?? history;
    const nextStreak = params.extraStreak ?? streak;
    const nextMissions = params.extraMissions ?? missions;

    const updatedProfile: UserProfile = {
      ...profile,
      ...params.extraProfile,
      ecoPoints: profile.ecoPoints + params.pointsAmount,
    };

    // Unlock badges if conditions met
    const updatedBadges = badges.map((b) => {
      if (b.unlocked) return b;
      if (b.id === 'badge-first-scan' && updatedProfile.totalScans >= 1) {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      if (b.id === 'badge-divert-5' && updatedProfile.totalScans >= 5) {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      if (b.id === 'badge-streak-3' && nextStreak.currentDays >= 3) {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      if (b.id === 'badge-streak-7' && nextStreak.currentDays >= 7) {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      if (nextStage === 'sprout' && b.id === 'badge-pet-evolve') {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      if (nextStage === 'bloom' && b.id === 'badge-pet-bloom') {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      if (nextStage === 'guardian' && b.id === 'badge-pet-guardian') {
        return { ...b, unlocked: true, unlockedAt: 'Hoy' };
      }
      return b;
    });

    const addedLogs: EcoActivityLog[] = [];
    if (params.activity) addedLogs.push(params.activity);
    if (evolved) {
      addedLogs.push({
        id: `act-evo-${Date.now()}`,
        type: 'evolution',
        title: `¡${pet.name} evolucionó a ${getStageName(nextStage)}!`,
        description: `Alcanzaste el Nivel ${nextLevel} cuidando el ambiente.`,
        timestamp: new Date().toISOString(),
        icon: '🌟',
      });
    }

    const nextActivities = [...addedLogs, ...activities].slice(0, 40);

    setPet(updatedPet);
    setProfile(updatedProfile);
    setBadges(updatedBadges);
    setActivities(nextActivities);
    if (params.extraStreak) setStreak(params.extraStreak);
    if (params.extraMissions) setMissions(params.extraMissions);
    if (params.extraScans) setHistory(params.extraScans);

    syncActiveAccount({
      pet: updatedPet,
      profile: updatedProfile,
      badges: updatedBadges,
      activities: nextActivities,
      streak: nextStreak,
      missions: nextMissions,
      scans: nextScans,
    });

    if (evolved) {
      showToast(`✨ ¡Tu planeta evolucionó a ${getStageName(nextStage)}! 🌍🎉`);
    } else if (leveledUp) {
      showToast(`🎉 ¡Subiste a Nivel ${nextLevel}! +${params.pointsAmount} Puntos Verdes 🌱`);
    } else if (params.xpAmount > 0 || params.pointsAmount > 0) {
      showToast(`+${params.xpAmount} XP • +${params.pointsAmount} Puntos Verdes ✨`);
    }
  };

  // Progress missions based on category
  const progressMissions = (
    category: 'scan' | 'diy' | 'disposal' | 'learn' | 'community',
    increment = 1
  ): EcoMission[] => {
    const updated = missions.map((m) => {
      if (m.category === category && !m.completed) {
        const nextCount = m.currentCount + increment;
        const isDone = nextCount >= m.targetCount;
        return {
          ...m,
          currentCount: nextCount,
          completed: isDone,
        };
      }
      return m;
    });
    setMissions(updated);
    syncActiveAccount({ missions: updated });
    return updated;
  };

  // Claim completed mission reward
  const handleClaimMissionReward = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || mission.rewardClaimed) return;

    const updatedMissions = missions.map((m) =>
      m.id === missionId ? { ...m, rewardClaimed: true } : m
    );

    applyProgressUpdate({
      xpAmount: mission.xpReward,
      pointsAmount: mission.pointsReward,
      extraMissions: updatedMissions,
      extraProfile: {
        completedMissionsCount: profile.completedMissionsCount + 1,
      },
      activity: {
        id: `act-mission-${Date.now()}`,
        type: 'mission',
        title: `Misión «${mission.title}» completada`,
        description: mission.description,
        xpDelta: mission.xpReward,
        pointsDelta: mission.pointsReward,
        timestamp: new Date().toISOString(),
        icon: mission.icon,
      },
    });
  };

  // Pet Care
  const handlePetPet = () => {
    const updatedPet: PetState = {
      ...pet,
      happiness: Math.min(100, pet.happiness + 8),
    };
    const updatedMissions = missions.map((m) => {
      if (m.category === 'community' && !m.completed) {
        const nextCount = m.currentCount + 1;
        return { ...m, currentCount: nextCount, completed: nextCount >= m.targetCount };
      }
      return m;
    });
    setPet(updatedPet);
    setMissions(updatedMissions);
    syncActiveAccount({ pet: updatedPet, missions: updatedMissions });
  };

  const handleCleanPet = () => {
    const updatedPet: PetState = {
      ...pet,
      cleanliness: Math.min(100, pet.cleanliness + 10),
      happiness: Math.min(100, pet.happiness + 4),
    };
    const newActivity: EcoActivityLog = {
      id: `act-pet-${Date.now()}`,
      type: 'pet',
      title: `Cuidaste a ${pet.name}`,
      description: 'Regaste y purificaste la atmósfera de tu mascota ecológica.',
      timestamp: new Date().toISOString(),
      icon: '💧',
    };
    const nextActivities = [newActivity, ...activities].slice(0, 40);
    setPet(updatedPet);
    setActivities(nextActivities);
    showToast('💧 ¡Atmósfera regada y purificada con amor!');
    syncActiveAccount({ pet: updatedPet, activities: nextActivities });
  };

  // Customization
  const handleSelectPalette = (paletteId: string) => {
    const updatedPet: PetState = {
      ...pet,
      colorPaletteId: paletteId,
    };
    setPet(updatedPet);
    showToast('🎨 ¡Colores de biosfera actualizados!');
    syncActiveAccount({ pet: updatedPet });
  };

  const handleEquipAccessory = (
    accId: string,
    slot: 'head' | 'face' | 'body' | 'hand' | 'ambient'
  ) => {
    const updatedPet: PetState = {
      ...pet,
      equippedAccessories: {
        ...pet.equippedAccessories,
        [slot]: accId,
      },
    };
    setPet(updatedPet);
    showToast('✨ ¡Accesorio equipado!');
    syncActiveAccount({ pet: updatedPet });
  };

  const handleUnequipAccessory = (slot: 'head' | 'face' | 'body' | 'hand' | 'ambient') => {
    const updatedPet: PetState = {
      ...pet,
      equippedAccessories: {
        ...pet.equippedAccessories,
        [slot]: undefined,
      },
    };
    setPet(updatedPet);
    syncActiveAccount({ pet: updatedPet });
  };

  const handleToggleBiomeItem = (biomeId: string) => {
    let updatedItems = [...pet.placedBiomeItems];
    if (updatedItems.includes(biomeId)) {
      updatedItems = updatedItems.filter((id) => id !== biomeId);
      showToast('Elemento guardado en el inventario');
    } else {
      updatedItems.push(biomeId);
      showToast('🌿 ¡Elemento colocado en tu biosfera!');
    }
    const updatedPet: PetState = { ...pet, placedBiomeItems: updatedItems };
    setPet(updatedPet);
    syncActiveAccount({ pet: updatedPet });
  };

  const handleUpdatePetName = (newName: string) => {
    const updatedPet: PetState = { ...pet, name: newName };
    setPet(updatedPet);
    showToast(`Tu mascota ahora se llama ${newName} 🌍`);
    syncActiveAccount({ pet: updatedPet });
  };

  // Streak pause / shields
  const handleTogglePauseStreak = () => {
    const updatedStreak: EcoStreak = {
      ...streak,
      isPaused: !streak.isPaused,
    };
    setStreak(updatedStreak);
    showToast(
      updatedStreak.isPaused
        ? '⏸️ Racha pausada. No perderás tu progreso.'
        : '▶️ ¡Racha reanudada con éxito!'
    );
    syncActiveAccount({ streak: updatedStreak });
  };

  // Save history scan & award progress
  const saveToHistory = (result: EcoAnalysisResult) => {
    const exists = history.some(
      (item) => item.objectName === result.objectName && item.timestamp === result.timestamp
    );
    if (exists) {
      showToast('¡Este objeto ya está en tu historial!');
      return;
    }

    const updatedScans = [result, ...history].slice(0, 30);

    // Update daily streak
    const todayStr = new Date().toISOString().split('T')[0];
    let updatedStreak = streak;
    if (streak.lastActiveDate !== todayStr && !streak.isPaused) {
      const nextDays = streak.currentDays + 1;
      updatedStreak = {
        ...streak,
        currentDays: nextDays,
        longestDays: Math.max(streak.longestDays, nextDays),
        lastActiveDate: todayStr,
        historyDates: [...streak.historyDates, todayStr],
      };
    }

    const updatedMissions = missions.map((m) => {
      if (m.category === 'scan' && !m.completed) {
        const nextCount = m.currentCount + 1;
        return { ...m, currentCount: nextCount, completed: nextCount >= m.targetCount };
      }
      return m;
    });

    applyProgressUpdate({
      xpAmount: 60,
      pointsAmount: 35,
      extraScans: updatedScans,
      extraStreak: updatedStreak,
      extraMissions: updatedMissions,
      extraProfile: {
        totalScans: profile.totalScans + 1,
        co2SavedKg: Number((profile.co2SavedKg + 0.45).toFixed(2)),
        plasticDivertedItems: profile.plasticDivertedItems + 1,
      },
      activity: {
        id: `act-scan-${Date.now()}`,
        type: 'scan',
        title: `Escaneaste ${result.objectName}`,
        description: `${result.probableMaterial} • ${result.recyclabilityBadge}`,
        xpDelta: 60,
        pointsDelta: 35,
        timestamp: new Date().toISOString(),
        icon: '🔍',
      },
    });
  };

  const clearHistory = () => {
    setHistory([]);
    syncActiveAccount({ scans: [] });
    showToast('Historial vaciado correctamente');
  };

  // Perform AI analysis via server
  const analyzeImage = async (imageDataUrl: string, userHint?: string) => {
    setAnalysisError(null);
    setCapturedImage(imageDataUrl);
    setCurrentScreen('analyzing');

    try {
      const { uploadDataUrl, previewDataUrl } = await prepareImageForAnalysis(imageDataUrl);
      setCapturedImage(previewDataUrl);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: uploadDataUrl,
          userHint: userHint || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'No pudimos completar el análisis de la imagen con la IA.'
        );
      }

      const resultData: EcoAnalysisResult = await response.json();
      const hydratedResult: EcoAnalysisResult = {
        ...resultData,
        imageUrl: previewDataUrl,
        timestamp: resultData.timestamp || new Date().toISOString(),
      };

      setCurrentResult(hydratedResult);

      if (hydratedResult.recognized !== false) {
        saveToHistory(hydratedResult);
      }
      setCurrentScreen('results');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setCurrentResult(null);
      setAnalysisError({
        message:
          err?.message ||
          'Hubo un problema al analizar la fotografía. Verificá tu conexión e intentá nuevamente.',
        lastImage: imageDataUrl,
        lastHint: userHint,
      });
      setCurrentScreen('results');
    }
  };

  const handleSelectSample = (sample: SampleObject) => {
    analyzeImage(sample.dataUrl, sample.userHint || sample.name);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        analyzeImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Bottom Navigation tab changer
  const handleNavTab = (tab: MainNavTab) => {
    if (tab === 'scan') {
      setCurrentScreen('camera');
      return;
    }
    setCurrentTab(tab);
    if (currentScreen !== 'home') {
      setCurrentScreen('home');
    }
  };

  const unclaimedMissionsCount = missions.filter((m) => m.completed && !m.rewardClaimed).length;

  // Show Welcome / Auth Screen if no active session OR guest upgrading
  if (!activeAccountId || authModalMode !== null) {
    return (
      <AuthScreen
        initialMode={authModalMode || 'welcome'}
        savedAccounts={accounts}
        onRegister={handleRegister}
        onLogin={handleLogin}
        onContinueAsGuest={handleContinueAsGuest}
        onCancel={activeAccountId ? () => setAuthModalMode(null) : undefined}
        isConvertingGuest={Boolean(activeAccountId && profile.isGuest && authModalMode === 'register')}
      />
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingSlider
        username={profile.username}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F3] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Persistent Header */}
      {currentScreen !== 'camera' && (
        <>
          <Header
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
            onNavigateHome={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
          />
          <TopGamificationBar
            streak={streak}
            profile={profile}
            pet={pet}
            onOpenStreakModal={() => setIsStreakModalOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
          />
        </>
      )}

      {/* Main Screen Switcher */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onStartScan={() => setCurrentScreen('camera')}
                onSelectSample={handleSelectSample}
                onUploadFile={handleFileUpload}
                recentScans={history}
                onSelectRecent={(item) => {
                  setCurrentResult(item);
                  setCurrentScreen('results');
                }}
                pet={pet}
                streak={streak}
                profile={profile}
                onNavigateMyPlanet={() => setCurrentTab('my-planet')}
                onNavigateMissions={() => setCurrentTab('missions')}
                onPetPet={handlePetPet}
              />
            )}

            {currentTab === 'my-planet' && (
              <MyPlanetScreen
                pet={pet}
                profile={profile}
                onUpdatePetName={handleUpdatePetName}
                onSelectPalette={handleSelectPalette}
                onEquipAccessory={handleEquipAccessory}
                onUnequipAccessory={handleUnequipAccessory}
                onToggleBiomeItem={handleToggleBiomeItem}
                onPetPet={handlePetPet}
                onCleanPet={handleCleanPet}
                onNavigateScan={() => setCurrentScreen('camera')}
              />
            )}

            {currentTab === 'missions' && (
              <MissionsScreen
                missions={missions}
                streak={streak}
                onClaimMissionReward={handleClaimMissionReward}
                onTogglePauseStreak={handleTogglePauseStreak}
                onUseShield={() => {}}
                onNavigateScan={() => setCurrentScreen('camera')}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                profile={profile}
                pet={pet}
                streak={streak}
                history={history}
                activities={activities}
                badges={badges}
                onUpdateProfile={(updated) => {
                  const newProf = { ...profile, ...updated };
                  setProfile(newProf);
                  syncActiveAccount({ profile: newProf });
                  showToast('✨ ¡Perfil actualizado!');
                }}
                onSelectHistoryItem={(item) => {
                  setCurrentResult(item);
                  setCurrentScreen('results');
                }}
                onOpenHistoryModal={() => setIsHistoryOpen(true)}
                onNavigateHome={() => {
                  setCurrentTab('home');
                  setCurrentScreen('home');
                }}
                onNavigateMyPlanet={() => setCurrentTab('my-planet')}
                onEquipAccessory={handleEquipAccessory}
                onPetPet={handlePetPet}
                onLogout={handleLogout}
                onOpenUpgradeGuest={() => setAuthModalMode('register')}
              />
            )}
          </>
        )}

        {currentScreen === 'camera' && (
          <CameraScreen
            onCapture={(img) => analyzeImage(img)}
            onCancel={() => setCurrentScreen('home')}
            onSelectSample={handleSelectSample}
          />
        )}

        {currentScreen === 'analyzing' && (
          <AnalyzingScreen capturedImage={capturedImage} />
        )}

        {currentScreen === 'results' && (currentResult || analysisError) && (
          <ResultsScreen
            result={currentResult}
            analysisError={analysisError?.message}
            capturedImage={capturedImage}
            onRetry={
              analysisError
                ? () => analyzeImage(analysisError.lastImage, analysisError.lastHint)
                : undefined
            }
            onScanAnother={() => {
              setAnalysisError(null);
              setCurrentScreen('camera');
            }}
            onSaveToHistory={saveToHistory}
            isSaved={
              Boolean(currentResult) &&
              history.some(
                (h) =>
                  h.objectName === currentResult?.objectName &&
                  h.timestamp === currentResult?.timestamp
              )
            }
          />
        )}
      </main>

      {/* Persistent Bottom Navigation on all primary screens */}
      {currentScreen !== 'camera' && currentScreen !== 'analyzing' && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={handleNavTab}
          unclaimedMissionsCount={unclaimedMissionsCount}
        />
      )}

      {/* History Slide Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setCurrentResult(item);
          setCurrentScreen('results');
        }}
        onClearHistory={clearHistory}
      />

      {/* Streak Details Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streak={streak}
        onTogglePause={handleTogglePauseStreak}
        onUseShield={() => {}}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in flex items-center gap-2 max-w-[90vw] text-center">
          <span>🌿</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
