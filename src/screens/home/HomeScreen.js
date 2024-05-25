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
      categories: [],
      detailInfo: {
        address: '경기 수원시 장안구 화산로233번길 46 1층',
        contactNumber: '031-293-9294',
        menus: [Array],
        operatingInfos: [Array],
      },
      discountContent: '',
      id: 1,
      isLike: false,
      likeCount: 0,
      name: '목구멍 율전점',
      operatingEndTime: '',
      operatingStartTime: '',
      ratingAvg: 0,
      representativeImageUrl:
        'https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https://ldb-phinf.pstatic.net/20230615_253/1686790793946ISiOc_JPEG/3%B9%F8.jpg',
      representativeMenu: {
        description: '시원 상큼한 하이볼3종',
        imageUrl:
          'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https://ldb-phinf.pstatic.net/20230525_34/16849976756701d50P_JPEG/Screenshot_20230525_095732_Samsung_Internet.jpg',
        isRepresentative: true,
        name: '하이볼(레몬, 자몽, 얼그레이)',
        price: 7000,
      },
      representativeReviewContent: null,
      reviewCount: 0,
    },
    {
      categories: [],
      detailInfo: {
        address: '경기 수원시 장안구 율전로98번길 9',
        contactNumber: '0507-1479-8592',
        menus: [Array],
        operatingInfos: [Array],
      },
      discountContent: '',
      id: 2,
      isLike: false,
      likeCount: 0,
      name: '고기굽는교실 율전3반',
      operatingEndTime: '',
      operatingStartTime: '',
      ratingAvg: 0,
      representativeImageUrl:
        'https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https://ldb-phinf.pstatic.net/20230915_138/1694761539253MqBUj_JPEG/temp_file.jpg',
      representativeMenu: null,
      representativeReviewContent: null,
      reviewCount: 0,
    },
    {
      categories: [],
      detailInfo: {
        address: '경기 수원시 장안구 율전로108번길 11 1층',
        contactNumber: '0507-1460-0903',
        menus: [Array],
        operatingInfos: [Array],
      },
      discountContent: '',
      id: 3,
      isLike: false,
      likeCount: 0,
      name: '봉수육',
      operatingEndTime: '',
      operatingStartTime: '',
      ratingAvg: 0,
      representativeImageUrl:
        'https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https://ldb-phinf.pstatic.net//20170607_114/1496834895537QbEYi_JPEG/IMG_0230.',
      representativeMenu: null,
      representativeReviewContent: null,
      reviewCount: 0,
    },
    {
      categories: [],
      detailInfo: {
        address: '경기 수원시 장안구 율전로108번길 9 율전미주타운 1층 102호',
        contactNumber: '0507-1315-4231',
        menus: [Array],
        operatingInfos: [Array],
      },
      discountContent: '음료 한정 테이크 아웃 30% 가격 할인',
      id: 4,
      isLike: false,
      likeCount: 0,
      name: '자명문',
      operatingEndTime: '',
      operatingStartTime: '',
      ratingAvg: 0,
      representativeImageUrl:
        'https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https://ldb-phinf.pstatic.net/20201124_92/16062108769605dpF3_JPEG/xSKJpp_WcxT4xlbe8Jsq6g-O.jpeg.jpg',
      representativeMenu: null,
      representativeReviewContent: null,
      reviewCount: 0,
    },
  ]);

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

      console.log('response:', response.data);

      // setTodaysPick(response.data.data.restaurants.content);
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
