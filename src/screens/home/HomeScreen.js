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
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
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

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const [todaysPick, setTodaysPick] = useState([
    {
      name: '율천회관',
      category: '한식',
      menu: '육회비빔밥',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/max.jpeg',
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
    },
  ]);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // console.log('offsetX', event.nativeEvent.layoutMeasurement.width);
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = Math.floor(offsetX / pageWidth + 0.5);
    // setCurrentPage(currentPage);
    // setCurrentDetailText(currentPage);
  };

  return (
    <>
      <Header title={'홈'} isBackButton={false} />
      <View style={styles.entire}>
        {/* 먹구스꾸 오늘의 픽 */}
        <View style={styles.todayPick}>
          <Text style={styles.todayPickTitle}>먹구스꾸's 오늘의 픽</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <ScrollView
              // showsVerticalScrollIndicator={false}
              // showsHorizontalScrollIndicator={true}
              style={
                {
                  // width: 325,
                }
              }
              horizontal
              pagingEnabled
              onScroll={handleScroll}
              // scrollEventThrottle={16} // 조정 가능한 값으로, 스크롤 이벤트의 빈도를 조절합니다.
              ref={scrollViewRef}>
              {/* {todaysPick.map((pickData, index) => {
                return (
                  <View
                    key={index.toString()}
                    style={{
                      width: 325,
                      backgroundColor: '#e0e0e0',
                    }}
                    onPress={() => {
                      console.log(index);
                    }}>
                    <Image
                      source={{
                        uri: pickData.image,
                      }}
                      resizeMode="cover"
                      style={{
                        width: 115,
                        height: 132,
                        borderRadius: 16,
                        // backgroundColor: 'red',
                      }}
                    />
                    <Text>{pickData.name}</Text>
                  </View>
                );
              })} */}
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMain: {
    fontSize: 50,
    color: COLOR_PRIMARY,
  },
  buttonTest: {
    backgroundColor: COLOR_PRIMARY,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: COLOR_WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  todayPick: {
    width: windowWidth - 32,
    padding: 12,
    paddingHorizontal: 10,
    backgroundColor: COLOR_WHITE,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // for Android
  },
  todayPickTitle: {
    fontSize: 20,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
});
