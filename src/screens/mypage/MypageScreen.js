import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from '../../components/Header';
import {
  COLOR_BACKGROUND,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT_DARKGRAY,
} from '../../assets/color';
import MyReview from '../../components/MyReview';
import MyStore from '../../components/MyStore';
import axios from 'axios';
import AppContext from '../../components/AppContext';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyPageScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myStoresData, setMyStoresData] = useState([]);
  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [reviewPage, setReviewPage] = useState(0);
  const [storePage, setStorePage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [hasMoreStores, setHasMoreStores] = useState(true);
  const [email, setEmail] = useState('');

  const fetchUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('User ID:', userId);

      const response = await axios.get(`${API_URL}/v1/users/${userId}`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });
      console.log('User Info:', response.data);
      setNickname(response.data.data.userDto.nickname);
      setProfileImageUrl(response.data.data.userDto.profileImageUrl);
      setEmail(response.data.data.userDto.email);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchMyReviews = async page => {
    try {
      const response = await axios.get(
        `${API_URL}/v1/restaurants/my-reviews?page=${page}&size=5`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );

      console.log('My Reviews:', response.data);

      const reviews = response.data.data.reviews.content.map(review => ({
        id: review.id,
        image: review.imageUrls[0],
        score: review.rating,
        reviewCount: review.viewCount,
        heartCount: review.likeCount,
        firstReview: {
          reviewer: review.username,
          body: review.content,
        },
      }));

      setMyReviews(prevReviews => [...prevReviews, ...reviews]);
      setHasMoreReviews(response.data.data.reviews.content.length > 0);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedStores = async page => {
    try {
      const response = await axios.get(
        `${API_URL}/v1/restaurants/my-like?page=${page}&size=20`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );

      console.log(
        'Liked Stores Response:',
        response.data.data.restaurants.content,
      );

      const stores = response.data.data.restaurants.content.map(store => ({
        name: store.name,
        image: store.representativeImageUrl,
        id: store.id,
      }));

      setMyStoresData(prevStores => [...prevStores, ...stores]);
      setHasMoreStores(!response.data.data.restaurants.last);
    } catch (error) {
      console.error('Failed to fetch liked stores:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
      setReviewPage(0);
      setStorePage(0);
      // setMyReviews([]);
      // setMyStoresData([]);
      // fetchMyReviews(0);
      // fetchLikedStores(0);
    }, []),
  );

  useEffect(() => {
    fetchMyReviews(reviewPage);
  }, [context.accessToken, reviewPage]);

  useEffect(() => {
    fetchLikedStores(storePage);
  }, [context.accessToken, storePage]);

  const handleLoadMoreReviews = () => {
    if (hasMoreReviews) {
      setReviewPage(prevPage => prevPage + 1);
    }
  };

  const handleLoadMoreStores = () => {
    if (hasMoreStores) {
      setStorePage(prevPage => prevPage + 1);
    }
  };

  return (
    <>
      <Header title={'내 프로필'} isBackButton={false} />
      <ScrollView contentContainerStyle={styles.entire}>
        <Image
          style={[styles.myPageItem, styles.myPageItemLayout]}
          resizeMode="cover"
          source={
            profileImageUrl
              ? {uri: profileImageUrl}
              : require('../../assets/skku.png')
          }
        />
        <TouchableOpacity
          style={styles.text6Position}
          onPress={() => {
            navigation.navigate('UserDataChange');
          }}>
          <Text style={styles.text6}>{nickname}</Text>
          <Image
            style={styles.arrowIcon}
            resizeMode="contain"
            source={require('../../assets/right-arrow.png')}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text7}>이메일 주소</Text>
          <Text style={styles.text8}> {email}</Text>
        </View>

        <MyStore
          passData={myStoresData}
          onEndReached={handleLoadMoreStores}
          hasMore={hasMoreStores}
        />
        {loading ? (
          <ActivityIndicator size="large" color={COLOR_PRIMARY} />
        ) : (
          <MyReview
            myReviews={myReviews}
            onEndReached={handleLoadMoreReviews}
            hasMore={hasMoreReviews}
          />
        )}
        <View style={{height: 100}} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
    flex: 1,
  },
  myPageItem: {
    width: 100,
    height: 100,
  },
  myPageItemLayout: {
    marginTop: 20,
    marginBottom: 10,
  },
  text6: {
    fontSize: 20,
    color: COLOR_TEXT70GRAY,
    marginLeft: 20,
    marginRight: 5,
    fontWeight: 'bold',
  },
  text7: {
    fontSize: 12,
    color: COLOR_TEXT70GRAY,
    marginRight: 6,
  },
  text8: {
    fontSize: 12,
    color: COLOR_TEXT70GRAY,
    fontWeight: 'bold',
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
