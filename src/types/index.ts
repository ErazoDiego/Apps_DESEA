export type Category = 'verdad' | 'reto' | 'deseo' | 'sin_limites';
export type Level = 'suave' | 'picante' | 'fuego';
export type GameMode = 'mixto' | 'el' | 'ella' | 'alternado';
export type DirectedTo = 'mixta' | 'el' | 'ella';

export interface Card {
  id: string;
  category: Category;
  nivel: Level;
  dirigida_a: DirectedTo;
  texto: string;
  tiene_tiempo: boolean;
  tiempo_segundos?: number;
  version_app: string;
}

export interface UserProgress {
  cardsViewedToday: string[];
  lastPlayedDate: string;
  savedCards: string[];
  currentMode: GameMode;
  currentLevel: Level;
  isPro: boolean;
  trialEndsAt?: string;
}