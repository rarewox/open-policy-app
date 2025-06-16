import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterContext } from '../../../context/RegisterContext';
import { Link, router } from 'expo-router';
import { login } from '../../../scripts/api/auth';
import { storeToken } from '../../../scripts/utils/storage';
import { useAlert } from '../../../context/AlertProvider';

const Login = () => {
  const { setLoginStep } = useRegisterContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activateButton, setActivateButton] = useState(false);
  const { showError, showSuccess } = useAlert();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const authenticateUser = async () => {
    try {
      const response = await login({
        email: email,
        password: password,
      });

      if (response.data.success) {
        storeToken(response.data.token);
        router.replace('/parliament');
      }
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  useEffect(() => {
    setActivateButton(email.length > 0 && password.length > 0);
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim, email, password]);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
            },
          ]}
          className=" bg-white px-4 mt-10"
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color="black"
              className="mb-10"
            />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-3xl font-semibold mb-5">Log in</Text>
        </Animated.View>
        <View className="flex-1 bg-white px-6 pt-12">
          {/* Back Button */}

          {/* Email Input */}
          <View className="mb-6 mt-6">
            <Text className="text-gray-500 mb-2">Your Email</Text>
            <TextInput
              className="border-b border-gray-300 text-black py-2 font-semibold text-xl"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              placeholderTextColor="#A0A0A0"
            />
          </View>

          {/* Password Input */}
          <View className="mb-10 mt-10">
            <Text className="text-gray-500 mb-2">Password</Text>
            <View className="flex-row items-center justify-between border-b border-gray-300">
              <TextInput
                className="text-black py-2 flex-1 font-semibold text-xl"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#A0A0A0"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            className="mb-10 mt-7"
            onPress={() => setLoginStep(2)}
          >
            <Text className="text-blue-500 text-right">Forgot password?</Text>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity
            disabled={!activateButton}
            onPress={() => authenticateUser()}
            className={`${
              activateButton ? 'bg-black' : 'bg-gray-400'
            } rounded-full py-5 mb-10`}
          >
            <Text className="text-white text-center font-semibold">Log in</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <Text className="text-gray-500 text-center mb-10">
            {/* Or continue with social account */}
          </Text>
          <View className="flex-row justify-around mb-10">
            {/* <TouchableOpacity className="border border-black-100 rounded-full px-4 py-2 flex-row items-center">
                    <Image
                        source={images.apple}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-black font-semibold">Apple</Text>
                    </TouchableOpacity>
        
                    <TouchableOpacity className="border border-black-100 rounded-full px-4 py-2 flex-row items-center">
                    <Image
                        source={images.google}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-black font-semibold">Google</Text>
                    </TouchableOpacity>
        
                    <TouchableOpacity className="border border-black-100 rounded-full px-4 py-2 flex-row items-center">
                    <Image
                        source={images.facebook}
                        className="w-6 h-6 mr-2"
                    />
                    <Text className="text-black font-semibold">Facebook</Text>
                    </TouchableOpacity> */}
          </View>

          {/* Create Account */}
          <View className="flex-row justify-center items-center mt-4 h-[160px]">
            <Link className="font-bold text-center" href="/sign-up">
              Create Account
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
