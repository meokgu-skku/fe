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
  TouchableWithoutFeedback,
  Alert,
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
  COLOR_ORANGE,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL, IMG_URL} from '@env';
import {Dimensions} from 'react-native';
import TodayPick from '../../components/TodayPick';
import FoodCategory from '../../components/FoodCategory';
import KingoPass from '../../components/KingoPass';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

const windowWidth = Dimensions.get('window').width;

export default function ReviewWriteScreen(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const {route} = props;
  const storeData = route.params?.data;
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [showRatingError, setShowRatingError] = useState(false);
  const [showContentError, setShowContentError] = useState(false);
  const [showImageError, setShowImageError] = useState(false);
  const [reviewImage, setReviewImage] = useState('');

  console.log('storeData:', 2);

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      setShowRatingError(true);
      return;
    }
    if (reviewContent.trim() === '') {
      setShowContentError(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/v1/restaurants/${storeData.id}/reviews`,
        {
          content: reviewContent,
          imageUrls: [reviewImage],
          rating: rating,
        },
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );
      console.log('Review submitted successfully:', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const uploadImage = async image => {
    if (reviewImage.length >= 3) {
      setShowImageError(true);
      return;
    }

    let imageData = '';
    await RNFS.readFile(image.path, 'base64')
      .then(data => {
        console.log('encoded', data);
        imageData = data;
      })
      .catch(err => {
        console.error(err);
      });

    try {
      let count = 0;
      let response;
      while (count < 3) {
        response = await axios.post(`${IMG_URL}/v1/upload-image`, {
          images: [
            {
              imageData: imageData,
              location: 'test',
            },
          ],
        });

        console.log('response image:', response.data);

        if (response.data.result === 'SUCCESS') {
          setReviewImage(response.data.data[0].imageUrl);
          break;
        }
        count += 1;
      }

      if (count === 3) {
        Alert.alert('오류', '이미지 업로드에 실패했습니다!', [{text: '확인'}]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  return (
    <>
      <Header title={'리뷰 쓰기'} isBackButton={true} />
      <View contentContainerStyle={styles.entire}>
        <View style={styles.headerContainer}>
          <Text style={styles.storeName} numberOfLines={1}>
            {storeData.name}
          </Text>
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  setRating(index + 1);
                  setShowRatingError(false);
                }}>
                <SvgXml
                  xml={
                    index < rating
                      ? svgXml.icon.starFill
                      : svgXml.icon.starEmpty
                  }
                  width="24"
                  height="24"
                  style={{marginLeft: 2}}
                />
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        <View style={styles.Container}>
          {showRatingError && (
            <Text style={styles.errorText}>평점을 매겨주세요</Text>
          )}
          <AnimatedButton
            style={styles.photoButton}
            onPress={() => {
              console.log('리뷰 사진 추가', reviewImage);
              // if (reviewImage.) {
              //   console.log('Error: Maximum 3 images allowed');
              //   return;
              // }
              ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                multiple: true,
              })
                .then(images => {
                  images.forEach(image => uploadImage(image));
                })
                .catch(error => {
                  console.error('Image Picker Error:', error);
                });
            }}>
            {reviewImage ? (
              <View style={styles.imageWrapper}>
                <Image source={{uri: reviewImage}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setReviewImage('')}>
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <SvgXml xml={svgXml.icon.reviewCamera} width={50} height={50} />
            )}
          </AnimatedButton>
          {showImageError && (
            <Text style={styles.errorText}>사진은 최대 3개만 넣어주세요</Text>
          )}
          <TextInput
            style={styles.reviewInput}
            multiline
            placeholder="음식의 맛, 양, 위생 상태 등 음식에 대한 솔직한 리뷰를 남겨주세요. (선택)"
            value={reviewContent}
            onChangeText={text => {
              setReviewContent(text);
              setShowContentError(false);
            }}
          />
          {showContentError && (
            <Text style={styles.errorText}>리뷰 내용을 작성해주세요</Text>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleReviewSubmit}>
            <Text style={styles.submitButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    backgroundColor: COLOR_WHITE,
    alignItems: 'center',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  Container: {
    // width: '100%',
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 22,
    // fontWeight: 'bold',
    fontFamily: 'NIXGONFONTS M 2.0',
    color: COLOR_TEXT_BLACK,
    maxWidth: (windowWidth * 3) / 5,
  },
  starContainer: {
    flexDirection: 'row',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_LIGHTGRAY,
    // borderColor: COLOR_PRIMARY,
    // borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 0,
    width: 130,
    height: 130,
  },
  photoButtonText: {
    color: COLOR_PRIMARY,
    fontSize: 16,
    marginLeft: 4,
  },
  imageScrollView: {
    height: 120,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    // marginRight: 8,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 5,
  },
  removeButtonText: {
    color: COLOR_WHITE,
    fontSize: 12,
  },
  reviewInput: {
    backgroundColor: COLOR_WHITE,
    borderColor: COLOR_PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'NanumSquareRoundB',
    // width: '92%',
    // marginHorizontal: 16,
    height: 160,
    textAlignVertical: 'top',
    marginVertical: 16,
    fontSize: 16,
  },
  errorText: {
    color: COLOR_ORANGE,
    fontSize: 10,
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
    backgroundColor: COLOR_PRIMARY,
    padding: 16,
    borderRadius: 32,
    alignItems: 'center',
    width: '92%',
    marginBottom: 16,
    shadowColor: COLOR_TEXT_BLACK,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  submitButtonText: {
    color: COLOR_WHITE,
    fontFamily: 'NanumSquareRoundEB',
    fontSize: 18,
    // fontWeight: '600',
  },
});
