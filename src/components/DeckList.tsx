import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { CustomDeck } from '../types';

interface DeckListProps {
  decks: CustomDeck[];
  onSelect: (deck: CustomDeck) => void;
  onDelete: (deckId: string) => void;
}

export default function DeckList({ decks, onSelect, onDelete }: DeckListProps) {
  if (decks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No tenés mazos personalizados</Text>
        <Text style={styles.emptySubtext}>Cread uno para empezar</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={decks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
          <View style={styles.itemContent}>
            <Text style={styles.deckName}>{item.name}</Text>
            <Text style={styles.deckCount}>{item.cards.length} cartas</Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={(e) => { e.stopPropagation(); onDelete(item.id); }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  deckName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deckCount: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    color: colors.status.error,
    fontSize: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 12,
  },
});
