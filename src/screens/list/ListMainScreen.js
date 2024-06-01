/* eslint-disable no-sparse-arrays */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT70GRAY,
  COLOR_HOME_BACKGROUND,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import StoreCompo from '../../components/StoreCompo';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import {API_URL} from '@env';
import CategoryButton from '../../components/CategoryButton';
import ListModal from '../../components/ListModal';
import Modal from 'react-native-modal';
const windowWidth = Dimensions.get('window').width;

import AppContext from '../../components/AppContext';

export default function ListMainScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [storeScoreModalVisible, setStoreScoreModalVisible] = useState(false);
  const [replyNumModalVisible, setReplyNumModalVisible] = useState(false);
  const [storeScoreNaverModalVisible, setStoreScoreNaverModalVisible] =
    useState(false);
  const [replyNumNaverModalVisible, setReplyNaverNumModalVisible] =
    useState(false);

  const [priceRangeModalVisible, setPriceRangeModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [storeScore, setStoreScore] = useState('전체');
  const [storeScoreNaver, setStoreScoreNaver] = useState('전체');
  const [replyNum, setReplyNum] = useState('전체');
  const [priceRange, setPriceRange] = useState('전체');
  const [replyNumNaver, setReplyNumNaver] = useState('전체');
  const [sort, setSort] = useState('기본 순');
  const [selectSale, setSelectSale] = useState(false);
  const [likedStore, setLikedStore] = useState(false);
  const [search, setSearch] = useState('');

  const [myLocation, setMyLocation] = useState({
    latitude: 37.297861,
    longitude: 126.971458,
  });
  const [pageNumber, setPageNumber] = useState(0);

  //임시 데이터
  const [storeDartDatas, setStoreDartDatas] = useState([]);

  const checkCategory = async () => {
    const srcCategory = await AsyncStorage.getItem('category');
    if (srcCategory) {
      setSelectedCategory([srcCategory]);
      await AsyncStorage.setItem('category', '');
    } else {
      setSelectedCategory([]);
    }
  };

  //필터링 하는 함수
  const getStoreDatas = async p => {
    try {
      // console.log('context.accessToken:', context.accessToken);

      setPageNumber(p + 1);

      const params = {
        page: p,
      };

      if (selectSale) {
        params.discountForSkku = true;
      }

      if (likedStore) {
        params.like = true;
      }

      if (selectedCategory.length > 0) {
        // console.log('selectedCategory:', selectedCategory, pageNumber);
        params.categories = selectedCategory;
      }

      switch (storeScore) {
        case '5.0점':
          params.ratingAvg = 5.0;
          break;
        case '4.5점 이상':
          params.ratingAvg = 4.5;
          break;
        case '4.0점 이상':
          params.ratingAvg = 4.0;
          break;
        case '3.5점 이상':
          params.ratingAvg = 3.5;
          break;
      }

      switch (storeScoreNaver) {
        case '5.0점':
          params.naverRatingAvg = 5.0;
          break;
        case '4.5점 이상':
          params.naverRatingAvg = 4.5;
          break;
        case '4.0점 이상':
          params.naverRatingAvg = 4.0;
          break;
        case '3.5점 이상':
          params.naverRatingAvg = 3.5;
          break;
      }

      switch (replyNum) {
        case '10개 이상':
          params.reviewCount = 10;
          break;
        case '30개 이상':
          params.reviewCount = 30;
          break;
        case '50개 이상':
          params.reviewCount = 50;
          break;
        case '100개 이상':
          params.reviewCount = 100;
          break;
      }

      switch (replyNumNaver) {
        case '10개 이상':
          params.naverReviewCount = 10;
          break;
        case '30개 이상':
          params.naverReviewCount = 30;
          break;
        case '50개 이상':
          params.naverReviewCount = 50;
          break;
        case '100개 이상':
          params.naverReviewCount = 100;
          break;
      }

      switch (priceRange) {
        case '1만원 미만':
          params.priceMax = 10000;
          break;
        case '1만원 ~ 2만원':
          params.priceMin = 10000;
          params.priceMax = 20000;
          break;
        case '2만원 ~ 3만원':
          params.priceMin = 20000;
          params.priceMax = 30000;
          break;
        case '3만원 이상':
          params.priceMin = 30000;
          break;
      }

      switch (sort) {
        case '가까운 순':
          params.customSort = 'CLOSELY_DESC';
          params.latitude = myLocation.latitude;
          params.longitude = myLocation.longitude;
          break;
        case '평점 높은 순':
          params.customSort = 'RATING_DESC';
          break;
        case '댓글 많은 순':
          params.customSort = 'REVIEW_COUNT_DESC';
          break;
        case '찜 많은 순':
          params.customSort = 'LIKE_COUNT_DESC';
          break;
        case '기본 순':
          params.customSort = 'BASIC';
          break;
      }

      if (search !== '') {
        params.query = search;
      }

      const queryString = new URLSearchParams(params).toString();

      const response = await axios.get(
        `${API_URL}/v1/restaurants?${queryString}`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );
      // console.log('queryString:', queryString);
      // console.log('response:', response.data.data);

      console.log('page:', p);

      if (p == 0) {
        setStoreDartDatas(response.data.data.restaurants.content);
      } else {
        setStoreDartDatas([
          ...storeDartDatas,
          ...response.data.data.restaurants.content,
        ]);
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const onEndReached = () => {
    console.log('onEndReached', pageNumber);
    if (pageNumber === 0) {
      return;
    }
    getStoreDatas(pageNumber);
  };

  useEffect(() => {
    checkCategory();
  }, []);

  useEffect(() => {
    // setStoreDartDatas([]);
    getStoreDatas(0);
  }, [
    selectedCategory,
    storeScore,
    replyNum,
    priceRange,
    selectSale,
    likedStore,
    sort,
    storeScoreNaver,
    replyNumNaver,
    myLocation,
    search,
  ]);

  const listHeader = () => {
    return (
      <View
        style={{
          marginTop: 16,
        }}>
        <View style={{alignItems: 'center'}}>
          {/* 검색창 */}
          <AnimatedButton
            style={{
              width: windowWidth - 32,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 4,
              paddingHorizontal: 8,
              elevation: 4,
              justifyContent: 'center',
            }}
            onPress={() => {
              setSearch('');
              navigation.navigate('Search', {setSearch: setSearch});
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 8,
                }}>
                <SvgXml xml={svgXml.icon.search} width="24" height="24" />
              </View>
              {search !== '' ? (
                <Text style={styles.textInput}>{search}</Text>
              ) : (
                <Text style={styles.textInput}>
                  {'율전의 맛집은 과연 어디?'}
                </Text>
              )}
            </View>
          </AnimatedButton>

          {/* 필터 버튼들*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingTop: 16}}>
            <View style={{width: 16}} />

            <AnimatedButton
              style={[
                categoryModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                ,
                {
                  backgroundColor:
                    selectedCategory.length > 0
                      ? COLOR_PRIMARY
                      : categoryModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 카테고리');
                setCategoryModalVisible(true);
              }}>
              {selectedCategory.length == 0 ? (
                <>
                  <SvgXml xml={svgXml.icon.shop} width="20" height="20" />
                  <Text style={styles.filterText}>{'카테고리'}</Text>
                </>
              ) : (
                <>
                  <SvgXml xml={svgXml.icon.shopColor} width="20" height="20" />
                  <Text style={styles.filterTextActive}>{'카테고리'}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                sortModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                {
                  backgroundColor:
                    sort !== '기본 순'
                      ? COLOR_PRIMARY
                      : sortModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 정렬');
                setSortModalVisible(true);
              }}>
              {sort === '기본 순' ? (
                <>
                  <SvgXml xml={svgXml.icon.filter} width="20" height="20" />
                  <Text style={styles.filterText}>{'기본 순'}</Text>
                </>
              ) : (
                <>
                  <SvgXml
                    xml={svgXml.icon.filterColor}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.filterTextActive}>{sort}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectSale ? COLOR_PRIMARY : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 성대생 할인');
                setSelectSale(!selectSale);
              }}>
              {!selectSale ? (
                <>
                  <SvgXml xml={svgXml.icon.persent} width="20" height="20" />
                  <Text style={styles.filterText}>{'성대생 할인'}</Text>
                </>
              ) : (
                <>
                  <SvgXml
                    xml={svgXml.icon.presentColor}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.filterTextActive}>{'성대생 할인'}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                styles.filterButton,
                {
                  backgroundColor: likedStore ? COLOR_PRIMARY : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 찜');
                setLikedStore(!likedStore);
              }}>
              {!likedStore ? (
                <>
                  <SvgXml xml={svgXml.icon.emptyHeart} width="20" height="20" />
                  <Text style={styles.filterText}>{'찜'}</Text>
                </>
              ) : (
                <>
                  <SvgXml
                    xml={svgXml.icon.emptyHeartColor}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.filterTextActive}>{'찜'}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                storeScoreModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                {
                  backgroundColor:
                    storeScore !== '전체'
                      ? COLOR_PRIMARY
                      : storeScoreModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 평점');
                setStoreScoreModalVisible(true);
              }}>
              {storeScore === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.emptyStar} width="20" height="20" />
                  <Text style={styles.filterText}>{'평점'}</Text>
                </>
              ) : (
                <>
                  <SvgXml
                    xml={svgXml.icon.emptyStarColor}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.filterTextActive}>{storeScore}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                storeScoreNaverModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                {
                  backgroundColor:
                    storeScoreNaver !== '전체'
                      ? COLOR_PRIMARY
                      : storeScoreNaverModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 평점');
                setStoreScoreNaverModalVisible(true);
              }}>
              {storeScoreNaver === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.emptyStar} width="20" height="20" />
                  <Text style={styles.filterText}>{'네이버 평점'}</Text>
                </>
              ) : (
                <>
                  <SvgXml
                    xml={svgXml.icon.emptyStarColor}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.filterTextActive}>{storeScoreNaver}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                replyNumModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                {
                  backgroundColor:
                    replyNum !== '전체'
                      ? COLOR_PRIMARY
                      : replyNumModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 댓글수');
                setReplyNumModalVisible(true);
              }}>
              {replyNum === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.reply} width="20" height="20" />
                  <Text style={styles.filterText}>{'댓글 수'}</Text>
                </>
              ) : (
                <>
                  <SvgXml xml={svgXml.icon.replyColor} width="20" height="20" />
                  <Text style={styles.filterTextActive}>{replyNum}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                replyNumNaverModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                {
                  backgroundColor:
                    replyNumNaver !== '전체'
                      ? COLOR_PRIMARY
                      : replyNumNaverModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 네이버 댓글수');
                setReplyNaverNumModalVisible(true);
              }}>
              {replyNumNaver === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.reply} width="20" height="20" />
                  <Text style={styles.filterText}>{'네이버 리뷰 수'}</Text>
                </>
              ) : (
                <>
                  <SvgXml xml={svgXml.icon.replyColor} width="20" height="20" />
                  <Text style={styles.filterTextActive}>{replyNumNaver}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={[
                priceRangeModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton,
                {
                  backgroundColor:
                    priceRange !== '전체'
                      ? COLOR_PRIMARY
                      : priceRangeModalVisible
                      ? '#D9D9D9'
                      : 'white',
                },
              ]}
              onPress={() => {
                console.log('press 댓글수');
                setPriceRangeModalVisible(true);
              }}>
              {priceRange === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.price} width="20" height="20" />
                  <Text style={styles.filterText}>{'가격'}</Text>
                </>
              ) : (
                <>
                  <SvgXml xml={svgXml.icon.priceColor} width="20" height="20" />
                  <Text style={styles.filterTextActive}>{priceRange}</Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 16}} />
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <>
      <Header title={'리스트'} isBackButton={false} />
      <View style={styles.entire}>
        {/* 가게 목록 */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <FlatList
            data={storeDartDatas}
            style={{flex: 1, width: windowWidth}}
            ListHeaderComponent={listHeader}
            ListFooterComponent={() => <View style={{height: 16}} />}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            renderItem={({item, index}) => {
              return (
                <View style={{alignItems: 'center'}}>
                  <View style={{height: 16}} />
                  <StoreCompo storeData={item} index={index} />
                </View>
              );
            }}
          />
        </View>
      </View>

      {/* 카테고리 모달 */}
      <Modal
        isVisible={categoryModalVisible}
        hasBackdrop={true}
        backdropOpacity={0.5}
        onSwipeComplete={() => setCategoryModalVisible(false)}
        swipeDirection={'down'}
        onBackdropPress={() => setCategoryModalVisible(false)}
        // coverScreen={false}
        onBackButtonPress={() => setCategoryModalVisible(false)}
        onModalHide={() => {
          setCategoryModalVisible(false);
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
            <Text style={styles.modalTitle}>카테고리</Text>
            <AnimatedButton
              style={{padding: 4}}
              onPress={() => {
                console.log('새로고침');
                setSelectedCategory([]);
                setCategoryModalVisible(false);
              }}>
              <SvgXml xml={svgXml.icon.refresh} width="24" height="24" />
            </AnimatedButton>
          </View>

          {/* 카테고리 버튼들 */}
          <View style={{marginTop: 12}}>
            <CategoryButton
              onPress={setSelectedCategory}
              data={selectedCategory}
            />
          </View>
        </View>
      </Modal>

      {/* 평점 모달 */}
      <ListModal
        visible={storeScoreModalVisible}
        setVisible={setStoreScoreModalVisible}
        title={'평점'}
        value={storeScore}
        setValue={setStoreScore}
        valueList={['전체', '5.0점', '4.5점 이상', '4.0점 이상', '3.5점 이상']}
      />

      {/* 네이버 평점 모달 */}
      <ListModal
        visible={storeScoreNaverModalVisible}
        setVisible={setStoreScoreNaverModalVisible}
        title={'네이버 평점'}
        value={storeScoreNaver}
        setValue={setStoreScoreNaver}
        valueList={['전체', '5.0점', '4.5점 이상', '4.0점 이상', '3.5점 이상']}
      />

      {/* 정렬 모달 */}
      <ListModal
        visible={sortModalVisible}
        setVisible={setSortModalVisible}
        title={'정렬'}
        value={sort}
        setValue={setSort}
        valueList={[
          '기본 순',
          '가까운 순',
          '평점 높은 순',
          '댓글 많은 순',
          '찜 많은 순',
        ]}
        setLocation={setMyLocation}
      />

      {/* 댓글수 모달 */}
      <ListModal
        visible={replyNumModalVisible}
        setVisible={setReplyNumModalVisible}
        title={'댓글 수'}
        value={replyNum}
        setValue={setReplyNum}
        valueList={[
          '전체',
          '10개 이상',
          '30개 이상',
          '50개 이상',
          '100개 이상',
        ]}
      />

      {/* 댓글수 모달 */}
      <ListModal
        visible={replyNumNaverModalVisible}
        setVisible={setReplyNaverNumModalVisible}
        title={'네이버 리뷰 수'}
        value={replyNumNaver}
        setValue={setReplyNumNaver}
        valueList={[
          '전체',
          '10개 이상',
          '30개 이상',
          '50개 이상',
          '100개 이상',
        ]}
      />

      {/* 가격 모달 */}
      <ListModal
        visible={priceRangeModalVisible}
        setVisible={setPriceRangeModalVisible}
        title={'가격'}
        value={priceRange}
        setValue={setPriceRange}
        valueList={[
          '전체',
          '1만원 미만',
          '1만원 ~ 2만원',
          '2만원 ~ 3만원',
          '3만원 이상',
        ]}
      />
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
  textInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
    color: '#888888',
    padding: 0,
    fontFamily: 'NanumSquareRoundB',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLOR_PRIMARY,
    // elevation: 4,
  },
  filterButtonSelected: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLOR_PRIMARY,
    // elevation: 4,
  },
  filterText: {
    marginLeft: 1,
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundEB',
  },
  filterTextActive: {
    marginLeft: 1,
    fontSize: 12,
    color: '#FFFFFF',
    // fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundB',
  },
  filterTextFade: {
    marginLeft: 1,
    fontSize: 12,
    color: COLOR_GRAY,
    fontWeight: 'bold',
  },
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
  categoryLine: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
