import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';

const RepresentativeBackButton = ({ steps }) => {
  const { screen, setScreen, setScrolledPastThreshold, setShowSearchBar } =
    useRepresentativeContext();

  const backButtonMethod = () => {
    setScreen(screen - 1);
    if (screen === 2 || screen === 4) {
      setShowSearchBar(true);
    }
    setScrolledPastThreshold(false);
  };
  return (
    <View className="flex-row items-center mb-7">
      <TouchableOpacity
        className="ml-3"
        onPress={() => {
          backButtonMethod();
        }}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <View className="">
        {(screen === 2 || screen === 5) && (
          <Text className="text-2xl font-semibold">Issues Handled</Text>
        )}
      </View>
    </View>
  );
};

export default RepresentativeBackButton;
