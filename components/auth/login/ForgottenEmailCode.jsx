import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CountDownTimer from '../../CountDownTimer';
import { useRegisterContext } from '../../../context/RegisterContext';
import LoadingScreen from '../../LoadingScreen';
import { useAlert } from '../../../context/AlertProvider';

const ForgottenEmailCode = () => {
  const { setLoginStep, forgottenDetails, forgottenCode, setForgottenCode } =
    useRegisterContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const { showSuccess } = useAlert();

  const handleChange = (text, index) => {
    setLoading(false);
    setError(false);

    const newCode = [...forgottenCode];
    newCode[index] = text;
    setForgottenCode(newCode);

    if (text) {
      if (index < 3) {
        inputs.current[index + 1]?.focus();
      } else {
        handleSubmit(newCode);
      }
    }
  };

  const handleSubmit = (newCode) => {
    setLoading(true);
    setError(false);

    if (newCode.join('') === '1234') {
      setTimeout(function () {
        setLoading(false);
        showSuccess('Code Verified!');
        setLoginStep(4);
      }, 5000);
    } else {
      setError(true);
      setLoading(false);
    }
  };

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
            <TouchableOpacity className="mr-9" onPress={() => setLoginStep(2)}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="">
              <View className="" />
            </View>
          </View>

          {/* Header */}
          <Text className="text-2xl font-bold text-black text-center mt-8">
            Check your device
          </Text>
          <Text className="text-black text-center font-normal mt-4 px-20">
            Enter the 4-digit password we sent to
          </Text>
          <Text className="text-black text-center font-bold mb-10 px-20">
            {forgottenDetails}
          </Text>
          {/* Input Fields */}
          <View className="flex-row justify-center space-x-4 mb-4 mt-2">
            {forgottenCode.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                maxLength={1}
                keyboardType="number-pad"
                onChangeText={(text) => handleChange(text, index)}
                ref={(input) => (inputs.current[index] = input)}
                className={`h-[64px] w-[64px] mr-2 text-lg border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } text-center rounded-2xl`}
              />
            ))}
          </View>

          {/* Error Message */}
          {error && (
            <>
              {/* <View> */}
              <Text className="text-red-500 text-center mb-4 w-[200px]">
                Invalid forgottenCode
              </Text>
              {/* </View> */}
            </>
          )}

          {/* Resend forgottenCode */}
          <CountDownTimer time={50} />

          {/* Loading Indicator */}
          {loading && <LoadingScreen visible={loading} />}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgottenEmailCode;
