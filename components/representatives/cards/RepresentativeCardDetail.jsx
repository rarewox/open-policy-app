import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { images } from '../../../constants';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';
import FallbackImage from '../../FallBackImage';

const RepresentativeCardDetail = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { data } = useRepresentativeContext();

  const handleEmailPress = () => {
    if (data.email) {
      Linking.openURL(`mailto:${data.email}`);
    }
  };

  const handleLocationPress = () => {
    if (data.office) {
      const query = encodeURIComponent(data.office);

      let url = '';
      if (Platform.OS === 'ios') {
        url = `http://maps.apple.com/?q=${query}`;
      } else {
        url = `geo:0,0?q=${query}`;
      }

      Linking.openURL(url).catch((err) => {
        console.error('Failed to open map:', err);
        // Optional fallback to Google Maps in browser
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
        );
      });
    }
  };

  const handlePhonePress = () => {
    if (data.phone) {
      Linking.openURL(`tel:${data.phone}`);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      // Animated.timing(fadeAnim, {
      //     toValue: 0, // Fade out
      //     duration: 0,
      //     useNativeDriver: true,
      // }).start();
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
        {/* <Image
          source={{ uri: data.image }}
          className="w-[144px] h-[225px] rounded-3xl "
          resizeMode="cover"
        /> */}
        <FallbackImage
          key={data.image}
          uri={data.image}
          className="w-[144px] h-[225px] rounded-3xl"
          resizeMode="cover"
        />
        {/* Contact Information */}
        <View className="ml-6 flex-1 justify-start">
          {/* Email */}
          <TouchableOpacity
            className="flex-row items-center mb-5"
            onPress={handleEmailPress}
          >
            <Image source={images.email} />
            <Text className="ml-2 text-gray-600 flex-shrink">{data.email}</Text>
          </TouchableOpacity>

          {/* Location */}
          <TouchableOpacity
            className="flex-row items-start mb-5 pr-10"
            onPress={handleLocationPress}
          >
            <Image source={images.location} />
            <Text className="ml-2 text-gray-600 flex-shrink">
              {data.office}
            </Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={handlePhonePress}
          >
            <Image source={images.phone} />
            <Text className="ml-2 text-gray-600">{data.phone}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Name and Description */}
      <View className="mt-4">
        <Text className="text-2xl font-bold text-gray-900">{data.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{data.role}.</Text>
        {/* Bottom Border */}
        <View className="mt-2 border-b border-black" />
      </View>
    </Animated.View>
  );
};

export default RepresentativeCardDetail;
