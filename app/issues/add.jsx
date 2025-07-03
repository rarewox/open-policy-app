import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CenteredModal from '../../components/CenteredModal';
import { create_issue } from '../../scripts/api/bills';
import { useAlert } from '../../context/AlertProvider';

const CreateIssue = () => {
  const [issueName, setIssueName] = useState('');
  const [issueSummary, setIssueSummary] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { showError, showSuccess } = useAlert();

  const issueForm = async () => {
    // console.log([issueName, issueSummary, issueDescription]);
    if (
      issueName.length > 0 &&
      issueSummary.length > 0 &&
      issueDescription.length > 0
    ) {
      try {
        const response = await create_issue({
          name: issueName,
          summary: issueSummary,
          description: issueDescription,
        });

        if (response.data.success) {
          showSuccess(response.data.message);
        }
      } catch (error) {
        showError(error.response?.data.message || error.message);
      } finally {
        setIssueName('');
        setIssueSummary('');
        setIssueDescription('');
        setModalVisible(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 p-6 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-7 px-4 py-2">
        <TouchableOpacity
          className="mr-9"
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className=""></View>
      </View>

      <Text className="text-3xl px-6 font-normal mb-6">Issue Form</Text>

      <ScrollView className="flex-1 px-6 bg-white">
        {/* Issue Name */}
        <Text className="text-gray-500 mb-2">Issue Name</Text>
        <TextInput
          className="border border-white border-b-gray-300 p-4 mb-6"
          placeholder="Enter issue name"
          value={issueName}
          onChangeText={setIssueName}
        />

        {/* Issue Summary */}
        <Text className="text-gray-500 mb-2">Issue Summary</Text>
        <TextInput
          className="border border-white border-b-gray-300 p-4 mb-6 text-base"
          placeholder="Enter issue summary"
          value={issueSummary}
          onChangeText={setIssueSummary}
          multiline
          textAlignVertical="top"
          style={{ minHeight: 100 }}
        />

        {/* Issue Description */}
        <Text className="text-gray-500 mb-2">Issue Description</Text>
        <TextInput
          className="border border-white border-b-gray-300 p-4 mb-6 text-base"
          placeholder="Enter issue description"
          value={issueDescription}
          onChangeText={setIssueDescription}
          multiline
          textAlignVertical="top"
          style={{ minHeight: 140 }}
        />
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-black py-4 mx-6 rounded-full"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center text-xl font-semibold">
          Submit Issue
        </Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <CenteredModal visible={modalVisible} intensity={30}>
        <>
          <Text className="text-3xl font-medium text-center mb-2">
            Submit Issue ?
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            If approved by admin this issue will be shown on your profile
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-black py-4 rounded-full mb-4"
            onPress={() => issueForm()}
          >
            <Text className="text-white text-center font-semibold">
              Confirm
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="mx-20"
          >
            <Text className="text-center text-black font-semibold">Cancel</Text>
          </TouchableOpacity>
        </>
      </CenteredModal>
    </SafeAreaView>
  );
};

export default CreateIssue;
