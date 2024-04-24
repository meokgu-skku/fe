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
import Header from '../components/Header';
import AppContext from '../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import StoreCompo from './StoreCompo';
import AnimatedButton from './AnimationButton';

const windowWidth = Dimensions.get('window').width;

export default function KingoPass(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const {passData} = props;

  return (
    <View style={styles.kingopass}>
      <Text style={styles.kingopassTitle}>성대생 할인, 킹고패스</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          marginTop: 10,
        }}
        horizontal={true}
        ref={scrollViewRef}>
        <View style={{width: 16}} />
        {passData.map((data, index) => {
          return (
            <AnimatedButton
              key={index.toString()}
              style={styles.kingopassKard}
              // TODO: 킹고패스 페이지로 이동
              onPress={() => {
                console.log('킹고패스 페이지로 이동');
              }}>
              <Image
                source={{
                  uri: data.image,
                }}
                resizeMode="cover"
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  borderRadius: 10,
                  width: 140,
                  height: 140,
                  backgroundColor: '#000000',
                  opacity: 0.4,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  borderRadius: 10,
                  width: 140,
                  height: 140,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    color: COLOR_WHITE,
                    fontWeight: 'bold',
                    margin: 10,
                  }}>
                  {data.name}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    fontSize: 12,
                    color: '#A4D65E',
                    fontWeight: 'bold',
                    margin: 10,
                  }}>
                  {data.body}
                </Text>
              </View>
            </AnimatedButton>
          );
        })}
        <View style={{width: 16}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  kingopass: {
    marginTop: 15,
    width: windowWidth,
    // padding: 12,
    paddingHorizontal: 0,
  },
  kingopassTitle: {
    fontSize: 20,
    marginLeft: 26,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
  line: {
    marginVertical: 8,
    height: 0.5,
    backgroundColor: '#D9D9D9', // Change color as needed
    width: '100%', // Adjust width as needed
  },
  kingopassKard: {
    height: 140,
    width: 140,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
