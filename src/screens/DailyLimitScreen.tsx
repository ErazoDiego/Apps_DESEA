import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function DailyLimitScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cartas agotadas</Text>
      <Text style={styles.subtitle}>Has usado las 10 cartas gratuitas de hoy</Text>
      <View style={styles.options}>
        <TouchableOpacity style={styles.option}><Text style={styles.icon}>📺</Text><Text style={styles.optTitle}>Ver 1 anuncio</Text><Text style={styles.optDesc}>+10 cartas</Text></TouchableOpacity>
        <TouchableOpacity style={styles.option}><Text style={styles.icon}>⏱</Text><Text style={styles.optTitle}>Ver 2 anuncios</Text><Text style={styles.optDesc}>25 min Pro</Text></TouchableOpacity>
        <View style={styles.divider}><View style={styles.line} /><Text style={styles.divText}>o</Text><View style={styles.line} /></View>
        <TouchableOpacity style={styles.proBtn} onPress={() => navigation.navigate('Paywall')}><Text style={styles.proText}>Upgrade Pro $2.99/mes</Text></TouchableOpacity>
        <TouchableOpacity style={styles.waitBtn} onPress={() => navigation.navigate('Home')}><Text style={styles.waitText}>Esperar a mañana</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 100 },
  title: { fontSize: 28, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.text, opacity: 0.7, textAlign: 'center', marginBottom: 40 },
  options: { gap: 16 },
  option: { backgroundColor: colors.cardSurface, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  icon: { fontSize: 24, marginRight: 16 },
  optTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  optDesc: { fontSize: 14, color: colors.accent },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  line: { flex: 1, height: 1, backgroundColor: colors.gray[200] },
  divText: { paddingHorizontal: 16, color: colors.text, opacity: 0.5 },
  proBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  proText: { fontSize: 18, fontWeight: '600', color: colors.white },
  waitBtn: { paddingVertical: 12, alignItems: 'center' },
  waitText: { fontSize: 14, color: colors.text, opacity: 0.5 },
});