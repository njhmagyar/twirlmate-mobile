import React from 'react';
import { Stack } from 'expo-router';
import { EventsList } from '@/components/EventsList';

export default function RecentlyAddedScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Recently Added',
          headerBackTitle: 'Events',
        }} 
      />
      <EventsList
        title="Recently Added"
        apiEndpoint="https://twirlmate.com/api/v1/mobile/events/recently-added/"
        emptyMessage="No recently added events found."
      />
    </>
  );
}