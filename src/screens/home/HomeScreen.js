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
import axios, {AxiosError} from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import TodayPick from '../../components/TodayPick';
import FoodCategory from '../../components/FoodCategory';
import KingoPass from '../../components/KingoPass';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [todaysPick, setTodaysPick] = useState([]);

  const [kingoPassData, setkingoPassData] = useState([]);

  const initKingoPassData = async () => {
    try {
      // console.log('context.accessToken:', context.accessToken);

      const params = {
        discountForSkku: true,
      };

      const queryString = new URLSearchParams(params).toString();

      const response = await axios.get(
        `${API_URL}/v1/restaurants?${queryString}`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );

      // console.log('response:', response.data.data.restaurants.content[0]);

      setkingoPassData(response.data.data.restaurants.content);
    } catch (e) {
      console.log('error', e);
    }
  };

  const initTodayPickData = async () => {
    try {
      // console.log('context.accessToken:', context.accessToken);

      const response = await axios.get(`${API_URL}/v1/restaurants/recommend`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      console.log('response:', response.data.data.restaurants);

      setTodaysPick(response.data.data.restaurants);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    initKingoPassData();
    initTodayPickData();
  }, []);

  return (
    <>
      <Header title={'홈'} isBackButton={false} />
      <ScrollView contentContainerStyle={styles.entire}>
        {/* 먹구스꾸 오늘의 픽 */}
        <TodayPick todaysPick={todaysPick} />
        <FoodCategory />
        <KingoPass passData={kingoPassData} />
        <View style={{height: 100}} />
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
  buttonText: {
    fontSize: 20,
    color: COLOR_WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
