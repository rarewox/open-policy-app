import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import images from '../../../constants/images';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRegisterContext } from '../../../context/RegisterContext';

const GetForgottenEmail = () => {
  const { setLoginStep, forgottenDetails, setForgottenDetails } =
    useRegisterContext();
  const [activateNextButton, setActivateNextButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkIfPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10,20}$/; // make this range from 10 to 20
    return phoneRegex.test(phoneNumber);
  };

  const validateNext = () => {
    setActivateNextButton(
      validateEmail(forgottenDetails) || checkIfPhoneNumber(forgottenDetails),
    );
  };

  useEffect(() => {
    validateNext();
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
  }, [fadeAnim, forgottenDetails]);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <Animated.View
          className="flex-1 px-6 pt-8"
          style={[
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Back Icon and Progress Bar */}
          <View className="flex-row items-center mb-10">
            <TouchableOpacity className="mr-9" onPress={() => setLoginStep(1)}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="">
              <View className="" />
            </View>
          </View>

          {/* Header */}
          <Text className="text-2xl font-bold text-black text-center mt-8">
            Forgot your password ?
          </Text>
          <Text className="text-black text-center font-normal mb-5 mt-3 px-[40px]">
            No worries! We'll send a password reset code to your email or phone
            number
          </Text>

          {/* Form */}
          <View className="space-y-6 mt-10 ">
            {/* First Name */}
            <View className="mb-8">
              <Text className="text-gray-400 mb-4">
                Enter your email or phone number
              </Text>
              <TextInput
                value={forgottenDetails}
                className="border-b border-gray-200 pb-2 font-bold text-black text-xl"
                onChangeText={(text) => {
                  setForgottenDetails(text);
                }}
              />
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => setLoginStep(3)}
            disabled={!activateNextButton}
            className={`${
              activateNextButton ? 'bg-black' : 'bg-gray-400'
            } rounded-full py-4 mt-10`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Send Code
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetForgottenEmail;
