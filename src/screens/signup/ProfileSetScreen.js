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
  Image,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_SECONDARY,
  COLOR_NAVY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL, IMG_URL} from '@env';
import axios, {AxiosError} from 'axios';
import HeaderWhite from '../../components/HeaderWhite';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import LongPrimaryButton from '../../components/LongPrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../components/AppContext';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

export default function ProfileSetScreen(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const {route} = props;
  const signUpData = route.params;

  const [nickname, setNickname] = useState('');
  const [disable, setDisable] = useState(true);

  const [profileImage, setProfileImage] = useState('');

  const signUp = async () => {
    console.log('name:', signUpData.name);
    console.log('email:', signUpData.email);
    console.log('password:', signUpData.password);

    try {
      // 회원가입 하고 토큰 저장하는 부분
      const response = await axios.post(`${API_URL}/v1/users/email/sign-up`, {
        email: signUpData.email,
        nickname: signUpData.name,
        password: signUpData.password,
        profileImageUrl: profileImage,
      });
      console.log('response:', response.data.data);

      if (!response.data.data) {
        console.log('Error: No return data');
        return;
      }
      const accessToken = response.data.data.token.accessToken;
      const refreshToken = response.data.data.token.refreshToken;
      const userId = response.data.data.userDto.id;

      context.setAccessTokenValue(accessToken);
      context.setRefreshTokenValue(refreshToken);
      context.setIdValue(userId);

      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('refreshToken', refreshToken);
      AsyncStorage.setItem('userId', userId.toString());

      navigation.navigate('BottomTab');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const uploadImage = async image => {
    let imageData = '';
    await RNFS.readFile(image.path, 'base64')
      .then(data => {
        // console.log('encoded', data);
        imageData = data;
      })
      .catch(err => {
        console.error(err);
      });

    console.log('token:', signUpData.token);
    try {
      const response = await axios.post(`${IMG_URL}/v1/upload-image`, {
        images: [
          {
            imageData: imageData,
            location: 'test',
          },
        ],
      });

      console.log('response image:', response.data);

      if (response.data.result != 'SUCCESS') {
        console.log('Error: No return data');
        return;
      }

      setProfileImage(response.data.data[0].imageUrl);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    if (nickname && disable) {
      setDisable(false);
    } else if (!nickname && !disable) {
      setDisable(true);
    }
  }, [nickname]);
  //check
  return (
    <>
      <HeaderWhite title={'프로필 설정'} isBackButton={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.entire}>
          <AnimatedButton
            style={styles.profile}
            onPress={() => {
              // console.log('프로필 사진 변경', profileImage);
              ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                cropperCircleOverlay: true,
              }).then(image => {
                uploadImage(image);
              });
            }}>
            {profileImage ? (
              <Image
                source={{uri: profileImage}}
                style={{width: 150, height: 150, borderRadius: 75}}
              />
            ) : (
              <SvgXml width={104} height={102} xml={svgXml.icon.camera} />
            )}
          </AnimatedButton>
          <View style={styles.container}>
            <View style={styles.textAndInput}>
              <Text style={styles.samllText}>닉네임</Text>
              <TextInput
                // onSubmitEditing={endPasswordInput}
                autoCapitalize="none"
                placeholderTextColor={COLOR_GRAY}
                onChangeText={value => {
                  setNickname(value);
                }}
                value={nickname}
                style={styles.textinputBox}
              />
            </View>
          </View>

          <View style={{height: 80}} />
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
  profile: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 0.7,
    borderColor: COLOR_NAVY,
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
