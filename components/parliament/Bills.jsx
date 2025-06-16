import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { router, useFocusEffect } from 'expo-router';
import AddRepresentativeIssue from '../AddRepresentativeIssue';
import { bills } from '../../scripts/api/bills';
import BillCard from './BillCard';
import { useGlobalContext } from '../../context/GlobalContextProvider';
import { useAlert } from '../../context/AlertProvider';

const bill_list = ['All Bills', 'Private Member Bills', 'Government Bills'];

const Bills = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All Bills');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { user } = useGlobalContext();
  const { showError } = useAlert();

  const handlePress = (item) => {
    router.push(`/bills/${item.id}`);
  };

  const renderItem = useCallback(({ item }) => {
    return <BillCard item={item} onPress={() => handlePress(item)} />;
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (item) => {
    setSelected(item);
    setIsOpen(false);
  };

  const loadBills = useCallback(async () => {
    try {
      setData([]);
      const response = await bills({
        search: debouncedSearch,
        type: selected,
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      showError(error.response?.data.message || error.message);
    }
  }, [debouncedSearch, selected]);

  // Debounce the search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
    }, 10); // adjust as needed

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Load data when filters or search changes
  useEffect(() => {
    loadBills();
  }, [loadBills]);

  // Animate dropdown
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // useFocusEffect(
  //   useCallback(() => {
  //     loadBills();
  //     return () => {
  //       // Clean up if needed
  //     };
  //   }, [loadBills]),
  // );

  return (
    <>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F3F3F3',
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 10,
          margin: 16,
        }}
      >
        <Image
          source={images.logo}
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <TextInput
          placeholder="Search Bills"
          placeholderTextColor="#696969"
          autoCorrect={false}
          style={{ flex: 1, color: '#333', fontWeight: '600' }}
          onChangeText={setSearch}
          value={search}
        />
        <Image source={images.search} style={{ width: 44, height: 44 }} />
      </View>

      {/* Dropdown */}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 20,
          position: 'relative',
          zIndex: 50,
        }}
      >
        <TouchableOpacity
          onPress={toggleDropdown}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontWeight: '600', fontSize: 32, marginRight: 8 }}>
            {selected}
          </Text>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={28}
            color="black"
          />
        </TouchableOpacity>

        {isOpen && (
          <Animated.View
            style={{
              marginTop: 12,
              backgroundColor: 'white',
              borderRadius: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              elevation: 5,
              width: 220,
              position: 'absolute',
              top: 50,
              left: 10,
            }}
          >
            {bill_list.map((bill, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(bill)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: index !== bill_list.length - 1 ? 1 : 0,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 16 }}>{bill}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>

      {/* Divider */}
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          marginTop: 20,
          marginBottom: 12,
        }}
      />

      {/* Bill List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.number}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {user && user.role == 232 && <AddRepresentativeIssue />}
    </>
  );
};

export default Bills;
