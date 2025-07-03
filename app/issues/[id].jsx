import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  bill_support,
  bookmark_bill,
  guest_show_bill,
  show_bill,
} from '../../scripts/api/bills';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { images } from '../../constants';
import { getToken } from '../../scripts/utils/storage';
import {
  guest_issue_information,
  issue_bookmark,
  issue_information,
  issue_voting,
} from '../../scripts/api/representative';
import { useAlert } from '../../context/AlertProvider';

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity className="px-4 py-2 rounded-lg" onPress={onPress}>
    <View className="flex-row justify-between items-center">
      <Image source={icon} className="w-6 h-6 mr-2" resizeMode="contain" />
      <Text className="font-semibold">{label}</Text>
    </View>
  </TouchableOpacity>
);

const VoteButton = ({ label, onPress }) => (
  <TouchableOpacity
    className="bg-white rounded-full py-4 mb-4 items-center"
    onPress={onPress}
  >
    <Text className="text-black font-semibold">{label}</Text>
  </TouchableOpacity>
);

const VoteProgressBar = ({
  label,
  percentage,
  selected,
  onPress,
  disabled,
}) => (
  <TouchableOpacity
    className="w-full rounded-full mb-4 overflow-hidden"
    onPress={onPress}
    disabled={disabled}
  >
    <View className="relative w-full h-14 rounded-full bg-white overflow-hidden justify-center">
      {/* Filled bar */}
      <View
        style={{ width: `${percentage}%` }}
        className={`absolute left-0 top-0 bottom-0 ${
          selected ? 'bg-black' : 'bg-gray-200'
        }`}
      />

      {/* Label - always centered vertically */}
      <View className="z-10 px-4">
        <Text
          className={`text-base ${
            selected && percentage > 0 ? 'text-white' : 'text-black'
          }`}
        >
          {label}
        </Text>
      </View>

      {/* Percentage overlay */}
      <Text className="absolute right-4 text-[#395886] text-base font-semibold z-10">
        {percentage}%
      </Text>
    </View>
  </TouchableOpacity>
);

const IssueInformation = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkedLoading, setBookmarkedLoading] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [data, setData] = useState(null);
  const [vote, setVote] = useState(null);
  const [billData, setBillData] = useState([]);
  const { showError, showSuccess } = useAlert();

  const [supportPercentage, setSupportPercentage] = useState(0);
  const [opposePercentage, setOpposePercentage] = useState(0);

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
        setVote(response.data.vote_cast);
        setSupportPercentage(response.data.support_percentage);
        setOpposePercentage(100 - response.data.support_percentage);
        setBookmarked(response.data.bookmark);
        setData(response.data.data);
        setBillData(response.data.data?.app_summary || []);
      }
    } catch (error) {
      showError(error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: 'https://app.openpolicy.me',
      });
    } catch (error) {
      showError(error.message);
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
      showError('An error occurred bookmarking bill.');
    } finally {
      setBookmarkedLoading(false);
    }
  };

  const handleSupportRequest = async (type) => {
    try {
      setVotingLoading(true);
      const response = await issue_voting({
        id: id,
        support_type: type,
      });

      const data = response.data;
      if (data.success) {
        const supportPercentage = data.support_percentage;
        setVote(data.vote_cast);
        setSupportPercentage(supportPercentage);
        setOpposePercentage(Math.abs(100 - data.support_percentage));
        setVotingLoading(false);
      }
    } catch (error) {
      showError('An error occurred.');
      setVotingLoading(false);
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
      // console.error('PDF generation error:', error);
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
        <View className="mb-3 flex-row justify-between items-center">
          <View
            className={`font-bold mb-1 mt-2 text-xl p-2 w-[90%] text-center `}
          >
            <Text className="text-2xl font-base">{data.name}</Text>
            <Text className="text-sm text-gray-400 mb-6">{data.name}</Text>
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
          <ActionButton icon={images.share} label="Share" onPress={onShare} />
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
                Your Voice Matters
              </Text>
              <Text className="text-gray-700 mb-8">
                Do you support or oppose this Issue?
              </Text>
              {vote === null ? (
                <>
                  <VoteButton
                    label="I support the Issue"
                    onPress={() => handleSupportRequest('support')}
                  />
                  <VoteButton
                    label="I oppose the Issue"
                    onPress={() => handleSupportRequest('oppose')}
                  />
                </>
              ) : (
                <>
                  <VoteProgressBar
                    label="I support the Issue"
                    percentage={supportPercentage}
                    selected={vote === 'support'}
                    onPress={() => handleSupportRequest('support')}
                    disabled={votingLoading}
                  />
                  <VoteProgressBar
                    label="I oppose the Issue"
                    percentage={opposePercentage}
                    selected={vote === 'oppose'}
                    onPress={() => handleSupportRequest('oppose')}
                    disabled={votingLoading}
                  />
                </>
              )}
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
    </SafeAreaView>
  );
};

export default IssueInformation;
