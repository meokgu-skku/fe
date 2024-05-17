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

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckShow, setPasswordCheckShow] = useState(true);
  const [disable, setDisable] = useState(true);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordCheckInputRef = useRef(null);
  const context = useContext(AppContext);

  //state name, email, password 가 변경될 때마다 실행
  useEffect(() => {
    if (
      name &&
      email &&
      password &&
      disable &&
      passwordCheck &&
      password === passwordCheck
    ) {
      setDisable(false);
    } else if (
      (!name ||
        !email ||
        !password ||
        !passwordCheck ||
        password !== passwordCheck) &&
      !disable
    ) {
      setDisable(true);
    }
  }, [name, email, password, passwordCheck]);

  const endEmailInput = () => {
    passwordInputRef.current.focus();
  };

  const endNameInput = () => {
    emailInputRef.current.focus();
  };

  const endPasswordInput = () => {
    passwordCheckInputRef.current.focus();
  };

  const signUp = async () => {
    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', password);

    try {
      const response = await axios.post(`${API_URL}/v1/users/email/send`, {
        email: email,
        sendType: 'SIGN_UP',
      });

      console.log('response:', response.data);

      if (response.data.result === 'SUCCESS') {
        navigation.navigate('CheckEmail', {
          name: name,
          email: email,
          password: password,
        });
      }
    } catch (error) {
      const errorResponse = AxiosError.response;
      console.log(errorResponse);
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
              <Text style={styles.samllText}>비밀번호</Text>
              <TextInput
                ref={passwordInputRef}
                onSubmitEditing={endPasswordInput}
                secureTextEntry={passwordShow}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setPassword(value);
                }}
                value={password}
                style={styles.textinputBox}
              />
              <AnimatedButton
                style={styles.showButton}
                onPress={() => {
                  setPasswordShow(!passwordShow);
                }}>
                <SvgXml
                  width={20}
                  height={20}
                  xml={
                    passwordShow
                      ? svgXml.button.passwordShow
                      : svgXml.button.passwordNotShow
                  }
                />
              </AnimatedButton>
            </View>

            <View style={{height: 15}} />

            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>비밀번호 확인</Text>
              <TextInput
                ref={passwordCheckInputRef}
                secureTextEntry={passwordCheckShow}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setPasswordCheck(value);
                }}
                value={passwordCheck}
                style={styles.textinputBox}
              />
              <AnimatedButton
                style={styles.showButton}
                onPress={() => {
                  setPasswordCheckShow(!passwordCheckShow);
                }}>
                <SvgXml
                  width={20}
                  height={20}
                  xml={
                    passwordCheckShow
                      ? svgXml.button.passwordShow
                      : svgXml.button.passwordNotShow
                  }
                />
              </AnimatedButton>
            </View>
          </View>

          <View style={{height: 20}} />
          <LongPrimaryButton
            text={
              password === passwordCheck
                ? '회원가입'
                : '비밀번호가 일치하지 않습니다'
            }
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
