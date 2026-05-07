import { CustomDeck, CustomCard, Level, CustomCardCategory } from '../types';

// Generar ID único
export function generateId(): string {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Crear un nuevo mazo
export function createDeck(name: string): CustomDeck {
  return {
    id: generateId(),
    name,
    cards: [],
    createdAt: new Date().toISOString(),
  };
}

// Crear una nueva carta personalizada
export function createCustomCard(text: string, level: Level, category: CustomCardCategory): CustomCard {
  return {
    id: generateId(),
    text,
    level,
    category,
    createdAt: new Date().toISOString(),
  };
}

// Agregar carta a un mazo
export function addCardToDeck(deck: CustomDeck, cardId: string): CustomDeck {
  return {
    ...deck,
    cards: [...deck.cards, cardId],
  };
}

// Eliminar carta de un mazo
export function removeCardFromDeck(deck: CustomDeck, cardId: string): CustomDeck {
  return {
    ...deck,
    cards: deck.cards.filter(id => id !== cardId),
  };
}