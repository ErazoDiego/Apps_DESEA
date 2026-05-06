import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../types';
import { getCategoryLabel, getLevelColor } from '../engine/cardUtils';
import Badge from './Badge';

interface CardDisplayProps {
  card: Card;
  isSessionMode?: boolean;
  sessionColor?: string;
}

export default function CardDisplay({ card, isSessionMode, sessionColor }: CardDisplayProps) {
  const cardStyle = isSessionMode && sessionColor
    ? [styles.card, { borderColor: sessionColor, borderWidth: 2 }]
    : styles.card;

  return (
    <View style={cardStyle}>
      <View style={styles.header}>
        <Badge label={getCategoryLabel(card.category)} color={getLevelColor(card.nivel)} />
        <Badge label={card.nivel.toUpperCase()} color={getLevelColor(card.nivel)} outlined />
      </View>
      <Text style={styles.text}>{card.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0E0018',
    borderRadius: 24,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  text: {
    fontSize: 22,
    color: '#F3E8FF',
    textAlign: 'center',
    lineHeight: 32,
  },
});
