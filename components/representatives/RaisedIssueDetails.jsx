import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React from 'react';
import images from '../../constants/images';

const billData = [
  { id: '1', title: 'Sponsor:', value: 'Chrystie Logos (Liberal)' },
  {
    id: '2',
    title: 'Status:',
    value:
      'This bill has received Royal Assent and is, or will soon become, law.',
  },
  {
    id: '3',
    title: 'Summary:',
    value:
      'This enactment amends the Excise Tax Act in order to implement a temporary GST/HST holiday between December 14, 2024 and February 15, 2025 inclusively in respect of certain taxable supplies.This enactment amends the Excise Tax Act in order to implement a temporary GST/HST holiday between December 14, 2024 and February 15, 2025 inclusively in respect of certain taxable supplies.This enactment amends the Excise Tax Act in order to implement a temporary GST/HST holiday between December 14, 2024 and February 15, 2025 inclusively in respect of certain taxable supplies.This enactment amends the Excise Tax Act in order to implement a temporary GST/HST holiday between December 14, 2024 and February 15, 2025 inclusively in respect of certain taxable supplies.This enactment amends the Excise Tax Act in order to implement a temporary GST/HST holiday between December 14, 2024 and February 15, 2025 inclusively in respect of certain taxable supplies.This enactment amends the Excise Tax Act in order to implement a temporary GST/HST holiday between December 14, 2024 and February 15, 2025 inclusively in respect of certain taxable supplies.',
  },
];

const RaisedIssueDetails = () => {
  return (
    <View className="p-6 bg-gray-50 flex-1">
      {/* Header Section */}
      <View className=" mb-3 flex-row justify-between">
        <Text className="text-3xl font-base">Species at Risk Act (SARA)</Text>

        <Image
          source={images.bookmark}
          className="w-6 h-6 mt-2"
          resizeMode="contain"
        />
      </View>

      <Text className="text-sm text-gray-400 mb-6">
        Outside order precedence
      </Text>

      {/* Action Buttons */}
      <View className="flex-row space-x-4 mb-2 justify-between">
        <TouchableOpacity className="px-4 py-2 rounded-lg">
          <View className=" flex-row justify-between">
            <Image
              source={images.ai}
              className="w-6 h-6 mr-1"
              resizeMode="contain"
            />
            <Text className="font-semibold">Talk to AI</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="px-4 py-2 rounded-lg">
          <View className=" flex-row justify-between">
            <Image
              source={images.download}
              className="w-6 h-6 mr-2"
              resizeMode="contain"
            />
            <Text className="font-semibold">Download</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="px-4 py-2 rounded-lg">
          <View className=" flex-row justify-between">
            <Image
              source={images.share}
              className="w-6 h-6 mr-2"
              resizeMode="contain"
            />
            <Text className="font-semibold">Share</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <View className="mt-2 border-b-2 border-black" />
      </View>

      <FlatList
        data={billData}
        renderItem={({ item }) => (
          <View className="my-4">
            <Text className="font-bold text-gray-700 leading-relaxed">
              {item.title}{' '}
              <Text className="text-gray-500 font-normal leading-relaxed">
                {item.value}
              </Text>
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => (
          <View className="mt-2 mb-6 p-4 bg-gray-100 rounded-t-3xl">
            <Text className="text-xl font-semibold mb-8">
              Your Voice Matters
            </Text>
            <Text className="text-gray-700 mb-8">
              Do you support or oppose this bill?
            </Text>
            <TouchableOpacity className="px-4 py-2 bg-white rounded-2xl mb-3">
              <Text className="text-black font-semibold text-center">
                I support the bill
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="px-4 py-2 bg-white rounded-2xl">
              <Text className="text-black font-semibold text-center">
                I oppose this bill
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default RaisedIssueDetails;
