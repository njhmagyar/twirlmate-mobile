import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const quickActions = [
    {
      title: 'Browse Events',
      subtitle: 'Find upcoming baton twirling competitions',
      icon: 'calendar',
      route: '/(tabs)/events',
    },
    {
      title: 'Find Coaches',
      subtitle: 'Connect with experienced instructors',
      icon: 'person.fill',
      route: '/(tabs)/coaches',
    },
    {
      title: 'Join Groups',
      subtitle: 'Discover local twirling communities',
      icon: 'person.3.fill',
      route: '/(tabs)/groups',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Welcome to Twirlmate
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Your companion for the baton twirling community
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Quick Actions
          </Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={() => router.push(action.route as any)}
            >
              <View style={styles.actionIcon}>
                <IconSymbol size={32} name={action.icon as any} color={Colors[colorScheme ?? 'light'].tint} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionSubtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {action.subtitle}
                </Text>
              </View>
              <IconSymbol size={20} name="chevron.right" color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  quickActions: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
});