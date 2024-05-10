/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
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
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BlurView} from '@react-native-community/blur';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import MapDart from '../../components/MapDart';
import Modal from 'react-native-modal';
import {Dimensions} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import StoreCompo from '../../components/StoreCompo';

const windowWidth = Dimensions.get('window').width;

export default function SearchScreen() {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');

  //TODO: 검색어를 받아와서 검색하는 함수
  function searchStore(inputString) {
    console.log('검색어:', inputString);
  }

  return (
    <>
      <Header title={'검색'} isBackButton={true} />
      <View style={styles.entire}>
        <View style={{alignItems: 'center'}}>
          {/* 검색창 */}
          <View
            style={{
              width: windowWidth - 32,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 4,
              paddingHorizontal: 8,
              elevation: 4,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AnimatedButton
                onPress={() => {
                  searchStore(searchText);
                }}
                style={{
                  padding: 8,
                }}>
                <SvgXml xml={svgXml.icon.search} width="24" height="24" />
              </AnimatedButton>
              <TextInput
                onFocus={() => {}}
                placeholder={'율전의 맛집은 과연 어디?'}
                placeholderTextColor={'#888888'}
                style={styles.textInput}
                onChangeText={text => {
                  setSearchText(text);
                }}
                blurOnSubmit={false}
                maxLength={200}
                value={searchText}
                onSubmitEditing={() => {
                  console.log('검색 제출');
                  searchStore(searchText);
                }}
                // multiline={true}
                textAlignVertical="center"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
  },
  textInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
    padding: 0,
  },
});
