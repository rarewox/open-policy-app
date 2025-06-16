import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { Animated, Modal, Text, TouchableOpacity, View } from 'react-native';

const CenteredModal = ({ visible, intensity, children }) => {
  const slideAnim = new Animated.Value(30); // Start off-screen

  // Animate Modal Slide Up
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      {/* Blurred Background */}
      <BlurView
        intensity={intensity}
        // onMagicTap={() => set}
        className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-gray-500"
      />

      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-black opacity-80" />

      {/* Swipe Up Modal Animation */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
        className="flex-1 justify-center items-center px-6"
      >
        <View className="bg-white w-full max-w-xs p-6 rounded-3xl shadow-lg">
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default CenteredModal;
