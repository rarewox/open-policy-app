import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../../constants';
import { useRegisterContext } from '../../../context/RegisterContext';

const Register = () => {
  const {
    setStep,
    firstName,
    setFirstName,
    secondName,
    setSecondName,
    email,
    setEmail,
  } = useRegisterContext();
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

  const proceedNextPage = () => {
    if (activateNextButton) {
      setStep(2);
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
            <Text className="text-custom-text-label mb-1">Your Email</Text>
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
        onPress={proceedNextPage}
        disabled={!activateNextButton}
        className={`${
          activateNextButton ? 'bg-custom-black' : 'bg-custom-button-disabled'
        } rounded-full py-4 mt-10`}
      >
        <Text className={`text-white text-center font-semibold text-lg`}>
          Next
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Register;
