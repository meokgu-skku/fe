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
  Platform,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT60GRAY,
} from '../assets/color';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';
import Header from './Header';
import AppContext from './AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import ImageModal from 'react-native-image-modal';

const windowWidth = Dimensions.get('window').width;

export default function StoreCompo(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const {storeData, index, addPadding, fade} = props;

  return (
    <Pressable
      key={index.toString()}
      style={{
        width: addPadding ? windowWidth - 32 : windowWidth - 32,
        // height: windowWidth / 3,
        paddingHorizontal: addPadding,
        // backgroundColor: storeData.id % 2 === 0 ? 'red' : 'blue',
        // backgroundColor: 'blue',
      }}
      onPress={() => {
        console.log('가게 상세 페이지로 이동');
        navigation.navigate('StoreDetail', {data: storeData});
      }}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            position: 'absolute',
            width: windowWidth / 3,
            height: windowWidth / 3,
            backgroundColor: COLOR_BACKGROUND,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.5,
          }}>
          <SvgXml xml={svgXml.icon.noImage} width="140" height="140" />
        </View>
        <Image
          resizeMode="cover"
          style={{
            width: windowWidth / 3,
            height: windowWidth / 3,
            borderRadius: 10,
          }}
          source={{
            uri: storeData.representativeImageUrl,
          }}
        />

        {fade ? (
          <View
            style={{
              position: 'absolute',
              width: windowWidth / 3,
              height: windowWidth / 3,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 10,
            }}
          />
        ) : null}
        <View
          style={{
            flex: 1,
            marginLeft: 12,
            // backgroundColor: 'green',
          }}>
          <Text
            style={{
              fontSize: 15,
              color: COLOR_TEXT_BLACK,
              // fontWeight: 'bold',
              fontFamily: 'NanumSquareRoundR',
              // fontFamily: 'NIXGONFONTS M 2.0',
              alignSelf: 'flex-start',
            }}>
            {storeData.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 2,
            }}>
            <SvgXml xml={svgXml.icon.star} width="15" height="15" style={{}} />
            <Text
              style={{
                fontSize: 11,
                color: COLOR_TEXT70GRAY,
                // fontWeight: 'bold',
                fontFamily: 'NanumSquareRoundB',
                // fontFamily: 'NIXGONFONTS M 2.0',
                alignSelf: 'center',
                marginLeft: 3,
              }}>
              {storeData.ratingAvg.toFixed(1) +
                ' (' +
                storeData.reviewCount +
                ')'}
            </Text>
            <SvgXml
              xml={svgXml.icon.heart}
              width="15"
              height="15"
              style={{marginLeft: 7}}
            />
            <Text
              style={{
                fontSize: 11,
                color: COLOR_TEXT70GRAY,
                // fontWeight: 'bold',
                fontFamily: 'NanumSquareRoundB',
                alignSelf: 'center',
                marginLeft: 3,
              }}>
              {storeData.likeCount}
            </Text>
            <SvgXml
              xml={svgXml.icon.naver}
              width={15}
              height={15}
              style={{marginLeft: 10}}
            />
            <Text
              style={{
                fontSize: 11,
                color: COLOR_TEXT70GRAY,
                // fontWeight: 'bold',
                fontFamily: 'NanumSquareRoundB',
                // fontFamily: 'NIXGONFONTS M 2.0',
                alignSelf: 'center',
                marginLeft: 3,
              }}>
              {storeData.naverRatingAvg +
                ' (' +
                storeData.naverReviewCount +
                ')'}
            </Text>
          </View>

          {storeData.categories ? (
            storeData.categories.length ? (
              <Text
                style={{
                  fontSize: 12,
                  color: COLOR_GRAY,
                  fontFamily: 'NanumSquareRoundB',
                  marginVertical: 2,
                }}>
                {storeData.categories[0]}
              </Text>
            ) : null
          ) : null}

          {storeData.representativeMenu ? (
            <Text
              style={{
                fontSize: 13,
                color: COLOR_TEXT_BLACK,
                fontFamily:
                  Platform.OS == 'android' ? 'NIXGONFONTS M 2.0' : 'NIXGONM-Vb',
              }}>
              {storeData.representativeMenu.name}
            </Text>
          ) : null}

          <View style={styles.line} />

          {storeData.representativeReviewContent ? (
            <>
              <Text numberOfLines={3} style={styles.review}>
                {storeData.representativeReviewContent}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.review}>{'아직 작성된 리뷰가 없어요!'}</Text>
              <Text numberOfLines={2} style={styles.review}>
                {`먹구스꾸에서 ${storeData.name} 리뷰 쓰고 첫 리뷰의 주인공이 되어보세요!`}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  line: {
    marginVertical: 8,
    height: 0.5,
    backgroundColor: '#D9D9D9', // Change color as needed
    width: '100%', // Adjust width as needed
  },
  review: {
    fontSize: 11,
    color: COLOR_TEXT70GRAY,
    fontFamily: 'NanumSquareRoundR',
    marginRight: 5,
  },
});
