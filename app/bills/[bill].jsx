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
import { getToken, removeToken } from '../../scripts/utils/storage';
import CenteredModal from '../../components/CenteredModal';
import { useAlert } from '../../context/AlertProvider';

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity className="px-4 py-2 rounded-lg" onPress={onPress}>
    <View className="flex-row justify-between items-center">
      <Image source={icon} className="w-6 h-6 mr-2" resizeMode="contain" />
      <Text className="font-semibold">{label}</Text>
    </View>
  </TouchableOpacity>
);

const VoteButton = ({ label, onPress, disabled }) => (
  <TouchableOpacity
    className="bg-white rounded-full py-4 mb-4 items-center"
    onPress={onPress}
    disabled={disabled}
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

const BillInformation = () => {
  const { bill } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkedLoading, setBookmarkedLoading] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [data, setData] = useState(null);
  const [vote, setVote] = useState(null);
  const [billData, setBillData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const { showError, showSuccess } = useAlert();

  const [supportPercentage, setSupportPercentage] = useState(0);
  const [opposePercentage, setOpposePercentage] = useState(0);

  const onShare = async () => {
    try {
      // const result =
      await Share.share({
        message: 'https://app.openpolicy.me/bills/' + data.id,
      });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error) {
      showError(error.message);
    }
  };

  const loadBills = async () => {
    try {
      const token = await getToken(); // Declare token with const (safe practice)
      setLoading(true);

      let response; // Declare response in the parent scope

      if (token) {
        response = await show_bill({ number: bill });
      } else {
        response = await guest_show_bill({ number: bill });
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
      if (error.response.status === 401) {
        await removeToken();
        setNotFound(true);
        return;
      }

      router.back();
      showError('An error occurred while fetching bill data.');
    } finally {
      setLoading(false);
    }
  };

  const talkToAI = async (bill) => {
    const token = await getToken();
    if (token) {
      router.push(`/chat/${bill}`);
      return;
    }

    setNotFound(true);
  };

  const handleBookMark = async () => {
    const token = await getToken();
    if (!token) {
      setNotFound(true);
      return;
    }

    setBookmarkedLoading(true);
    try {
      const response = await bookmark_bill({
        number: data.number,
        bookmark: !bookmarked,
      });
      if (response.data.success) setBookmarked(!bookmarked);
      showSuccess(response.data.message);
    } catch (error) {
      if (error.response.status === 401) {
        await removeToken();
        setNotFound(true);

        return;
      }
      showError('An error occurred while bookmarking bill.');
    } finally {
      setBookmarkedLoading(false);
    }
  };

  const handleBillSupport = async (type) => {
    const token = await getToken();
    if (!token) {
      setNotFound(true);
      return;
    }
    try {
      const response = await bill_support({
        number: bill,
        support_type: type,
      });

      if (response.data.success) {
        setVote(response.data.vote_cast);
        setSupportPercentage(response.data.support_percentage);
        setOpposePercentage(Math.abs(100 - response.data.support_percentage));
      }
    } catch (error) {
      if (error.response.status === 401) {
        await removeToken();
        setNotFound(true);
        return;
      }
      showError('An error occurred.');
    } finally {
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
            <h1>${data?.short_name}</h1>
            <p>${data?.name}</p>
            <h2>Summary</h2>
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
      console.error('PDF generation error:', error);
      showError('Failed to generate PDF');
    }
  };

  useEffect(() => {
    if (bill) loadBills();
  }, [bill]);

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
          <Text
            className={`font-bold mb-1 mt-2 text-xl p-2 w-[90px] text-center bg-[#F3F3F3] rounded-full ${
              data.is_government_bill ? 'text-[#395886]' : 'text-[#86393A]'
            }`}
          >
            {data.number}
          </Text>
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

        <Text className="text-2xl font-base">{data.short_name}</Text>
        <Text className="text-sm text-gray-400 mb-6">{data.name}</Text>

        {/* Actions */}
        <View className="flex-row space-x-4 mb-2 justify-between">
          <ActionButton
            icon={images.ai}
            label="Talk to AI"
            onPress={() => talkToAI(data.number)}
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
                Do you support or oppose this bill?
              </Text>
              {vote === null ? (
                <>
                  <VoteButton
                    label="I support the bill"
                    onPress={() => handleBillSupport('support')}
                    disabled={votingLoading}
                  />
                  <VoteButton
                    label="I oppose the bill"
                    onPress={() => handleBillSupport('oppose')}
                    disabled={votingLoading}
                  />
                </>
              ) : (
                <>
                  <VoteProgressBar
                    label="I support the bill"
                    percentage={supportPercentage}
                    selected={vote === 'support'}
                    onPress={() => handleBillSupport('support')}
                    disabled={votingLoading}
                  />
                  <VoteProgressBar
                    label="I oppose the bill"
                    percentage={opposePercentage}
                    selected={vote === 'oppose'}
                    onPress={() => handleBillSupport('oppose')}
                    disabled={votingLoading}
                  />
                </>
              )}
              <TouchableOpacity
                className="px-4 py-4 bg-[#FFFFFF] rounded-3xl"
                onPress={() =>
                  router.push(`/politicians/${data.politician_id}`)
                }
              >
                <Text className="text-black font-semibold text-center">
                  Contact Representative
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <CenteredModal visible={notFound} intensity={30}>
        <>
          {/* Modal Content */}
          <Text className="text-3xl font-medium text-center mb-2">
            Want Access?
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            You will need to login or register to access this feature
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-black py-4 rounded-full mb-3"
            onPress={() => {
              setNotFound(false);
              router.push('/auth/login');
            }}
          >
            <Text className="text-white text-center font-semibold">
              Click to Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-stone-200 py-4 rounded-full mb-4 "
            onPress={() => {
              setNotFound(false);
              router.push('/auth/register/name');
            }}
          >
            <Text className="text-black text-center font-semibold">
              Click to Register
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => setNotFound(false)}
            className="mx-20"
          >
            <Text className="text-center text-black font-semibold">Cancel</Text>
          </TouchableOpacity>
        </>
      </CenteredModal>
    </SafeAreaView>
  );
};

export default BillInformation;
