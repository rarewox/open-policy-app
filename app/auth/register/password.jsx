import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../../constants';
import { useRegisterContext } from '../../../context/RegisterContext';
import { register } from '../../../scripts/api/auth';
import { storeToken } from '../../../scripts/utils/storage';
import { router } from 'expo-router';
import { useGlobalContext } from '../../../context/GlobalContextProvider';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';
import { useAlert } from '../../../context/AlertProvider';

const PasswordSetup = () => {
  const {
    firstName,
    secondName,
    email,
    phone,
    postalCode,
    password,
    setPassword,
  } = useRegisterContext();
  const { setUser } = useGlobalContext();
  const { setYourRepresentative, setShowRepresentative, setData } =
    useRepresentativeContext();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activateButton, setActivateButton] = useState(false);
  const { showError, showSuccess } = useAlert();
  const [isValid, setIsValid] = useState({
    length: false,
    number: false,
    symbol: false,
    match: false,
  });

  // Password validation rules
  const validatePassword = (pass, confirmpass) => {
    setIsValid({
      length: pass.length >= 8,
      number: /\d/.test(pass),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      match: pass != '' && pass == confirmpass,
    });

    // setActivateButton(isValid.length && isValid.number && isValid.symbol && isValid.match)
  };

  const handleNext = async () => {
    if (
      isValid.length &&
      isValid.number &&
      isValid.symbol &&
      password === confirmPassword
    ) {
      try {
        setActivateButton(false);
        const response = await register({
          first_name: firstName,
          last_name: secondName,
          email: email,
          phone: phone,
          postal_code: postalCode,
          password: password,
          password_confirmation: confirmPassword,
        });

        if (response.data.success) {
          storeToken(response.data.token);
          setUser(response.data.user);
          setYourRepresentative(response.data.representative);
          setData(response.data.representative);
          setShowRepresentative(true);
        }
        showSuccess(response.data.message);
        setActivateButton(true);
        router.replace('/auth/register/welcome');
      } catch (error) {
        setActivateButton(true);
        showError(error.response?.data?.message || error.message);
      }
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
        <View className="flex-1 px-6 pt-8">
          <View className="flex-row items-center mb-10">
            <TouchableOpacity className="mr-9" onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            {/* <View className="h-1 w-[202px] bg-[#F0F3FA] ml-9"> */}
            <View className="h-1 w-[80%] bg-[#F0F3FA]">
              <View className={`h-1 bg-black w-full`} />
            </View>
          </View>
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
              One last step
            </Text>

            {/* Create Password */}
            <Text className="text-gray-500 mt-10 mb-7">Create Password</Text>
            <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-4">
              <TextInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validatePassword(text, '');
                }}
                // placeholder="Enter your password"
                className="flex-1 py-2 h-12 text-2xl"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={'#B4B4B4'}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text className="text-gray-500 mt-10 mb-7">Confirm Password</Text>
            <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-8">
              <TextInput
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  validatePassword(password, text);
                }}
                // placeholder="Re-enter your password"
                className="flex-1 py-2 h-10 text-2xl"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={'#B4B4B4'}
                />
              </TouchableOpacity>
            </View>

            {/* Validation */}
            <View className="mb-8 flex-row items-center justify-center mt-5">
              <View className="flex-row">
                {isValid.length && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text className="text-sm mr-5 text-[#B4B4B4]">
                  8 characters
                </Text>
              </View>
              <View className="flex-row">
                {isValid.symbol && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text className="text-sm mr-5 text-[#B4B4B4]">1 symbol</Text>
              </View>
              <View className="flex-row">
                {isValid.number && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text className="text-sm mr-5 text-[#B4B4B4]">1 number</Text>
              </View>

              <View className="flex-row">
                {isValid.match && (
                  <Image source={images.check} resizeMode="contain" />
                )}
                <Text className="text-sm mr-5 text-[#B4B4B4]">match</Text>
              </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              disabled={!activateButton}
              onPress={handleNext}
              className={`${
                activateButton ? 'bg-black' : 'bg-[#E7E7E7]'
              } py-5 rounded-full mt-5 `}
            >
              <Text className="text-white text-center font-semibold">Next</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordSetup;
