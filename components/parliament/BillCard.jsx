import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const BillCard = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            color: item.is_government_bill === 0 ? '#86393A' : '#395886',
            fontWeight: 'bold',
            fontSize: 18,
            padding: 8,
            backgroundColor: '#F3F3F3',
            borderRadius: 50,
            textAlign: 'center',
            width: 90,
          }}
        >
          {item.number}
        </Text>
        <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
          {dayjs(item.introduced).format('YYYY-MM-DD')}
        </Text>
      </View>

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
            {item.short_name}
          </Text>
          <Text style={{ color: '#666', lineHeight: 20 }} numberOfLines={3}>
            {item.name}
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
  );
});

export default BillCard;
