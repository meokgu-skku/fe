import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  COLOR_BACKGROUND,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_RED,
  COLOR_NAVY,
  COLOR_BLUE,
  COLOR_HOME_BACKGROUND,
  COLOR_TEXT_BLACK,
} from '../../assets/color';
import {useNavigation, CommonActions} from '@react-navigation/native';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL, IMG_URL} from '@env';
import AnimatedButton from '../../components/AnimationButton';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';

export default function UserDataChangeScreen(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const {route} = props;
  // const profile = route.params?.profile;
  const [profileImage, setProfileImage] = useState(route.params?.data);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [messageColor, setMessageColor] = useState(COLOR_RED);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        console.log(`Fetching user info with userId: ${userId}`);
        console.log(`Using accessToken: ${context.accessToken}`);
        const response = await axios.get(`${API_URL}/v1/users/${userId}`, {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        });

        console.log('User Info API Response:', response.data);
        setNickname(response.data.data.userDto.nickname);
        setEmail(response.data.data.userDto.email);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response.data.message,
        });
      }
    };

    fetchUserInfo();
  }, [context.accessToken]);

  const nicknameCheckHandler = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/users/check-nickname`, {
        params: {nickname},
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      if (response.data.isDuplicate || nickname === context.nickname) {
        setDuplicateMessage('이미 사용 중인 닉네임입니다.');
        setMessageColor(COLOR_RED);
      } else {
        setDuplicateMessage('사용 가능한 닉네임입니다.');
        setMessageColor(COLOR_BLUE);
      }
    } catch (error) {
      setDuplicateMessage('이미 사용 중인 닉네임입니다.');
      setMessageColor(COLOR_RED);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  const updateNicknameHandler = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/v1/users`,
        {
          profileImageUrl: profileImage,
          nickname: nickname,
        },
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );

      if (response.status === 200) {
        Alert.alert(
          '성공',
          '닉네임/프로필 이미지가 성공적으로 변경되었습니다.',
          [{text: '확인', onPress: () => navigation.goBack()}],
        );
      }
    } catch (error) {
      console.error('Failed to update nickname:', error);
      Alert.alert('오류', '닉네임 변경 중 오류가 발생했습니다.', [
        {text: '확인'},
      ]);
    }
  };

  const deleteUserHandler = async () => {
    try {
      const response = await axios.delete(`${API_URL}/v1/users`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      if (response.status === 200) {
        Alert.alert('성공', '회원탈퇴가 정상적으로 완료되었습니다.', [
          {
            text: '확인',
            onPress: async () => {
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('refreshToken');
              context.setAccessTokenValue(null);
              context.setRefreshTokenValue(null);

              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Splash'}],
                }),
              );
            },
          },
        ]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
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

    // console.log('token:', signUpData.token);
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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');

      context.setAccessTokenValue(null);
      context.setRefreshTokenValue(null);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Splash'}],
        }),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  return (
    <>
      <Header title={'내 정보 수정'} isBackButton={true} />
      <ScrollView contentContainerStyle={styles.entire}>
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
              style={{width: 100, height: 100, borderRadius: 75}}
            />
          ) : (
            <SvgXml width={100} height={100} xml={svgXml.icon.camera} />
          )}
        </AnimatedButton>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해주세요"
            />
            <TouchableOpacity
              style={styles.checkButton}
              onPress={nicknameCheckHandler}>
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          {duplicateMessage ? (
            <Text style={[styles.duplicateMessage, {color: messageColor}]}>
              {duplicateMessage}
            </Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>대표 이메일</Text>
          <TextInput
            style={[styles.input2, styles.disabledInput]}
            value={email}
            editable={false}
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateNicknameHandler}>
          <Text style={styles.updateButtonText}>수정하기</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.footerText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteUserHandler}>
            <Text style={styles.footerText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
  },
  myPageItem: {
    width: 120,
    height: 120,
  },
  myPageItemLayout: {
    marginTop: 20,
    marginBottom: 50,
    borderRadius: 15,
  },
  inputContainer: {
    width: '85%',
    marginBottom: 20,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLOR_TEXT_BLACK,
    marginBottom: 8,
    fontFamily: 'NanumSquareRoundB',
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLOR_PRIMARY,
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    backgroundColor: COLOR_WHITE,
    width: '100%',
    height: 45,
    fontFamily: 'NanumSquareRoundEB',
  },
  input2: {
    borderWidth: 1.5,
    borderColor: COLOR_PRIMARY,
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    backgroundColor: COLOR_TEXT_BLACK,
    width: '100%',
    height: 45,
    fontFamily: 'NanumSquareRoundEB',
  },
  disabledInput: {
    backgroundColor: COLOR_HOME_BACKGROUND,
    color: COLOR_TEXT_BLACK,
    height: 45,
  },
  checkButton: {
    marginLeft: 10,
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 45,
    justifyContent: 'center',
  },
  checkButtonText: {
    color: COLOR_WHITE,
    fontSize: 12,
    fontFamily: 'NanumSquareRoundB',
  },
  duplicateMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  updateButton: {
    width: '85%',
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: COLOR_WHITE,
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
  footerText: {
    color: COLOR_PRIMARY,
    fontSize: 14,
    fontFamily: 'NanumSquareRoundB',
  },
  profile: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
});
