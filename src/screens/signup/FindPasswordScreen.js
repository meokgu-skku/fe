/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect, useRef} from 'react';
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
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import axios from 'axios';
import HeaderWhite from '../../components/HeaderWhite';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import LongPrimaryButton from '../../components/LongPrimaryButton';

//TODO: 비밀번호 찾기 화면
export default function FindPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);

  return (
    <>
      <HeaderWhite title={'비밀번호 찾기 - 아직 안만듬'} isBackButton={true} />
      <Pressable
        onPress={() => {
          console.log('Pressable');
        }}
        // accessible={false}
        style={styles.entire}>
        <View style={styles.container}>
          <View style={styles.textAndInput}>
            <Text style={styles.samllText}>이메일 주소</Text>
            <TextInput
              // onSubmitEditing={actions.onSearchButtonPressed}
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
              // onSubmitEditing={actions.onSearchButtonPressed}
              placeholderTextColor={COLOR_GRAY}
              onChangeText={value => {
                setPassword(value);
              }}
              value={password}
              style={styles.textinputBox}
            />
          </View>

          <AnimatedButton
            onPress={() => {
              console.log('Go to find password screen');
            }}
            style={{marginTop: 7, padding: 3}}>
            <Text style={styles.samllText}>비밀번호 찾기</Text>
          </AnimatedButton>
        </View>

        <View style={{height: 20}} />
        <LongPrimaryButton text="로그인" action={() => {}} />
      </Pressable>
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
