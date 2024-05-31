import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {
  COLOR_TEXT70GRAY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT60GRAY,
} from '../assets/color';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import ImageModal from 'react-native-image-modal';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';
import AppContext from './AppContext';
import axios from 'axios';
import {API_URL} from '@env';

const windowWidth = Dimensions.get('window').width;

export default function StoreCompoForR(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const {storeData, index} = props;

  const [storeInfo, setStoreInfo] = useState([]);

  const restaurantDetail = async () => {
    console.log('Id: ', storeData.restaurantId);
    try {
      const response = await axios.get(
        `${API_URL}/v1/restaurants/${storeData.restaurantId}`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );

      console.log('Restaurant heart:', response.data.data.restaurant);
      setStoreInfo(response.data.data.restaurant);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  useEffect(() => {
    restaurantDetail();
  }, []);

  return (
    <Pressable
      key={index.toString()}
      style={
        {
          // width: windowWidth - 32,
          // height: windowWidth / 3,
        }
      }
      onPress={() => {
        // console.log('가게 상세 페이지로 이동', storeData);
        navigation.navigate('StoreDetail', {data: storeData});
      }}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imageContainer}>
          {storeData.image ? (
            <ImageModal
              swipeToDismiss={true}
              modalImageResizeMode="contain"
              imageBackgroundColor="transparent"
              overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
              resizeMode="cover"
              style={styles.image}
              source={{
                uri: storeData.image || 'https://via.placeholder.com/150',
              }}
            />
          ) : (
            <ImageModal
              swipeToDismiss={true}
              modalImageResizeMode="contain"
              imageBackgroundColor="transparent"
              overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
              resizeMode="cover"
              style={styles.image}
              source={{uri: storeInfo.representativeImageUrl}}
            />
          )}
        </View>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.storeName} numberOfLines={1}>
            {storeInfo.name}.1
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 2,
            }}>
            <SvgXml xml={svgXml.icon.star} width="15" height="15" style={{}} />
            <Text style={styles.reviewText}>
              {storeInfo.ratingAvg} ({storeInfo.reviewCount})
            </Text>
            <SvgXml
              xml={svgXml.icon.heart}
              width="15"
              height="15"
              style={{marginLeft: 7}}
            />
            <Text style={styles.heartText}>{storeInfo.likeCount}</Text>
          </View>
          <Text style={styles.reviewerName}>
            {storeData.firstReview.reviewer + '님'}
          </Text>
          <ScrollView style={styles.reviewContent}>
            <Text style={styles.reviewBody}>
              {storeData.firstReview.body}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: windowWidth / 4,
    height: windowWidth / 4,
    borderWidth: 1,
    borderColor: COLOR_TEXT70GRAY,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: windowWidth / 4,
    height: windowWidth / 4,
  },
  storeName: {
    width: 245,
    fontSize: 15,
    color: COLOR_TEXT_BLACK,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundR',
    // fontFamily: 'NIXGONFONTS M 2.0',
    alignSelf: 'flex-start',
  },
  reviewText: {
    fontSize: 11,
    color: COLOR_TEXT70GRAY,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundB',
    // fontFamily: 'NIXGONFONTS M 2.0',
    alignSelf: 'center',
    marginLeft: 7,
  },
  heartText: {
    fontSize: 11,
    color: COLOR_TEXT70GRAY,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundB',
    // fontFamily: 'NIXGONFONTS M 2.0',
    alignSelf: 'center',
    marginLeft: 7,
  },
  reviewerName: {
    fontSize: 12,
    color: COLOR_TEXT70GRAY,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundB',
    marginVertical: 6,
    marginBottom: 10,
  },
//     reviewContent: {
//     fontSize: 14,
//     color: COLOR_TEXT_BLACK,
//     fontFamily: 'NanumSquareRoundB',
//     },
  reviewContent: {
    fontSize: 14,
    color: COLOR_TEXT_BLACK,
    fontFamily: 'NanumSquareRoundB',
    marginTop: 4,
    maxHeight: 180,
    padding: 4,
  },
  reviewBody: {
    fontSize: 15,
    color: COLOR_TEXT70GRAY,
    flexWrap: 'wrap',
    marginRight: 10,
  },
});
