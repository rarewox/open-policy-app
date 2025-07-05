import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import CenteredModal from '../../components/CenteredModal';
import { update_profile } from '../../scripts/api/profile';
import { useGlobalContext } from '../../context/GlobalContextProvider';
import { useAlert } from '../../context/AlertProvider';

const EditProfile = () => {
  const { setUser, user } = useGlobalContext();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [gender, setGender] = useState(user.gender);
  const [dateOfBirth, setDateOfBirth] = useState(
    user.age ? new Date(user.age) : new Date(2000, 1, 1), // Default to Jan 1, 2000 if age is not set
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(
    user?.dp?.replace(/^http:\/\//i, 'https://'),
  );
  const [loadingImage, setLoadingImage] = useState(false);
  const { showError, showSuccess } = useAlert();

  const isFormComplete = firstName && lastName && gender && dateOfBirth;

  const pickImage = async () => {
    try {
      setLoadingImage(true);

      // Request permissions first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        showError(
          'This app requires photo access to allow you to select and upload a profile image.',
        );
        setLoadingImage(false);
        return;
      }

      // Launch image picker with the simplest approach
      const result = await ImagePicker.launchImageLibraryAsync({
        // Don't specify mediaTypes at all - it will default to images
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      // console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      // console.error('Error picking image:', error);
      showError('Failed to select image. Please try again.');
    } finally {
      setLoadingImage(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate) {
      if (currentDate > new Date()) {
        showError('Date of birth cannot be in the future.');
      } else {
        setDateOfBirth(currentDate);
      }
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('gender', gender);
      formData.append('date_of_birth', dateOfBirth.toISOString().split('T')[0]);

      if (profileImage) {
        // Extract file extension properly
        const fileName = profileImage.split('/').pop();
        const fileType = fileName.split('.').pop().toLowerCase();

        // Ensure the mimetype is correct based on file extension
        let mimeType;
        switch (fileType) {
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          default:
            mimeType = `image/${fileType}`;
        }

        formData.append('profile_picture', {
          uri:
            Platform.OS === 'android'
              ? profileImage
              : profileImage.replace('file://', ''),
          name: fileName,
          type: mimeType,
        });
      }

      const response = await update_profile(formData);

      if (response.data && response.data.success) {
        // Update global user state if needed
        if (response.data.user) {
          setUser(response.data.user);
        }

        showSuccess(response.data.message || 'Profile updated successfully');
        setModalVisible(false);
      }
    } catch (error) {
      // console.error('Profile update error:', error);
      setModalVisible(false);
      showError(
        'Update Failed, please confirm no fields are empty and the image is a PNG, JPG file',
      );
    }
  };

  const selectGender = (selected) => {
    setGender(selected);
    setGenderModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePicContainer}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profilePicTouchable}
            disabled={loadingImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : user.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : loadingImage ? (
              <ActivityIndicator size="large" color="#ccc" />
            ) : (
              <>
                <Feather name="upload-cloud" size={30} color="gray" />
                <Text style={styles.uploadText}>Upload Profile</Text>
              </>
            )}
            <View style={styles.editIcon}>
              <Feather name="edit-3" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields wrapped in FlatList for potential future scroll needs */}
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* First Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter Your First Name"
                    placeholderTextColor="#aaa"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Last Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter Your Last Name"
                    placeholderTextColor="#aaa"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Gender Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity
                  style={styles.pickerTouchable}
                  onPress={() => setGenderModalVisible(true)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      !gender && styles.placeholderText,
                    ]}
                  >
                    {gender || 'Select Gender'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
              </View>

              {/* Date of Birth Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.pickerTouchable}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      !dateOfBirth && styles.placeholderText,
                    ]}
                  >
                    {dateOfBirth
                      ? dateOfBirth.toLocaleDateString('en-GB')
                      : 'Select Date of Birth'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="gray" />
                </TouchableOpacity>
              </View>
              {/* Conditionally render DateTimePicker */}
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
              {/* iOS Specific 'Done' button if using 'spinner' display */}
              {showDatePicker && Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.iosPickerDoneButton}
                >
                  <Text style={styles.iosPickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}

              {/* Update Button */}
              <TouchableOpacity
                disabled={!isFormComplete}
                onPress={() => setModalVisible(true)}
                style={[
                  styles.updateButton,
                  !isFormComplete && styles.disabledButton,
                ]}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </>
          }
          keyExtractor={(item, index) => index.toString()}
          data={[]}
        />
      </View>

      {/* Gender Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setGenderModalVisible(false)}
        >
          <View style={styles.genderModalContent}>
            <Text style={styles.genderModalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => selectGender('Male')}
            >
              <Text style={styles.genderOptionText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => selectGender('Female')}
            >
              <Text style={styles.genderOptionText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderOption, styles.genderCancel]}
              onPress={() => setGenderModalVisible(false)}
            >
              <Text style={[styles.genderOptionText, styles.genderCancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirmation Modal */}
      <CenteredModal visible={modalVisible} intensity={30}>
        <>
          <Text style={styles.confirmTitle}>Confirm Update?</Text>
          <Text style={styles.confirmText}>
            Are you sure you want to update your profile?
          </Text>

          <TouchableOpacity style={styles.confirmButton} onPress={handleUpdate}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      </CenteredModal>
    </SafeAreaView>
  );
};

// --- Add Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    marginRight: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicTouchable: {
    width: 160,
    height: 160,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    color: '#9ca3af',
    marginTop: 8,
  },
  editIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'black',
    padding: 4,
    borderRadius: 999,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#6b7280',
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  pickerTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#aaa',
  },
  updateButton: {
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 999,
    marginTop: 40,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  // Gender Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  genderModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  genderOption: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  genderCancel: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  genderOptionText: {
    fontSize: 16,
  },
  genderCancelText: {
    color: 'red',
  },
  // iOS Date Picker Done Button
  iosPickerDoneButton: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  iosPickerDoneText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Confirmation Modal Styles
  confirmTitle: {
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmText: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 999,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditProfile;
