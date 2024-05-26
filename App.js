/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import AppContext from './src/components/AppContext';

import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View, StyleSheet} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import 'react-native-gesture-handler';

export default function App() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [id, setId] = useState('');

  const setAccessTokenValue = string => {
    setAccessToken(string);
  };

  const setRefreshTokenValue = string => {
    setRefreshToken(string);
  };

  const setIdValue = string => {
    setId(string);
  };

  const tokens = {
    accessToken: accessToken,
    setAccessTokenValue,
    refreshToken: refreshToken,
    setRefreshTokenValue,
    id: id,
    setIdValue,
  };

  return (
    <AppContext.Provider value={tokens}>
      <MainStackNavigator />
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  entire: {},
});
