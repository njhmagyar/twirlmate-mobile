import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { CoachesList } from '@/components/CoachesList';

const US_STATES: { [key: string]: string } = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia', 
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 
  'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 
  'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 
  'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 
  'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 
  'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};

export default function CoachesByStateScreen() {
  const { state } = useLocalSearchParams();
  
  const getStateTitle = (stateValue: string) => {
    return US_STATES[stateValue as string] || stateValue;
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `${getStateTitle(state as string)}`,
          headerBackTitle: 'Back',
        }} 
      />
      <CoachesList
        title={`${getStateTitle(state as string)} Coaches`}
        apiEndpoint={`https://twirlmate.com/api/v1/mobile/accounts/by-state/?state=${state}`}
        emptyMessage={`No coaches found in ${getStateTitle(state as string)}.`}
      />
    </>
  );
}