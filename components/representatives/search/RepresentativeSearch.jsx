import { View, Text, Image } from 'react-native';
import React from 'react';
import { images } from '../../../constants';

const RepresentativeSearch = ({ type }) => {
  return (
    <View className="items-center justify-center mb-8 h-[620px]">
      {type === 'search' && (
        <Image source={images.search_system} className="mb-8" />
      )}

      {type === 'not_found' && (
        <Image source={images.search_system} className="mb-8" />
      )}

      {type === 'server_error' && (
        <Image source={images.search_system} className="mb-8" />
      )}

      {type === 'no_internet' && (
        <Image source={images.search_system} className="mb-8" />
      )}

      <Text className="text-2xl font-bold mb-3 text-black">
        {type === 'search' && 'No Result Available'}
        {type === 'not_found' && 'No Result Found!'}
        {type === 'server_error' && 'Server Error'}
        {type === 'no_internet' && 'No Internet'}
      </Text>
      <Text className="text-gray-500 text-center mb-8 px-8">
        {type === 'search' &&
          'Type in a keyword to search for a representative.'}
        {type === 'not_found' && 'Please try searching for something else.'}
        {type === 'server_error' &&
          'Our server is experiencing a slight glitch. Please try again.'}
        {type === 'no_internet' &&
          'Your device is currently not connected to the internet.'}
      </Text>
    </View>
  );
};

export default RepresentativeSearch;
