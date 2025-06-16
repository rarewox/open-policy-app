import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useEffect, useRef } from 'react';
import images from '../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Onboarding = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    <SafeAreaView className="bg-white flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
            },
          ]}
          className="flex-1 px-6 pt-12"
        >
          {/* Language Selector */}
          <View className="flex-row items-center justify-start mb-6">
            <Image
              source={images.language}
              className="w-8 h-8 mr-2"
              resizeMode="contain"
            />
            <Text className="text-[#000000]">English</Text>
            <Ionicons
              name="chevron-down"
              size={19}
              color="#222222"
              className="ml-2"
            />
          </View>

          {/* Logo and Title */}
          <View className="flex-row justify-center items-center mb-8">
            <Image
              source={images.logo}
              className="w-12 h-12"
              resizeMode="contain"
            />
            <Text className="text-2xl text-custom-black font-bold ml-2">
              OpenPolicy
            </Text>
          </View>

          {/* Onboarding Image and Text */}
          <View className="justify-center items-center h-[60%]">
            <Image
              source={images.onboarding}
              className="w-full max-h-[300px] mb-6"
              resizeMode="contain"
            />

            <Text className="text-3xl md:text-4xl font-bold mb-4 mt-5 text-custom-black text-center">
              Explore Records.
            </Text>

            <Text className="text-custom-subtext mb-8 px-6 text-center">
              Find the newest reports, bills, and official documents, all in one
              spot.
            </Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            className="bg-custom-black py-5 rounded-full mb-3"
            onPress={() => router.push('/auth/register/name')}
          >
            <Text className="text-white text-center font-semibold">
              Get started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-custom-border py-5 rounded-full mb-3"
            onPress={() => router.push('/auth/login')}
          >
            <Text className="text-black text-center font-semibold">
              I have an account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/user-parliament')}>
            <Text className="text-center text-black">Enter as a Guest</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;
