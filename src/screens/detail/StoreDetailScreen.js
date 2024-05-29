/* eslint-disable react/no-unstable-nested-components */
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
  FlatList,
  Pressable,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT_DARKGRAY,
  COLOR_TEXT70GRAY,
  COLOR_TEXT60GRAY,
  COLOR_TEXT_BLACK,
  COLOR_LIGHTGRAY,
  COLOR_ORANGE,
  COLOR_SECONDARY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import ImageModal from 'react-native-image-modal';
import {Modal, TouchableHighlight} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function StoreDetailScreen(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const {route} = props;
  const restaurantId = route.params?.data?.id || 2;
  const [restaurant, setRestaurant] = useState(null);
  const [isHearted, setIsHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [menuList, setMenuList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [displayedMenuList, setDisplayedMenuList] = useState([]);
  const [displayedReviewList, setDisplayedReviewList] = useState([]);
  const [menuCount, setMenuCount] = useState(4);
  const [reviewCount, setReviewCount] = useState(4);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      restaurantDetail();
      handleHeartPress();
    }, []),
  );
  useEffect(() => {
    setDisplayedMenuList(menuList.slice(0, menuCount));
  }, [menuList, menuCount]);

  useEffect(() => {
    setDisplayedReviewList(reviewList.slice(0, reviewCount));
  }, [reviewList, reviewCount]);

  const restaurantDetail = async () => {
    console.log('Id: ', restaurantId);
    try {
      const response = await axios.get(
        `${API_URL}/v1/restaurants/${restaurantId}`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );
      const responseReview = await axios.get(
        `${API_URL}/v1/restaurants/${restaurantId}/reviews`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );
      const data = response.data.data;
      const dataReview = responseReview.data.data;

      console.log('data: ', data.restaurant);

      setRestaurant(data);
      setIsHearted(data.restaurant.isLike);
      setHeartCount(data.restaurant.likeCount);
      setMenuList(data.restaurant.detailInfo.menus);
      setReviewList(dataReview.reviews.content);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const handleHeartPress = async () => {
    try {
      const newHeartedState = !isHearted;
      setIsHearted(newHeartedState);
      setHeartCount(newHeartedState ? heartCount + 1 : heartCount - 1);
      const ret = await axios.post(
        `${API_URL}/v1/restaurants/${restaurantId}/like`,
        {
          isLike: newHeartedState,
        },
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );
    } catch (error) {
      console.error('Error updating heart count:', error);
    }
  };

  const handleLoadMoreMenus = () => {
    setMenuCount(menuCount + 4);
  };

  const handleLoadMoreReviews = () => {
    setReviewCount(reviewCount + 4);
  };

  if (!restaurant) {
    return <Text>Loading...</Text>;
  }

  const renderMenuItem = ({item}) => (
    <>
      <View key={item.name} style={styles.sectionItem}>
        {item.imageUrl ? (
          <ImageModal
            swipeToDismiss={true}
            modalImageResizeMode="contain"
            // resizeMode="contain"
            imageBackgroundColor="transparent"
            overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
            source={{uri: item.imageUrl}}
            style={styles.menuImage}
          />
        ) : (
          <View style={styles.menuImagePlaceholder}>
            <Text style={styles.menuImagePlaceholderText}>
              음식 사진 준비중
            </Text>
          </View>
        )}
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.name}</Text>
          <Text style={styles.menuDescription}>{item.description}</Text>
          <Text style={styles.menuPrice}>{item.price} 원</Text>
        </View>
      </View>
      <View style={styles.horizontalDivider} />
    </>
  );

  const renderReviewItem = ({item}) => {
    const rating = item.rating;
    const likeCount = item.likeCount;
    const viewCount = item.viewCount;

    const renderStars = () => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push(
          <SvgXml
            key={i}
            xml={i < rating ? svgXml.icon.starFill : svgXml.icon.starEmpty}
            width="15"
            height="15"
            style={{marginLeft: 3}}
          />,
        );
      }
      return stars;
    };

    return (
      <>
        <View key={item.id} style={styles.sectionItem}>
          <View style={styles.reviewTextContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.profileImageUrl ? (
                  <Image
                    source={{uri: item.profileImageUrl}}
                    style={styles.reviewAuthorImage}
                  />
                ) : (
                  <View style={styles.reviewAuthorImagePlaceholder} />
                )}
                <Text style={styles.reviewAuthor}>{item.username}</Text>
                <Text style={styles.reviewAuthor2}>님</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.reviewStats}>{`좋아요 ${likeCount}`}</Text>
                {renderStars()}
              </View>
            </View>
            <Text style={styles.reviewText}>{item.content}</Text>
          </View>
        </View>
        <FlatList
          horizontal
          data={item.imageUrls}
          renderItem={({item}) => (
            <ImageModal
              swipeToDismiss={true}
              modalImageResizeMode="contain"
              // resizeMode="contain"
              imageBackgroundColor="transparent"
              overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
              source={{uri: item}}
              style={styles.reviewImage}
            />
          )}
          keyExtractor={(image, index) => `${item.id}-${index}`}
        />
        <View style={styles.horizontalDivider} />
      </>
    );
  };

  const ListHeader = () => (
    <>
      <View style={styles.entire}>
        <View style={styles.storeImageContainer}>
          <ImageModal
            swipeToDismiss={true}
            modalImageResizeMode="contain"
            imageBackgroundColor="transparent"
            overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
            source={{uri: restaurant.restaurant.representativeImageUrl}}
            style={styles.storeImage}
          />
          {/* <ImageModal
            swipeToDismiss={true}
            modalImageResizeMode="contain"
            imageBackgroundColor="transparent"
            overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
            resizeMode="cover"
            style={styles.storeImage}
            source={{uri: restaurant.restaurant.representativeImageUrl}}
          /> */}
        </View>
        <View style={styles.storeInfo}>
          <View style={styles.storeHeader}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.storeName}>{restaurant.restaurant.name}</Text>
              <Text style={styles.storeCategory}>
                {restaurant.restaurant.categories}
              </Text>
            </View>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionTitle}>
                <Text style={styles.storeReview}>찜 {heartCount}</Text>
                <Text style={styles.storeReview}>·</Text>
                <Text style={styles.storeReview}>
                  리뷰 {restaurant.restaurant.reviewCount}
                </Text>
              </View>
              <View style={styles.sectionTitle}>
                <Text style={styles.storeReviewNaver}>
                  {'('} 네이버 평점 {restaurant.restaurant.naverRatingAvg}
                </Text>
                <Text style={styles.storeReviewNaver}>·</Text>
                <Text style={styles.storeReviewNaver}>
                  리뷰 {restaurant.restaurant.naverReviewCount} {')'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => setModalVisible(true)}>
              <SvgXml xml={svgXml.icon.phone} width={24} height={24} />
              <Text style={styles.contactButtonText}>전화</Text>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleHeartPress}>
              <SvgXml
                xml={
                  isHearted ? svgXml.icon.heartGrey : svgXml.icon.emptyHeartGrey
                }
                width={24}
                height={24}
              />
              <Text style={styles.contactButtonText}>찜</Text>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TouchableOpacity style={styles.contactButton}>
              <SvgXml xml={svgXml.icon.starGrey} width={24} height={24} />
              <Text style={styles.contactButtonText}>
                {restaurant.restaurant.ratingAvg.toFixed(1)}
              </Text>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <AnimatedButton
              style={styles.contactButton}
              onPress={() => {
                navigation.navigate('ReviewWrite', {
                  data: restaurant.restaurant,
                });
              }}>
              <SvgXml xml={svgXml.icon.pen} width={24} height={24} />
              <Text style={styles.contactButtonText}>리뷰</Text>
            </AnimatedButton>
          </View>
          <View style={styles.horizontalDivider} />
          <View style={{flexDirection: 'row', marginTop: 6}}>
            <SvgXml
              style={styles.contactButtonIcon}
              xml={svgXml.icon.location}
              width={24}
              height={24}
            />
            <Text style={styles.storeAddress}>
              위치: {restaurant.restaurant.detailInfo.address}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <SvgXml
              style={styles.contactButtonIcon}
              xml={svgXml.icon.phone}
              width={24}
              height={24}
            />
            <Text style={styles.storePhoneNum}>
              전화번호: {restaurant.restaurant.detailInfo.contactNumber}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>메뉴</Text>
            <Text style={styles.sectionTitleNumText}>{menuList.length}</Text>
          </View>
          <FlatList
            data={displayedMenuList}
            renderItem={renderMenuItem}
            keyExtractor={item => item.name}
          />
          {menuCount < menuList.length && (
            <TouchableOpacity onPress={handleLoadMoreMenus}>
              <Text style={styles.loadMoreText}>메뉴 더보기</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>리뷰</Text>
            <Text style={styles.sectionTitleNumText}>{reviewList.length}</Text>
          </View>
          <FlatList
            data={displayedReviewList}
            renderItem={renderReviewItem}
            keyExtractor={item => item.id}
            ListFooterComponent={
              reviewCount < reviewList.length && (
                <TouchableOpacity onPress={handleLoadMoreReviews}>
                  <Text style={styles.loadMoreText}>리뷰 더보기</Text>
                </TouchableOpacity>
              )
            }
          />
        </View>
      </View>
    </>
  );

  return (
    <>
      <Header
        title={restaurant.restaurant.name}
        isBackButton={true}
        style={{backgroundColor: 'trasparent'}}
      />
      <FlatList
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.entire}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            전화번호: {restaurant.restaurant.detailInfo.contactNumber}
          </Text>
          <View style={styles.sectionItem}>
            <TouchableHighlight style={styles.callButton}>
              <Text style={styles.textStyle}>전화</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>닫기</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
    marginHorizontal: -3,
  },
  storeImageContainer: {
    // width: '100%',
    // height: 240,
  },
  storeImage: {
    width: windowWidth,
    height: 240,
    resizeMode: 'cover',
  },
  storeInfo: {
    width: '100%',
    padding: 16,
    backgroundColor: COLOR_WHITE,
    elevation: 3,
    marginBottom: 16,
  },
  storeHeader: {
    alignItems: 'right',
  },
  storeName: {
    fontSize: 24,
    color: COLOR_TEXT_BLACK,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  storeCategory: {
    fontSize: 16,
    color: COLOR_TEXT_DARKGRAY,
    marginVertical: 10,
  },
  storeReview: {
    fontSize: 15,
    color: COLOR_TEXT70GRAY,
    marginBottom: 16,
    marginRight: 6,
  },
  storeReviewNaver: {
    fontSize: 15,
    color: COLOR_GRAY,
    marginBottom: 16,
    marginRight: 6,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  contactButton: {
    alignItems: 'center',
  },
  contactButtonIcon: {
    marginVertical: 6,
    marginHorizontal: 2,
  },
  contactButtonText: {
    fontSize: 15,
    marginTop: 4,
    color: COLOR_TEXT70GRAY,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLOR_LIGHTGRAY,
    marginHorizontal: 16,
  },
  horizontalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_LIGHTGRAY,
  },
  storeAddress: {
    fontSize: 15,
    color: COLOR_TEXT_DARKGRAY,
    marginVertical: 8,
    flex: 1,
  },
  storeHours: {
    fontSize: 15,
    color: COLOR_TEXT_DARKGRAY,
    marginVertical: 7,
  },
  storePhoneNum: {
    fontSize: 15,
    color: COLOR_TEXT_DARKGRAY,
    marginVertical: 7,
  },
  section: {
    width: '92%',
    backgroundColor: COLOR_WHITE,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: COLOR_TEXT_BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    flexDirection: 'row',
  },
  sectionTitleText: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_TEXT_BLACK,
    marginRight: 5,
  },
  sectionTitleNumText: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_GRAY,
  },
  sectionItem: {
    flexDirection: 'row',
    height: 120,
  },
  menuImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginVertical: 12,
  },
  menuImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuImagePlaceholderText: {
    textAlign: 'center',
    color: COLOR_SECONDARY,
    fontSize: 16,
    margin: 5,
  },
  menuTextContainer: {
    marginLeft: 10,
    marginVertical: 5,
    justifyContent: 'center',
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    color: COLOR_TEXT_BLACK,
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  menuDescription: {
    fontSize: 16,
    color: COLOR_TEXT_DARKGRAY,
    flexWrap: 'wrap',
  },
  menuPrice: {
    fontSize: 17,
    color: COLOR_TEXT_BLACK,
    fontWeight: '600',
  },
  reviewTextContainer: {
    justifyContent: 'center',
    marginVertical: 12,
  },
  reviewAuthor: {
    fontSize: 17,
    color: COLOR_TEXT_BLACK,
    marginRight: 4,
  },
  reviewAuthor2: {
    fontSize: 12,
    color: COLOR_GRAY,
  },
  reviewAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  reviewAuthorImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_LIGHTGRAY,
    marginRight: 6,
  },
  reviewDate: {
    fontSize: 12,
    color: COLOR_TEXT_DARKGRAY,
    marginVertical: 4,
  },
  reviewStats: {
    fontSize: 12,
    color: COLOR_TEXT60GRAY,
    marginRight: 6,
  },
  reviewText: {
    fontSize: 15,
    color: COLOR_TEXT_BLACK,
    marginTop: 6,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    margin: 7,
  },
  loadMoreText: {
    textAlign: 'center',
    color: COLOR_PRIMARY,
    fontSize: 16,
    marginTop: 10,
  },
  modalView: {
    top: 350,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  callButton: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
  },
  closeButton: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 17,
    color: COLOR_TEXT_BLACK,
  },
});
