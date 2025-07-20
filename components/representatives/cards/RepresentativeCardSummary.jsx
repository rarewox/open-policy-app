import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { images } from '../../../constants';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';
import FallbackImage from '../../FallBackImage';

const RepresentativeCardSummary = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { setScrolledPastThreshold, data } = useRepresentativeContext();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      //   Animated.timing(fadeAnim, {
      //       toValue: 0, // Fade out
      //       duration: 0,
      //       useNativeDriver: true,
      //   }).start();
    };
  }, [fadeAnim]);
  return (
    <Animated.View
      className="bg-white rounded-lg p-4 w-full"
      style={[
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Profile Section */}
      <View className="flex-row">
        {/* Profile Image */}
        <FallbackImage
          key={data.image}
          uri={data.image}
          className="w-[144px] h-[225px] rounded-3xl"
          resizeMode="cover"
        />
        {/* Contact Information */}
        <View className="ml-5 flex-1 justify-start mt-2">
          {/* Email */}
          <View className="flex-row items-center mb-1">
            <Text className="text-3xl font-bold text-gray-900">
              {data.name}
            </Text>
          </View>
          {/* Location */}
          <View className="flex-row items-start mb-5 pr-2">
            <Text className="text-1xl text-gray-600 mt-1">{data.role}</Text>
          </View>
          {/* Phone */}
          <View className="flex-row items-center mt-5">
            <TouchableOpacity
              className="flex-row items-center bg-black px-12 py-4 rounded-full"
              onPress={() => {
                setScrolledPastThreshold(false);
              }}
            >
              <Text className="text-white font-semibold ml-2">Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Name and Description */}
      <View className="mt-4">
        {/* Bottom Border */}
        <View className="mt-2 border-b border-black" />
      </View>
    </Animated.View>
  );
};

export default RepresentativeCardSummary;
