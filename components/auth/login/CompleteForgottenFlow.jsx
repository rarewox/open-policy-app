import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import images from '../../../constants/images';
import { router } from 'expo-router';

const CompleteForgottenFlow = () => {
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
        onPress={() => router.push('/representative')}
      >
        <Text className="text-white text-center font-semibold">
          Continue to home
        </Text>
      </TouchableOpacity>

      {/* Log Out Link */}
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text className="text-black font-semibold">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompleteForgottenFlow;
