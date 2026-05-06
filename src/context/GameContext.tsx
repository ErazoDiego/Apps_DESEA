import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameMode, Level, UserProgress } from '../types';
import { cards } from '../data/cards';
import { getSessionCards, SESSION_PHASE_COLORS } from '../engine/sessionUtils';

interface GameContextType {
  mode: GameMode;
  level: Level;
  isPro: boolean;
  isOnboardingComplete: boolean;
  dailyCardsUsed: number;
  savedCards: string[];
  trialEndsAt: string | null;
  // Modo Sesión
  isSessionMode: boolean;
  sessionCardIndex: number; //0-19
  sessionCards: typeof cards;
  // Funciones
  setMode: (mode: GameMode) => void;
  setLevel: (level: Level) => void;
  setOnboardingComplete: (complete: boolean) => void;
  useCard: () => void;
  saveCard: (cardId: string) => void;
  removeSavedCard: (cardId: string) => void;
  isCardSaved: (cardId: string) => boolean;
  startSession: () => void;
  nextSessionCard: () => void;
  getCurrentPhase: () => number;
  getPhaseColor: (phase: number) => string;
  startTrial: () => void;
  isTrialActive: () => boolean;
  isProOrTrial: () => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const STORAGE_KEY = '@desea_user_progress';
const MAX_FREE_CARDS = 10;

export function GameProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<GameMode>('mixto');
  const [level, setLevelState] = useState<Level>('suave');
  const [isPro, setIsPro] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isOnboardingComplete, setIsOnboardingCompleteState] = useState(false);
  const [dailyCardsUsed, setDailyCardsUsed] = useState(0);
  const [savedCards, setSavedCards] = useState<string[]>([]);
  const [lastPlayedDate, setLastPlayedDate] = useState<string>('');

  // Modo Sesión
  const [isSessionMode, setIsSessionMode] = useState(false);
  const [sessionCardIndex, setSessionCardIndex] = useState(0); //0-19
  const [sessionCards, setSessionCards] = useState<typeof cards>(() => getSessionCards(cards));

  useEffect(() => { loadProgress(); }, []);

  // Iniciar Modo Sesión
  const startSession = () => {
    setSessionCards(getSessionCards(cards));
    setSessionCardIndex(0);
    setIsSessionMode(true);
  };

  // Siguiente carta de la sesión
  const nextSessionCard = () => {
    const nextIndex = sessionCardIndex + 1;
    if (nextIndex >= sessionCards.length) {
      // Sesión completa
      setIsSessionMode(false);
      return;
    }
    setSessionCardIndex(nextIndex);
  };

  // Obtener fase actual basado en el índice
  const getCurrentPhase = () => {
    if (!isSessionMode) return 1;
    return Math.floor(sessionCardIndex / (sessionCards.length / 4)) + 1;
  };

  // Color de la fase (delegado al engine)
  const getPhaseColor = (phase: number) => {
    // Simple mapping: 1: verde, 2: naranja, 3: fucsia, 4: violeta
    const colors = ['#1D9E75', '#B45A00', '#A21CAF', '#6A0DAD'];
    return colors[phase - 1] || colors[0];
  };
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastPlayedDate !== today) {
      setDailyCardsUsed(0);
      setLastPlayedDate(today);
    }
  }, [lastPlayedDate]);

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const progress: UserProgress = JSON.parse(data);
        setModeState(progress.currentMode);
        setLevelState(progress.currentLevel);
        setIsPro(progress.isPro);
        setSavedCards(progress.savedCards || []);
        setTrialEndsAt(progress.trialEndsAt || null);
        const today = new Date().toDateString();
        if (progress.lastPlayedDate === today) {
          setDailyCardsUsed(progress.cardsViewedToday?.length || 0);
          setLastPlayedDate(today);
        }
        if (progress.lastPlayedDate) setIsOnboardingCompleteState(true);
      }
    } catch (error) { console.error('Error loading:', error); }
  };

  const saveProgress = async () => {
    try {
      const progress: UserProgress = {
        currentMode: mode, currentLevel: level, isPro,
        cardsViewedToday: [], lastPlayedDate: new Date().toDateString(), savedCards,
        trialEndsAt: trialEndsAt,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) { console.error('Error saving:', error); }
  };

  // Iniciar prueba de 24 horas
  const startTrial = () => {
    const endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas desde ahora
    setTrialEndsAt(endsAt);
    saveProgress();
  };

  // Verificar si la prueba sigue activa
  const isTrialActive = () => {
    if (!trialEndsAt) return false;
    return new Date(trialEndsAt) > new Date();
  };

  // ¿Es Pro o está en período de prueba?
  const isProOrTrial = () => {
    return isPro || isTrialActive();
  };

  const setMode = (m: GameMode) => { setModeState(m); saveProgress(); };
  const setLevel = (l: Level) => { setLevelState(l); saveProgress(); };
  const setOnboardingComplete = (c: boolean) => { setIsOnboardingCompleteState(c); saveProgress(); };
  const useCard = () => { if (!isProOrTrial() && dailyCardsUsed >= MAX_FREE_CARDS) return; setDailyCardsUsed(p => p + 1); };
  const saveCard = (id: string) => { if (!savedCards.includes(id)) { setSavedCards(p => [...p, id]); saveProgress(); }};
  const removeSavedCard = (id: string) => { setSavedCards(p => p.filter(x => x !== id)); saveProgress(); };
  const isCardSaved = (id: string) => savedCards.includes(id);

  return (
    <GameContext.Provider value={{
      mode, level, isPro, isOnboardingComplete, dailyCardsUsed, savedCards, trialEndsAt,
      isSessionMode, sessionCardIndex, sessionCards,
      setMode, setLevel, setOnboardingComplete,
      useCard, saveCard, removeSavedCard, isCardSaved,
      startSession, nextSessionCard, getCurrentPhase, getPhaseColor,
      startTrial, isTrialActive, isProOrTrial,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}