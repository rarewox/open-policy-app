import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { navigation } from '../constants';
import { useGlobalContext } from '../context/GlobalContextProvider';
import { router } from 'expo-router';

const Footer = ({ screen }) => {
  const { footer, setFooter } = useGlobalContext();
  return (
    <>
      <View className="mt-10 bg-transparent "></View>
      <View className="absolute bottom-6 left-12 right-12 bg-transparent">
        <View className="flex-row justify-around items-center bg-[#F3F3F3] py-2 rounded-full mt-2 ">
          {footer === 'representative' ? (
            <TouchableOpacity
              className="flex-row items-center bg-[#222222] px-8 py-2 rounded-full"
              disabled={true}
            >
              <Image source={navigation.rep_nav_white} resizeMode="contain" />
              <Text className="text-white font-semibold ml-2">
                Representatives
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-transparent p-2"
              onPress={() => {
                setFooter('representative');
                router.replace('/representative');
              }}
            >
              <Image source={navigation.rep_nav_black} resizeMode="contain" />
            </TouchableOpacity>
          )}

          {footer === 'parliament' ? (
            <TouchableOpacity
              className="flex-row items-center bg-[#222222] px-10 py-4 rounded-full"
              disabled={true}
            >
              <Image source={navigation.pal_nav_white} resizeMode="contain" />
              <Text className="text-white font-semibold ml-2">Parliament</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-transparent p-2"
              onPress={() => {
                setFooter('parliament');
                router.replace('/parliament');
              }}
            >
              <Image source={navigation.pal_nav_black} resizeMode="contain" />
            </TouchableOpacity>
          )}

          {footer === 'profile' ? (
            <TouchableOpacity
              className="flex-row items-center bg-[#222222] px-10 py-4 rounded-full"
              disabled={true}
            >
              <Image
                source={navigation.profile_nav_white}
                resizeMode="contain"
              />
              <Text className="text-white font-semibold ml-2">Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-transparent p-2"
              onPress={() => {
                setFooter('profile');
                router.replace('/profile');
              }}
            >
              <Image
                source={navigation.profile_nav_black}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity className="bg-transparent p-2">
              <Image
                    source={navigation.pal_nav_black}
                    resizeMode="contain"
                  />
            </TouchableOpacity>

            <TouchableOpacity className="bg-transparent p-2">
              <Image
                    source={navigation.profile_nav_black}
                    resizeMode="contain"
                  />
            </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
};

export default Footer;
