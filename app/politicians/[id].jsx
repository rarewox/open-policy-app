import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Footer from '../../components/Footer';
import RepresentativeSection from '../../components/representatives/RepresentativeSection';
import { images } from '../../constants';
import RepresentativeSearch from '../../components/representatives/cards/RepresentativeSearch';
import { useRepresentativeContext } from '../../context/RepresentativeContext';
import RepresentativeList from '../../components/representatives/RepresentativeList';
import RepresentativeBackButton from '../../components/representatives/cards/RepresentativeBackButton';
import RaisedIssueDetails from '../../components/representatives/RaisedIssueDetails';
import RepresentativeCardDetail from '../../components/representatives/cards/RepresentativeCardDetail';
import RepresentativeCardSummary from '../../components/representatives/cards/RepresentativeCardSummary';
import RepRecentActivities from '../../components/representatives/activities/RepRecentActivities';
import RepIssuesRaised from '../../components/representatives/activities/RepIssuesRaised';
import { getToken, removeToken } from '../../scripts/utils/storage';
import {
  representative,
  search_representatives,
  your_representative,
} from '../../scripts/api/representative';
import { useAlert } from '../../context/AlertProvider';
const userRepresentative = () => {
  const {
    scrolledPastThreshold,
    setScrolledPastThreshold,
    setShowRepresentative,
    setData,
    data,
  } = useRepresentativeContext();

  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { showError } = useAlert();

  const loadUserRep = async () => {
    try {
      const response = await representative({ id: id });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchBarHandler = async (text) => {
    // setSearchParam(text);
    // const token = await getToken();
    // if (token && text == '') {
    //   setShowRepresentative(true);
    // } else {
    //   setShowRepresentative(false);
    // }
  };

  useEffect(() => {
    setScrolledPastThreshold(false);
    loadUserRep();
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
    // RepresentativeList
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center mb-7">
        <TouchableOpacity
          className="ml-3"
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {!scrolledPastThreshold ? (
        <RepresentativeCardDetail />
      ) : (
        <RepresentativeCardSummary />
      )}

      <RepRecentActivities />
    </SafeAreaView>
  );
};

export default userRepresentative;
