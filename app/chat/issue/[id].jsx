import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { images } from '../../../constants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  bill_chat,
  getBill,
  getIssue,
  issue_chat,
} from '../../../scripts/api/gpt';
import { useAlert } from '../../../context/AlertProvider';

const IssueChat = () => {
  const { id } = useLocalSearchParams();

  const scrollViewRef = useRef(null);

  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('true');
  const { showError } = useAlert();

  useEffect(() => {
    if (
      inputText === 'Explain the issue to me' ||
      inputText === 'Explain this to me as a farmer' ||
      inputText === 'Explain this to me like a 5 year old'
    ) {
      handleSend();
    }
  }, [inputText]);

  useEffect(() => {
    if (id) loadBillInformation();
  }, [id]);

  const loadBillInformation = async () => {
    try {
      setLoading(true); // ⬅️ start loading
      const response = await getIssue({ id: id });

      if (response.data.success) {
        // console.log(response.data.data.summary);
        setMessages([{ text: response.data.data.summary, sender: 'bot' }]);
        setData(response.data.data);
      }
    } catch (error) {
      showError('An error occurred while fetching issue data.');
      router.back();
    } finally {
      setLoading(false); // ⬅️ stop loading
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    setMessages([...messages, { text: inputText, sender: 'user' }]);
    const messagesCopy = inputText;
    setInputText('');
    setIsLoading(true);
    try {
      const response = await issue_chat({
        id: id,
        summary: data.summary,
        instruction: messagesCopy,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.response, sender: 'bot' },
      ]);
    } catch (error) {
      showError('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // ⬇️ Fullscreen loading screen
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600 font-medium">Loading Issue...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-6 bg-white flex-1 mb-20">
          <View className="flex-row items-center mb-7">
            <TouchableOpacity
              className="mr-9"
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <View />
          </View>

          <View className="mb-3"></View>
          <Text
            className={`${showSuggestions ? 'text-2xl' : 'text-xl'} font-base`}
          >
            {data.name}
          </Text>

          <View className="mb-2">
            <View className="mt-2 border-b-2 border-black" />
          </View>

          <ScrollView
            className="flex-1"
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                className={`p-4 my-2 rounded-xl ${
                  msg.sender === 'user' ? 'bg-gray-200 self-end' : ' self-start'
                }`}
                style={{ maxWidth: '75%' }}
              >
                <Text className="text-black leading-relaxed">{msg.text}</Text>
              </View>
            ))}

            {isLoading && (
              <View className="self-start bg-gray-100 p-4 rounded-xl mt-2">
                <ActivityIndicator size="small" color="gray" />
              </View>
            )}
          </ScrollView>
        </View>

        <View className="absolute bottom-6 left-1 right-1 bg-white">
          {showSuggestions && (
            <View className="space-y-3 mb-1">
              <TouchableOpacity
                className="bg-gray-200 px-6 py-4 rounded-full w-3/4 self-start mb-1 ml-2"
                onPress={() => {
                  setShowSuggestions(false);
                  setInputText('Explain the issue to me');
                }}
              >
                <Text className="text-gray-600 font-semibold">
                  Explain this issue to me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-200 px-6 py-4 rounded-full w-3/4 self-start mb-1 ml-2"
                onPress={() => {
                  setShowSuggestions(false);
                  setInputText('Explain this to me as a farmer');
                }}
              >
                <Text className="text-gray-600 font-semibold">
                  Explain this to me as a farmer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-200 px-6 py-4 rounded-full w-3/4 self-start mb-1 ml-2"
                onPress={() => {
                  setShowSuggestions(false);
                  setInputText('Explain this to me like a 5 year old');
                }}
              >
                <Text className="text-gray-600 font-semibold">
                  Explain this to me like a 5 year old
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View className="flex-row items-center bg-black rounded-full px-4 py-4 m-4">
            <Image source={images.ai_logo} className="w-8 h-8 mr-2" />
            <TextInput
              onPressIn={() => {
                setShowSuggestions(false);
              }}
              multiline
              numberOfLines={4}
              scrollEnabled
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask anything ...."
              placeholderTextColor={'white'}
              className="flex-1 text-white font-semibold"
              cursorColor={'white'}
              style={{
                maxHeight: 50,
                textAlignVertical: 'top',
              }}
            />
            <TouchableOpacity onPress={handleSend}>
              <Image source={images.send} className="w-8 h-8 mr-2" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default IssueChat;
