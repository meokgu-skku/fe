/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, ScrollView, Text, View, StyleSheet} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import 'react-native-gesture-handler';

export default function App() {
  return <MainStackNavigator />;
}

const styles = StyleSheet.create({
  entire: {},
});
