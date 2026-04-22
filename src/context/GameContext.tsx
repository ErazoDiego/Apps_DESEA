import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameMode, Level, UserProgress } from '../types';

interface GameContextType {
  mode: GameMode;
  level: Level;
  isPro: boolean;
  isOnboardingComplete: boolean;
  dailyCardsUsed: number;
  savedCards: string[];
  setMode: (mode: GameMode) => void;
  setLevel: (level: Level) => void;
  setOnboardingComplete: (complete: boolean) => void;
  useCard: () => void;
  saveCard: (cardId: string) => void;
  removeSavedCard: (cardId: string) => void;
  isCardSaved: (cardId: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const STORAGE_KEY = '@desea_user_progress';
const MAX_FREE_CARDS = 10;

export function GameProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<GameMode>('mixto');
  const [level, setLevelState] = useState<Level>('suave');
  const [isPro, setIsPro] = useState(false);
  const [isOnboardingComplete, setIsOnboardingCompleteState] = useState(false);
  const [dailyCardsUsed, setDailyCardsUsed] = useState(0);
  const [savedCards, setSavedCards] = useState<string[]>([]);
  const [lastPlayedDate, setLastPlayedDate] = useState<string>('');

  useEffect(() => { loadProgress(); }, []);
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
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) { console.error('Error saving:', error); }
  };

  const setMode = (m: GameMode) => { setModeState(m); saveProgress(); };
  const setLevel = (l: Level) => { setLevelState(l); saveProgress(); };
  const setOnboardingComplete = (c: boolean) => { setIsOnboardingCompleteState(c); saveProgress(); };
  const useCard = () => { if (!isPro && dailyCardsUsed >= MAX_FREE_CARDS) return; setDailyCardsUsed(p => p + 1); };
  const saveCard = (id: string) => { if (!savedCards.includes(id)) { setSavedCards(p => [...p, id]); saveProgress(); }};
  const removeSavedCard = (id: string) => { setSavedCards(p => p.filter(x => x !== id)); saveProgress(); };
  const isCardSaved = (id: string) => savedCards.includes(id);

  return (
    <GameContext.Provider value={{ mode, level, isPro, isOnboardingComplete, dailyCardsUsed, savedCards, setMode, setLevel, setOnboardingComplete, useCard, saveCard, removeSavedCard, isCardSaved }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}