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
  TextInput,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { EventDateListItem } from '@/types/api';
import { Colors } from '@/constants/Colors';
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

export default function EventsListScreen() {
  const [events, setEvents] = useState<EventDateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    tier: '',
    type: '',
    comp_format: '',
    organization: ''
  });
  const [tempFilters, setTempFilters] = useState({
    state: '',
    tier: '',
    type: '',
    comp_format: '',
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
        comp_format: filters.comp_format,
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
      comp_format: '',
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

  const selectState = (stateValue: string) => {
    updateTempFilter('state', stateValue);
  };

  const showStateSelector = () => {
    const options = US_STATES.map(state => state.label);
    
    Alert.alert(
      'Select State',
      '',
      [
        ...US_STATES.map(state => ({
          text: state.label,
          onPress: () => selectState(state.value),
          style: tempFilters.state === state.value ? 'default' : 'default'
        })),
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
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
          <View style={[styles.modalHeader, { borderBottomColor: Colors[colorScheme ?? 'light'].text }]}>
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
                  borderColor: Colors[colorScheme ?? 'light'].text 
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
              <TextInput
                style={[styles.filterInput, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].text 
                }]}
                placeholder="Competition tier"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text}
                value={tempFilters.tier}
                onChangeText={(text) => updateTempFilter('tier', text)}
              />
            </View>

            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Type</Text>
              <TextInput
                style={[styles.filterInput, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].text 
                }]}
                placeholder="Event type"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text}
                value={tempFilters.type}
                onChangeText={(text) => updateTempFilter('type', text)}
              />
            </View>

            {/* Competition Format Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Competition Format</Text>
              <TextInput
                style={[styles.filterInput, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].text 
                }]}
                placeholder="e.g. In-person, Virtual"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text}
                value={tempFilters.comp_format}
                onChangeText={(text) => updateTempFilter('comp_format', text)}
              />
            </View>

            {/* Organization Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Organization</Text>
              <TextInput
                style={[styles.filterInput, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].text 
                }]}
                placeholder="Organizing body"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text}
                value={tempFilters.organization}
                onChangeText={(text) => updateTempFilter('organization', text)}
              />
            </View>

            {/* Clear Filters Button */}
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={[styles.clearButtonText, { color: '#F44336' }]}>Clear All Filters</Text>
            </TouchableOpacity>
          </ScrollView>
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    fontWeight: '500',
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
    fontWeight: '600',
    marginBottom: 8,
  },
  filterInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  clearButton: {
    marginTop: 32,
    marginBottom: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  },
});