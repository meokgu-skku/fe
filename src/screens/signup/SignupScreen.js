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
import axios from 'axios';
import HeaderWhite from '../../components/HeaderWhite';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import LongPrimaryButton from '../../components/LongPrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../components/AppContext';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const [disable, setDisable] = useState(true);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const context = useContext(AppContext);

  //state name, email, password 가 변경될 때마다 실행
  useEffect(() => {
    if (name && email && password) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [name, email, password]);

  const endEmailInput = () => {
    passwordInputRef.current.focus();
  };

  const endNameInput = () => {
    emailInputRef.current.focus();
  };

  const signUp = async () => {
    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', password);

    try {
      //TODO: 회원가입 API확인
      //회원가입 하고 토큰 저장하는 부분
      // const response = await axios.post(
      //   `${API_URL}​/v1​/users​/email​/sign-up`,
      //   {
      //     email: email,
      //     nickname: name,
      //     password: password,
      //   },
      // );
      // console.log('response:', response.data.data);

      // if (!response.data.data) {
      //   console.log('Error: No return data');
      //   return;
      // }
      // const accessToken = response.data.data.accessToken;
      // const refreshToken = response.data.data.refreshToken;

      // context.setAccessTokenValue(accessToken);
      // context.setRefreshTokenValue(refreshToken);
      // AsyncStorage.setItem('accessToken', accessToken);
      // AsyncStorage.setItem('refreshToken', refreshToken);

      navigation.navigate('BottomTab');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <>
      <HeaderWhite title={'회원가입'} isBackButton={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>이름</Text>
              <TextInput
                ref={nameInputRef}
                onSubmitEditing={endNameInput}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setName(value);
                }}
                value={name}
                style={styles.textinputBox}
              />
            </View>

            <View style={{height: 15}} />

            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>이메일 주소</Text>
              <TextInput
                ref={emailInputRef}
                onSubmitEditing={endEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setEmail(value);
                }}
                value={email}
                style={styles.textinputBox}
              />
            </View>

            <View style={{height: 15}} />

            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>비밀 번호</Text>
              <AnimatedButton
                style={styles.showButton}
                onPress={() => {
                  setPasswordShow(!passwordShow);
                }}>
                <SvgXml
                  width={20}
                  height={13}
                  xml={
                    passwordShow
                      ? svgXml.button.passwordShow
                      : svgXml.button.passwordNotShow
                  }
                />
              </AnimatedButton>
              <TextInput
                ref={passwordInputRef}
                onSubmitEditing={signUp}
                secureTextEntry={passwordShow}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setPassword(value);
                }}
                value={password}
                style={styles.textinputBox}
              />
            </View>
          </View>

          <View style={{height: 20}} />
          <LongPrimaryButton
            text="회원가입"
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
  },
  container: {
    width: '90%',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 140,
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
    top: 0,
    padding: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
