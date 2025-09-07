import React from 'react';
import { Stack } from 'expo-router';
import { EventsList } from '@/components/EventsList';

export default function HappeningSoonScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Happening Soon',
          headerBackTitle: 'Events',
        }} 
      />
      <EventsList
        title="Happening Soon"
        apiEndpoint="https://twirlmate.com/api/v1/mobile/events/happening-soon/"
        emptyMessage="No upcoming events found."
      />
    </>
  );
}