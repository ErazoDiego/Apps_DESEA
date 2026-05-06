import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

interface BadgeProps {
  label: string;
  color: string;
  outlined?: boolean;
  style?: ViewStyle;
}

export default function Badge({ label, color, outlined = false, style }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        outlined ? { borderColor: color, borderWidth: 1, backgroundColor: 'transparent' } : { backgroundColor: color },
        style,
      ]}
    >
      <Text style={[styles.text, outlined ? { color } : { color: colors.white }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
