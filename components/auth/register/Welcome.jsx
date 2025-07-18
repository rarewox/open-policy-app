import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../../constants/images';
import { router } from 'expo-router';

const Welcome = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex-1 bg-white px-6 pt-12">
          {/* Logo */}
          <View className="flex-row justify-center items-center">
            <Image
              source={images.logo}
              className="w-[70px] h-[70px]"
              resizeMode="contain"
            />
            <Text className="text-4xl w-30 h-22 ml-1">OpenPolicy</Text>
          </View>

          {/* Onboarding Items */}
          <View className="mb-12 space-y-6 mt-10 border-red-600">
            <View className="flex-row items-center space-x-4 h-[100px] w-[350px]">
              <Image
                source={images.calendar}
                className="mr-4 h-[35px] w-[35px]"
                resizeMode="contain"
              />
              <Text className="text-[#000000] text-xl w-[90%]">
                Be informed about plenary and committee meetings at the Canadian
                Parliament.
              </Text>
            </View>

            <View className="items-center">
              <View className="h-1 w-[400px] bg-gray-100 mt-3">
                <View className="h-1 bg-gray w-4/4" />
              </View>
            </View>

            <View className="flex-row items-center space-x-4 h-[100px] w-[350px]">
              <Image
                source={images.like}
                className="mr-4 h-[35px] w-[35px]"
                resizeMode="contain"
              />
              <Text className="text-[#000000] text-xl w-[90%]">
                Make your voice known by voting bills.
              </Text>
            </View>

            <View className="items-center">
              <View className="h-1 w-[400px] bg-gray-100 mt-3">
                <View className="h-1 bg-gray w-4/4" />
              </View>
            </View>

            <View className="flex-row items-center space-x-4 h-[100px] w-[350px] mt-4 mb-2">
              <Image
                source={images.document}
                className="mr-4 h-[35px] w-[35px]"
                resizeMode="contain"
              />
              <Text className="text-[#000000] text-xl w-[90%]">
                Access the most relevant documents recently published by the
                Canadian Parliament.
              </Text>
            </View>
            <View className="items-center">
              <View className="h-1 w-[400px] bg-gray-100 mt-3">
                <View className="h-1 bg-gray w-4/4" />
              </View>
            </View>

            <View className="flex-row items-center space-x-4 h-[100px] w-[350px] mt-2">
              <Image
                source={images.users}
                className="mr-4 h-[35px] w-[35px]"
                resizeMode="contain"
              />
              <Text className="text-[#000000] text-xl w-[90%]">
                Find specific MPs and get their contact details.
              </Text>
            </View>
          </View>

          {/* Explore Now */}
          <TouchableOpacity
            className="bg-black py-5 rounded-full mt-5"
            onPress={() => router.push('/parliament')}
          >
            <Text className="text-white text-center font-semibold">
              Explore Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
