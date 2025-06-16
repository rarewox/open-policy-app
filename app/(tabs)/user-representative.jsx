import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { your_representative } from '../../scripts/api/representative';
import { useFocusEffect } from '@react-navigation/native';
import { useAlert } from '../../context/AlertProvider';
const userRepresentative = () => {
  const {
    showSearchBar,
    setSearchParam,
    searchParam,
    scrolledPastThreshold,
    setData,
    showRepresentative,
    setShowRepresentative,
    setScrolledPastThreshold,
    yourRepresentative,
  } = useRepresentativeContext();

  const { showError } = useAlert();

  const loadUserRep = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return;
      }
      const response = await your_representative({});

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  };

  const searchBarHandler = async (text) => {
    setSearchParam(text);

    const token = await getToken();
    if (token && text == '') {
      setShowRepresentative(true);
    } else {
      setShowRepresentative(false);
    }
  };

  useEffect(() => {
    setScrolledPastThreshold(false);
    loadUserRep();
  }, []);

  // Inside your component:
  useFocusEffect(
    React.useCallback(() => {
      // This will run when the screen comes into focus
      setData(yourRepresentative);
      loadUserRep();

      return () => {
        // Optional cleanup when screen loses focus
      };
    }, []),
  );

  return (
    // RepresentativeList
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-4 m-4">
        {/* Logo */}
        <Image
          source={images.logo} // Replace with your logo
          className="w-8 h-8 mr-2"
        />
        {/* Input */}
        <TextInput
          onChangeText={(text) => {
            searchBarHandler(text);
          }}
          value={searchParam}
          placeholderTextColor="#696969"
          autoCorrect={false}
          placeholder="Search by name or location..."
          className="flex-1 font-semibold"
        />
        {/* Search Icon */}
        <Image
          source={images.search} // Replace with your logo
          className="w-11 h-11"
        />
        {/* <Text className="text-gray-400 text-lg">🔍</Text> */}
      </View>

      {showRepresentative ? (
        <>
          {!scrolledPastThreshold ? (
            <RepresentativeCardDetail />
          ) : (
            <RepresentativeCardSummary />
          )}

          <RepRecentActivities />
        </>
      ) : (
        <RepresentativeList />
      )}
    </SafeAreaView>
  );
};

export default userRepresentative;
