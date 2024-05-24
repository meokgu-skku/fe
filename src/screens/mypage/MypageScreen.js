import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { COLOR_BACKGROUND, COLOR_PRIMARY } from '../../assets/color';
import MyReview from '../../components/MyReview';
import MyStore from '../../components/MyStore';

export default function MypageScreen() {
  const navigation = useNavigation();

  const [myReviews, setMyReviews] = useState([
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

  const [myStoresData, setMyStoresData] = useState([
    {
      name: '율천회관',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
    },
    {
      name: '무대뽀 핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/max.jpeg',
    },
    {
      name: '무대뽀 핫도그',
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/max.jpeg',
    },
  ]);

  return (
    <>
      <Header title={'마이 프로필'} isBackButton={false} />
      <ScrollView contentContainerStyle={styles.entire}>
        <Image
          style={[styles.myPageItem, styles.myPageItemLayout]}
          resizeMode="cover"
          source={require("../../assets/skku.png")}
        />
        <TouchableOpacity
          style={styles.text6Position}
          onPress={() => {
            navigation.navigate('UserDataChange');
          }}
        >
          <Text style={styles.text6}>사용자 이름</Text>
          <Image
            style={styles.arrowIcon}
            resizeMode="contain"
            source={require("../../assets/right-arrow.png")}
          />
        </TouchableOpacity>
        <MyStore passData={myStoresData} />
        <MyReview myReviews={myReviews} />
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
  },
  myPageItem: {
    width: 100,
    height: 100,
  },
  myPageItemLayout: {
    marginTop: 20,
    marginBottom: 20,
  },
  text6: {
    fontSize: 20,
    color: COLOR_PRIMARY,
    marginLeft: 20,
    marginRight: 5
  },
  text6Position: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
});
