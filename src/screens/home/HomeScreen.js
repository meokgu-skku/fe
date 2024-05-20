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

  const [todaysPick, setTodaysPick] = useState([
    {
      name: '율천회관',
      category: '한식',
      menu: '육회비빔밥',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/max.jpeg',
      score: 4.5,
      reviewCount: 100,
      heartCount: 20,
      firstReview: {
        reviewer: '엄승주',
        body: '가게 내부 깨끗하고, 서비스 친절해서 개좋음. 기대안하고 첨 갔는데 걍 인생 oo 맛봄. 지림.',
      },
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
      score: 4.5,
      reviewCount: 100,
      heartCount: 20,
      firstReview: {
        reviewer: '엄승주',
        body: '가게 내부 깨끗하고, 서비스 친절해서 개좋음. 기대안하고 첨 갔는데 걍 인생 oo 맛봄. 지림.',
      },
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
      score: 4.5,
      reviewCount: 100,
      heartCount: 20,
      firstReview: {
        reviewer: '엄승주',
        body: '가게 내부 깨끗하고, 서비스 친절해서 개좋음. 기대안하고 첨 갔는데 걍 인생 oo 맛봄. 지림.',
      },
    },
  ]);

  const [kingoPassData, setkingoPassData] = useState([]);

  const initKingoPassData = async () => {
    try {
      console.log('context.accessToken:', context.accessToken);

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

      console.log('response:', response.data.data.restaurants[0]);

      setkingoPassData(response.data.data.restaurants);
    } catch (e) {
      console.log('error', e);
    }
  };

  const initTodayPickData = async () => {
    try {
      //TODO: 백엔드 연결
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    initKingoPassData();
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
