import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { EventDateListItem } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function EventsListScreen() {
  const [events, setEvents] = useState<EventDateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const colorScheme = useColorScheme();

  const fetchEvents = async (date: Date = currentDate) => {
    try {
      const month = date.getMonth() + 1; // Convert to 1-based month
      const year = date.getFullYear();
      const response = await axios.get(`https://twirlmate.com/api/v1/mobile/events/?month=${month}&year=${year}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
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
        <Text style={styles.registrationStatus}>
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
      <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading events...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={[styles.monthHeader, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <IconSymbol size={20} name="chevron.left" color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: Colors[colorScheme ?? 'light'].text }]}>
          {formatMonthYear(currentDate)}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <IconSymbol size={20} name="chevron.right" color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontWeight: '600',
  },
  registrationStatus: {
    paddingTop: 4,
    fontSize: 12,
    fontWeight: '400',
    opacity: .7
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});