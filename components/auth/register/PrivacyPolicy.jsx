import { View, Text, Animated, ScrollView } from 'react-native';
import React, { useEffect, useRef } from 'react';
import terms from '../../../constants/terms';

const PrivacyPolicy = () => {
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
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text className="text-4xl font-bold mb-3">Privacy Policy</Text>
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
  );
};

export default PrivacyPolicy;
