import React, { useContext, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
} from '../assets/color';
import { useNavigation } from '@react-navigation/native';
import AppContext from './AppContext';
import { Dimensions } from 'react-native';
import AnimatedButton from './AnimationButton';

const windowWidth = Dimensions.get('window').width;

export default function MyStore(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const { passData } = props;

  return (
    <View style={styles.kingopass}>
      <Text style={styles.kingopassTitle}>찜한 가게</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={true}
        style={{
          marginTop: 10,
        }}
        horizontal={true}
        ref={scrollViewRef}>
        <View style={{ width: 16 }} />
        {passData.map((data, index) => {
          return (
            <AnimatedButton
              key={index.toString()}
              style={styles.kingopassKard}
              // TODO: 찜한 가게 페이지로 이동
              onPress={() => {
                console.log('찜한 가게 페이지로 이동');
              }}>
              <Image
                source={{
                  uri: data.image,
                }}
                resizeMode="cover"
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  borderRadius: 10,
                  width: 140,
                  height: 140,
                  backgroundColor: '#000000',
                  opacity: 0.3,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  borderRadius: 10,
                  width: 140,
                  height: 140,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    color: COLOR_WHITE,
                    fontWeight: 'bold',
                    margin: 10,
                  }}>
                  {data.name}
                </Text>
              </View>
            </AnimatedButton>
          );
        })}
        <View style={{ width: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  kingopass: {
    marginTop: 15,
    width: windowWidth,
    paddingHorizontal: 0,
  },
  kingopassTitle: {
    fontSize: 20,
    marginLeft: 26,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
  kingopassKard: {
    height: 140,
    width: 140,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});