import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRegisterContext } from '../../../context/RegisterContext';
import LoadingScreen from '../../LoadingScreen';
import CountDownTimer from '../../CountDownTimer';
import { send_otp, verify_otp } from '../../../scripts/api/auth';
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
        setStep(6);

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
      // console.log('Send Otp success:', response.data);
    } catch (error) {
      // console.error('Send Otp error:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    otp_request();
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
  );
};

export default VerificationCode;
