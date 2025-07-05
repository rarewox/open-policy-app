import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import CenteredModal from '../../components/CenteredModal';
import SwipeUpModal from '../../components/SwipeUpModal';
import { logout } from '../../scripts/api/auth';
import { removeToken } from '../../scripts/utils/storage';
import { useGlobalContext } from '../../context/GlobalContextProvider';
import { delete_account } from '../../scripts/api/profile';
import { useAlert } from '../../context/AlertProvider';

const SettingsItem = ({ icon, label, onPress, danger = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-row items-center space-x-3">
        <Ionicons name={icon} size={24} color={danger ? 'red' : 'gray'} />
        <Text
          className={`text-lg ml-3 ${danger ? 'text-red-500' : 'text-black'}`}
        >
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="gray" />
    </TouchableOpacity>
  );
};

const Settings = () => {
  const [logOutModal, setLogOutModal] = useState(false);
  const [email, setEmail] = useState('');
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [enterDeletedEmail, setEnterDeletedEmail] = useState(false);
  const { setUser } = useGlobalContext();
  const { showError, showSuccess } = useAlert();
  const reasons = [
    'I no longer need the app',
    'I found a better alternative',
    'I have privacy or security concerns',
    'The app does not meet my expectations',
    'I no longer work with this company',
  ];

  const logoutUser = async () => {
    try {
      const response = await logout();

      if (response.data.success) {
        await removeToken();
        setUser(null);
        setLogOutModal(false);
        showSuccess(response.data.message);
        router.push('/');
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await delete_account({
        reason: reasons[selectedReason],
        email: email,
      });

      if (response.data.success) {
        await removeToken();
        setUser(null);
        setDeleteAccountModal(false);
        setEnterDeletedEmail(false);
        setSelectedReason(null);
        setEmail('');
        showSuccess(response.data.message);
        router.push('/');
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  const handleReasonSelect = (index) => {
    setSelectedReason(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 bg-white flex-1">
        <View className="flex-row items-center mb-7">
          <TouchableOpacity
            className="mr-9"
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className=""></View>
        </View>
        {/* Header Section */}
        <Text className="text-4xl font-normal mb-6">Settings and Activity</Text>

        {/* Account Status Section */}
        <Text className="text-gray-400 text-base mb-4">Account Status</Text>
        <SettingsItem
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => router.push('/profile/password')}
        />
        <SettingsItem
          icon="location-outline"
          label="Change Postal Code"
          onPress={() => router.push('/profile/postal')}
        />
        <SettingsItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push('/profile/edit')}
        />
        <SettingsItem
          icon="trash-outline"
          label="Delete Account"
          onPress={() => setDeleteAccountModal(true)}
          danger
        />

        <View className="border-b border-gray-200 mt-5" />

        {/* More Info and Support Section */}
        <Text className="text-gray-400 text-base mt-6 mb-4">
          More Info and Support
        </Text>
        <SettingsItem
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => router.push('/disclosures/privacy-policy')}
        />
        <SettingsItem
          icon="information-circle-outline"
          label="Terms of Service"
          onPress={() => router.push('/disclosures/terms-of-service')}
        />
        <SettingsItem icon="gift-outline" label="Donate" onPress={() => {}} />

        <View className="border-b border-gray-200 mt-10" />
        <TouchableOpacity
          className="flex-row items-center mt-5 space-x-3"
          onPress={() => setLogOutModal(true)}
        >
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text className="text-lg text-red-500">Log Out</Text>
        </TouchableOpacity>
      </View>
      <CenteredModal visible={logOutModal} intensity={30}>
        <>
          {/* Modal Content */}
          <Text className="text-3xl font-medium text-center mb-2">Logout?</Text>
          <Text className="text-gray-500 text-center mb-8">
            Are you sure you want to logout? To confirm click on confirm
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-black py-4 rounded-full mb-4 "
            onPress={() => logoutUser()}
          >
            <Text className="text-white text-center font-semibold">
              Confirm
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => setLogOutModal(false)}
            className="mx-20"
          >
            <Text className="text-center text-black font-semibold">Cancel</Text>
          </TouchableOpacity>
        </>
      </CenteredModal>

      <SwipeUpModal visible={deleteAccountModal} intensity={20}>
        <View className="bg-white rounded-t-3xl p-6">
          {/* Title Section */}
          <Text className="text-4xl font-normal mb-5">Account Deletion</Text>
          <Text className="text-gray-400 mb-6">
            What is your reason for deleting OpenPolicy?
          </Text>

          {/* Radio Button List */}
          {enterDeletedEmail ? (
            <View className="h-[65%] mt-10">
              <Text className="text-gray-500 mt-5">Email Address</Text>
              <View className="flex-row items-center border border-b-gray-300 border-l-white border-r-white border-t-white px-3 mb-2">
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                  placeholder="Enter your new postal code"
                  className="flex-1 py-2 h-12"
                />
              </View>
            </View>
          ) : (
            <FlatList
              data={reasons}
              className="h-[65%] mt-4"
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleReasonSelect(index)}
                  className="flex-row items-center mb-10"
                >
                  {/* Radio Button */}
                  <View className="w-6 h-6 border-2 border-black rounded-full justify-center items-center mr-4">
                    {selectedReason === index && (
                      <View className="w-4 h-4 bg-black rounded-full" />
                    )}
                  </View>
                  <Text className="text-lg">{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => {
              if (email != '') {
                deleteAccount(email);
                setDeleteAccountModal(false);
                setEnterDeletedEmail(false);
                setSelectedReason(null);
              }
              setEnterDeletedEmail(true);
            }}
            disabled={selectedReason === null}
            className={`mt-6 py-4 rounded-full ${
              selectedReason !== null ? 'bg-black' : 'bg-gray-300'
            }`}
          >
            <Text className="text-center text-white font-semibold text-lg">
              {enterDeletedEmail ? 'Confirm' : 'Next'}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => {
              setDeleteAccountModal(false);
              setEnterDeletedEmail(false);
              setSelectedReason(null);
              setEmail('');
            }}
            className="mt-4"
          >
            <Text className="text-center text-lg text-gray-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </SwipeUpModal>
    </SafeAreaView>
  );
};

export default Settings;
