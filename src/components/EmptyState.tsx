import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  message: string;
  ctaText?: string;
  onCtaPress?: () => void;
};

const EmptyState = ({ message, ctaText, onCtaPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {ctaText && onCtaPress && (
        <TouchableOpacity style={styles.button} onPress={onCtaPress}>
          <Text style={styles.buttonText}>{ctaText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    color: colors.textFaded,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmptyState;
