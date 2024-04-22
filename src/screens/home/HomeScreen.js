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
      score: 4.5,
      reviewCount: 100,
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
      score: 4.5,
      reviewCount: 100,
    },
    {
      name: '무대뽀 핫도그',
      category: '술집',
      menu: '핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
      score: 4.5,
      reviewCount: 100,
    },
  ]);

  // const handleScroll = event => {
  //   const offsetX = event.nativeEvent.contentOffset.x;
  //   // console.log('offsetX', event.nativeEvent.layoutMeasurement.width);
  //   const pageWidth = event.nativeEvent.layoutMeasurement.width;
  //   const currentPage = Math.floor(offsetX / pageWidth + 0.5);
  //   // setCurrentPage(currentPage);
  //   // setCurrentDetailText(currentPage);
  // };

  return (
    <>
      <Header title={'홈'} isBackButton={false} />
      <View style={styles.entire}>
        {/* 먹구스꾸 오늘의 픽 */}
        <View style={styles.todayPick}>
          <Text style={styles.todayPickTitle}>먹구스꾸's 오늘의 픽</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
            style={{
              // backgroundColor: 'green',
              marginTop: 10,
            }}
            horizontal={true}
            pagingEnabled
            // onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}>
            {todaysPick.map((pickData, index) => {
              return (
                <Pressable
                  key={index.toString()}
                  style={{
                    width: windowWidth - 52,
                  }}
                  onPress={() => {
                    console.log('가게 상세 페이지로 이동');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={{
                        uri: pickData.image,
                      }}
                      resizeMode="cover"
                      style={{
                        width: windowWidth / 3,
                        height: windowWidth / 3,
                        borderRadius: 16,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        // backgroundColor: 'green',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontSize: 17,
                            color: COLOR_TEXT_BLACK,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                          }}>
                          {pickData.name}
                        </Text>
                        <SvgXml
                          xml={svgXml.icon.star}
                          width="15"
                          height="15"
                          style={{marginLeft: 7}}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLOR_TEXT70GRAY,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                            marginLeft: 7,
                          }}>
                          {pickData.score + ' (' + pickData.reviewCount + ')'}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontSize: 13,
                          color: COLOR_GRAY,
                        }}>
                        {pickData.category}
                      </Text>

                      <Text
                        style={{
                          fontSize: 13,
                          color: COLOR_TEXT_BLACK,
                        }}>
                        {pickData.menu}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
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
