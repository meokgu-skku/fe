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

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
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
          console.log('PRESSED~!!');
          navigation.navigate('ListNavigator');
        }}
        style={styles.buttonTest}>
        <Text style={styles.buttonText}>ListNavigator</Text>
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
