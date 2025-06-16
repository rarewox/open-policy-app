import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const IssueCard = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="py-4 pl-4 flex-row justify-between items-center mx-4 mb-10 bg-white rounded-3xl border border-gray-300"
      style={{
        elevation: 10, // Stronger elevation for Android
        borderWidth: 0.5, // Ensure a visible border
        borderColor: '#FFFFFF', // Light gray border for a subtle definition
        boxShadow: '2px 19px 20px 10px #0000000D',
      }}
    >
      <View className="flex-1 ">
        <Text className="text-gray-500 font-base mb-1 mt-2 text-sm">
          {dayjs(item.date).format('YYYY-MM-DD')}
        </Text>
        <Text className="text-black font-semibold text-xl mt-2">
          {item.name}
        </Text>
        <Text
          className="text-gray-500 pr-20 mt-3 leading-relaxed "
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {item.summary}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color="black"
        className="mr-4"
      />
    </TouchableOpacity>
  );
});

export default IssueCard;
