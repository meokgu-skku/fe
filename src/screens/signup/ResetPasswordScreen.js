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
  COLOR_HOME_BACKGROUND,
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

export default function ResetPasswordScreen(props) {
  const navigation = useNavigation();
  const {route} = props;
  const signUpData = route.params;

  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckShow, setPasswordCheckShow] = useState(true);
  const [disable, setDisable] = useState(true);

  const passwordInputRef = useRef(null);
  const passwordCheckInputRef = useRef(null);
  const context = useContext(AppContext);

  //state name, email, password 가 변경될 때마다 실행
  useEffect(() => {
    if (password && disable && passwordCheck && password === passwordCheck) {
      setDisable(false);
    } else if (
      (!password || !passwordCheck || password !== passwordCheck) &&
      !disable
    ) {
      setDisable(true);
    }
  }, [password, passwordCheck]);

  const endPasswordInput = () => {
    passwordCheckInputRef.current.focus();
  };

  function containsAll(text) {
    const hasAlphabet = /[a-zA-Z]/.test(text);
    const hasNumber = /\d/.test(text);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(text);

    return hasAlphabet && hasNumber && hasSpecial;
  }

  const resetPassword = async () => {
    console.log('email:', signUpData.email);
    console.log('token:', signUpData.token);
    console.log('password:', password);

    try {
      const response = await axios.patch(`${API_URL}/v1/users/password`, {
        email: signUpData.email,
        password: password,
        token: signUpData.token,
      });

      console.log('response2:', response.data);

      if (response.data.result === 'SUCCESS') {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <>
      <HeaderWhite title={'비밀번호 재설정'} isBackButton={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>새 비밀번호</Text>
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
                ? containsAll(password)
                  ? '회원가입'
                  : '영어, 숫자, 특수문자가 포함되어야 합니다.'
                : '비밀번호가 일치하지 않습니다'
            }
            action={resetPassword}
            disable={disable}
          />
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
    color: COLOR_PRIMARY,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 4,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundB',
    marginBottom: 8,
  },
  textinputBox: {
    height: 50,
    borderColor: '#F8F8F8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: COLOR_HOME_BACKGROUND,
    fontSize: 16,
    width: '100%',
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
