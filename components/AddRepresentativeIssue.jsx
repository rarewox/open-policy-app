import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  Easing,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { images } from '../constants';
import { router } from 'expo-router';

const AddRepresentativeIssue = () => {
  const [openIssue, setOpenIssue] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity animation
  const translateYAnim = useRef(new Animated.Value(20)).current; // Slide-up effect

  const toggleRotation = () => {
    setOpenIssue(!openIssue);
    Animated.timing(rotateAnim, {
      toValue: openIssue ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (!openIssue) {
      // Opening animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View className="absolute bottom-40 right-3 items-end">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        }}
        className="flex-row justify-end"
      >
        <Text className="text-center bg-[#F3F3F3] p-4 mb-4 mr-2 rounded-3xl">
          Create Issue
        </Text>
        <TouchableOpacity
          className="bg-[#FFFFFF] p-4 mb-4 mr-2 rounded-full shadow-lg"
          onPress={() => router.push('/issues/add')}
        >
          <Image source={images.edit} />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        onPress={toggleRotation}
        className="bg-[#222222] p-5 rounded-full shadow-lg"
      >
        <Animated.Image
          source={images.plus}
          style={{ transform: [{ rotate: rotateInterpolate }] }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AddRepresentativeIssue;
