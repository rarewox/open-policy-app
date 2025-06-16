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
import { useRegisterContext } from '../../../context/RegisterContext';
import LoadingScreen from '../../../components/LoadingScreen';
import CountDownTimer from '../../../components/CountDownTimer';
import { useAlert } from '../../../context/AlertProvider';
import { send_otp, verify_otp } from '../../../scripts/api/auth';

const ForgottenEmailCode = () => {
  const { forgottenDetails, forgottenCode, setForgottenCode } =
    useRegisterContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlert();
  const inputs = useRef([]);

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

  const otp_request = async () => {
    try {
      const response = await send_otp({
        platform: 'sms',
        phone: forgottenDetails,
      });
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  const handleSubmit = async (newCode) => {
    setLoading(true);
    setError(false);

    try {
      const response = await verify_otp({
        platform: 'sms',
        code: newCode.join(''),
        phone: forgottenDetails,
      });

      if (response.data.success) {
        showSuccess(response.data.message);
        router.push('/auth/forgot/password');

        return;
      }
      showError(response.data.message);
    } catch (error) {
      setError(true);
    } finally {
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
            <TouchableOpacity className="mr-9" onPress={() => router.back()}>
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
                Invalid Code
              </Text>
              {/* </View> */}
            </>
          )}

          {/* Resend forgottenCode */}
          <CountDownTimer time={50} otp_request={otp_request} />

          {/* Loading Indicator */}
          {loading && <LoadingScreen visible={loading} />}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgottenEmailCode;
