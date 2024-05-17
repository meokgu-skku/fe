/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Keyboard,
  Pressable,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_SECONDARY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import axios, {AxiosError} from 'axios';
import HeaderWhite from '../../components/HeaderWhite';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import LongPrimaryButton from '../../components/LongPrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../components/AppContext';

export default function PrifileSetScreen(props) {
  const navigation = useNavigation();
  const {route} = props;
  const signUpData = route.params;

  const [checkNum, setCheckNum] = useState('');
  const [disable, setDisable] = useState(true);

  const signUp = async () => {
    console.log('name:', signUpData.name);
    console.log('email:', signUpData.email);
    console.log('password:', signUpData.password);

    try {
      //회원가입 하고 토큰 저장하는 부분
      const response = await axios.post(`${API_URL}/v1/users/email/sign-up`, {
        email: signUpData.email,
        nickname: signUpData.name,
        password: signUpData.password,
      });
      console.log('response:', response.data.data);

      if (!response.data.data) {
        console.log('Error: No return data');
        return;
      }
      const accessToken = response.data.data.token.accessToken;
      const refreshToken = response.data.data.token.refreshToken;

      // context.setAccessTokenValue(accessToken);
      // context.setRefreshTokenValue(refreshToken);
      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('refreshToken', refreshToken);

      navigation.navigate('BottomTab');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    if (checkNum.length == 6 && disable) {
      setDisable(false);
    } else if (checkNum.length != 6 && !disable) {
      setDisable(true);
    }
  }, [checkNum]);

  return (
    <>
      <HeaderWhite title={'프로필 설정'} isBackButton={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>닉네임</Text>
              <TextInput
                // onSubmitEditing={endPasswordInput}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setCheckNum(value);
                }}
                value={checkNum}
                style={styles.textinputBox}
              />
            </View>
          </View>

          <View style={{height: 20}} />
          <LongPrimaryButton
            text={'회원가입'}
            action={signUp}
            disable={disable}
          />
          <View
            style={{
              marginTop: 12,
              padding: 4,
            }}>
            <Text style={styles.samllText}>
              {'가입하시면 이용약관 및 개인정보 보호정책에'}
            </Text>
            <Text style={[styles.samllText, {marginTop: -5}]}>
              {'자동으로 동의하게 됩니다.'}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  textAndInput: {
    width: '100%',
    // backgroundColor: 'blue',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  samllText: {
    color: COLOR_TEXT70GRAY,
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
    paddingVertical: 4,
  },
  textinputBox: {
    padding: 0,
    fontSize: 15,
    height: 45,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR_TEXT70GRAY,
  },
  showButton: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    padding: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
