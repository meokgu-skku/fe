import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import {
  COLOR_BACKGROUND,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_RED,
  COLOR_BLUE,
} from '../../assets/color';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import { API_URL } from '@env';

export default function UserDataChangeScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [messageColor, setMessageColor] = useState(COLOR_RED);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log(`Fetching user info with userId: ${context.id}`);
        console.log(`Using accessToken: ${context.accessToken}`);
        const response = await axios.get(
          `${API_URL}/v1/users/${context.id}`,
          {
            headers: { Authorization: `Bearer ${context.accessToken}` },
          }
        );

        console.log('User Info API Response:', response.data);
        setNickname(response.data.data.userDto.nickname);
        setEmail(response.data.data.userDto.email);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [context.accessToken, context.id]);

  const nicknameCheckHandler = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/users/check-nickname`, {
        params: { nickname },
        headers: { Authorization: `Bearer ${context.accessToken}` }
      });

      if (response.data.isDuplicate || nickname === context.nickname) {
        setDuplicateMessage("이미 사용 중인 닉네임입니다.");
        setMessageColor(COLOR_RED);
      } else {
        setDuplicateMessage("사용 가능한 닉네임입니다.");
        setMessageColor(COLOR_BLUE);
      }
    } catch (error) {
      setDuplicateMessage("이미 사용 중인 닉네임입니다.");
      setMessageColor(COLOR_RED);
    }
  };

  const updateNicknameHandler = async () => {
    try {
      const response = await axios.patch(`${API_URL}/v1/users`, {
        nickname: nickname
      }, {
        headers: { Authorization: `Bearer ${context.accessToken}` }
      });

      if (response.status === 200) {
        Alert.alert("성공", "닉네임이 성공적으로 변경되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
      }
    } catch (error) {
      console.error("Failed to update nickname:", error);
      Alert.alert("오류", "닉네임 변경 중 오류가 발생했습니다.", [{ text: "확인" }]);
    }
  };

  const deleteUserHandler = async () => {
    try {
      const response = await axios.delete(`${API_URL}/v1/users`, {
        headers: { Authorization: `Bearer ${context.accessToken}` }
      });

      if (response.status === 200) {
        Alert.alert("성공", "회원탈퇴가 정상적으로 완료되었습니다.", [
          {
            text: "확인", onPress: async () => {
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('refreshToken');
              context.setAccessTokenValue(null);
              context.setRefreshTokenValue(null);

              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Splash' }],
                })
              );
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      Alert.alert("오류", "회원탈퇴 중 오류가 발생했습니다.", [{ text: "확인" }]);
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
          routes: [{ name: 'Splash' }],
        })
      );
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <>
      <Header title={'내 정보 수정'} isBackButton={true} />
      <ScrollView contentContainerStyle={styles.entire}>
        <Image
          style={[styles.myPageItem, styles.myPageItemLayout]}
          resizeMode="cover"
          source={require("../../assets/skku.png")}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해주세요"
            />
            <TouchableOpacity style={styles.checkButton} onPress={nicknameCheckHandler}> 
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          {duplicateMessage ? (
            <Text style={[styles.duplicateMessage, { color: messageColor }]}>
              {duplicateMessage}
            </Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>대표 이메일</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={updateNicknameHandler}>
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
    fontSize: 16,
    color: COLOR_TEXT70GRAY,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR_GRAY,
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: COLOR_WHITE,
    width: '100%',
    height: 45,
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: COLOR_GRAY,
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
    fontSize: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
  footerText: {
    color: COLOR_PRIMARY,
    fontSize: 16,
  },
});
