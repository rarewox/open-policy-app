import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { debates } from '../../scripts/api/parliament';
import { router } from 'expo-router';
import { useAlert } from '../../context/AlertProvider';

const Debates = () => {
  const { showError } = useAlert();
  const generateLink = async (type) => {
    try {
      const response = await debates({ type: type });

      if (response.data.success) {
        router.push({
          pathname: '/webview/[url]',
          params: { url: response.data.data },
        });
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  return (
    <View className="p-6 bg-white flex-1">
      {/* Header Section */}
      <Text className="text-3xl font-bold text-black mb-2">
        The Debates of the House of Commons
      </Text>
      <Text className="text-gray-600 mb-6 leading-5">
        When Parliament is in session, every word spoken by a member is
        faithfully transcribed, and published in a document called a Hansard. We
        have the Hansards of the House of Commons dating back to 1994.
      </Text>

      <TouchableOpacity
        onPress={() => generateLink('debates_this_month')}
        className="bg-[#F2F2F2] mb-2 rounded-t-3xl py-14"
      >
        <View className="flex-row justify-between">
          <View className="px-8">
            <Text className="text-gray-400 font-normal text-2xl">Debates</Text>
            <Text className="text-black font-normal text-2xl">This Month</Text>
          </View>
          <View>
            <Image source={images.arrow_top} />
          </View>
        </View>
      </TouchableOpacity>

      <View className="flex-row justify-between gap-2">
        <TouchableOpacity
          onPress={() => generateLink('debates_past')}
          className="flex-row justify-between bg-[#F2F2F2] mb-2 rounded-bl-3xl py-16 w-[49%]"
        >
          <View className="px-5">
            <Text className="text-black font-normal text-2xl">Past</Text>
            <Text className="text-gray-400 font-normal text-2xl">Debates</Text>
          </View>
          <View>
            <Image source={images.arrow_top} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => generateLink('debates_recent')}
          className="flex-row justify-between bg-[#F2F2F2] mb-2 rounded-br-3xl py-16 w-[49%]"
        >
          <View className="px-5">
            <Text className="text-black font-normal text-2xl">Recent</Text>
            <Text className="text-gray-400 font-normal text-2xl">Debates</Text>
          </View>
          <View>
            <Image source={images.arrow_top} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Debates;
