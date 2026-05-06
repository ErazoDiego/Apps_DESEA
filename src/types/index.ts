export type Category = 'verdad' | 'reto' | 'deseo' | 'sin_limites' | 'reto_con_frase' | 'cierre';
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
  // Campos del JSON
  acceso?: string;
  cronometro_segundos?: number;
  frase_instruccion?: string | null;
  ilustracion?: string | null;
}

export interface UserProgress {
  cardsViewedToday: string[];
  lastPlayedDate: string;
  savedCards: string[];
  currentMode: GameMode;
  currentLevel: Level;
  isPro: boolean;
  trialEndsAt?: string | null;
}