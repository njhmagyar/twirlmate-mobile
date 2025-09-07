import React from 'react';
import { Stack } from 'expo-router';
import { EventsList } from '@/components/EventsList';

export default function ClosingSoonScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Registration Closing Soon',
          headerBackTitle: 'Events',
        }} 
      />
      <EventsList
        title="Registration Closing Soon"
        apiEndpoint="https://twirlmate.com/api/v1/mobile/events/closing-soon/"
        emptyMessage="No events with registration closing soon."
      />
    </>
  );
}