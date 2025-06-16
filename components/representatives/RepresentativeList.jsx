import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { images } from '../../constants';
import RepresentativeSearch from './search/RepresentativeSearch';
import { useRepresentativeContext } from '../../context/RepresentativeContext';
import { search_representatives } from '../../scripts/api/representative';

const RepresentativeList = () => {
  const { searchParam, setScreen, setShowSearchBar } =
    useRepresentativeContext();

  const [type, setType] = useState('');
  const [representatives, setRepresentatives] = useState([]);
  const [showEmptyField, setShowEmptyField] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const searchRepresentatives = useCallback(async () => {
    try {
      setRepresentatives([]);
      if (debouncedSearch == '') {
        setType('search');
        setShowEmptyField(true);
        return;
      }

      setShowEmptyField(false);
      const response = await search_representatives({
        search: debouncedSearch,
      });

      if (response.data.success) {
        if (response.data.data.length == 0) {
          setType('not_found');
          setShowEmptyField(true);
        } else {
          setRepresentatives(response.data.data);
          setShowEmptyField(false);
        }

        return;
      } else {
        setType('server_error');
        setShowEmptyField(true);

        return;
      }
    } catch (error) {
      const error_detail = error.response?.data.message || error.message;
      // console.log(error_detail);
      if (error_detail == 'Network Error') {
        setType('no_internet');
        setShowEmptyField(true);

        return;
      }
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(searchParam);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchParam]);

  useEffect(() => {
    searchRepresentatives();
  }, [searchRepresentatives]);

  return showEmptyField ? (
    <RepresentativeSearch type={type} />
  ) : (
    <FlatList
      data={representatives}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <>
          <TouchableOpacity
            onPress={() => router.push(`/politicians/${item.id}`)}
            style={{
              padding: 16,
              marginHorizontal: 16,
              marginBottom: 20,
              backgroundColor: '#fff',
              borderRadius: 24,
              borderWidth: 0.5,
              borderColor: '#eee',
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  style={{ color: '#666', lineHeight: 20 }}
                  numberOfLines={3}
                >
                  {item.province_name}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="black"
                style={{ alignSelf: 'center', marginLeft: 12 }}
              />
            </View>
          </TouchableOpacity>
        </>
      )}
    />
  );
  // <RepresentativeSearch type={search} />
};

export default RepresentativeList;
