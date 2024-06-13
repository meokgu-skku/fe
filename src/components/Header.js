/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
} from '../assets/color';
import AnimatedButton from './AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';
import {StatusBarHeight} from './Safe';

export default function Header(props) {
  const navigation = useNavigation();
  const {title, isBackButton, noSafe} = props;
  return (
    <View
      style={{
        paddingTop: noSafe
          ? Platform.OS == 'android'
            ? 0
            : StatusBarHeight
          : 0,
        backgroundColor: COLOR_PRIMARY,
        // height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
      }}>
      {isBackButton ? (
        <AnimatedButton
          style={{
            position: 'absolute',
            // backgroundColor: 'red',
            left: 6,
            padding: 10,
            paddingTop: noSafe
              ? Platform.OS == 'android'
                ? 10
                : 10 + StatusBarHeight
              : 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <SvgXml xml={svgXml.button.goback} width="24" height="24" />
        </AnimatedButton>
      ) : null}
      <Text
        style={{
          color: COLOR_WHITE,
          fontSize: 16,
          // fontWeight: 'bold',
          fontFamily: 'NanumSquareRoundB',
          textAlign: 'center',
          // backgroundColor: 'red',
          margin: Platform.OS == 'android' ? 16 : 10,
        }}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
