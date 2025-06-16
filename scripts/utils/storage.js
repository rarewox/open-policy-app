import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('access_token', token);
  } catch (e) {
    console.error('Failed to store token:', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (e) {
    console.error('Failed to get token:', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
  } catch (e) {
    console.error('Failed to remove token:', e);
  }
};
