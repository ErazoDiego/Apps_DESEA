import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface TimerDisplayProps {
  timeLeft: number;
  maxTime: number;
  isRunning: boolean;
  isDone: boolean;
  onStart: () => void;
  pulseAnim?: Animated.Value;
}

export default function TimerDisplay({ timeLeft, maxTime, isRunning, isDone, onStart, pulseAnim }: TimerDisplayProps) {
  const progress = maxTime > 0 ? timeLeft / maxTime : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.progress, { width: `${progress * 100}%`, backgroundColor: isDone ? '#EF4444' : colors.accent }]} />
      </View>

      {isDone ? (
        <Animated.View style={[styles.display, pulseAnim ? { transform: [{ scale: pulseAnim }] } : {}]}>
          <Text style={styles.doneText}>¡TIEMPO!</Text>
        </Animated.View>
      ) : (
        <View style={styles.display}>
          <Text style={styles.icon}>⏱</Text>
          <Text style={styles.text}>{formatTime(timeLeft)}</Text>
        </View>
      )}

      {!isRunning && !isDone && (
        <TouchableOpacity style={styles.startBtn} onPress={onStart}>
          <Text style={styles.startText}>INICIAR</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, alignItems: 'center' },
  bar: { width: '100%', height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progress: { height: '100%', borderRadius: 4 },
  display: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 20 },
  text: { fontSize: 32, fontWeight: '700', color: colors.text },
  doneText: { fontSize: 32, fontWeight: '700', color: '#EF4444' },
  startBtn: { marginTop: 12, backgroundColor: colors.accent, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20 },
  startText: { fontSize: 14, fontWeight: '600', color: colors.background },
});
