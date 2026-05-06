import { Card, Level, GameMode } from '../types';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function filterCards(
  cards: Card[],
  mode: GameMode,
  level: Level,
  isProOrTrial: boolean
): Card[] {
  return cards.filter(c => {
    if (mode === 'el' && c.dirigida_a !== 'mixta' && c.dirigida_a !== 'el') return false;
    if (mode === 'ella' && c.dirigida_a !== 'mixta' && c.dirigida_a !== 'ella') return false;
    if (level === 'suave' && c.nivel !== 'suave') return false;
    if (level === 'picante' && c.nivel !== 'suave' && c.nivel !== 'picante') return false;
    if (c.nivel === 'fuego' && !isProOrTrial) return false;
    return true;
  });
}

export function getCategoryLabel(category: string): string {
  if (category === 'verdad') return 'VERDAD';
  if (category === 'reto') return 'RETO';
  return category.toUpperCase();
}

export function getLevelColor(nivel: string): string {
  if (nivel === 'suave') return '#10B981';
  if (nivel === 'picante') return '#F59E0B';
  return '#EF4444';
}
