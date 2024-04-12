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

  const tryAutoLogin = async () => {
    try {
      // AsyncStorage(=디바이스에 저장하는 데이터)에 저장된 토큰을 가져온다.
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      //없으면 그만
      console.log('accessToken:', accessToken);
      if (accessToken == null) {
        return;
      }

      //토큰이 맞는지 확인 -> 헤더에 토큰 넣어서 백엔드 요청
      const response = await axios.get(`${API_URL}/hello/security-test`, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      console.log('response:', response.data.data);

      //토큰이 맞지 않으면 그만
      if (!response.data.data) {
        console.log('Error: No return data');
        return;
      }

      //토큰이 맞으면 context에 저장하고 화면 이동
      context.setAccessTokenValue(accessToken);
      context.setRefreshTokenValue(refreshToken);

      //화면 이동
      navigation.navigate('BottomTab');
    } catch (e) {
      console.log('error', e);
    }
  };

  // [] 에 state를 넣으면 state가 변경될 때마다 실행된다. 근데 아무것도 없으면 처음 로딩될때만 작동 = 초기화용
  useEffect(() => {
    tryAutoLogin();
  }, []);

  //버튼 눌렀을 때의 작동함수
  const pressButton = async () => {
    navigation.navigate('Login');
  };

  //이 함수형 컴포넌트가 화면에 보여지는 부분
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
