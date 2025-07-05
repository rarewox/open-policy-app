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
import { change_postal_code } from '../../scripts/api/profile';
import { useGlobalContext } from '../../context/GlobalContextProvider';
import { useRepresentativeContext } from '../../context/RepresentativeContext';
import { useAlert } from '../../context/AlertProvider';

const ChangePostalCode = () => {
  const { user, setUser } = useGlobalContext();
  const { setYourRepresentative, setData } = useRepresentativeContext();
  const [postalCode, setPostalCode] = useState(user.postal_code);
  const [modalVisible, setModalVisible] = useState(false);
  const [activateButton, setActivateButton] = useState(false);
  const [isValid, setIsValid] = useState({
    length: false,
  });
  const { showError, showSuccess } = useAlert();

  const changePostalCode = async () => {
    try {
      const response = await change_postal_code({
        postal_code: postalCode,
      });

      if (response.data.success) {
        setYourRepresentative(response.data.data);
        setData(response.data.data);
        setUser(response.data.user);
        setActivateButton(false);
        setModalVisible(false);
        showSuccess(response.data.message);
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  // Password validation rules
  const validateText = (text) => {
    setIsValid({
      length: text.length >= 4,
    });
  };

  const handleNext = () => {
    if (isValid.length) {
      setModalVisible(true);
      // showSuccess('Password set successfully!');
    } else {
      // showError('Passwords do not match or requirements are not met.');
    }
  };

  useEffect(() => {
    setActivateButton(isValid.length);
  }, [postalCode]);
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
        <Text className="text-4xl font-normal mb-10">Postal Code</Text>

        <Text className="text-gray-500 mt-10 mb-7">Postal Code</Text>
        <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-4">
          <TextInput
            value={postalCode}
            onChangeText={(text) => {
              setPostalCode(text);
              validateText(text);
            }}
            placeholder="Enter your new postal code"
            className="flex-1 py-2 h-12"
          />
          {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} />
          </TouchableOpacity> */}
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
            Save Postal Code
          </Text>
        </TouchableOpacity>
      </View>
      <CenteredModal visible={modalVisible} intensity={30}>
        <>
          {/* Modal Content */}
          <Text className="text-3xl font-medium text-center mb-2">
            Save Postal Code?
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Are you sure you want to update your postal code
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-black py-4 rounded-full mb-4 "
            onPress={() => changePostalCode()}
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

export default ChangePostalCode;
