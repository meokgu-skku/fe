/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_TEXT_BLACK,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import TodayPick from '../../components/TodayPick';
import FoodCategory from '../../components/FoodCategory';
import KingoPass from '../../components/KingoPass';

const windowWidth = Dimensions.get('window').width;

export default function ReviewWriteScreen(props) {
  const navigation = useNavigation();
  const {route} = props;
  const storeData = route.params?.data;

  console.log('storeData:', storeData);

  return (
    <>
      <Header title={'리뷰 쓰기'} isBackButton={true} />
      <ScrollView contentContainerStyle={styles.entire}>
        <Text>{storeData.name}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    backgroundColor: COLOR_BACKGROUND,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});
