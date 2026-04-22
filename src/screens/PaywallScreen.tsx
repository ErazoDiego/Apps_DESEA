import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

export default function PaywallScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      <View style={styles.hero}>
        <Text style={styles.logo}>D</Text>
        <Text style={styles.title}>DESEA Pro</Text>
        <Text style={styles.subtitle}>Desbloqueá la noche completa</Text>
      </View>
      <View style={styles.features}>
        <Text style={styles.feature}>✓ Cartas ilimitadas</Text>
        <Text style={styles.feature}>✓ Nivel Fuego incluido</Text>
        <Text style={styles.feature}>✓ Sin anuncios</Text>
        <Text style={styles.feature}>✓ Colección guardada ilimitada</Text>
      </View>
      <View style={styles.pricing}>
        <TouchableOpacity style={styles.monthly}>
          <Text style={styles.planName}>Pro Mensual</Text>
          <Text style={styles.planPrice}>$2.99/mes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.annual}>
          <View style={styles.badge}><Text style={styles.badgeText}>AHORRÁ 44%</Text></View>
          <Text style={styles.planName}>Pro Anual</Text>
          <Text style={styles.planPrice}>$19.99/año</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.trial}><Text style={styles.trialText}>Probar 3 días gratis</Text></TouchableOpacity>
      <Text style={styles.terms}>Podés cancelar en cualquier momento.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 50, paddingBottom: 20 },
  close: { fontSize: 24, color: colors.text },
  hero: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 60, fontWeight: 'bold', color: colors.accent },
  title: { fontSize: 32, fontWeight: '600', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 16, color: colors.text, opacity: 0.7 },
  features: { marginBottom: 32, gap: 12 },
  feature: { fontSize: 16, color: colors.text },
  pricing: { gap: 12, marginBottom: 24 },
  monthly: { backgroundColor: colors.cardSurface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.gray[200] },
  annual: { backgroundColor: colors.cardSurface, borderRadius: 16, padding: 20, borderWidth: 2, borderColor: colors.primary, position: 'relative' },
  badge: { position: 'absolute', top: -10, right: 16, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.white },
  planName: { fontSize: 18, fontWeight: '600', color: colors.text },
  planPrice: { fontSize: 18, fontWeight: '600', color: colors.accent },
  trial: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
  trialText: { fontSize: 16, fontWeight: '600', color: colors.background },
  terms: { fontSize: 12, color: colors.text, opacity: 0.5, textAlign: 'center' },
});