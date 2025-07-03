import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { router } from 'expo-router';
import SwipeUpModal from '../../components/SwipeUpModal';
import CenteredModal from '../../components/CenteredModal';
import { change_password } from '../../scripts/api/profile';
import { useAlert } from '../../context/AlertProvider';

const PasswordSetting = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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

  const changePassword = async () => {
    try {
      const response = await change_password({
        old_password: oldPassword,
        password: password,
        password_confirmation: confirmPassword,
      });

      if (response.data.success) {
        showSuccess(response.data.message);
        setModalVisible(false);
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        setIsValid({
          length: false,
          number: false,
          symbol: false,
          match: false,
        });
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

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

  const handleNext = () => {
    if (
      isValid.length &&
      isValid.number &&
      isValid.symbol &&
      oldPassword.length > 0 &&
      password === confirmPassword
    ) {
      setModalVisible(true);
      showSuccess('Password set successfully!');
    } else {
      showError('Passwords do not match or requirements are not met.');
    }
  };

  useEffect(() => {
    setActivateButton(
      isValid.length &&
        isValid.number &&
        isValid.symbol &&
        isValid.match &&
        oldPassword.length > 0,
    );
  }, [confirmPassword]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 bg-white flex-1">
        <View className="flex-row items-center mb-7">
          <TouchableOpacity
            className="mr-9"
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className=""></View>
        </View>
        <Text className="text-4xl font-normal mb-10">Password Setting</Text>
        <Text className="text-gray-500 mt-10 mb-7">Old Password</Text>
        <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-4">
          <TextInput
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={(text) => {
              setOldPassword(text);
            }}
            placeholder="Enter your password"
            className="flex-1 py-2 h-12"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 mt-10 mb-7">New Password</Text>
        <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-4">
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text, '');
            }}
            placeholder="Enter your password"
            className="flex-1 py-2 h-12"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} />
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
            placeholder="Re-enter your password"
            className="flex-1 py-2 h-10"
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
        <View className="mb-8 flex-row items-center justify-center mt-10">
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
          } py-5 rounded-full mt-10 `}
        >
          <Text className="text-white text-center font-semibold">
            Save Password
          </Text>
        </TouchableOpacity>
      </View>
      <CenteredModal visible={modalVisible} intensity={30}>
        <>
          {/* Modal Content */}
          <Text className="text-xl font-bold text-center mb-2">
            Save Password?
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Are you sure you want to change password? To confirm, click confirm.
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-black py-4 rounded-full mb-8 "
            onPress={() => changePassword()}
          >
            <Text className="text-white text-center font-semibold">
              Confirm
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="mx-20"
          >
            <Text className="text-center text-black font-semibold">Cancel</Text>
          </TouchableOpacity>
        </>
      </CenteredModal>
    </SafeAreaView>
  );
};

export default PasswordSetting;
