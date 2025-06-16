import { View, Text, Animated, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import { useRepresentativeContext } from '../../../context/RepresentativeContext';
import { Ionicons } from '@expo/vector-icons';

const representatives = [
  {
    id: '1',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '2',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '3',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '4',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '5',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '6',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '7',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '8',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '9',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '10',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '11',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '12',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '13',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '14',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '15',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '16',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '17',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '18',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '19',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '20',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '21',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '22',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '23',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '24',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '25',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '26',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '27',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '28',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
];

const RepIssuesRaised = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { setScreen, setScrolledPastThreshold, setShowSearchBar } =
    useRepresentativeContext();

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        setScrolledPastThreshold(scrollOffset > 1); // Switch logic at 150px
      },
    },
  );
  return (
    <Animated.FlatList
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={true}
      data={representatives}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            setScreen(6);
            setShowSearchBar(false);
          }}
          className="py-4 pl-4 flex-row justify-between items-center mx-4 mb-10 bg-white rounded-3xl border border-gray-300"
          style={{
            elevation: 10, // Stronger elevation for Android
            borderWidth: 0.5, // Ensure a visible border
            borderColor: '#FFFFFF', // Light gray border for a subtle definition
            boxShadow: '2px 19px 20px 10px #0000000D',
          }}
        >
          <View className="flex-1">
            <Text className="text-gray-500 font-base mb-1 mt-2 text-sm">
              {item.date}
            </Text>
            <Text className="text-black font-semibold text-xl mt-2">
              {item.name}
            </Text>
            <Text className="text-gray-500 pr-20 mt-3 leading-relaxed">
              {item.role}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="black"
            className="mr-4"
          />
        </TouchableOpacity>
      )}
    />
  );
};

export default RepIssuesRaised;
