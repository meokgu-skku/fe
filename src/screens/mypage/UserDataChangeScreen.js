import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import {
  COLOR_BACKGROUND,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_WHITE,
  COLOR_GRAY,
} from '../../assets/color';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

export default function UserDataChangeScreen() {
  const navigation = useNavigation();

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const email = 'test@test.com'; 


  const nicknameCheckHandler = () => {
    console.log('nickname check');
  };

  const nameCheckHandler = () => {
    console.log('name check');
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
              placeholder="먹구스꾸"
            />
            <TouchableOpacity style={styles.checkButton} onPress={nicknameCheckHandler}> 
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>이름</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={name}
              onChangeText={setName}
              placeholder="박정호"
            />
            <TouchableOpacity style={styles.checkButton} onPress={nameCheckHandler}> 
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>대표 이메일</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>수정하기</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity>
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
