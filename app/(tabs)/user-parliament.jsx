import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { router } from 'expo-router';
import Bills from '../../components/parliament/Bills';
import Debates from '../../components/parliament/Debates';
import Committees from '../../components/parliament/Committees';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const tabCount = 3;
const tabWidth = screenWidth / tabCount;
const indicatorWidth = tabWidth * 0.4; // 40% of the tab width

const TabNavigation = () => {
  const [state, setState] = useState('Bills');

  const getTabIndex = () => {
    switch (state) {
      case 'Bills':
        return 0;
      case 'Debates':
        return 1;
      case 'Committees':
        return 2;
      default:
        return 0;
    }
  };

  const indicatorLeft =
    getTabIndex() * tabWidth + (tabWidth - indicatorWidth) / 2;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Tab Buttons */}
      <View className="flex-row bg-white py-4 mx-10">
        <TouchableOpacity
          onPress={() => setState('Bills')}
          className="flex-1 items-center"
        >
          <Image
            source={
              state === 'Bills'
                ? images.pal_bil_active
                : images.pal_bill_inactive
            }
          />
          <Text
            className={`mt-1 text-sm ${
              state === 'Bills' ? 'text-black font-semibold' : 'text-gray-400'
            }`}
          >
            Bills
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setState('Debates')}
          className="flex-1 items-center mx-16"
        >
          <Image
            source={
              state === 'Debates'
                ? images.pal_debate_active
                : images.pal_debate_inactive
            }
          />
          <Text
            className={`mt-1 text-sm ${
              state === 'Debates' ? 'text-black font-semibold' : 'text-gray-400'
            }`}
          >
            Debates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setState('Committees')}
          className="flex-1 items-center"
        >
          <Image
            source={
              state === 'Committees'
                ? images.pal_com_active
                : images.pal_com_inactive
            }
          />
          <Text
            numberOfLines={1}
            className={`mt-1 text-sm ${
              state === 'Committees'
                ? 'text-black font-semibold'
                : 'text-gray-400'
            }`}
          >
            Committees
          </Text>
        </TouchableOpacity>
      </View>

      {/* Responsive Black Indicator */}
      <View style={{ position: 'relative', height: 2 }}>
        <View
          style={{
            position: 'absolute',
            left: indicatorLeft,
            width: indicatorWidth,
            height: 2,
            backgroundColor: 'black',
          }}
        />
      </View>

      <View className="border-b border-gray-200 mb-3" />

      {/* Conditional Content */}
      {state === 'Bills' && <Bills />}
      {state === 'Debates' && <Debates />}
      {state === 'Committees' && <Committees />}
    </SafeAreaView>
  );
};

export default TabNavigation;
