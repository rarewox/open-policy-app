import React, { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import '../global.css';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import GlobalProvider from '../context/GlobalContextProvider';
import RepresentativeProvider from '../context/RepresentativeContext';
import RegisterProvider from '../context/RegisterContext';
import { AlertProvider } from '../context/AlertProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  return (
    //! NOTE: AWS TRANSLATOR, GOOGLE TRANSLATOR FOR FRENCH

    // <NavigationContainer>
    <SafeAreaProvider>
      <GlobalProvider>
        <AlertProvider>
          <RegisterProvider>
            <RepresentativeProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="auth/forgot/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/forgot/otp"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/forgot/password"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/forgot/complete"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/register/name"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/register/number"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/register/otp"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/register/password"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/register/welcome"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/login"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="chat/[bill]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="chat/issue/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="disclosures/privacy-policy"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="disclosures/terms-of-service"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="issues/add"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="bills/[bill]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="issues/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="issues/delete/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="politicians/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/activity"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/edit"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/issues-raised"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/password"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/postal"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/saved-bills"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="profile/votes-cast"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="webview/[url]"
                  options={{ headerShown: false }}
                />
              </Stack>
            </RepresentativeProvider>
          </RegisterProvider>
        </AlertProvider>
      </GlobalProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
