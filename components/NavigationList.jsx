import { View, Text, Animated, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import tabs from '../constants/tabs';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const NavigationList = ({ isFocused, route, onPress, label }) => {
  return (
    <AnimatedTouchableOpacity
      layout={LinearTransition.springify().mass(0.5)}
      disabled={isFocused}
      key={route.key}
      onPress={onPress}
      className={`${
        isFocused
          ? 'flex-row items-center bg-[#222222] px-8 py-2 rounded-full'
          : 'bg-transparent p-2'
      }`}
    >
      {getIconByRouteName(route.name, isFocused)}
      {isFocused && (
        <Animated.Text
          className="text-white font-semibold ml-2"
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          {label}
        </Animated.Text>
      )}
    </AnimatedTouchableOpacity>
  );

  function getIconByRouteName(routeName, isFocused) {
    if (routeName === 'user-representative') {
      if (isFocused) {
        return <Image source={tabs.rep_nav_white} resizeMode="contain" />;
      }
      return <Image source={tabs.rep_nav_black} resizeMode="contain" />;
    }

    if (routeName === 'user-parliament') {
      if (isFocused) {
        return <Image source={tabs.pal_nav_white} resizeMode="contain" />;
      }
      return <Image source={tabs.pal_nav_black} resizeMode="contain" />;
    }

    if (routeName === 'user-profile') {
      if (isFocused) {
        return <Image source={tabs.profile_nav_white} resizeMode="contain" />;
      }
      return <Image source={tabs.profile_nav_black} resizeMode="contain" />;
    }
  }
};

export default NavigationList;
