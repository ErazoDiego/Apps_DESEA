import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { Level, CustomCardCategory } from '../types';

interface CreateCardFormProps {
  onSave: (text: string, level: Level, category: CustomCardCategory) => void;
  onCancel: () => void;
}

export default function CreateCardForm({ onSave, onCancel }: CreateCardFormProps) {
  const [text, setText] = useState('');
  const [level, setLevel] = useState<Level>('suave');
  const [category, setCategory] = useState<CustomCardCategory>('verdad');

  const levels: { value: Level; label: string }[] = [
    { value: 'suave', label: 'Suave' },
    { value: 'picante', label: 'Picante' },
    { value: 'fuego', label: 'Fuego' },
  ];

  const categories: { value: CustomCardCategory; label: string }[] = [
    { value: 'verdad', label: 'Verdad' },
    { value: 'reto', label: 'Reto' },
    { value: 'deseo', label: 'Deseo' },
    { value: 'reto_con_frase', label: 'Reto con Frase' },
  ];

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim(), level, category);
    setText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Crear Carta</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Texto</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribí tu carta..."
          placeholderTextColor={colors.text + '80'}
          multiline
          numberOfLines={4}
        />
      </View>

      <Text style={styles.sectionTitle}>Nivel</Text>
      <View style={styles.optionsGrid}>
        {levels.map((l) => (
          <TouchableOpacity
            key={l.value}
            style={[styles.option, level === l.value && styles.optionSelected]}
            onPress={() => setLevel(l.value)}
          >
            <Text style={[styles.optionLabel, level === l.value && styles.optionLabelSelected]}>
              {l.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Categoría</Text>
      <View style={styles.optionsGrid}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[styles.option, category === c.value && styles.optionSelected]}
            onPress={() => setCategory(c.value)}
          >
            <Text style={[styles.optionLabel, category === c.value && styles.optionLabelSelected]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '600', color: colors.text, marginBottom: 24, textAlign: 'center' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.cardSurface,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 16, marginBottom: 12 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  option: {
    backgroundColor: colors.cardSurface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionSelected: { borderColor: colors.primary },
  optionLabel: { fontSize: 14, color: colors.text },
  optionLabelSelected: { color: colors.primary, fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cancelText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
