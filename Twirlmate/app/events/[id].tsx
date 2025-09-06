import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { EventDateDetail } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function EventDetailScreen() {
  const { id, detailUrl } = useLocalSearchParams<{ id: string; detailUrl: string }>();
  const [event, setEvent] = useState<EventDateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchEventDetail();
  }, [id]);


  const fetchEventDetail = async () => {
    try {
      const url = detailUrl ? `https://twirlmate.com${decodeURIComponent(detailUrl)}` : `https://twirlmate.com/api/v1/mobile/events/dates/${id}/`;
      const response = await axios.get(url);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event detail:', error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRegistrationStatus = (event: EventDateDetail) => {
    if (event.registration_upcoming) return 'Registration Opening Soon';
    if (event.registration_available) return 'Registration Open';
    if (event.registration_closed) return 'Registration Closed';
    return 'Registration Status Unknown';
  };

  const handleLinkPress = async (url: string) => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        Alert.alert('Error', 'Unable to open link');
      }
    }
  };

  const renderSection = (title: string, content: string) => {
    if (!content) return null;
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {title}
        </Text>
        <Text style={[styles.sectionContent, { color: Colors[colorScheme ?? 'light'].text }]}>
          {content}
        </Text>
      </View>
    );
  };

  const renderAddress = (address: EventDateDetail['event']['primary_address']) => {
    if (!address) return null;
    
    const fullAddress = [
      address.name,
      address.address_1,
      address.address_2,
      `${address.city}, ${address.state} ${address.zip_code}`,
      address.country_display
    ].filter(Boolean).join('\n');
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Venue
        </Text>
        <Text style={[styles.sectionContent, { color: Colors[colorScheme ?? 'light'].text }]}>
          {fullAddress}
        </Text>
      </View>
    );
  };

  const renderSocialLinks = () => {
    if (!event) return null;
    
    const links = [
      { label: 'Website', url: event.event.website },
      { label: 'Facebook', url: event.event.facebook_url },
      { label: 'Instagram', url: event.event.instagram_url },
      { label: 'X (Twitter)', url: event.event.x_url },
      { label: 'YouTube', url: event.event.youtube_url }
    ].filter(link => link.url);

    if (links.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Links
        </Text>
        {links.map((link, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleLinkPress(link.url)}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading event details...
        </Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Event not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Image 
        source={{ uri: event.event.image.startsWith('/static/') ? `https://www.twirlmate.com${event.event.image}` : event.event.image }}
        style={styles.eventImage}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          {event.event.name}
        </Text>
        
        <View style={styles.basicInfo}>
          <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].text }]}>
            {event.event.location}
          </Text>
          <Text style={[styles.date, { color: Colors[colorScheme ?? 'light'].text }]}>
            {formatDate(event.start)}
          </Text>
          <Text style={[styles.time, { color: Colors[colorScheme ?? 'light'].text }]}>
            {formatTime(event.start)} - {formatTime(event.end)}
          </Text>
          
          <Text style={styles.registrationStatus}>
            {getRegistrationStatus(event)}
          </Text>
        </View>

        {event.registration_available && event.registration_url && (
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => handleLinkPress(event.registration_url)}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        )}

        {renderSection('Overview', event.event.overview_description)}
        {renderSection('Order of Events', event.event.order_of_events)}
        {renderSection('Awards', event.event.awards_description)}
        {renderSection('Rules', event.event.rules)}
        {renderSection('Additional Information', event.event.additional_information)}
        {renderSection('Cancellation Policy', event.event.cancellation_policy)}
        
        {renderAddress(event.event.primary_address)}
        {renderAddress(event.event.secondary_address)}
        
        {(event.event.contact_name || event.event.contact_email || event.event.contact_phone_number) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Contact Information
            </Text>
            {event.event.contact_name && (
              <Text style={[styles.sectionContent, { color: Colors[colorScheme ?? 'light'].text }]}>
                Name: {event.event.contact_name}
              </Text>
            )}
            {event.event.contact_email && (
              <TouchableOpacity onPress={() => handleLinkPress(`mailto:${event.event.contact_email}`)}>
                <Text style={[styles.linkText, styles.sectionContent]}>
                  Email: {event.event.contact_email}
                </Text>
              </TouchableOpacity>
            )}
            {event.event.contact_phone_number && (
              <TouchableOpacity onPress={() => handleLinkPress(`tel:${event.event.contact_phone_number}`)}>
                <Text style={[styles.linkText, styles.sectionContent]}>
                  Phone: {event.event.contact_phone_number}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {renderSocialLinks()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 350,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  basicInfo: {
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.8,
  },
  date: {
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.8,
  },
  time: {
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.8,
  },
  format: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  eventTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  registrationStatus: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 16,
  },
  registerButton: {
    backgroundColor: '#038179',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#1976D2',
    fontSize: 16,
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
  errorText: {
    fontSize: 18,
    opacity: 0.7,
  },
});