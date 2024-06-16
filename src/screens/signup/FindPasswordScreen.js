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
import Toast from 'react-native-toast-message';
import {
  COLOR_WHITE,
  COLOR_HOME_BACKGROUND,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import axios, {AxiosError} from 'axios';
import Header from '../../components/Header';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import LongPrimaryButton from '../../components/LongPrimaryButton';
import AppContext from '../../components/AppContext';

//TODO: 비밀번호 찾기 화면
export default function FindPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(true);

  const emailSend = async () => {
    console.log('email:', email);

    try {
      const response = await axios.post(`${API_URL}/v1/users/email/send`, {
        email: email,
        sendType: 'RESET_PASSWORD',
      });

      console.log('response:', response.data);

      if (response.data.result === 'SUCCESS') {
        navigation.navigate('CheckEmail2', {
          email: email,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    if (email && disable) {
      setDisable(false);
    } else if (!email && !disable) {
      setDisable(true);
    }
  }, [email]);

  return (
    <>
      <Header
        color={'white'}
        title={'비밀번호 찾기'}
        isBackButton={true}
        noSafe={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>이메일 주소</Text>
              <TextInput
                // onSubmitEditing={actions.onSearchButtonPressed}
                placeholderTextColor={COLOR_GRAY}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={value => {
                  setEmail(value);
                }}
                value={email}
                style={styles.textinputBox}
              />
            </View>
          </View>

          <View style={{height: 20}} />
          <LongPrimaryButton
            text="비밀번호 초기화 메일 발송"
            action={emailSend}
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
  },
  container: {
    width: '90%',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 160,
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
    top: 0,
    padding: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
