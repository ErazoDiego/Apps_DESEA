import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { CustomDeck, CustomCard } from '../types';
import { createDeck, createCustomCard } from '../engine/deckUtils';
import DeckList from '../components/DeckList';
import DeckCard from '../components/DeckCard';
import CreateCardForm from '../components/CreateCardForm';

export default function CustomDeckScreen({ navigation }: any) {
  const {
    customDecks, customCards, addCustomDeck, removeCustomDeck, addCustomCard, removeCustomCard,
  } = useGame();

  const [selectedDeck, setSelectedDeck] = useState<CustomDeck | null>(null);

  const handleCreateDeck = () => {
    Alert.prompt(
      'Nuevo Mazo',
      'Nombre del mazo:',
      (name) => {
        if (name?.trim()) {
          const newDeck = createDeck(name.trim());
          addCustomDeck(newDeck);
        }
      }
    );
  };

  const handleSelectDeck = (deck: CustomDeck) => {
    setSelectedDeck(deck);
  };

  const handleDeleteDeck = (deckId: string) => {
    Alert.alert(
      'Eliminar Mazo',
      '¿Estás seguro? Se borrarán todas las cartas del mazo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeCustomDeck(deckId) },
      ]
    );
  };

  const handleSaveCard = (text: string, level: 'suave' | 'picante' | 'fuego', category: 'verdad' | 'reto' | 'deseo' | 'reto_con_frase') => {
    if (!selectedDeck) return;
    const newCard = createCustomCard(text, level, category);
    addCustomCard(newCard);
    // Agregar ID al mazo
    const updatedDeck: CustomDeck = {
      ...selectedDeck,
      cards: [...selectedDeck.cards, newCard.id],
    };
    // Actualizar mazo (usando addCustomDeck para reemplazar)
    removeCustomDeck(selectedDeck.id);
    addCustomDeck(updatedDeck);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!selectedDeck) return;
    removeCustomCard(cardId);
    // Remover ID del mazo
    const updatedDeck: CustomDeck = {
      ...selectedDeck,
      cards: selectedDeck.cards.filter(id => id !== cardId),
    };
    removeCustomDeck(selectedDeck.id);
    addCustomDeck(updatedDeck);
  };

  const handlePlayDeck = () => {
    if (!selectedDeck || selectedDeck.cards.length === 0) {
      Alert.alert('Mazo vacío', 'Agregá algunas cartas antes de jugar.');
      return;
    }
    // Aquí se debería navegar a GameScreen con el mazo personalizado
    Alert.alert('Jugar', `Jugar con mazo "${selectedDeck.name}" (${selectedDeck.cards.length} cartas)`);
    // navigation.navigate('Game', { customDeckId: selectedDeck.id });
  };

  if (selectedDeck) {
    const deckCards = selectedDeck.cards
      .map(id => customCards[id])
      .filter(card => card !== undefined) as CustomCard[];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedDeck(null)}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedDeck.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.deckActions}>
          <TouchableOpacity style={styles.playBtn} onPress={handlePlayDeck}>
            <Text style={styles.playText}>Jugar</Text>
          </TouchableOpacity>
        </View>

        <CreateCardForm onSave={handleSaveCard} onCancel={() => {}} />

        <FlatList
          data={deckCards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <DeckCard
              card={item}
              onDelete={() => handleDeleteCard(item.id)}
            />
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mazos Personalizados</Text>
        <TouchableOpacity onPress={handleCreateDeck}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>

      <DeckList
        decks={customDecks}
        onSelect={handleSelectDeck}
        onDelete={handleDeleteDeck}
      />

      <TouchableOpacity style={styles.createDeckBtn} onPress={handleCreateDeck}>
        <Text style={styles.createDeckText}>Crear Nuevo Mazo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontWeight: '600', color: colors.text, flex: 1, marginHorizontal: 10 },
  addBtn: { fontSize: 24, color: colors.primary },
  deckActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  playBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  playText: { fontSize: 16, fontWeight: '600', color: colors.white },
  createDeckBtn: {
    backgroundColor: colors.cardSurface,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  createDeckText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  list: { padding: 20 },
});
