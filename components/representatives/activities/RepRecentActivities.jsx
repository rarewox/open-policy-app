import { View, Text, Animated, TouchableOpacity, Linking } from 'react-native';
import React, { useRef, useState } from 'react';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { activity_link } from '../../../scripts/api/representative';
import { router } from 'expo-router';
import { useAlert } from '../../../context/AlertProvider';

const RepRecentActivities = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const {
    screen,
    setScreen,
    setScrolledPastThreshold,
    setShowSearchBar,
    data,
  } = useRepresentativeContext();

  const [viewIssue, setViewIssue] = useState(false);
  const { showError } = useAlert();

  const generateLink = async (link) => {
    try {
      const response = await activity_link({ link: link });

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
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        setScrolledPastThreshold(scrollOffset > 1); // Switch logic at 150px
      },
    },
  );
  return (
    <Animated.FlatList
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 120 }}
      data={!viewIssue ? data.issues?.slice(0, 5) || [] : data.issues || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            router.push('/issues/' + item.id);
          }}
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
              className="text-gray-500 pr-20 mt-3 leading-relaxed"
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
      )}
      ListHeaderComponent={() => (
        <View className="px-2">
          <View className="p-4">
            <Text className="text-2xl font-bold mb-3">Recent Activities</Text>
            {/* <Text className="text-gray-600 mb-2 leading-relaxed">
              Nunc sed blandit libero volutpat sed cras ornare. Mauris a diam
            </Text> */}

            {(data.house_activity || []).map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  generateLink(item.link);
                }}
                key={index}
                className="flex-row items-start mb-2"
              >
                <View className="w-2 h-2 bg-gray-500 rounded-full mr-2 mt-[6px]" />
                <Text className="text-gray-600 leading-relaxed flex-1">
                  {item.info}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="p-4">
            <Text className="text-2xl font-bold mb-3">Voting Activities</Text>
            {/* <Text className="text-gray-600 mb-2 leading-relaxed">
              Nunc sed blandit libero volutpat sed cras ornare. Mauris a diam
            </Text> */}

            {(data.vote_activity || []).map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  generateLink(item.link);
                }}
                key={index}
                className="flex-row items-start mb-2"
              >
                <View className="w-2 h-2 bg-gray-500 rounded-full mr-2 mt-[6px]" />
                <Text className="text-gray-600 leading-relaxed flex-1">
                  {item.info}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {data.issues?.length > 0 && (
            <View className="p-4">
              <View className="flex-row justify-between">
                <View className="justify-center items-center">
                  <Text className="text-2xl font-bold mb-3">Issues Raised</Text>
                </View>
                {!viewIssue && data.issues?.length > 5 && (
                  <TouchableOpacity
                    className="mr-1 flex-row"
                    onPress={() => {
                      setViewIssue(true);
                    }}
                  >
                    <Text className="mt-1 text-gray-500">View More</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

export default RepRecentActivities;
