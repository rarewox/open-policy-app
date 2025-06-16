import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRegisterContext } from '../../../context/RegisterContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ProgressBar = ({ showProgressBar }) => {
  const { step, setStep } = useRegisterContext();

  const RegisterRouting = () => {
    if (step === 1) {
      router.back();
    }
    if (step === 2) {
      setStep(1);
    }
    if (step === 3) {
      setStep(2);
    }
    if (step === 4) {
      setStep(2);
    }
    if (step === 5) {
      setStep(2);
    }
    if (step === 6) {
      setStep(5);
    }
    if (step === 7) {
      setStep(6);
    }
    if (step === 8) {
      setStep(7);
    }
  };

  const ProgressPoint = () => {
    if (step === 1 || step === 2) {
      return 'w-1/3';
    }
    if (step === 5) {
      return 'w-3/5';
    }

    if (step === 6) {
      return 'w-full';
    }
  };

  return (
    <View className="flex-row items-center mb-10">
      <TouchableOpacity className="mr-9" onPress={RegisterRouting}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      {showProgressBar && (
        <View className="h-1 w-[202px] bg-[#F0F3FA] ml-9">
          <View
            className={`h-1 bg-black 
                ${ProgressPoint()}`}
          />
        </View>
      )}
    </View>
  );
};

export default ProgressBar;
