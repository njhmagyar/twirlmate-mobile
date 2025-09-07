import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { EventDateListItem } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

interface EventsListProps {
  title: string;
  apiEndpoint: string;
  emptyMessage?: string;
}

export function EventsList({ title, apiEndpoint, emptyMessage = "No events found." }: EventsListProps) {
  const [events, setEvents] = useState<EventDateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      setEvents(response.data);
    } catch (error) {
      console.error(`Error fetching ${title}:`, error);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [apiEndpoint]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRegistrationStatus = (event: EventDateListItem) => {
    if (event.registration_upcoming) return `Registration opens ${formatDeadline(event.registration_open)}`;
    if (event.registration_available) return `Register by ${formatDeadline(event.registration_close)}`;
    if (event.registration_closed) return `Registration closed ${formatDeadline(event.registration_close)}`;
    return 'Registration Dates Unknown';
  };

  const renderEventItem = ({ item }: { item: EventDateListItem }) => (
    <TouchableOpacity 
      style={[styles.eventCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => router.push(`/events/${item.id}?detailUrl=${encodeURIComponent(item.mobile_detail_url)}`)}
    >
      <View style={styles.eventContent}>
        <Text style={[styles.eventDate, { color: Colors[colorScheme ?? 'light'].text }]}>
          {formatDate(item.start)}
        </Text>
        <Text style={[styles.eventTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.event.name}
        </Text>
        <Text style={[styles.eventLocation, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.event.location}
        </Text>
        <Text style={[styles.registrationStatus, { color: Colors[colorScheme ?? 'light'].icon }]}>
          {getRegistrationStatus(item)}
        </Text>
      </View>
      <Image 
        source={{ uri: item.event.image.startsWith('/static/') ? `https://www.twirlmate.com${item.event.image}` : item.event.image }}
        style={styles.eventImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading {title.toLowerCase()}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (events.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {emptyMessage}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 0,
    paddingBottom: 80,
  },
  eventCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 20
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 16,
    marginRight: 0
  },
  eventContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontFamily: Fonts.regular,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontFamily: Fonts.semiBold,
  },
  registrationStatus: {
    paddingTop: 4,
    fontSize: 12,
    fontFamily: Fonts.regular,
    opacity: 0.7
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    opacity: 0.7,
    textAlign: 'center',
  },
});