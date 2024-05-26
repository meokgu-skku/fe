import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { COLOR_BACKGROUND, COLOR_PRIMARY } from '../../assets/color';
import MyReview from '../../components/MyReview';
import MyStore from '../../components/MyStore';
import axios from 'axios';
import AppContext from '../../components/AppContext';
import { API_URL } from '@env';

export default function MypageScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myStoresData, setMyStoresData] = useState([]);
  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const fetchUserInfo = async () => {
    try {
      console.log(`Fetching user info with userId: ${context.id}`);
      console.log(`Using accessToken: ${context.accessToken}`);
      const response = await axios.get(
        `${API_URL}/v1/users/${context.id}`,
        {
          headers: { Authorization: `Bearer ${context.accessToken}` },
        }
      );

      console.log('User Info API Response:', response.data);
      setNickname(response.data.data.userDto.nickname);
      setProfileImageUrl(response.data.data.userDto.profileImageUrl);  
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/v1/restaurants/my-reviews`,
          {
            headers: { Authorization: `Bearer ${context.accessToken}` },
          }
        );

        console.log('My Review API Response:', response.data);

        const reviews = response.data.reviews ? response.data.reviews.map(review => ({
          id: review.id,
          image: review.imageUrls[0], 
          score: review.rating,
          reviewCount: review.viewCount,
          heartCount: review.likeCount,
          firstReview: {
            reviewer: review.username,
            body: review.content,
          },
        })) : [];

        setMyReviews(reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedStores = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/v1/restaurants/my-like`,
          {
            headers: { Authorization: `Bearer ${context.accessToken}` },
          }
        );

        console.log('Liked Stores API Response:', response.data);

        const stores = response.data.restaurants ? response.data.restaurants.map(store => ({
          name: store.name,
          image: store.representativeImageUrl,
        })) : [];

        setMyStoresData(stores);
      } catch (error) {
        console.error("Failed to fetch liked stores:", error);
      }
    };

    fetchMyReviews();
    fetchLikedStores();
  }, [context.accessToken, context.id]);

  return (
    <>
      <Header title={'내 프로필'} isBackButton={false} />
      <ScrollView contentContainerStyle={styles.entire}>
        <Image
          style={[styles.myPageItem, styles.myPageItemLayout]}
          resizeMode="cover"
          source={profileImageUrl ? { uri: profileImageUrl } : require("../../assets/skku.png")}  
        />
        <TouchableOpacity
          style={styles.text6Position}
          onPress={() => {
            navigation.navigate('UserDataChange');
          }}
        >
          <Text style={styles.text6}>{nickname}</Text>
          <Image
            style={styles.arrowIcon}
            resizeMode="contain"
            source={require("../../assets/right-arrow.png")}
          />
        </TouchableOpacity>
        <MyStore passData={myStoresData} />
        {loading ? (
          <ActivityIndicator size="large" color={COLOR_PRIMARY} />
        ) : (
          <MyReview myReviews={myReviews} />
        )}
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
