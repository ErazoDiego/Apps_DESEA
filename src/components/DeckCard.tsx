import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { CustomCard } from '../types';

interface DeckCardProps {
  card: CustomCard;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function DeckCard({ card, onPress, onDelete }: DeckCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: getLevelColor(card.level) }]}>
          <Text style={styles.badgeText}>{card.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.text}>{card.text}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  text: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    color: colors.status.error,
    fontSize: 18,
  },
});

function getLevelColor(level: string): string {
  if (level === 'suave') return '#10B981';
  if (level === 'picante') return '#F59E0B';
  return '#EF4444';
}
