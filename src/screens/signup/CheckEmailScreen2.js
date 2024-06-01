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

export default function CheckEmailScreen2(props) {
  const navigation = useNavigation();
  const {route} = props;
  const signUpData = route.params;

  const [checkNumShow, setCheckNumShow] = useState(true);
  const [checkNum, setCheckNum] = useState('');
  const [disable, setDisable] = useState(true);

  const validate = async () => {
    console.log('email:', signUpData.email);

    try {
      const response = await axios.post(`${API_URL}/v1/users/email/validate`, {
        code: checkNum,
        email: signUpData.email,
        sendType: 'RESET_PASSWORD',
      });
      console.log('response:', response.data);

      if (!response.data) {
        console.log('Error: No return data');
        return;
      }

      navigation.navigate('ResetPassword', {
        email: signUpData.email,
        token: response.data.data.token,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
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
      <HeaderWhite title={'인증번호 확인'} isBackButton={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>인증번호 입력</Text>
              <TextInput
                // onSubmitEditing={endPasswordInput}
                secureTextEntry={checkNumShow}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setCheckNum(value);
                }}
                value={checkNum}
                style={styles.textinputBox}
                keyboardType="number-pad"
              />
              <AnimatedButton
                style={styles.showButton}
                onPress={() => {
                  setCheckNumShow(!checkNumShow);
                }}>
                <SvgXml
                  width={20}
                  height={20}
                  xml={
                    checkNumShow
                      ? svgXml.button.passwordShow
                      : svgXml.button.passwordNotShow
                  }
                />
              </AnimatedButton>
            </View>
          </View>

          <View style={{height: 20}} />
          <LongPrimaryButton
            text={'인증번호 확인'}
            action={validate}
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
    color: COLOR_TEXT70GRAY,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 4,
    fontWeight: 'bold',
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
    right: 10,
    bottom: 8,
    padding: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
