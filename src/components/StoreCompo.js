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

  const {storeData, index, addPadding} = props;

  return (
    <Pressable
      key={index.toString()}
      style={{
        width: addPadding
          ? windowWidth - 32 - 2 * addPadding
          : windowWidth - 32,
        height: windowWidth / 3,
        // backgroundColor: 'blue',
      }}
      onPress={() => {
        console.log('가게 상세 페이지로 이동');
        navigation.navigate('StoreDetail', {data: storeData});
      }}>
      <View style={{flexDirection: 'row'}}>
        <ImageModal
          swipeToDismiss={true}
          modalImageResizeMode="contain"
          // resizeMode="contain"
          imageBackgroundColor="transparent"
          overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
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
        <View
          style={{
            flex: 1,
            marginLeft: 12,
            // backgroundColor: 'green',
          }}>
          <Text
            style={{
              fontSize: 17,
              color: COLOR_TEXT_BLACK,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}>
            {storeData.name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SvgXml xml={svgXml.icon.star} width="15" height="15" style={{}} />
            <Text
              style={{
                fontSize: 12,
                color: COLOR_TEXT70GRAY,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginLeft: 7,
              }}>
              {storeData.ratingAvg + ' (' + storeData.reviewCount + ')'}
            </Text>
            <SvgXml
              xml={svgXml.icon.heart}
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
              {storeData.likeCount}
            </Text>
          </View>

          {storeData.categories ? (
            storeData.categories.length ? (
              <Text
                style={{
                  fontSize: 13,
                  color: COLOR_GRAY,
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
              }}>
              {storeData.representativeMenu.name}
            </Text>
          ) : null}

          <View style={styles.line} />

          {storeData.representativeReviewContent ? (
            <>
              <Text
                style={{
                  fontSize: 11,
                  color: COLOR_TEXT70GRAY,
                }}>
                {storeData.representativeReviewContent.reviewer + ' 님'}
              </Text>
              <Text
                numberOfLines={4}
                style={{
                  fontSize: 11,
                  color: COLOR_TEXT60GRAY,
                }}>
                {storeData.representativeReviewContent.body}
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 11,
                  color: COLOR_TEXT70GRAY,
                }}>
                {'아직 작성된 리뷰가 없어요!'}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  color: COLOR_TEXT60GRAY,
                }}>
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
});
