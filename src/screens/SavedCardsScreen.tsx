import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { cards } from '../data/cards';

export default function SavedCardsScreen({ navigation }: any) {
  const { savedCards, removeSavedCard } = useGame();
  const saved = cards.filter(c => savedCards.includes(c.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Guardadas</Text>
        <View style={{ width: 24 }} />
      </View>
      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No tenés cartas guardadas</Text>
        </View>
      ) : (
        <FlatList data={saved} keyExtractor={c => c.id} renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.texto}</Text>
            <TouchableOpacity onPress={() => removeSavedCard(item.id)}><Text style={styles.remove}>Eliminar</Text></TouchableOpacity>
          </View>
        )} contentContainerStyle={styles.list} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontWeight: '600', color: colors.text },
  list: { padding: 20 },
  card: { backgroundColor: colors.cardSurface, borderRadius: 16, padding: 20, marginBottom: 12 },
  cardText: { fontSize: 16, color: colors.text, lineHeight: 24 },
  remove: { marginTop: 12, fontSize: 12, color: colors.status.error, alignSelf: 'flex-end' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: colors.text, opacity: 0.6 },
});