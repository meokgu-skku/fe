/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT70GRAY,
} from '../assets/color';
import AnimatedButton from './AnimationButton';
import {useNavigation} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BlurView} from '@react-native-community/blur';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';

export default function MapDart(props) {
  //TODO: 눌렀을 때 상세 페이지로 이동해야함
  const navigation = useNavigation();
  const {data, onPress} = props;

  const n = Math.floor(Math.random() * 6);

  return (
    <Marker
      coordinate={{latitude: data.latitude, longitude: data.longitude}}
      anchor={{x: 0.5, y: 0}}
      onPress={() => {
        onPress(data);
        console.log('marker pressed', data.name);
      }}>
      <View style={styles.dart}>
        {/* {n === 0 ? (
          <SvgXml xml={svgXml.marker._1} width="20" height="20" />
        ) : n === 1 ? (
          <SvgXml xml={svgXml.marker._2} width="20" height="20" />
        ) : n === 2 ? (
          <SvgXml xml={svgXml.marker._3} width="20" height="20" />
        ) : n === 3 ? (
          <SvgXml xml={svgXml.marker._4} width="20" height="20" />
        ) : n === 4 ? (
          <SvgXml xml={svgXml.marker._5} width="20" height="20" />
        ) : n === 5 ? (
          <SvgXml xml={svgXml.marker._6} width="20" height="20" />
        ) : null} */}
        <SvgXml xml={svgXml.marker._1} width="18" height="18" />
        <Text style={styles.dartText} numberOfLines={1}>
          {data.name}
        </Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  dart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dartText: {
    fontSize: 11,
    maxWidth: 80,
    color: COLOR_TEXT_BLACK,
    textAlign: 'center',
    fontFamily: 'NanumSquareRoundB',
  },
});
