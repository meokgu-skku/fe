import React, {useState, useCallback, useEffect, useContext} from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';

export default function HomeScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const helloAPI = async () => {
    try {
      const response = await axios.get(`${API_URL}/hello/security-test`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      console.log('response:', response.data.data);

      if (!response.data.data) {
        console.log('Error: No return data');
        return;
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <>
      <Header title={'홈'} isBackButton={false} />
      <View style={styles.entire}>
        <Text style={styles.textMain}>HomeScreen</Text>
        <AnimatedButton
          onPress={() => {
            console.log('PRESSED~!!');
            navigation.navigate('Signup');
          }}
          style={styles.buttonTest}>
          <Text style={styles.buttonText}>Signup</Text>
        </AnimatedButton>
        <AnimatedButton
          onPress={() => {
            helloAPI();
          }}
          style={styles.buttonTest}>
          <Text style={styles.buttonText}>Hello API Check</Text>
        </AnimatedButton>
      </View>
    </>
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
