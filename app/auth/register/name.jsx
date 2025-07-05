import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterContext } from '../../../context/RegisterContext';
import { router } from 'expo-router';
import { check_email } from '../../../scripts/api/auth';
import { useAlert } from '../../../context/AlertProvider';

const RegistrationNameSetUp = () => {
  const {
    firstName,
    setFirstName,
    secondName,
    setSecondName,
    email,
    setEmail,
  } = useRegisterContext();
  const { showError } = useAlert();
  const [activateNextButton, setActivateNextButton] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateNext = () => {
    setActivateNextButton(validateEmail(email) && firstName && secondName);
  };

  const checkButtonState = () => {
    setActivateNextButton(validateEmail(email) && firstName && secondName);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNextButtonPress = async () => {
    try {
      setActivateNextButton(false);
      const response = await check_email({ email: email });

      if (response.data.success) {
        router.push('/auth/register/number');
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    } finally {
      setActivateNextButton(true);
    }
  };

  useEffect(() => {
    checkButtonState();
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
  }, [fadeAnim, firstName, secondName, email]);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex-1 px-6 pt-8">
          <View className="flex-row items-center mb-10">
            <TouchableOpacity className="mr-9" onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            {/* <View className="h-1 w-[202px] bg-[#F0F3FA] ml-9"> */}
            <View className="h-1 w-[80%] bg-[#F0F3FA]">
              <View className={`h-1 bg-black w-1/3`} />
            </View>
          </View>
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text className="text-custom-blue text-center font-semibold mb-5 mt-8">
              OpenPolicy
            </Text>
            <Text className="text-2xl font-bold text-custom-black text-center mb-10">
              Let’s get to know you!
            </Text>

            {/* Form */}
            <View className="space-y-6 mt-10 ">
              {/* First Name */}
              <View className="mb-8">
                <Text className="text-custom-text-label mb-1">First Name</Text>
                <TextInput
                  value={firstName}
                  className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
                  onChangeText={(text) => {
                    setFirstName(text);
                    validateNext();
                  }}
                />
              </View>

              {/* Last Name */}
              <View className="mb-8">
                <Text className="text-custom-text-label mb-1">Last Name</Text>
                <TextInput
                  value={secondName}
                  className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
                  onChangeText={(text) => {
                    setSecondName(text);
                    validateNext();
                  }}
                />
              </View>

              {/* Email */}
              <View className="mb-10">
                <View className="flex-row justify-start items-center">
                  <Text className="text-custom-text-label mb-1">
                    Your Email
                  </Text>
                  <Ionicons
                    name="information-circle"
                    className="ml-2"
                    size={16}
                    color="gray"
                  />
                </View>
                <TextInput
                  value={email}
                  className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
                  onChangeText={(text) => {
                    setEmail(text);
                    validateNext();
                  }}
                />
              </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNextButtonPress}
              disabled={!activateNextButton}
              className={`${
                activateNextButton
                  ? 'bg-custom-black'
                  : 'bg-custom-button-disabled'
              } rounded-full py-4 mt-10`}
            >
              <Text className={`text-white text-center font-semibold text-lg`}>
                Next
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationNameSetUp;
