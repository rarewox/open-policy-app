import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import images from '../../../constants/images';
import { router } from 'expo-router';
import { removeToken } from '../../../scripts/utils/storage';
import { useGlobalContext } from '../../../context/GlobalContextProvider';
import { useAlert } from '../../../context/AlertProvider';
import { logout } from '../../../scripts/api/auth';

const CompleteForgottenFlow = () => {
  const { setUser } = useGlobalContext();
  const { showError, showSuccess } = useAlert();

  const logoutUser = async () => {
    try {
      const response = await logout();

      if (response.data.success) {
        await removeToken();
        setUser(null);
        showSuccess(response.data.message);
        router.push('/');
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Checkmark Icon */}
      <View className="items-center justify-center mb-8 h-[620px]">
        <Image source={images.success} className="mb-8" />

        {/* Success Message */}
        <Text className="text-lg font-bold mb-2 text-black">
          Reset successful
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Your password has been changed.
        </Text>
      </View>

      {/* Continue to Home Button */}
      <TouchableOpacity
        className="bg-black rounded-full w-full py-5 mb-4"
        onPress={() => router.push('/user-parliament')}
      >
        <Text className="text-white text-center font-semibold">
          Continue to home
        </Text>
      </TouchableOpacity>

      {/* Log Out Link */}
      <TouchableOpacity onPress={logoutUser}>
        <Text className="text-black font-semibold">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompleteForgottenFlow;
