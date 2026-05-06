import { Card } from '../types';
import { shuffle } from './cardUtils';

export const SESSION_PHASE_COLORS = ['#1D9E75', '#B45A00', '#A21CAF', '#6A0DAD']; // Verde, Naranja, Fucsia, Violeta

export const SESSION_PHASE_RANGES = [
  { start: 0, end: 4, phase: 1 },   // 5 suaves
  { start: 5, end: 11, phase: 2 },  // 7 picantes
  { start: 12, end: 17, phase: 3 }, // 6 intensas (ajustado de 8 a 6 para total 18+2)
  { start: 18, end: 19, phase: 4 }, // 2 finales (ajustado para total 20)
];

export function getSessionCards(cards: Card[]): Card[] {
  const suaves = shuffle(cards.filter(c => c.nivel === 'suave')).slice(0, 5);
  const picantes = shuffle(cards.filter(c => c.nivel === 'picante')).slice(0, 7);
  const intensas = shuffle(cards.filter(c => c.nivel === 'fuego')).slice(0, 8);
  return [...suaves, ...picantes, ...intensas];
}

export function getPhaseForIndex(index: number): number {
  const range = SESSION_PHASE_RANGES.find(r => index >= r.start && index <= r.end);
  return range ? range.phase : 1;
}

export function getPhaseColor(phase: number): string {
  return SESSION_PHASE_COLORS[phase - 1] || SESSION_PHASE_COLORS[0];
}
