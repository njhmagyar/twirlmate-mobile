import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { CoachesList } from '@/components/CoachesList';

export default function CoachesBySpecialtyScreen() {
  const { specialty } = useLocalSearchParams();
  
  const getSpecialtyTitle = (specialtyValue: string) => {
    const specialtyMap: { [key: string]: string } = {
      'baton': 'Baton Twirling Specialists',
      'dance': 'Dance Specialists',
      'majorette': 'Majorette Specialists',
      'color_guard': 'Color Guard Specialists',
      'flag': 'Flag Specialists',
      'pageantry': 'Pageantry Specialists'
    };
    return specialtyMap[specialtyValue as string] || 'Specialists';
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: getSpecialtyTitle(specialty as string),
          headerBackTitle: 'Back',
        }} 
      />
      <CoachesList
        title={getSpecialtyTitle(specialty as string)}
        apiEndpoint={`https://twirlmate.com/api/v1/mobile/accounts/by-specialty/?specialty=${specialty}`}
        emptyMessage={`No ${getSpecialtyTitle(specialty as string).toLowerCase()} found.`}
      />
    </>
  );
}