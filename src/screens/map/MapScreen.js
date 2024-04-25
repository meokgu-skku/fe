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
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BlurView} from '@react-native-community/blur';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';

function MapMarker(props) {
  const navigation = useNavigation();
  const {data} = props;

  return (
    <Marker
      coordinate={{latitude: data.latitude, longitude: data.longitude}}
      anchor={{x: 0, y: 1}}>
      <View>
        <View style={styles.dart}>
          <Text style={styles.dartText}>{data.name}</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <SvgXml xml={svgXml.icon.star} width="15" height="15" />
            <Text
              style={{
                fontSize: 12,
                color: COLOR_TEXT70GRAY,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginLeft: 3,
                marginTop: -1,
              }}>
              {data.rating}
            </Text>
          </View>
        </View>
        <View style={styles.triangle} />
      </View>
    </Marker>
  );
}

export default function MapScreen() {
  const navigation = useNavigation();
  //TODO: storeDartDatas를 서버에서 받아와서 저장해야함
  const [storeDartDatas, setStoreDartDatas] = useState([
    {
      name: '옥집',
      type: '한식',
      latitude: 37.296736,
      longitude: 126.970762,
      rating: 4.3,
    },
    {
      name: '자스민',
      type: '아시안',
      latitude: 37.298612,
      longitude: 126.972889,
      rating: 4.5,
    },
    {
      name: '키와마루아지',
      type: '일식',
      latitude: 37.29693,
      longitude: 126.968718,
      rating: 4.2,
    },
  ]);

  return (
    <>
      <Header title={'지도'} isBackButton={false} />
      <View style={styles.entire}>
        <MapView
          style={{flex: 1, width: '100%'}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.297861,
            longitude: 126.971458,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {storeDartDatas.map((data, index) => (
            <MapMarker data={data} />
          ))}
        </MapView>
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
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  dart: {
    padding: 3,
    alignItems: 'center',
    backgroundColor: COLOR_WHITE,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },
  dartText: {
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
  },
});
