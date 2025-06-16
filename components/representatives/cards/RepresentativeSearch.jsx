import { View, Text, Image, TextInput } from 'react-native';
import React from 'react';
import { images } from '../../../constants';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';

const RepresentativeSearch = () => {
  const {
    setStep,
    setShowRepresentativeList,
    searchParam,
    setSearchParam,
    setScreen,
  } = useRepresentativeContext();
  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-4 m-4">
      {/* Logo */}
      <Image
        source={images.logo} // Replace with your logo
        className="w-8 h-8 mr-2"
      />
      {/* Input */}
      <TextInput
        onChangeText={(text) => {
          searchBarHandler(text);
        }}
        value={searchParam}
        placeholderTextColor="#696969"
        autoCorrect={false}
        placeholder="Search by name or location..."
        className="flex-1 font-semibold"
      />
      {/* Search Icon */}
      <Image
        source={images.search} // Replace with your logo
        className="w-11 h-11"
      />
      {/* <Text className="text-gray-400 text-lg">🔍</Text> */}
    </View>
  );
};

export default RepresentativeSearch;
