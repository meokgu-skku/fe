/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT70GRAY,
  COLOR_TEXT60GRAY,
} from '../assets/color';
import AnimatedButton from './AnimationButton';
import Header from './Header';
import {useNavigation} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BlurView} from '@react-native-community/blur';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';
import MapDart from './MapDart';
import Modal from 'react-native-modal';
import {Dimensions} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import StoreCompo from './StoreCompo';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import axios, {AxiosError} from 'axios';
import {API_URL} from '@env';
import AppContext from './AppContext';

const windowWidth = Dimensions.get('window').width;

export default function ListModal(props) {
  const {visible, setVisible, title, value, setValue, valueList} = props;

  return (
    <Modal
      isVisible={visible}
      hasBackdrop={true}
      backdropOpacity={0}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={'down'}
      onBackdropPress={() => setVisible(false)}
      // coverScreen={false}
      onBackButtonPress={() => setVisible(false)}
      onModalHide={() => {
        setVisible(false);
      }}
      style={{justifyContent: 'flex-end', margin: 0}}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.modalContent}>
        {/* 모달의 제목 부분 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.modalTitle}>{title}</Text>
          <AnimatedButton
            style={{padding: 4}}
            onPress={() => {
              console.log('새로고침');
              setValue('전체');
              setVisible(false);
            }}>
            <SvgXml xml={svgXml.icon.refresh} width="24" height="24" />
          </AnimatedButton>
        </View>
        <View style={{height: 8}} />
        <FlatList
          data={valueList}
          renderItem={({item, index}) => {
            return (
              <AnimatedButton
                style={styles.listButton}
                onPress={() => {
                  setValue(item);
                }}>
                {item == value ? (
                  <Text style={styles.buttonText2}>{item}</Text>
                ) : (
                  <Text style={styles.buttonText}>{item}</Text>
                )}
              </AnimatedButton>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalTitle: {
    fontSize: 20,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
  listButton: {
    // backgroundColor: 'blue',
    padding: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
    fontWeight: 'normal',
  },
  buttonText2: {
    fontSize: 12,
    color: '#A4D65E',
    fontWeight: 'normal',
  },
});
