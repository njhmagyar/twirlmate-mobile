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
import { CoachListItem } from '@/types/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CoachCard } from '@/components/CoachCard';

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

const ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'coach', label: 'Coach' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'judge', label: 'Judge' },
  { value: 'choreographer', label: 'Choreographer' }
];

const SPECIALTIES = [
  { value: '', label: 'All Specialties' },
  { value: 'baton', label: 'Baton Twirling' },
  { value: 'dance', label: 'Dance' },
  { value: 'majorette', label: 'Majorette' },
  { value: 'color_guard', label: 'Color Guard' },
  { value: 'flag', label: 'Flag' },
  { value: 'pageantry', label: 'Pageantry' }
];

type TabType = 'explore' | 'search' | 'states';

export default function CoachesDiscoveryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Explore tab data
  const [coachList, setCoachPreview] = useState<CoachListItem[]>([]);
  const [judgeList, setJudgePreview] = useState<CoachListItem[]>([]);
  const [organizerList, setOrganizerPreview] = useState<CoachListItem[]>([]);
  
  // Search tab data
  const [searchCoaches, setSearchCoaches] = useState<CoachListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  
  // Animation refs
  const statePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const statePickerSlideAnim = useRef(new Animated.Value(300)).current;
  const rolePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const rolePickerSlideAnim = useRef(new Animated.Value(300)).current;
  const specialtyPickerFadeAnim = useRef(new Animated.Value(0)).current;
  const specialtyPickerSlideAnim = useRef(new Animated.Value(300)).current;
  
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    role: '',
    specialty: ''
  });
  const [tempFilters, setTempFilters] = useState({
    state: '',
    role: '',
    specialty: ''
  });
  
  const colorScheme = useColorScheme();

  const fetchDiscoveryData = async () => {
    try {
      const [coachRes, judgeRes, organizerRes] = await Promise.all([
        axios.get('https://twirlmate.com/api/v1/mobile/accounts/by-role/?role=coach&truncate=1'),
        axios.get('https://twirlmate.com/api/v1/mobile/accounts/by-role/?role=judge&truncate=1'),
        axios.get('https://twirlmate.com/api/v1/mobile/accounts/by-role/?role=event_organizer&truncate=1')
      ]);

      setCoachPreview(coachRes.data.results || coachRes.data);
      setJudgePreview(judgeRes.data.results || judgeRes.data);
      setOrganizerPreview(organizerRes.data.results || organizerRes.data);
    } catch (error) {
      console.error('Error fetching discovery data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSearchCoaches = async (searchParams: any = {}) => {
    setSearchLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams(searchParams);
      
      // Remove empty parameters
      for (const [key, value] of params.entries()) {
        if (!value || value.trim() === '') {
          params.delete(key);
        }
      }
      
      const response = await axios.get(`https://twirlmate.com/api/v1/mobile/accounts/?${params.toString()}`);
      setSearchCoaches(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching search people:', error);
      setSearchCoaches([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryData();
  }, []);

  useEffect(() => {
    if (activeTab === 'search') {
      const searchParams = { 
        ...filters,
        name: searchQuery 
      };
      fetchSearchCoaches(searchParams);
    }
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'search') {
      const searchParams = { 
        ...filters,
        name: searchQuery 
      };
      fetchSearchCoaches(searchParams);
      setRefreshing(false);
    } else {
      fetchDiscoveryData();
    }
  };

  // Search tab filter functions
  const toggleFilter = () => {
    if (!showFilter) {
      setTempFilters({
        state: filters.state,
        role: filters.role,
        specialty: filters.specialty
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
    fetchSearchCoaches(searchParams);
    setShowFilter(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      state: '',
      role: '',
      specialty: ''
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

  const getRoleLabel = (roleValue: string) => {
    const role = ROLES.find(r => r.value === roleValue);
    return role ? role.label : 'All Roles';
  };

  const getSpecialtyLabel = (specialtyValue: string) => {
    const specialty = SPECIALTIES.find(s => s.value === specialtyValue);
    return specialty ? specialty.label : 'All Specialties';
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

  const showRoleSelector = () => {
    setShowRolePicker(true);
    Animated.parallel([
      Animated.timing(rolePickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rolePickerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const showSpecialtySelector = () => {
    setShowSpecialtyPicker(true);
    Animated.parallel([
      Animated.timing(specialtyPickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(specialtyPickerSlideAnim, {
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

  const hideRolePicker = () => {
    Animated.parallel([
      Animated.timing(rolePickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(rolePickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      setShowRolePicker(false);
    });
  };

  const hideSpecialtyPicker = () => {
    Animated.parallel([
      Animated.timing(specialtyPickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(specialtyPickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      setShowSpecialtyPicker(false);
    });
  };

  const confirmStatePicker = () => {
    hideStatePicker();
  };

  const confirmRolePicker = () => {
    hideRolePicker();
  };

  const confirmSpecialtyPicker = () => {
    hideSpecialtyPicker();
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
          activeTab === 'search' && styles.activeTab,
          { borderBottomColor: activeTab === 'search' ? Colors[colorScheme ?? 'light'].tint : 'transparent' }
        ]}
        onPress={() => setActiveTab('search')}
      >
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'search' ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon }
        ]}>
          Search
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

  const renderCoachItem = ({ item }: { item: CoachListItem }) => (
    <CoachCard 
      coach={item} 
      onPress={() => router.push(`/people/${item.id}?detailUrl=${encodeURIComponent(item.mobile_detail_url)}`)}
    />
  );

  const renderSection = (title: string, data: CoachListItem[], seeAllRoute: string) => {
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
          renderItem={renderCoachItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>
    );
  };

  const renderExploreTab = () => (
    <View style={styles.exploreTabContent}>
      {renderSection('Coaches', coachList, '/people/by-role/coach')}
      {renderSection('Judges', judgeList, '/people/by-role/judge')}
      {renderSection('Event Organizers', organizerList, '/people/by-role/event_organizer')}
    </View>
  );

  const renderSearchTab = () => {
    const renderCoachItem = ({ item }: { item: CoachListItem }) => (
      <TouchableOpacity 
        style={[styles.searchCoachCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
        onPress={() => router.push(`/people/${item.id}?detailUrl=${encodeURIComponent(item.mobile_detail_url)}`)}
      >
        <View style={styles.searchCoachContent}>
          <Text style={[styles.searchCoachName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.name}
          </Text>
          <Text style={[styles.searchCoachLocation, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.location}
          </Text>
        </View>
        <Image 
          source={{ uri: item.image.startsWith('/static/') ? `https://www.twirlmate.com${item.image}` : item.image }}
          style={styles.searchCoachImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );

    return (
      <View style={styles.searchContainer}>
        {searchLoading ? (
          <View style={[styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Loading people...
            </Text>
          </View>
        ) : (
          <FlatList
            data={searchCoaches}
            renderItem={renderCoachItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.searchListContent}
            showsVerticalScrollIndicator={false}
          />
        )}

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
            <View style={[styles.modalHeader, { borderBottomColor: Colors[colorScheme ?? 'light'].inputBorder }]}>
              <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Filter Coaches</Text>
              <TouchableOpacity onPress={applyFilters} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: '#038179' }]}>Apply</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Search Coaches</Text>
                <TextInput
                  style={[styles.filterInput, { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder,
                    color: Colors[colorScheme ?? 'light'].text
                  }]}
                  placeholder="Search by coach name..."
                  placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

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

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Role</Text>
                <TouchableOpacity
                  style={[styles.dropdownButton, { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder 
                  }]}
                  onPress={showRoleSelector}
                >
                  <Text style={[styles.dropdownText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {getRoleLabel(tempFilters.role)}
                  </Text>
                  <IconSymbol size={16} name="chevron.down" color={Colors[colorScheme ?? 'light'].text} />
                </TouchableOpacity>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Specialty</Text>
                <TouchableOpacity
                  style={[styles.dropdownButton, { 
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].inputBorder 
                  }]}
                  onPress={showSpecialtySelector}
                >
                  <Text style={[styles.dropdownText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {getSpecialtyLabel(tempFilters.specialty)}
                  </Text>
                  <IconSymbol size={16} name="chevron.down" color={Colors[colorScheme ?? 'light'].text} />
                </TouchableOpacity>
              </View>

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

            {showRolePicker && (
              <Animated.View style={[styles.pickerOverlayContainer, { opacity: rolePickerFadeAnim }]}>
                <TouchableOpacity 
                  style={styles.pickerBackdrop} 
                  onPress={hideRolePicker}
                  activeOpacity={1}
                />
                <View style={styles.pickerSlideContainer}>
                  <Animated.View style={[
                    styles.pickerBottomSheet, 
                    { 
                      backgroundColor: Colors[colorScheme ?? 'light'].background,
                      transform: [{ translateY: rolePickerSlideAnim }]
                    }
                  ]}>
                    <View style={[styles.pickerHeader, { borderBottomColor: '#9aa8ba' }]}>
                      <TouchableOpacity onPress={hideRolePicker}>
                        <Text style={[styles.pickerButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={[styles.pickerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Select Role</Text>
                      <TouchableOpacity onPress={confirmRolePicker}>
                        <Text style={[styles.pickerButtonText, { color: '#038179' }]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <Picker
                      selectedValue={tempFilters.role}
                      onValueChange={(itemValue) => updateTempFilter('role', itemValue)}
                      style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
                    >
                      {ROLES.map((role) => (
                        <Picker.Item
                          key={role.value}
                          label={role.label}
                          value={role.value}
                          color={Colors[colorScheme ?? 'light'].text}
                        />
                      ))}
                    </Picker>
                  </Animated.View>
                </View>
              </Animated.View>
            )}

            {showSpecialtyPicker && (
              <Animated.View style={[styles.pickerOverlayContainer, { opacity: specialtyPickerFadeAnim }]}>
                <TouchableOpacity 
                  style={styles.pickerBackdrop} 
                  onPress={hideSpecialtyPicker}
                  activeOpacity={1}
                />
                <View style={styles.pickerSlideContainer}>
                  <Animated.View style={[
                    styles.pickerBottomSheet, 
                    { 
                      backgroundColor: Colors[colorScheme ?? 'light'].background,
                      transform: [{ translateY: specialtyPickerSlideAnim }]
                    }
                  ]}>
                    <View style={[styles.pickerHeader, { borderBottomColor: '#9aa8ba' }]}>
                      <TouchableOpacity onPress={hideSpecialtyPicker}>
                        <Text style={[styles.pickerButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={[styles.pickerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Select Specialty</Text>
                      <TouchableOpacity onPress={confirmSpecialtyPicker}>
                        <Text style={[styles.pickerButtonText, { color: '#038179' }]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <Picker
                      selectedValue={tempFilters.specialty}
                      onValueChange={(itemValue) => updateTempFilter('specialty', itemValue)}
                      style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
                    >
                      {SPECIALTIES.map((specialty) => (
                        <Picker.Item
                          key={specialty.value}
                          label={specialty.label}
                          value={specialty.value}
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
      onPress={() => router.push(`/people/by-state/${item.value}`)}
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
      case 'search':
        return renderSearchTab();
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
            Loading people...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Tab Bar as Header */}
      {renderTabBar()}

      {activeTab === 'states' || activeTab === 'search' ? (
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
  scrollView: {
    flex: 1,
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
  exploreTabContent: {
    paddingTop: 20,
    paddingBottom: 40
  },
  statesTabContent: {
    paddingTop: 20,
    paddingBottom: 40
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
  searchContainer: {
    flex: 1,
  },
  searchListContent: {
    padding: 0,
    paddingBottom: 80,
  },
  searchCoachCard: {
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
  searchCoachImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 16,
    marginRight: 0
  },
  searchCoachContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    justifyContent: 'center',
  },
  searchCoachName: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  searchCoachLocation: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Fonts.regular,
  },
  floatingFilterButton: {
    position: 'absolute',
    bottom: 72,
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