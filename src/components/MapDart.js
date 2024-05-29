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

  return (
    <Marker
      coordinate={{latitude: data.latitude, longitude: data.longitude}}
      anchor={{x: 0, y: 1}}
      onPress={() => {
        onPress(data);
        console.log('marker pressed', data.name);
      }}>
      <View>
        <View style={styles.dart}>
          <Text style={styles.dartText} numberOfLines={1}>
            {data.name}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <SvgXml xml={svgXml.icon.star} width="15" height="15" />
            <Text
              style={{
                fontSize: 12,
                color: COLOR_WHITE,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginLeft: 3,
                marginTop: -1,
              }}>
              {data.ratingAvg.toString()}
            </Text>
          </View>
        </View>
        <View style={styles.triangle} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderRightColor: 'transparent',
    borderTopColor: COLOR_PRIMARY,
  },
  dart: {
    padding: 3,
    alignItems: 'center',
    fontFamily: 'NanumSquareRoundR',
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },
  dartText: {
    fontSize: 12,
    color: COLOR_WHITE,
    maxWidth: 100,
  },
});
