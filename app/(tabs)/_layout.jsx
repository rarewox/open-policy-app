import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import CustomNavBar from '../../components/CustomNavBar';

export default function _layout() {
  return (
    <Tabs tabBar={(props) => <CustomNavBar {...props} />}>
      <Tabs.Screen
        name="user-representative"
        options={{
          headerShown: false,
          title: 'Representatives',
        }}
      />

      <Tabs.Screen
        name="user-parliament"
        options={{
          headerShown: false,
          title: 'Parliament',
        }}
      />

      <Tabs.Screen
        name="user-profile"
        options={{
          headerShown: false,
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
