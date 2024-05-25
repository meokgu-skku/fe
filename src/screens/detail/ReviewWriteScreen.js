/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_TEXT70GRAY,
  COLOR_TEXT_BLACK,
  COLOR_LIGHTGRAY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import TodayPick from '../../components/TodayPick';
import FoodCategory from '../../components/FoodCategory';
import KingoPass from '../../components/KingoPass';

const windowWidth = Dimensions.get('window').width;

export default function ReviewWriteScreen(props) {
  const navigation = useNavigation();
  const {route} = props;
  const storeData = route.params?.data;
  const [rating, setRating] = useState(0);

  console.log('storeData:', storeData);

  const DottedLine = () => {
    return (
      <View style={styles.dottedContainer}>
        {[...Array(20)].map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
    );
  };

  return (
    <>
      <Header title={'리뷰 쓰기'} isBackButton={true} />
      <ScrollView contentContainerStyle={styles.entire}>
      < View style={styles.headerContainer}>
          <Text style={styles.storeName}>{storeData.name}</Text>
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                <SvgXml
                  xml={index < rating ? svgXml.icon.starFill : svgXml.icon.starEmpty}
                  width="24"
                  height="24"
                  style={{ marginLeft: 7 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoButtonText}>사진 첨부하기</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.reviewInput}
          multiline
          placeholder="음식의 맛, 양, 위생 상태 등 음식에 대한 솔직한 리뷰를 남겨주세요. (선택)"
        />
        <DottedLine />
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    backgroundColor: COLOR_WHITE,
    // justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR_TEXT_BLACK,
  },
  starContainer: {
    flexDirection: 'row',
  },
  photoButton: {
    backgroundColor: COLOR_WHITE,
    borderColor: COLOR_PRIMARY,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    width: '92%',
    height: '',
  },
  photoButtonText: {
    color: COLOR_PRIMARY,
    fontSize: 16,
  },
  reviewInput: {
    backgroundColor: COLOR_WHITE,
    borderColor: COLOR_PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: '92%',
    height: 150,
    textAlignVertical: 'top',
    marginVertical: 16,
    fontSize: 16,
  },
  dottedContainer: {
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  dot: {
    width: 9,
    height: 2,
    backgroundColor: COLOR_LIGHTGRAY,
    marginHorizontal: 1,
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLOR_PRIMARY,
    padding: 16,
    borderRadius: 32,
    alignItems: 'center',
    width: '90%',
    marginBottom: 16,
    shadowColor: COLOR_TEXT_BLACK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  submitButtonText: {
    color: COLOR_WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
});
