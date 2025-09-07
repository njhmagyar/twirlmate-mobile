import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
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
import { EventCard } from '@/components/EventCard';

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' }, 
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, 
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' }, 
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, 
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, 
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, 
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' }, 
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, 
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, 
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, 
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, 
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, 
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' }, 
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, 
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, 
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, 
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }, { value: 'DC', label: 'District of Columbia' }
];

const US_REGIONS = [
  {
    title: 'Northeast',
    states: [
      { value: 'CT', label: 'Connecticut' },
      { value: 'ME', label: 'Maine' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NY', label: 'New York' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'VT', label: 'Vermont' },
      { value: 'DC', label: 'District of Columbia' }
    ]
  },
  {
    title: 'Southeast',
    states: [
      { value: 'AL', label: 'Alabama' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WV', label: 'West Virginia' }
    ]
  },
  {
    title: 'Midwest',
    states: [
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'WI', label: 'Wisconsin' }
    ]
  },
  {
    title: 'Central',
    states: [
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'MO', label: 'Missouri' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'SD', label: 'South Dakota' }
    ]
  },
  {
    title: 'Southwest',
    states: [
      { value: 'AZ', label: 'Arizona' },
      { value: 'CO', label: 'Colorado' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' }
    ]
  },
  {
    title: 'West',
    states: [
      { value: 'AK', label: 'Alaska' },
      { value: 'CA', label: 'California' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'MT', label: 'Montana' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'WA', label: 'Washington' },
      { value: 'WY', label: 'Wyoming' }
    ]
  }
];

const US_STATES_WITH_ALL = [
  { value: '', label: 'All States' },
  ...US_STATES
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

type TabType = 'explore' | 'calendar' | 'states';

export default function EventsDiscoveryScreen() {
  const [recentlyAdded, setRecentlyAdded] = useState<EventDateListItem[]>([]);
  const [closingSoon, setClosingSoon] = useState<EventDateListItem[]>([]);
  const [happeningSoon, setHappeningSoon] = useState<EventDateListItem[]>([]);
  const [monthlyEvents, setMonthlyEvents] = useState<EventDateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calendar tab filter state
  const [searchQuery, setSearchQuery] = useState('');
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

  const fetchDiscoveryData = async () => {
    try {
      const [recentlyAddedRes, closingSoonRes, happeningSoonRes] = await Promise.all([
        axios.get('https://twirlmate.com/api/v1/mobile/events/recently-added/?truncate=1'),
        axios.get('https://twirlmate.com/api/v1/mobile/events/closing-soon/?truncate=1'),
        axios.get('https://twirlmate.com/api/v1/mobile/events/happening-soon/?truncate=1')
      ]);

      setRecentlyAdded(recentlyAddedRes.data);
      setClosingSoon(closingSoonRes.data);
      setHappeningSoon(happeningSoonRes.data);
    } catch (error) {
      console.error('Error fetching discovery data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMonthlyEvents = async (date: Date = currentDate, searchParams: any = {}) => {
    setMonthlyLoading(true);
    try {
      const month = date.getMonth() + 1;
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
      setMonthlyEvents(response.data);
    } catch (error) {
      console.error('Error fetching monthly events:', error);
      setMonthlyEvents([]);
    } finally {
      setMonthlyLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryData();
  }, []);

  useEffect(() => {
    if (activeTab === 'calendar') {
      const searchParams = { 
        ...filters,
        name: searchQuery 
      };
      fetchMonthlyEvents(currentDate, searchParams);
    }
  }, [activeTab, currentDate]);

  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'calendar') {
      const searchParams = { 
        ...filters,
        name: searchQuery 
      };
      fetchMonthlyEvents(currentDate, searchParams);
      setRefreshing(false);
    } else {
      fetchDiscoveryData();
    }
  };

  const handleSearchPress = () => {
    router.push('/events-search');
  };

  // Calendar tab filter functions

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
    fetchMonthlyEvents(currentDate, searchParams);
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
    setSearchQuery('');
  };

  const updateTempFilter = (key: string, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStateLabel = (stateValue: string) => {
    const state = US_STATES_WITH_ALL.find(s => s.value === stateValue);
    return state ? state.label : 'All States';
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

  // Picker animation functions
  const showStateSelector = () => {
    setShowStatePicker(true);
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
    setShowTierPicker(true);
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
    setShowTypePicker(true);
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
    setShowOrganizationPicker(true);
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

  const renderTabBar = () => (
    <View style={[styles.tabBar, {borderBottomColor: Colors[colorScheme ?? 'light'].inputBorder }]}>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'explore' && styles.activeTab,
          { borderBottomColor: activeTab === 'explore' ? Colors[colorScheme ?? 'light'].tint : 'transparent' }
        ]}
        onPress={() => setActiveTab('explore')}
      >
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'explore' ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon }
        ]}>
          Explore
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'calendar' && styles.activeTab,
          { borderBottomColor: activeTab === 'calendar' ? Colors[colorScheme ?? 'light'].tint : 'transparent' }
        ]}
        onPress={() => setActiveTab('calendar')}
      >
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'calendar' ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon }
        ]}>
          Calendar
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'states' && styles.activeTab,
          { borderBottomColor: activeTab === 'states' ? Colors[colorScheme ?? 'light'].tint : 'transparent' }
        ]}
        onPress={() => setActiveTab('states')}
      >
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'states' ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon }
        ]}>
          States
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEventItem = ({ item }: { item: EventDateListItem }) => (
    <EventCard 
      event={item} 
      onPress={() => router.push(`/events/${item.id}?detailUrl=${encodeURIComponent(item.mobile_detail_url)}`)}
    />
  );

  const renderSection = (title: string, data: EventDateListItem[], seeAllRoute: string) => {
    if (data.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity 
            onPress={() => router.push(seeAllRoute)}
            style={styles.sectionTitleWrapper}
          >
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {title}
            </Text>
            <IconSymbol style={styles.sectionTitleChevron} size={20} name="chevron.right" color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={data}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>
    );
  };

  const renderExploreTab = () => (
    <View style={styles.exploreTabContent}>
      {/* Discovery Sections */}
      {renderSection('Registration Closing Soon', closingSoon, '/events/closing-soon')}
      {renderSection('Happening Soon', happeningSoon, '/events/happening-soon')}
      {renderSection('Recently Added', recentlyAdded, '/events/recently-added')}
    </View>
  );

  const renderCalendarTab = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const previousMonth = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    };

    const nextMonth = () => {
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

    const renderEventItem = ({ item }: { item: EventDateListItem }) => (
      <TouchableOpacity 
        style={[styles.calendarEventCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
        onPress={() => router.push(`/events/${item.id}?detailUrl=${encodeURIComponent(item.mobile_detail_url)}`)}
      >
        <View style={styles.calendarEventContent}>
          <Text style={[styles.calendarEventDate, { color: Colors[colorScheme ?? 'light'].text }]}>
            {formatDate(item.start)}
          </Text>
          <Text style={[styles.calendarEventTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.event.name}
          </Text>
          <Text style={[styles.calendarEventLocation, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.event.location}
          </Text>
          <Text style={styles.calendarRegistrationStatus}>
            {getRegistrationStatus(item)}
          </Text>
        </View>
        <Image 
          source={{ uri: item.event.image.startsWith('/static/') ? `https://www.twirlmate.com${item.event.image}` : item.event.image }}
          style={styles.calendarEventImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );

    return (
      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={[styles.monthHeader, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
          <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
            <IconSymbol size={20} name="chevron.left" color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {formatMonthYear(currentDate)}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <IconSymbol size={20} name="chevron.right" color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        {/* Events List */}
        {monthlyLoading ? (
          <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Loading events...
            </Text>
          </View>
        ) : (
          <FlatList
            data={monthlyEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.calendarListContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating Filter Button */}
        <TouchableOpacity 
          style={[styles.floatingFilterButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary
          }]}
          onPress={toggleFilter}
        >
          <IconSymbol size={24} name="line.3.horizontal.decrease" color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>

        {/* Filter Modal */}
        <Modal
          visible={showFilter}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: Colors[colorScheme ?? 'light'].inputBorder }]}>
              <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Filter Events</Text>
              <TouchableOpacity onPress={applyFilters} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: '#038179' }]}>Apply</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Search/Name Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Search Events</Text>
                <TextInput
                  style={[styles.filterInput, { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder,
                    color: Colors[colorScheme ?? 'light'].text
                  }]}
                  placeholder="Search by event name..."
                  placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* State Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>State</Text>
                <TouchableOpacity
                  style={[styles.dropdownButton, { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder
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
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder 
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
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder 
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
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder 
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

            {/* Picker Overlays */}
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
                      {US_STATES_WITH_ALL.map((state) => (
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

            {/* Other picker overlays would go here - Tier, Type, Organization */}
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
      </View>
    );
  };

  const renderStateItem = ({ item }: { item: { value: string; label: string } }) => (
    <TouchableOpacity 
      style={[styles.horizontalStateCard, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}
      onPress={() => router.push(`/events/state/${item.value}`)}
    >
      <Image 
        source={{ uri: `https://www.twirlmate.com/static/pages/images/states/${item.value}-transparent.png` }}
        style={styles.stateImage}
        resizeMode="contain"
      />
      <Text style={[styles.horizontalStateLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderStatesTab = () => {
    const renderRegionSection = (region: typeof US_REGIONS[0]) => (
      <View style={styles.section} key={region.title}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {region.title}
          </Text>
        </View>
        <FlatList
          horizontal
          data={region.states}
          renderItem={renderStateItem}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalStatesList}
        />
      </View>
    );

    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.statesTabContent}
        showsVerticalScrollIndicator={false}
      >
        {US_REGIONS.map(renderRegionSection)}
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        return renderExploreTab();
      case 'calendar':
        return renderCalendarTab();
      case 'states':
        return renderStatesTab();
      default:
        return renderExploreTab();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading events...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Tab Bar as Header */}
      {renderTabBar()}

      {/* Tab Content */}
      {activeTab === 'states' || activeTab === 'calendar' ? (
        renderTabContent()
      ) : (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      )}
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
    fontFamily: Fonts.bold,
  },
  scrollView: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    alignItems: 'center'
  },
  sectionTitleChevron: {
    marginLeft: 8
  },
  horizontalList: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  browseGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  browseCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  browseCardText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  // Tab styles
  exploreTabContent: {
    paddingTop: 20,
    paddingBottom: 40
  },
  statesTabContent: {
    paddingTop: 20,
    paddingBottom: 40
  },
  tabBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  activeTab: {
    // Active tab styling handled by borderBottomColor prop
  },
  tabText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  // Coming soon styles
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  comingSoonText: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    opacity: 0.7,
  },
  // States tab styles
  statesList: {
    padding: 20,
    paddingBottom: 80,
  },
  stateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  stateLabel: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  stateCode: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    opacity: 0.6,
  },
  // Horizontal states styles
  horizontalStatesList: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  horizontalStateCard: {
    width: 160,
    height: 160,
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  horizontalStateLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    marginBottom: 4,
  },
  horizontalStateCode: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    opacity: 0.6,
  },
  // Calendar tab styles
  calendarContainer: {
    flex: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stickyMonthNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
  eventsList: {
    padding: 20,
    paddingBottom: 80,
  },
  eventItem: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  registrationDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  // Additional calendar tab styles
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
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 50,
    marginVertical: 12,
    marginHorizontal: 16
  },
  calendarListContent: {
    padding: 0,
    paddingBottom: 80,
  },
  calendarListContentWithStickyNav: {
    padding: 0,
    paddingBottom: 100, // Extra padding for sticky navigation
  },
  floatingFilterButton: {
    position: 'absolute',
    bottom: 72, // Account for main tab navigation height
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  calendarEventCard: {
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
  calendarEventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 16,
    marginRight: 0
  },
  calendarEventContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  calendarEventTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  calendarEventLocation: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontFamily: Fonts.semiBold,
  },
  calendarEventDate: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
    fontFamily: Fonts.semiBold,
  },
  calendarRegistrationStatus: {
    paddingTop: 4,
    fontSize: 12,
    fontFamily: Fonts.regular,
    opacity: .7
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.semiBold
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
    paddingBottom: 34,
    maxHeight: 300,
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