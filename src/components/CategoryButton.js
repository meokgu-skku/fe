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
  COLOR_SECONDARY,
  COLOR_TEXT60GRAY,
} from '../assets/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';
import Header from '../components/Header';
import AppContext from '../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import AnimatedButton from './AnimationButton';
import {astToReact} from 'react-native-svg/lib/typescript/xml';

const windowWidth = Dimensions.get('window').width;

export default function CategoryButton(props) {
  const {onPress, data} = props;

  const navigation = useNavigation();
  const context = useContext(AppContext);

  const categroyList1 = ['한식', '양식', '일식', '중식', '분식'];
  const categroyList2 = ['치킨', '피자', '버거', '아시안', '카페'];

  return (
    <View style={styles.todayPick}>
      <View style={styles.buttonLine}>
        {categroyList1.map((categroy, index) => {
          const n = index + 1;
          return (
            <AnimatedButton
              style={styles.buttonSet}
              onPress={async () => {
                if (data.includes(categroy)) {
                  const filtered = data.filter(item => item !== categroy);
                  onPress(filtered);
                } else {
                  onPress([...data, categroy]);
                }
              }}>
              <View
                key={index}
                style={[
                  styles.categroyButton,
                  data.includes(categroy)
                    ? {backgroundColor: COLOR_SECONDARY, borderRadius: 20}
                    : null,
                ]}>
                {n === 1 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/1.png')}
                  />
                ) : n === 2 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/2.png')}
                  />
                ) : n === 3 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/3.png')}
                  />
                ) : n === 4 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/4.png')}
                  />
                ) : (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/5.png')}
                  />
                )}
              </View>
              <Text style={styles.categroyText2}>{categroy}</Text>
            </AnimatedButton>
          );
        })}
      </View>

      <View style={{height: 13}} />
      <View style={styles.buttonLine}>
        {categroyList2.map((categroy, index) => {
          const n = index + 1;
          return (
            <AnimatedButton
              style={styles.buttonSet}
              onPress={async () => {
                if (data.includes(categroy)) {
                  const filtered = data.filter(item => item !== categroy);
                  onPress(filtered);
                } else {
                  onPress([...data, categroy]);
                }
              }}>
              <View
                key={index}
                style={[
                  styles.categroyButton,
                  data.includes(categroy)
                    ? {backgroundColor: COLOR_SECONDARY, borderRadius: 20}
                    : null,
                ]}>
                {n === 1 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/6.png')}
                  />
                ) : n === 2 ? (
                  <Image
                    style={styles.foodIcon2}
                    resizeMode="contain"
                    source={require('../assets/images/7.png')}
                  />
                ) : n === 3 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/8.png')}
                  />
                ) : n === 4 ? (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/9.png')}
                  />
                ) : (
                  <Image
                    style={styles.foodIcon}
                    resizeMode="contain"
                    source={require('../assets/images/10.png')}
                  />
                )}
              </View>
              <Text style={styles.categroyText2}>{categroy}</Text>
            </AnimatedButton>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todayPick: {
    width: windowWidth - 32,
    padding: 12,
    paddingHorizontal: 15,
  },
  todayPickTitle: {
    fontSize: 20,
    color: COLOR_PRIMARY,
    // fontWeight: '700',
    // fontFamily: 'NanumSquareRoundEB',
    fontFamily: 'NIXGONFONTS M 2.0',
  },
  line: {
    marginVertical: 8,
    height: 0.5,
    backgroundColor: '#D9D9D9', // Change color as needed
    width: '100%', // Adjust width as needed
  },
  buttonLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 3,
  },
  categroyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    width: 50,
    height: 50,
  },
  categroyText2: {
    fontSize: 13,
    color: COLOR_TEXT_BLACK,
    // fontWeight: 'bold',
    // fontFamily: 'NanumSquareRoundEB',
    fontFamily: 'NIXGONFONTS M 2.0',
  },
  buttonSet: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    // backgroundColor: 'red',
  },
  foodIcon: {
    width: 30,
    height: 30,
  },
  foodIcon2: {
    width: 25,
    height: 25,
  },
});
