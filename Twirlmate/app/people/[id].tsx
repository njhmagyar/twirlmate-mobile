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
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { CoachDetail } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CoachDetailScreen() {
  const { id, detailUrl } = useLocalSearchParams<{ id: string; detailUrl: string }>();
  const [coach, setCoach] = useState<CoachDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchCoachDetail();
  }, [id]);

  const fetchCoachDetail = async () => {
    try {
      const url = detailUrl ? `https://twirlmate.com${decodeURIComponent(detailUrl)}` : `https://twirlmate.com/api/v1/mobile/accounts/${id}/`;
      const response = await axios.get(url);
      setCoach(response.data);
    } catch (error) {
      console.error('Error fetching coach detail:', error);
      setCoach(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPress = async (url: string) => {
    if (url) {
      try {
        await Linking.openURL(`https://www.twirlmate.com${url}`);
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

  const renderSpecialties = () => {
    if (!coach?.coach_specialties || coach.coach_specialties.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Specialties
        </Text>
        <View style={styles.specialtiesContainer}>
          {coach.coach_specialties.map((specialty, index) => (
            <View key={index} style={[styles.specialtyTag, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <Text style={[styles.specialtyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {specialty}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading coach details...
        </Text>
      </View>
    );
  }

  if (!coach) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Coach not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Image 
        source={{ uri: coach.image.startsWith('/static/') ? `https://www.twirlmate.com${coach.image}` : coach.image }}
        style={styles.coachImage}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          {coach.name}
        </Text>
        
        <View style={styles.basicInfo}>
          <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].text }]}>
            {coach.location}
          </Text>
        </View>

        {coach.web_coach_request_url && (
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handleLinkPress(coach.web_detail_url)}
          >
            <Text style={styles.contactButtonText}>View on Twirlmate</Text>
          </TouchableOpacity>
        )}

        {renderSection('Bio', coach.bio)}
        {renderSpecialties()}

        {coach.web_detail_url && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Links
            </Text>
            <TouchableOpacity 
              onPress={() => handleLinkPress(coach.web_detail_url)}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>View Full Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coachImage: {
    width: '100%',
    height: 350,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 16,
  },
  basicInfo: {
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.8,
    fontFamily: Fonts.semiBold,
  },
  contactButton: {
    backgroundColor: '#038179',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Fonts.semiBold
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Fonts.semiBold
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
    opacity: 0.8,
    marginBottom: 20
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  linkButton: {
    paddingTop: 4,
  },
  linkText: {
    color: '#038179',
    fontSize: 16,
    fontFamily: Fonts.regular
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