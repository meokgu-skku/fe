import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import axios from 'axios';

export default function SignupScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.entire}>
      <Text style={styles.textMain}>SignupScreen</Text>
      <AnimatedButton
        onPress={() => {
          console.log('PRESSED~!!');
          navigation.navigate('BottomTab');
        }}
        style={styles.buttonTest}>
        <Text style={styles.buttonText}>bottom tab</Text>
      </AnimatedButton>
      <AnimatedButton
        onPress={async () => {
          console.log('PRESSED~!!');
          const response = await axios.get(`${API_URL}/hello`).then(res => {
            console.log('res', res.data.data);
          });
        }}
        style={styles.buttonTest}>
        <Text style={styles.buttonText}>Test Axios HELLO!</Text>

      </AnimatedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMain: {
    fontSize: 50,
    color: COLOR_PRIMARY,
  },
  buttonTest: {
    backgroundColor: COLOR_PRIMARY,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: COLOR_WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
