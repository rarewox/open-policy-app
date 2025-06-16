import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import images from '../../../constants/images';
import { useRegisterContext } from '../../../context/RegisterContext';
import { useAlert } from '../../../context/AlertProvider';

const ResetForgottenPassword = () => {
  const { forgotNewPassword, setForgotNewPassword, setLoginStep } =
    useRegisterContext();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activateButton, setActivateButton] = useState(false);
  const [isValid, setIsValid] = useState({
    length: false,
    number: false,
    symbol: false,
    match: false,
  });
  const { showError, showSuccess } = useAlert();

  // forgotNewPassword validation rules
  const validatePassword = (pass, confirmpass) => {
    setIsValid({
      length: pass.length >= 8,
      number: /\d/.test(pass),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      match: pass != '' && pass == confirmpass,
    });
  };

  const handleNext = () => {
    if (
      isValid.length &&
      isValid.number &&
      isValid.symbol &&
      forgotNewPassword === confirmPassword
    ) {
      showSuccess('Password reset successfully!');
      setLoginStep(5);
    } else {
      showError('Passwords do not match or requirements are not met.');
    }
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setActivateButton(
      isValid.length && isValid.number && isValid.symbol && isValid.match,
    );
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
  }, [fadeAnim, confirmPassword]);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <KeyboardAvoidingView behavior="padding" className="flex-1 px-6 pt-8">
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {/* Back Icon and Progress Bar */}
            <View className="flex-row items-center mb-10">
              <TouchableOpacity
                className="mr-9"
                onPress={() => setLoginStep(3)}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
              <View className="">
                <View className="" />
              </View>
            </View>

            {/* Header */}
            <Text className="text-2xl font-bold text-black text-center mt-8">
              Reset your password
            </Text>
            <Text className="text-black text-center text-base font-normal mt-4 px-19">
              Create a new password that hasn't been
            </Text>
            <Text className="text-black text-center text-base font-normal px-19">
              used before
            </Text>

            {/* Create forgotNewPassword */}
            <Text className="text-gray-500 mt-10 mb-7">Create password</Text>
            <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-4">
              <TextInput
                secureTextEntry={!showPassword}
                value={forgotNewPassword}
                onChangeText={(text) => {
                  setForgotNewPassword(text);
                  validatePassword(text, '');
                }}
                placeholder="Enter your password"
                className="flex-1 py-2"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} />
              </TouchableOpacity>
            </View>

            {/* Confirm forgotNewPassword */}
            <Text className="text-gray-500 mt-10 mb-7">Confirm password</Text>
            <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-8">
              <TextInput
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  validatePassword(forgotNewPassword, text);
                }}
                placeholder="Re-enter your password"
                className="flex-1 py-2 "
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                />
              </TouchableOpacity>
            </View>

            {/* Validation */}
            <View className="mb-8 flex-row items-center justify-center mt-5">
              <View className="flex-row">
                {isValid.length && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text
                  className={`text-sm mr-5 ${
                    isValid.length ? 'text-black-500' : 'text-gray-400'
                  }`}
                >
                  8 characters
                </Text>
              </View>
              <View className="flex-row">
                {isValid.symbol && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text
                  className={`text-sm mr-5 ${
                    isValid.symbol ? 'text-black-500' : 'text-gray-400'
                  }`}
                >
                  1 symbol
                </Text>
              </View>
              <View className="flex-row">
                {isValid.number && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text
                  className={`text-sm mr-5 ${
                    isValid.number ? 'text-black-500' : 'text-gray-400'
                  }`}
                >
                  1 number
                </Text>
              </View>
              <View className="flex-row">
                {isValid.match && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text
                  className={`text-sm mr-5 ${
                    isValid.match ? 'text-black-500' : 'text-gray-400'
                  }`}
                >
                  match
                </Text>
              </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              disabled={!activateButton}
              onPress={handleNext}
              className={`${
                activateButton ? 'bg-black' : 'bg-gray-400'
              } py-5 rounded-full mt-5 `}
            >
              <Text className="text-white text-center font-semibold">Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetForgottenPassword;
