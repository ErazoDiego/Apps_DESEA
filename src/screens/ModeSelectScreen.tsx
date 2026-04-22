import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { GameMode, Level } from '../types';

export default function ModeSelectScreen({ navigation }: any) {
  const { mode, level, setMode, setLevel, dailyCardsUsed, isPro } = useGame();

  const modes: { value: GameMode; label: string; desc: string }[] = [
    { value: 'mixto', label: 'Mixto', desc: 'Cartas para los dos' },
    { value: 'el', label: 'Para él', desc: 'Solo cartas para él' },
    { value: 'ella', label: 'Para ella', desc: 'Solo cartas para ella' },
    { value: 'alternado', label: 'Alternado', desc: 'Uno para cada uno' },
  ];

  const levels: { value: Level; label: string; desc: string; pro?: boolean }[] = [
    { value: 'suave', label: 'Suave', desc: 'Iniciación' },
    { value: 'picante', label: 'Picante', desc: 'Más osado' },
    { value: 'fuego', label: 'Fuego 🔥', desc: 'Contenido adulto', pro: true },
  ];

  const handleStart = () => {
    if (dailyCardsUsed >= 10 && !isPro) {
      navigation.navigate('DailyLimit');
    } else {
      navigation.navigate('Game');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elegí tu juego</Text>
      
      <Text style={styles.sectionTitle}>Modo</Text>
      <View style={styles.optionsGrid}>
        {modes.map((m) => (
          <TouchableOpacity
            key={m.value}
            style={[styles.option, mode === m.value && styles.optionSelected]}
            onPress={() => setMode(m.value)}
          >
            <Text style={[styles.optionLabel, mode === m.value && styles.optionLabelSelected]}>
              {m.label}
            </Text>
            <Text style={styles.optionDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Intensidad</Text>
      <View style={styles.optionsGrid}>
        {levels.map((l) => (
          <TouchableOpacity
            key={l.value}
            style={[
              styles.option,
              level === l.value && styles.optionSelected,
              l.pro && !isPro && styles.optionProLocked,
            ]}
            onPress={() => l.pro && !isPro ? navigation.navigate('Paywall') : setLevel(l.value)}
          >
            <Text style={[styles.optionLabel, level === l.value && styles.optionLabelSelected]}>
              {l.label}
            </Text>
            <Text style={styles.optionDesc}>{l.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.remaining}>
        <Text style={styles.remainingText}>
          {isPro ? 'Ilimitadas' : `${10 - dailyCardsUsed} cartas`} disponibles hoy
        </Text>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
        <Text style={styles.startBtnText}>Empezar noche</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, marginTop: 16, textAlign: 'center' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  optionsRow: { flexGrow: 0, marginBottom: 8, paddingVertical: 8 },
  option: { backgroundColor: colors.cardSurface, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, minWidth: '45%', flexGrow: 1, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  optionSelected: { borderColor: colors.primary },
  optionProLocked: { opacity: 0.5 },
  optionLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4, textAlign: 'center' },
  optionLabelSelected: { color: colors.primary },
  optionDesc: { fontSize: 10, color: colors.text, opacity: 0.6, textAlign: 'center' },
  remaining: { alignItems: 'center', marginTop: 32, marginBottom: 16 },
  remainingText: { fontSize: 14, color: colors.text, opacity: 0.6 },
  startBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 16 },
  startBtnText: { fontSize: 18, fontWeight: '600', color: colors.white },
  backBtn: { paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  backBtnText: { fontSize: 14, color: colors.text, opacity: 0.6 },
});