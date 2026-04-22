import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { GameMode, Level } from '../types';

type Step = 'welcome' | 'age' | 'mode' | 'intensity' | 'ready';

export default function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('welcome');
  const { setMode, setLevel, setOnboardingComplete } = useGame();

  const next = () => {
    const order: Step[] = ['welcome', 'age', 'mode', 'intensity', 'ready'];
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };
  const selectMode = (m: GameMode) => { setMode(m); next(); };
  const selectLevel = (l: Level) => { setLevel(l); next(); };
  const finish = () => { setOnboardingComplete(true); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); };

  const render = () => {
    switch (step) {
      case 'welcome':
        return (
          <View style={styles.step}>
            <Text style={styles.logo}>D</Text>
            <Text style={styles.title}>DESEA</Text>
            <Text style={styles.subtitle}>La noche empieza acá.</Text>
            <View style={styles.stats}><Text style={styles.stat}>+150 Cartas</Text><Text style={styles.stat}>•</Text><Text style={styles.stat}>3 Niveles</Text></View>
            <TouchableOpacity style={styles.startBtn} onPress={next}><Text style={styles.startBtnText}>Continuar</Text></TouchableOpacity>
          </View>
        );
      case 'age':
        return (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>¿Tenés más de 18?</Text>
            <Text style={styles.stepDesc}>Esta app contiene contenido para adultos.</Text>
            <TouchableOpacity style={styles.confirmBtn} onPress={next}><Text style={styles.confirmBtnText}>Confirmar</Text></TouchableOpacity>
          </View>
        );
      case 'mode':
        return (
          <ScrollView style={styles.optionsList}>
            <Text style={[styles.stepTitle, {marginBottom: 20}]}>¿Cómo van a jugar?</Text>
            {(['mixto', 'el', 'ella', 'alternado'] as GameMode[]).map(m => (
              <TouchableOpacity key={m} style={styles.option} onPress={() => selectMode(m)}>
                <Text style={styles.optionTitle}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
                <Text style={styles.optionDesc}>{m === 'mixto' ? 'Cartas para los dos' : m === 'el' ? 'Para él' : m === 'ella' ? 'Para ella' : 'Uno para cada uno'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 'intensity':
        return (
          <ScrollView style={styles.optionsList}>
            <Text style={[styles.stepTitle, {marginBottom: 20}]}>¿Qué intensidad?</Text>
            {(['suave', 'picante', 'fuego'] as Level[]).map(l => (
              <TouchableOpacity key={l} style={styles.option} onPress={() => selectLevel(l)}>
                <Text style={styles.optionTitle}>{l.charAt(0).toUpperCase() + l.slice(1)} {l === 'fuego' ? '🔥' : ''}</Text>
                <Text style={styles.optionDesc}>{l === 'suave' ? 'Iniciación' : l === 'picante' ? 'Más osado' : 'Contenido adulto'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 'ready':
        return (
          <View style={styles.step}>
            <Text style={styles.logo}>D</Text>
            <Text style={styles.stepTitle}>¡Listo!</Text>
            <Text style={styles.stepDesc}>La noche los espera.</Text>
            <TouchableOpacity style={styles.startBtn} onPress={finish}><Text style={styles.startBtnText}>Empezar noche</Text></TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>{render()}</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
  step: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: 28, fontWeight: '600', color: colors.text, marginBottom: 8, textAlign: 'center' },
  stepDesc: { fontSize: 16, color: colors.text, opacity: 0.7, textAlign: 'center', marginBottom: 32 },
  logo: { fontSize: 80, fontWeight: 'bold', color: colors.accent, marginBottom: 8 },
  title: { fontSize: 40, fontWeight: '600', color: colors.text, letterSpacing: 8, marginBottom: 8 },
  subtitle: { fontSize: 18, color: colors.text, opacity: 0.7, fontStyle: 'italic' },
  stats: { flexDirection: 'row', marginTop: 24, gap: 8 },
  stat: { fontSize: 14, color: colors.text, opacity: 0.6 },
  optionsList: { flex: 1, paddingTop: 60 },
  option: { backgroundColor: colors.cardSurface, padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.primary },
  optionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
  optionDesc: { fontSize: 14, color: colors.text, opacity: 0.6 },
  confirmBtn: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30 },
  confirmBtnText: { fontSize: 16, fontWeight: '600', color: colors.white },
  startBtn: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30, marginBottom: 16 },
  startBtnText: { fontSize: 18, fontWeight: '600', color: colors.white },
});