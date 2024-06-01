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
  COLOR_LIGHTGRAY,
  COLOR_HOME_BACKGROUND,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import axios from 'axios';
import HeaderWhite from '../../components/HeaderWhite';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import LongPrimaryButton from '../../components/LongPrimaryButton';
import AppContext from '../../components/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();

  //state 선언 -> UI에 영향을 미치는 변수들 만약 이게 바뀌었을때 화면이 바뀌어야하면 state로 선언
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState(true);
  const [disable, setDisable] = useState(true);

  //ref 선언 -> 요소를 직접 제어할때 사용
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // 앱내부에서 전역변수로 사용하는 것 쓰고싶으면 선언한다
  const context = useContext(AppContext);

  // [ ] 안의 State가 변경될 때마다 실행된다. 여기서는 email, password가 변경될 때마다 실행되서 로그인 버튼이 활성화 될지 비활성화 될지 결정한다.
  useEffect(() => {
    if (email && password && disable) {
      setDisable(false);
    } else if ((!email || !password) && !disable) {
      setDisable(true);
    }
  }, [email, password]);

  // 이메일 입력이 끝나면 패스워드 입력으로 커서를 이동시키는 함수
  const endEmailInput = () => {
    passwordInputRef.current.focus();
  };

  // 로그인 하는 함수 -> 버튼 누르면 & 입력하고 엔터 누르면 작동
  const login = async () => {
    console.log('email:', email);
    console.log('password:', password);

    try {
      // 백엔드 요청 -> 아직 로그인 전인 백엔드 요청이라 토큰이 필요없다.
      const response = await axios.post(`${API_URL}/v1/users/email/sign-in`, {
        email: email,
        password: password,
      });

      //출력
      console.log('response:', response.data.data);

      //백엔드에서 받은 데이터가 없으면 에러 출력
      if (!response.data.data) {
        console.log('Error: No return data');
        return;
      }

      //백엔드에서 받은 토큰을 저장하고 화면 이동
      const accessToken = response.data.data.token.accessToken;
      const refreshToken = response.data.data.token.refreshToken;
      const userId = response.data.data.userDto.id;

      //전역 변수에 저장
      context.setAccessTokenValue(accessToken);
      context.setRefreshTokenValue(refreshToken);
      context.setIdValue(userId);

      //디바이스에 저장
      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('refreshToken', refreshToken);
      AsyncStorage.setItem('userId', userId.toString());

      navigation.navigate('BottomTab');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>이메일</Text>
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
                placeholder=""
              />
            </View>
            <View style={{height: 20}} />
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>비밀 번호</Text>
              <TextInput
                ref={passwordInputRef}
                onSubmitEditing={login}
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
          </View>

          <View style={{height: 40}} />
          <LongPrimaryButton
            text="로그인하기"
            action={login}
            disable={disable}
          />
          <View
            style={{
              marginTop: 12,
              padding: 4,
            }}>
            <View style={{flexDirection: 'row'}}>
              <AnimatedButton
                onPress={() => {
                  navigation.navigate('FindPassword');
                }}
                style={{
                  // backgroundColor: 'blue',
                  padding: 30,
                  paddingVertical: 0,
                }}>
                <Text style={styles.samllTextColor}>비밀번호 찾기</Text>
              </AnimatedButton>
              <AnimatedButton
                onPress={() => {
                  navigation.navigate('Signup');
                }}
                style={{
                  // backgroundColor: 'red',
                  padding: 30,
                  paddingVertical: 0,
                }}>
                <Text style={styles.samllTextColor}>{'회원가입'}</Text>
              </AnimatedButton>
            </View>
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
    // marginTop: 200,
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
  samllTextColor: {
    color: COLOR_SECONDARY,
    fontSize: 12,
    // fontWeight: 'normal',
    fontFamily: 'NanumSquareRoundB',
    textAlign: 'center',
    paddingVertical: 4,
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
    right: 10,
    bottom: 8,
    padding: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
