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

const windowWidth = Dimensions.get('window').width;

export default function StoreCompo(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const {storeData, index} = props;

  return (
    <Pressable
      key={index.toString()}
      style={{
        width: windowWidth - 52,
      }}
      //TODO: 가게 상세 페이지로 이동
      onPress={() => {
        console.log('가게 상세 페이지로 이동');
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{
            uri: storeData.image,
          }}
          resizeMode="cover"
          style={{
            width: windowWidth / 3,
            height: windowWidth / 3,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 12,
            // backgroundColor: 'green',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 17,
                color: COLOR_TEXT_BLACK,
                fontWeight: 'bold',
                alignSelf: 'center',
              }}>
              {storeData.name}
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
              {storeData.score + ' (' + storeData.reviewCount + ')'}
            </Text>
            {/* TODO: 줄이 길어서 화면 밖으로 나감 */}
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
              {storeData.heartCount}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 13,
              color: COLOR_GRAY,
            }}>
            {storeData.category}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: COLOR_TEXT_BLACK,
            }}>
            {storeData.menu}
          </Text>

          <View style={styles.line} />

          <Text
            style={{
              fontSize: 11,
              color: COLOR_TEXT70GRAY,
            }}>
            {storeData.firstReview.reviewer + ' 님'}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 11,
              color: COLOR_TEXT60GRAY,
            }}>
            {storeData.firstReview.body}
          </Text>
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
