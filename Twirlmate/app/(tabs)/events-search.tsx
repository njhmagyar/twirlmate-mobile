import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  SafeAreaView,
  Modal,
  ScrollView,
  Animated
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { EventDateListItem } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

const US_STATES = [
  { value: '', label: 'All States' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

const TIERS = [
  { value: '', label: 'All Tiers' },
  { value: 'open', label: 'Open / Local' },
  { value: 'state', label: 'State / Provincial' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
  { value: 'other', label: 'Other' }
];

const TYPES = [
  { value: '', label: 'All Types' },
  { value: '1', label: 'Competition' },
  { value: '2', label: 'Class' },
  { value: '3', label: 'Clinic' },
  { value: '4', label: 'Camp' },
  { value: '5', label: 'Seminar' },
  { value: '6', label: 'Twirler Day' },
  { value: '7', label: 'Audition' }
];

const ORGANIZATIONS = [
  { value: '', label: 'All Organizations' },
  { value: '5', label: 'AAU' },
  { value: '4', label: 'DMA' },
  { value: '7', label: 'IBTF' },
  { value: '1', label: 'NBTA' },
  { value: '3', label: 'TU' },
  { value: '6', label: 'USTA' },
  { value: '2', label: 'WTA' }
];

export default function EventsListScreen() {
  const [events, setEvents] = useState<EventDateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showTierPicker, setShowTierPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showOrganizationPicker, setShowOrganizationPicker] = useState(false);
  
  // Animation refs
  const statePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const statePickerSlideAnim = useRef(new Animated.Value(300)).current;
  const tierPickerFadeAnim = useRef(new Animated.Value(0)).current;
  const tierPickerSlideAnim = useRef(new Animated.Value(300)).current;
  const typePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const typePickerSlideAnim = useRef(new Animated.Value(300)).current;
  const organizationPickerFadeAnim = useRef(new Animated.Value(0)).current;
  const organizationPickerSlideAnim = useRef(new Animated.Value(300)).current;
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    tier: '',
    type: '',
    organization: ''
  });
  const [tempFilters, setTempFilters] = useState({
    state: '',
    tier: '',
    type: '',
    organization: ''
  });
  const colorScheme = useColorScheme();

  const fetchEvents = async (date: Date = currentDate, searchParams: any = {}) => {
    try {
      const month = date.getMonth() + 1; // Convert to 1-based month
      const year = date.getFullYear();
      
      // Build query parameters
      const params = new URLSearchParams({
        month: month.toString(),
        year: year.toString(),
        ...searchParams
      });
      
      // Remove empty parameters
      for (const [key, value] of params.entries()) {
        if (!value || value.trim() === '') {
          params.delete(key);
        }
      }
      
      const response = await axios.get(`https://twirlmate.com/api/v1/mobile/events/?${params.toString()}`);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const searchParams = { 
      ...filters,
      name: query 
    };
    fetchEvents(currentDate, searchParams);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      fetchEvents(currentDate, filters);
    }
  };

  const dismissSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    fetchEvents(currentDate, filters);
  };

  const toggleFilter = () => {
    if (!showFilter) {
      // Copy current filters to temp when opening modal
      setTempFilters({
        state: filters.state,
        tier: filters.tier,
        type: filters.type,
        organization: filters.organization
      });
    }
    setShowFilter(!showFilter);
  };

  const applyFilters = () => {
    const newFilters = {
      ...filters,
      ...tempFilters
    };
    setFilters(newFilters);
    const searchParams = { 
      ...newFilters,
      name: searchQuery 
    };
    fetchEvents(currentDate, searchParams);
    setShowFilter(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      state: '',
      tier: '',
      type: '',
      organization: ''
    };
    setTempFilters(clearedFilters);
  };

  const updateTempFilter = (key: string, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStateLabel = (stateValue: string) => {
    const state = US_STATES.find(s => s.value === stateValue);
    return state ? state.label : 'All States';
  };

  const showStateSelector = () => {
    console.log('showStateSelector called');
    setShowStatePicker(true);
    // Start animations
    Animated.parallel([
      Animated.timing(statePickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(statePickerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const showTierSelector = () => {
    console.log('showTierSelector called');
    setShowTierPicker(true);
    // Start animations
    Animated.parallel([
      Animated.timing(tierPickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(tierPickerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const showTypeSelector = () => {
    console.log('showTypeSelector called');
    setShowTypePicker(true);
    // Start animations
    Animated.parallel([
      Animated.timing(typePickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(typePickerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const showOrganizationSelector = () => {
    console.log('showOrganizationSelector called');
    setShowOrganizationPicker(true);
    // Start animations
    Animated.parallel([
      Animated.timing(organizationPickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(organizationPickerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const hideStatePicker = () => {
    Animated.parallel([
      Animated.timing(statePickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(statePickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      setShowStatePicker(false);
    });
  };

  const hideTierPicker = () => {
    Animated.parallel([
      Animated.timing(tierPickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(tierPickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      setShowTierPicker(false);
    });
  };

  const hideTypePicker = () => {
    Animated.parallel([
      Animated.timing(typePickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(typePickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      setShowTypePicker(false);
    });
  };

  const hideOrganizationPicker = () => {
    Animated.parallel([
      Animated.timing(organizationPickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(organizationPickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      setShowOrganizationPicker(false);
    });
  };

  const confirmStatePicker = () => {
    hideStatePicker();
  };

  const confirmTierPicker = () => {
    hideTierPicker();
  };

  const confirmTypePicker = () => {
    hideTypePicker();
  };

  const confirmOrganizationPicker = () => {
    hideOrganizationPicker();
  };

  const getTierLabel = (tierValue: string) => {
    const tier = TIERS.find(t => t.value === tierValue);
    return tier ? tier.label : 'All Tiers';
  };

  const getTypeLabel = (typeValue: string) => {
    const type = TYPES.find(t => t.value === typeValue);
    return type ? type.label : 'All Types';
  };

  const getOrganizationLabel = (organizationValue: string) => {
    const organization = ORGANIZATIONS.find(o => o.value === organizationValue);
    return organization ? organization.label : 'All Organizations';
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
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {showSearch ? (
          // Search Header
          <>
            <TextInput
              style={[styles.searchHeaderInput, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
              }]}
              placeholder="Search events..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            <TouchableOpacity onPress={dismissSearch} style={styles.headerButton}>
              <IconSymbol size={24} name="xmark" color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          </>
        ) : (
          // Regular Header
          <>
            <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Events
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={toggleSearch} style={styles.headerButton}>
                <IconSymbol size={24} name="magnifyingglass" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFilter} style={styles.headerButton}>
                <IconSymbol size={24} name="line.3.horizontal.decrease" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Month Navigation */}
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

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: '#9aa8ba' }]}>
            <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Filter Events</Text>
            <TouchableOpacity onPress={applyFilters} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: '#038179' }]}>Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* State Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>State</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  borderColor: '#9aa8ba' 
                }]}
                onPress={showStateSelector}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {getStateLabel(tempFilters.state)}
                </Text>
                <IconSymbol size={16} name="chevron.down" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>

            {/* Tier Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Tier</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  borderColor: '#9aa8ba' 
                }]}
                onPress={showTierSelector}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {getTierLabel(tempFilters.tier)}
                </Text>
                <IconSymbol size={16} name="chevron.down" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>

            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Type</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  borderColor: '#9aa8ba' 
                }]}
                onPress={showTypeSelector}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {getTypeLabel(tempFilters.type)}
                </Text>
                <IconSymbol size={16} name="chevron.down" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>


            {/* Organization Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Organization</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  borderColor: '#9aa8ba' 
                }]}
                onPress={showOrganizationSelector}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {getOrganizationLabel(tempFilters.organization)}
                </Text>
                <IconSymbol size={16} name="chevron.down" color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>

            {/* Clear Filters Button */}
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={[styles.clearButtonText, { color: '#F44336' }]}>Clear All Filters</Text>
            </TouchableOpacity>
          </ScrollView>
          {/* State Picker Overlay - Inside Modal */}
          {showStatePicker && (
            <Animated.View style={[styles.pickerOverlayContainer, { opacity: statePickerFadeAnim }]}>
              <TouchableOpacity 
                style={styles.pickerBackdrop} 
                onPress={hideStatePicker}
                activeOpacity={1}
              />
              <View style={styles.pickerSlideContainer}>
                <Animated.View style={[
                  styles.pickerBottomSheet, 
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    transform: [{ translateY: statePickerSlideAnim }]
                  }
                ]}>
                  <View style={[styles.pickerHeader, { borderBottomColor: '#9aa8ba' }]}>
                    <TouchableOpacity onPress={hideStatePicker}>
                      <Text style={[styles.pickerButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.pickerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Select State</Text>
                    <TouchableOpacity onPress={confirmStatePicker}>
                      <Text style={[styles.pickerButtonText, { color: '#038179' }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <Picker
                    selectedValue={tempFilters.state}
                    onValueChange={(itemValue) => updateTempFilter('state', itemValue)}
                    style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
                  >
                    {US_STATES.map((state) => (
                      <Picker.Item
                        key={state.value}
                        label={state.label}
                        value={state.value}
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                    ))}
                  </Picker>
                </Animated.View>
              </View>
            </Animated.View>
          )}

          {/* Tier Picker Overlay - Inside Modal */}
          {showTierPicker && (
            <Animated.View style={[styles.pickerOverlayContainer, { opacity: tierPickerFadeAnim }]}>
              <TouchableOpacity 
                style={styles.pickerBackdrop} 
                onPress={hideTierPicker}
                activeOpacity={1}
              />
              <View style={styles.pickerSlideContainer}>
                <Animated.View style={[
                  styles.pickerBottomSheet, 
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    transform: [{ translateY: tierPickerSlideAnim }]
                  }
                ]}>
                  <View style={[styles.pickerHeader, { borderBottomColor: '#9aa8ba' }]}>
                    <TouchableOpacity onPress={hideTierPicker}>
                      <Text style={[styles.pickerButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.pickerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Select Tier</Text>
                    <TouchableOpacity onPress={confirmTierPicker}>
                      <Text style={[styles.pickerButtonText, { color: '#038179' }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <Picker
                    selectedValue={tempFilters.tier}
                    onValueChange={(itemValue) => updateTempFilter('tier', itemValue)}
                    style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
                  >
                    {TIERS.map((tier) => (
                      <Picker.Item
                        key={tier.value}
                        label={tier.label}
                        value={tier.value}
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                    ))}
                  </Picker>
                </Animated.View>
              </View>
            </Animated.View>
          )}

          {/* Type Picker Overlay - Inside Modal */}
          {showTypePicker && (
            <Animated.View style={[styles.pickerOverlayContainer, { opacity: typePickerFadeAnim }]}>
              <TouchableOpacity 
                style={styles.pickerBackdrop} 
                onPress={hideTypePicker}
                activeOpacity={1}
              />
              <View style={styles.pickerSlideContainer}>
                <Animated.View style={[
                  styles.pickerBottomSheet, 
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    transform: [{ translateY: typePickerSlideAnim }]
                  }
                ]}>
                  <View style={[styles.pickerHeader, { borderBottomColor: '#9aa8ba' }]}>
                    <TouchableOpacity onPress={hideTypePicker}>
                      <Text style={[styles.pickerButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.pickerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Select Type</Text>
                    <TouchableOpacity onPress={confirmTypePicker}>
                      <Text style={[styles.pickerButtonText, { color: '#038179' }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <Picker
                    selectedValue={tempFilters.type}
                    onValueChange={(itemValue) => updateTempFilter('type', itemValue)}
                    style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
                  >
                    {TYPES.map((type) => (
                      <Picker.Item
                        key={type.value}
                        label={type.label}
                        value={type.value}
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                    ))}
                  </Picker>
                </Animated.View>
              </View>
            </Animated.View>
          )}

          {/* Organization Picker Overlay - Inside Modal */}
          {showOrganizationPicker && (
            <Animated.View style={[styles.pickerOverlayContainer, { opacity: organizationPickerFadeAnim }]}>
              <TouchableOpacity 
                style={styles.pickerBackdrop} 
                onPress={hideOrganizationPicker}
                activeOpacity={1}
              />
              <View style={styles.pickerSlideContainer}>
                <Animated.View style={[
                  styles.pickerBottomSheet, 
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    transform: [{ translateY: organizationPickerSlideAnim }]
                  }
                ]}>
                  <View style={[styles.pickerHeader, { borderBottomColor: '#9aa8ba' }]}>
                    <TouchableOpacity onPress={hideOrganizationPicker}>
                      <Text style={[styles.pickerButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.pickerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Select Organization</Text>
                    <TouchableOpacity onPress={confirmOrganizationPicker}>
                      <Text style={[styles.pickerButtonText, { color: '#038179' }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <Picker
                    selectedValue={tempFilters.organization}
                    onValueChange={(itemValue) => updateTempFilter('organization', itemValue)}
                    style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
                  >
                    {ORGANIZATIONS.map((organization) => (
                      <Picker.Item
                        key={organization.value}
                        label={organization.label}
                        value={organization.value}
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                    ))}
                  </Picker>
                </Animated.View>
              </View>
            </Animated.View>
          )}
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.bold,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchHeaderInput: {
    flex: 1,
    fontSize: 18,
    marginRight: 8,
    fontFamily: Fonts.regular,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
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
    fontFamily: Fonts.semiBold,
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
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontFamily: Fonts.semiBold,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
  },
  registrationStatus: {
    paddingTop: 4,
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Fonts.regular,
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginTop: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  filterInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.regular
  },
  clearButton: {
    marginTop: 32,
    marginBottom: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold
  },
  dropdownButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.regular
  },
  // Picker styles
  pickerOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  pickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pickerSlideContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  pickerBottomSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34, // Safe area padding
    maxHeight: 300, // Fixed height instead of percentage
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
  pickerButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  picker: {
    height: 200,
  },
});