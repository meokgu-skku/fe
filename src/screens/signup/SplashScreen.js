import React, {useState, useCallback, useEffect, useContext} from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LongPrimaryButton from '../../components/LongPrimaryButton';
import AppContext from '../../components/AppContext';

export default function SplashScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  //TODO: 저장된 토큰 가져와서 로그인 시도해보는 로직
  const tryAutoLogin = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (accessToken == null || refreshToken == null) {
        return;
      }

      //TODO: 토큰 로그인 API확인
      //토큰으로 로그인 하는  부분
      // const response = await axios.get(
      //   `${API_URL}/hello/security-test`
      // );
      // console.log('response:', response.data.data);

      // if (!response.data.data) {
      //   console.log('Error: No return data');
      //   return;
      // }

      context.setAccessTokenValue(accessToken);
      context.setRefreshTokenValue(refreshToken);
      navigation.navigate('BottomTab');
    } catch (e) {
      console.log('error', e);
    }
  };

  // run at first time
  useEffect(() => {
    tryAutoLogin();
  }, []);

  const pressButton = async () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.entire}>
      <Text style={styles.textMain}>먹구스꾸</Text>

      <View style={styles.buttonContainer}>
        <LongPrimaryButton text="시작하기" action={pressButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
  },
  textMain: {
    fontSize: 35,
    color: COLOR_TEXT70GRAY,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 76,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
