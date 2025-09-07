import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsList } from '@/components/EventsList';

const US_STATES_MAP: { [key: string]: string } = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia'
};

export default function StateEventsScreen() {
  const { state } = useLocalSearchParams<{ state: string }>();
  const stateCode = state?.toUpperCase() || '';
  const stateName = US_STATES_MAP[stateCode] || stateCode;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: stateName,
          headerBackTitle: 'States',
        }} 
      />
      <EventsList
        title={`Events in ${stateName}`}
        apiEndpoint={`https://twirlmate.com/api/v1/mobile/events/by-state/?state=${stateCode}`}
        emptyMessage={`No events found in ${stateName}.`}
      />
    </>
  );
}