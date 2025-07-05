import {
  View,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef } from 'react';
import terms from '../../constants/terms';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const TermsAndConditions = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sections = terms.privacyPolicySections;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex-1 px-6 pt-8">
          <View className="flex-row items-center mb-10">
            <TouchableOpacity className="mr-9" onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text className="text-4xl font-bold mb-3">Terms of Service</Text>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 30 }}
              className="bg-gray-200 rounded-2xl"
            >
              {sections.map((section, index) => (
                <View key={index} className="mb-2 mt-10 px-5">
                  {section.title && (
                    <Text className="text-base font-semibold mb-1">
                      {section.title}
                    </Text>
                  )}
                  <Text className="text-sm leading-6 text-gray-500">
                    {section.content}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
