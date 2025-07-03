import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { images } from '../../../constants';
import { getToken } from '../../../scripts/utils/storage';
import {
  guest_issue_information,
  issue_bookmark,
  issue_information,
  request_deletion,
} from '../../../scripts/api/representative';
import SwipeUpModal from '../../../components/SwipeUpModal';
import CenteredModal from '../../../components/CenteredModal';
import { useAlert } from '../../../context/AlertProvider';

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity className="px-4 py-2 rounded-lg" onPress={onPress}>
    <View className="flex-row justify-between items-center">
      <Image source={icon} className="w-6 h-6 mr-2" resizeMode="contain" />
      <Text className="font-semibold">{label}</Text>
    </View>
  </TouchableOpacity>
);

const IssueInformation = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkedLoading, setBookmarkedLoading] = useState(false);
  const [data, setData] = useState(null);
  const [billData, setBillData] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const reasons = [
    'I changed my stance',
    'I made a mistake',
    'Error in text',
    'the app does not meet my expectations',
    'I no longer work with this company',
  ];
  const { showError, showSuccess } = useAlert();

  const loadIssues = async () => {
    try {
      const token = await getToken(); // Declare token with const (safe practice)
      setLoading(true);

      let response; // Declare response in the parent scope

      if (token) {
        response = await issue_information({ id: id });
      } else {
        response = await guest_issue_information({ id: id });
      }

      if (response.data.success) {
        setBookmarked(response.data.bookmark);
        setData(response.data.data);
        setBillData(response.data.data?.app_summary || []);
      }
    } catch (error) {
      router.back();
      showError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBookMark = async () => {
    setBookmarkedLoading(true);
    try {
      const response = await issue_bookmark({
        id: id,
        bookmark: !bookmarked,
      });
      if (response.data.success) setBookmarked(!bookmarked);
      showSuccess(response.data.message);
    } catch (error) {
      if (error.response.status === 401) {
        router.replace('/auth/login');
        return;
      }
      showError('An error occurred bookmarking issue.');
    } finally {
      setBookmarkedLoading(false);
    }
  };

  const handleDeletionRequest = async () => {
    try {
      const response = await request_deletion({
        deletion_reason: reasons[selectedReason],
      });
      const data = response.data;
      if (data.success) {
        showSuccess(data.message);
        router.back();
        setConfirmModal(false);
      }
    } catch (error) {
      showError('An error occurred.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { font-size: 24px; }
              p { font-size: 16px; color: #444; }
              ul { padding-left: 20px; }
              li { margin-bottom: 6px; }
            </style>
          </head>
          <body>
            <h1>${data?.name}</h1>
            <h2>Issue Summary</h2>
            <ul>
              ${billData
                .map(
                  (item) =>
                    `<li><strong>${item.title}:</strong> ${item.value}</li>`,
                )
                .join('')}
            </ul>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      //   console.error('PDF generation error:', error);
      showError('Failed to generate PDF');
    }
  };

  useEffect(() => {
    if (id) loadIssues();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <View className="flex-row items-center mb-7">
          <TouchableOpacity className="mr-9" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600">No bill data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 bg-white flex-1">
        {/* Header */}
        <View className="flex-row items-center mb-7">
          <TouchableOpacity className="mr-9" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Title and Bookmark */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-base">{data.name}</Text>
            <Text className="text-sm text-gray-400">{data.name}</Text>
          </View>
          <TouchableOpacity
            className="mt-2"
            onPress={handleBookMark}
            activeOpacity={0.7}
            disabled={bookmarkedLoading}
          >
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={27}
              color={bookmarked ? '#000' : '#555'}
            />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View className="flex-row space-x-4 mb-2 justify-between">
          <ActionButton
            icon={images.ai}
            label="Talk to AI"
            onPress={() => router.push(`/chat/issue/${id}`)}
          />
          <ActionButton
            icon={images.download}
            label="Download"
            onPress={handleDownloadPDF}
          />
          <ActionButton icon={images.share} label="Share" onPress={() => {}} />
        </View>

        <View className="mt-2 mb-6 border-b-2 border-black" />

        {/* Summary */}
        <FlatList
          data={billData}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <View className="my-2 pr-2">
              <Text className="font-bold text-gray-700 leading-relaxed">
                {item.title}{' '}
                <Text className="text-gray-500 font-normal leading-relaxed">
                  {item.value}
                </Text>
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="mt-2 mb-1 p-4 bg-[#F2F2F2] rounded-t-3xl">
              <Text className="text-xl font-semibold mb-8">
                Changed your mind ?
              </Text>
              <Text className="text-gray-700 mb-8">
                Request for this issue to be deleted
              </Text>
              <TouchableOpacity
                className="bg-white rounded-full py-4 mb-4 items-center"
                onPress={() => setDeleteAccountModal(true)}
              >
                <Text className="text-black font-semibold">
                  Request Deletion
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                className="px-4 py-4 bg-[#FFFFFF] rounded-3xl"
                onPress={() =>
                  router.push(`/politicians/${data.politician_id}`)
                }
              >
                <Text className="text-black font-semibold text-center">
                  Contact Representative
                </Text>
              </TouchableOpacity> */}
            </View>
          )}
        />
      </View>
      <SwipeUpModal visible={deleteAccountModal} intensity={20}>
        <View className="bg-white rounded-t-3xl p-6">
          {/* Title Section */}
          <Text className="text-4xl font-normal mb-5">Retract Issue</Text>
          <Text className="text-gray-400 mb-6">
            What is your reason for retracting this issue?
          </Text>

          {/* Radio Button List */}

          <FlatList
            data={reasons}
            className="h-[65%] mt-4"
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setSelectedReason(index)}
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

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => {
              setDeleteAccountModal(false);
              setConfirmModal(true);
            }}
            disabled={selectedReason === null}
            className={`mt-6 py-4 rounded-full ${
              selectedReason !== null ? 'bg-black' : 'bg-gray-300'
            }`}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Confirm
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => {
              setDeleteAccountModal(false);
              setSelectedReason(null);
            }}
            className="mt-4"
          >
            <Text className="text-center text-lg text-gray-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </SwipeUpModal>
      <CenteredModal visible={confirmModal} intensity={30}>
        <>
          {/* Modal Content */}
          <Text className="text-3xl font-medium text-center mb-2">
            Retract Issue?
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            If approved by admin this issue will be deleted permanently.
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-black py-4 rounded-full mb-4 "
            onPress={() => handleDeletionRequest()}
          >
            <Text className="text-white text-center font-semibold">
              Confirm
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => setConfirmModal(false)}
            className="mx-20"
          >
            <Text className="text-center text-black font-semibold">Cancel</Text>
          </TouchableOpacity>
        </>
      </CenteredModal>
    </SafeAreaView>
  );
};

export default IssueInformation;
