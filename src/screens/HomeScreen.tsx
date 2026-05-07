import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';

export default function HomeScreen({ navigation }: any) {
  const { isOnboardingComplete, dailyCardsUsed, isPro } = useGame();
  console.log('HOME:', { isOnboardingComplete, dailyCardsUsed, isPro });

  const handleStart = () => {
    const dest = isOnboardingComplete ? 'ModeSelect' : 'Onboarding';
    console.log('NAVIGATE:', dest);
    navigation.navigate(dest);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>D</Text>
        <Text style={styles.title}>DESEA</Text>
      </View>
      <Text style={styles.tagline}>La noche empieza acá.</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}><Text style={styles.statNumber}>+150</Text><Text style={styles.statLabel}>Cartas</Text></View>
        <View style={styles.statItem}><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>Niveles</Text></View>
        <View style={styles.statItem}><Text style={styles.statNumber}>4</Text><Text style={styles.statLabel}>Modos</Text></View>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Empezar noche</Text>
      </TouchableOpacity>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('SavedCards')}>
          <Text style={styles.secondaryButtonText}>Guardadas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('CustomDeck')}>
          <Text style={styles.secondaryButtonText}>Mazos</Text>
        </TouchableOpacity>
        {!isPro && <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Paywall')}>
          <Text style={styles.secondaryButtonText}>Upgrade Pro</Text>
        </TouchableOpacity>}
      </View>
      {!isPro && <Text style={styles.dailyLimit}>{10 - dailyCardsUsed} cartas libres hoy</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logo: { fontSize: 80, fontWeight: 'bold', color: colors.accent },
  title: { fontSize: 40, fontWeight: '600', color: colors.text, letterSpacing: 8 },
  tagline: { fontSize: 18, color: colors.text, opacity: 0.7, marginBottom: 40, fontStyle: 'italic' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 48 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.accent },
  statLabel: { fontSize: 14, color: colors.text, opacity: 0.6, marginTop: 4 },
  startButton: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30, marginBottom: 32 },
  startButtonText: { fontSize: 18, fontWeight: '600', color: colors.white },
  bottomButtons: { flexDirection: 'row', gap: 16 },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: colors.primary },
  secondaryButtonText: { fontSize: 14, color: colors.primary },
  dailyLimit: { position: 'absolute', bottom: 40, fontSize: 12, color: colors.text, opacity: 0.5 },
});