import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import Footer from '../../components/Footer';
import { images } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { BlurView } from 'expo-blur';
import AddRepresentativeIssue from '../../components/AddRepresentativeIssue';
import { useGlobalContext } from '../../context/GlobalContextProvider';
import { profile } from '../../scripts/api/profile';
import { useAlert } from '../../context/AlertProvider';
import { getToken } from '../../scripts/utils/storage';

const base_image =
  'https://media.istockphoto.com/id/2041572395/vector/blank-avatar-photo-placeholder-icon-vector-illustration.webp?b=1&s=612x612&w=0&k=20&c=88LuT9lqQ6gHAvy7aQfxnRs_iK6KpnE-8QHDw3YyAUU=';
const Profile = () => {
  const { user, fetchUserData } = useGlobalContext();
  const { showError } = useAlert();
  // store user in a state and update on mount
  const [userData, setUserData] = useState(user);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    votesCast: '00',
    savedBills: '00',
    issuesRaised: '00',
  });

  // Function to refresh user data
  const refreshUserData = useCallback(async () => {
    setRefreshing(true);
    // Assuming fetchUserData is an async function that updates the user in context
    if (fetchUserData) {
      await fetchUserData();
    }

    try {
      const token = await getToken();

      if (token) {
        const response = await profile();
        if (response.data.success) {
          setMetrics({
            votesCast: response.data.votes_cast || '00',
            savedBills: response.data.saved_bills || '00',
            issuesRaised: response.data.issues_raised || '00',
          });
        }
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }

    setRefreshing(false);
  }, [fetchUserData]);

  // Update local state when global user changes
  useEffect(() => {
    setUserData(user);
  }, [user]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshUserData();
      return () => {
        // Clean up if needed
      };
    }, [refreshUserData]),
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshUserData}
            colors={['#395886']}
          />
        }
        ListHeaderComponent={() => (
          <>
            <View className="flex-row justify-end px-5 mb-10">
              <TouchableOpacity
                disabled={!userData}
                onPress={() => router.push('/profile/activity')}
              >
                <Ionicons name="settings" size={20} />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between px-4">
              <View className="flex-1">
                <Text className="text-4xl font-semibold mt-6">
                  Good Morning{' '}
                  {`${userData ? '\n' + userData.first_name + '!' : ''}`}
                </Text>
                <Text className="font-base text-gray-400 text-xl">
                  Let's see what's new with your saved bills and updates
                </Text>
              </View>
              {userData && userData.dp ? (
                <Image
                  source={{
                    uri: userData?.dp?.replace(/^http:\/\//i, 'https://'),
                  }}
                  className="w-[144px] h-[180px] rounded-3xl "
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{
                    uri: base_image,
                  }}
                  className="w-[144px] h-[180px] rounded-3xl "
                  resizeMode="cover"
                />
              )}
            </View>
            {userData && (
              <View className="flex-row justify-start px-5 mb-4">
                <Text className="text-[#395886] font-bold px-6 py-2 text-xl text-center bg-gray-100 rounded-full">
                  {userData.postal_code}
                </Text>
              </View>
            )}

            <View className="px-4 flex pt-10 flex-row justify-between gap-2">
              <TouchableOpacity
                disabled={!userData}
                className={`bg-[#F2F2F2] px-6 py-10 w-[49%] border border-gray-200 ${
                  userData && userData.role == 232
                    ? 'rounded-tl-3xl'
                    : 'rounded-l-3xl'
                }`}
                onPress={() => router.push('/profile/votes-cast')}
              >
                <View className="flex-row justify-between items-start">
                  <Text className="text-7xl font-base mt-5">
                    {metrics.votesCast}
                  </Text>
                  <Image source={images.arrow_top} />
                </View>
                <View className="border-b border-gray-300 mt-5 mb-2" />
                <Text className="text-gray-500 font-medium mt-2">
                  Vote Cast
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!userData}
                className={`bg-[#F2F2F2] px-6 py-10 w-[49%] border border-gray-200 ${
                  userData && userData.role == 232
                    ? 'rounded-tr-3xl'
                    : 'rounded-r-3xl'
                }`}
                onPress={() => router.push('/profile/saved-bills')}
              >
                <View className="flex-row justify-between items-start">
                  <Text className="text-7xl font-base mt-6">
                    {metrics.savedBills}
                  </Text>
                  <Image source={images.arrow_top} />
                </View>
                <View className="border-b border-gray-300 mt-5 mb-2" />
                <Text className="text-gray-500 font-medium mt-2">
                  Saved Bills
                </Text>
              </TouchableOpacity>
            </View>

            {userData && userData.role == 232 && (
              <View className="px-4 mt-[8px] w-full mb-10">
                <TouchableOpacity
                  className="bg-[#F2F2F2] px-6 py-10 rounded-b-3xl w-full border border-gray-200"
                  onPress={() => router.push('/profile/issues-raised')}
                >
                  <View className="flex-row justify-between items-start">
                    <Text className="text-7xl font-base mt-6">
                      {metrics.issuesRaised}
                    </Text>
                    <Image source={images.arrow_top} />
                  </View>
                  <View className="border-b border-gray-300 mt-5 mb-2" />
                  <Text className="text-gray-500 font-medium mt-2">
                    Issues Raised
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      />

      {userData && userData.role == 232 && <AddRepresentativeIssue />}
    </SafeAreaView>
  );
};

export default Profile;
