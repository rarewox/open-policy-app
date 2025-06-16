import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link, router } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterContext } from '../../../context/RegisterContext';

const PhoneAndPostalCode = () => {
  const {
    phone,
    setPhone,
    postalCode,
    setPostalCode,
    setStep,
    isChecked,
    setChecked,
  } = useRegisterContext();
  const [activateButton, setActivateButton] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const checkButtonState = () => {
    setActivateButton(isChecked && phone !== '' && postalCode !== '');
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
  }, [fadeAnim, isChecked]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text className="text-blue-300 text-center font-semibold mb-5 mt-8">
        OpenPolicy
      </Text>
      <Text className="text-2xl font-bold text-black text-center mb-10">
        Almost there!
      </Text>

      {/* Form */}
      <View className="space-y-6 mt-10 mb-7">
        {/* Phone Number */}
        <View className="mb-8">
          <Text className="text-custom-text-label mb-1">Your Phone Number</Text>
          <TextInput
            value={phone}
            className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
            onChangeText={(text) => {
              setPhone(text);
              checkButtonState();
            }}
          />
        </View>

        {/* Postal Code */}
        <View className="mb-8">
          <View className="flex-row justify-start items-center">
            <Text className="text-custom-text-label mb-1">Postal Code</Text>
            <Ionicons
              name="information-circle"
              size={16}
              color="gray"
              className="ml-2"
            />
          </View>
          <TextInput
            value={postalCode}
            className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
            onChangeText={(text) => {
              setPostalCode(text);
              checkButtonState();
            }}
          />
        </View>
      </View>

      {/* Terms and Conditions */}
      <View className="flex-row w-[325px] items-center mt-8 space-x-2 mb-5">
        <Checkbox
          color={'#222222'}
          className="mr-3"
          value={isChecked}
          onValueChange={setChecked}
        />
        <Text className="text-custom-black">
          By continuing, you agree to OpenPolicy’s{' '}
          <Text
            className="text-custom-black underline"
            onPress={() => setStep(3)}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            className="text-custom-black underline"
            onPress={() => setStep(4)}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        disabled={!activateButton}
        className={`mt-10 rounded-full py-4 ${
          activateButton ? 'bg-custom-black' : 'bg-custom-button-disabled'
        }`}
        onPress={() => setStep(5)}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Next
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PhoneAndPostalCode;
