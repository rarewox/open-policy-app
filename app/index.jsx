import { View, Text, Image, ScrollView, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';
import { getToken, removeToken } from '../scripts/utils/storage';
import { getUser } from '../scripts/api/auth';
import Onboarding from './auth/onboarding';
import { useGlobalContext } from '../context/GlobalContextProvider';
import { useRepresentativeContext } from '../context/RepresentativeContext';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { setUser } = useGlobalContext();
  const { setYourRepresentative, setShowRepresentative, setData } =
    useRepresentativeContext();

  const check_user = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setShowOnboarding(true);
        setShowRepresentative(false);
        return;
      }
      const response = await getUser();
      if (response.data.success) {
        setUser(response.data.user);
        setYourRepresentative(response.data.representative);
        setData(response.data.representative);
        setShowRepresentative(true);
        router.replace('/user-parliament');
      } else {
        setShowOnboarding(true);
        setShowRepresentative(false);
      }
    } catch (error) {
      removeToken();
      setShowOnboarding(true);
      setShowRepresentative(false);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      check_user();
    }, 5000);

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return !showOnboarding ? (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <Animated.View
          className="w-full justify-center items-center min-h-[85vh] px-4"
          style={[
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Image
            source={images.logo}
            className="w-[144px] h-[144px] mb-1"
            resizeMode="contain"
          />

          <Text className="text-5xl font-normal text-black">OpenPolicy</Text>
          <View className="absolute bottom-6 left-0 right-0 items-center">
            <Text className="text-lg text-black ">
              We are not affiliated with or representative
            </Text>
            <Text className="text-lg text-black ">
              of any government agency.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <Onboarding />
  );
}
