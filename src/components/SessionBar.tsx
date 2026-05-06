import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPhaseColor, SESSION_PHASE_COLORS } from '../engine/sessionUtils';

interface SessionBarProps {
  currentIndex: number;
  total?: number;
}

export default function SessionBar({ currentIndex, total = 20 }: SessionBarProps) {
  const phase = Math.floor(currentIndex / (total / 4)) + 1;
  const color = getPhaseColor(phase);

  return (
    <View style={styles.container}>
      <Text style={[styles.phaseText, { color }]}>Fase {phase}</Text>
      <View style={styles.bar}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              i < currentIndex && { backgroundColor: color },
              i === currentIndex && { borderColor: color, borderWidth: 1 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  phaseText: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  bar: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  segment: { width: 12, height: 12, borderRadius: 2, backgroundColor: '#0E0018', borderWidth: 1, borderColor: 'transparent' },
});
