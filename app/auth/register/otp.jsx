import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { send_otp, verify_otp } from '../../../scripts/api/auth';
import { useRegisterContext } from '../../../context/RegisterContext';
import { Ionicons } from '@expo/vector-icons';
import CountDownTimer from '../../../components/CountDownTimer';
import LoadingScreen from '../../../components/LoadingScreen';
import { router } from 'expo-router';
import { useAlert } from '../../../context/AlertProvider';

const VerificationCode = () => {
  const { step, setStep, code, setCode, phone } = useRegisterContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const { showError, showSuccess } = useAlert();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const handleChange = (text, index) => {
    setLoading(false);
    setError(false);

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text) {
      if (index < 3) {
        inputs.current[index + 1]?.focus();
      } else {
        handleSubmit(newCode);
      }
    }
  };

  const handleSubmit = async (newCode) => {
    setLoading(true);
    setError(false);

    try {
      const response = await verify_otp({
        platform: 'sms',
        code: newCode.join(''),
        phone: phone,
      });

      setLoading(false);
      if (response.data.success) {
        showSuccess(response.data.message);
        router.push('/auth/register/password');

        return;
      }
      showError(response.data.message);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  const otp_request = async () => {
    try {
      const response = await send_otp({
        platform: 'sms',
        phone: phone,
      });
      if (response.data.success) {
        showSuccess(response.data.message);
      }
      showError(response.data.message);
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

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
            {/* <View className="h-1 w-[202px] bg-[#F0F3FA] ml-9"> */}
            <View className="h-1 w-[80%] bg-[#F0F3FA]">
              <View className={`h-1 bg-black w-3/5`} />
            </View>
          </View>
          <Animated.View style={[{ opacity: fadeAnim }]}>
            <Text className="text-blue-300 text-center font-semibold mb-5 mt-8">
              OpenPolicy
            </Text>
            <Text className="text-2xl font-bold text-black text-center mb-10">
              Verify your phone
            </Text>
            {/* Input Fields */}
            <View className="flex-row justify-center space-x-4 mb-4">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  maxLength={1}
                  keyboardType="number-pad"
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && !code[index]) {
                      if (index > 0) {
                        inputs.current[index - 1]?.focus();
                        const newCode = [...code];
                        newCode[index - 1] = '';
                        setCode(newCode);
                      }
                    }
                  }}
                  ref={(input) => (inputs.current[index] = input)}
                  className={`h-[64px] w-[64px] mr-2 text-2xl border ${
                    error ? 'border-[#DD3434]' : 'border-[#EBEBEB]'
                  } text-center rounded-2xl`}
                />
              ))}
            </View>

            {/* Error Message */}
            {error && (
              <>
                {/* <View> */}
                <Text className="text-red-500 text-center mb-4 w-[200px]">
                  Invalid code
                </Text>
                {/* </View> */}
              </>
            )}

            <CountDownTimer time={50} otp_request={otp_request} />

            {/* Loading Indicator */}
            {loading && <LoadingScreen visible={loading} />}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationCode;
