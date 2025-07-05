import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterContext } from '../../../context/RegisterContext';
import { router } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { check_phone_postal } from '../../../scripts/api/auth';
import { useAlert } from '../../../context/AlertProvider';

const RegistrationNumberSetUp = () => {
  const { phone, setPhone, postalCode, setPostalCode, isChecked, setChecked } =
    useRegisterContext();
  const [activateButton, setActivateButton] = useState(false);
  const { showError, showSuccess } = useAlert();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const checkButtonState = () => {
    setActivateButton(isChecked && phone !== '' && postalCode !== '');
  };

  const handleNextButtonPress = async () => {
    try {
      setActivateButton(false);
      const response = await check_phone_postal({
        phone: phone,
        postal_code: postalCode,
      });

      if (response.data.success) {
        showSuccess(response.data.message);
        router.push('/auth/register/otp');
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    } finally {
      setActivateButton(true);
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
  }, [fadeAnim, isChecked]);

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
              <View className={`h-1 bg-black w-1/3`} />
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
              Almost there!
            </Text>

            {/* Form */}
            <View className="space-y-6 mt-10 mb-7">
              {/* Phone Number */}
              <View className="mb-8">
                <Text className="text-custom-text-label mb-1">
                  Your Phone Number
                </Text>
                <TextInput
                  value={phone}
                  keyboardType="number-pad"
                  className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
                  onChangeText={(text) => {
                    setPhone(text);
                    checkButtonState();
                  }}
                />
              </View>

              {/* Postal Code */}
              <View className="mb-8">
                <View className="flex-row justify-start items-center">
                  <Text className="text-custom-text-label mb-1">
                    Postal Code
                  </Text>
                  <Ionicons
                    name="information-circle"
                    size={16}
                    color="gray"
                    className="ml-2"
                  />
                </View>
                <TextInput
                  value={postalCode}
                  className="border-b border-custom-grey text-custom-black py-2 font-semibold text-xl"
                  onChangeText={(text) => {
                    setPostalCode(text);
                    checkButtonState();
                  }}
                />
              </View>
            </View>

            {/* Terms and Conditions */}
            <View className="flex-row w-[80%] items-center mt-8 space-x-2 mb-5">
              <Checkbox
                color={'#222222'}
                className="mr-3"
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text className="text-custom-black">
                By continuing, you agree to OpenPolicy’s{' '}
                <Text
                  className="text-custom-black underline"
                  onPress={() => router.push('/disclosures/terms-of-service')}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  className="text-custom-black underline"
                  onPress={() => router.push('/disclosures/privacy-policy')}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              disabled={!activateButton}
              className={`mt-10 rounded-full py-4 ${
                activateButton ? 'bg-custom-black' : 'bg-custom-button-disabled'
              }`}
              onPress={handleNextButtonPress}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Next
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationNumberSetUp;
