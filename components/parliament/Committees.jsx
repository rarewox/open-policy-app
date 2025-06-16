import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { committee } from '../../scripts/api/parliament';
import { router } from 'expo-router';
import { useAlert } from '../../context/AlertProvider';

const Committees = () => {
  const { showError } = useAlert();
  const generateLink = async (type) => {
    try {
      const response = await committee({ type: type });

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
    <View className="p-6 bg-white flex-1 mt-4">
      {/* Header Section */}
      <Text className="text-3xl font-bold text-black mb-2">
        House Committees
      </Text>
      <Text className="text-gray-600 mb-6 leading-5">
        Committees are where Parliament examines issues in detail and reviews
        bills before they become law. Browse recent committee reports and
        proceedings below, or use the search box above to find specific topics.
      </Text>

      <View className="flex-row justify-between mt-7 gap-2">
        <TouchableOpacity
          onPress={() => generateLink('current_committees')}
          className="bg-[#F2F2F2] mb-4 rounded-l-2xl pb-2 w-[49%]"
        >
          <View className="flex-row justify-end py-6">
            <Image source={images.arrow_top} />
          </View>
          <View className="px-4 py-6">
            <Text className="text-black font-normal text-2xl">Current</Text>
            <Text className="text-gray-400 font-normal text-2xl">
              Committees
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => generateLink('recent_studies')}
          className="bg-[#F2F2F2] mb-4 rounded-r-2xl pb-2 w-[49%]"
        >
          <View className="flex-row justify-end py-6">
            <Image source={images.arrow_top} />
          </View>
          <View className="px-4 py-6">
            <Text className="text-black font-normal text-2xl">Recent</Text>
            <Text className="text-gray-400 font-normal text-2xl">Studies</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Committees;
