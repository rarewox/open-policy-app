import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import WebView from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const WebViewUrl = () => {
  const { url } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          className="ml-3 flex-row items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text className="text-xl font-bold ml-1">Go back</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center bg-white z-10">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-2 text-gray-600">Loading...</Text>
        </View>
      )}

      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </SafeAreaView>
  );
};

export default WebViewUrl;
