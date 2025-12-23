import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CoachListItem } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CoachCardProps {
  coach: CoachListItem;
  onPress: () => void;
  style?: any;
}

export function CoachCard({ coach, onPress, style }: CoachCardProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }, style]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: coach.image.startsWith('/static/') ? `https://www.twirlmate.com${coach.image}` : coach.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={2}>
          {coach.name}
        </Text>
        <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={1}>
          {coach.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12
  },
  content: {
    paddingVertical: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
    lineHeight: 20,
  },
  location: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    opacity: 0.8,
  },
});