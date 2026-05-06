import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface HeaderProps {
  onBack?: () => void;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function Header({ onBack, centerContent, rightContent }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>{onBack ? '←' : ''}</Text>
      </TouchableOpacity>

      <View style={styles.center}>{centerContent}</View>

      {rightContent ? (
        rightContent
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  back: {
    fontSize: 24,
    color: colors.text,
  },
  center: {
    flex: 1,
    marginHorizontal: 20,
  },
});
