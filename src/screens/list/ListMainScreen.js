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
import AppContext from '../../components/AppContext';
import CategoryButton from '../../components/CategoryButton';
import ListModal from '../../components/ListModal';
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;

export default function ListMainScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [storeScoreModalVisible, setStoreScoreModalVisible] = useState(false);
  const [replyNumModalVisible, setReplyNumModalVisible] = useState(false);
  const [priceRangeModalVisible, setPriceRangeModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [storeScore, setStoreScore] = useState('전체');
  const [replyNum, setReplyNum] = useState('전체');
  const [priceRange, setPriceRange] = useState('전체');
  const [sort, setSort] = useState('기본 순');
  const [selectSale, setSelectSale] = useState(false);
  const [likedStore, setLikedStore] = useState(false);

  const [pageNumber, setPageNumber] = useState(0);

  const catrgory = [
    ['한식', '양식', '일식', '중식'],
    ['분식', '치킨', '피자', '버거'],
    ['아시안', '카페', '전체', ''],
  ];

  //TODO: 서버에서 데이터 받아오기
  //임시 데이터
  const [storeDartDatas, setStoreDartDatas] = useState([]);

  const checkCategory = async () => {
    const srcCategory = await AsyncStorage.getItem('category');
    if (srcCategory) {
      setSelectedCategory(srcCategory);
      await AsyncStorage.setItem('category', '');
    } else {
      setSelectedCategory('전체');
    }
  };

  //TODO: 필터링 하는 함수
  const getStoreDatas = async () => {
    try {
      // console.log('context.accessToken:', context.accessToken);
      const catrgories = [];

      if (selectedCategory !== '전체') {
        catrgories.push(selectedCategory);
      }

      let discountForSkku = false;
      if (selectSale) {
        discountForSkku = true;
      }

      let like = false;
      if (likedStore) {
        like = true;
      }

      let sort = 'BASIC';

      const params = {
        categories: catrgories,
        discountForSkku: discountForSkku,
        like: like,
        sort: sort,
        paged: true,
        pageNumber: pageNumber,
        pageSize: 20,
      };

      setPageNumber(pageNumber + 1);

      const queryString = new URLSearchParams(params).toString();

      const response = await axios.get(
        `${API_URL}/v1/restaurants?${queryString}`,
        {
          headers: {Authorization: `Bearer ${context.accessToken}`},
        },
      );

      console.log('response:', response.data.data.restaurants.content[0]);

      setStoreDartDatas(response.data.data.restaurants.content);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    checkCategory();
  }, []);

  useEffect(() => {
    setPageNumber(0);
    getStoreDatas();
  }, [
    selectedCategory,
    storeScore,
    replyNum,
    priceRange,
    selectSale,
    likedStore,
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
              //TODO: 리스트화면에도 검색 화면 추가하기
              // navigation.navigate('Search');
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
              <Text style={styles.textInput}>{'율전의 맛집은 과연 어디?'}</Text>
            </View>
          </AnimatedButton>

          {/* 필터 버튼들*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingTop: 16}}>
            <View style={{width: 16}} />

            <AnimatedButton
              style={
                categoryModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton
              }
              onPress={() => {
                console.log('press 카테고리');
                setCategoryModalVisible(true);
              }}>
              {selectedCategory === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.shop} width="20" height="20" />
                  <Text style={styles.filterText}>{'카테고리'}</Text>
                </>
              ) : (
                <>
                  <SvgXml xml={svgXml.icon.shopColor} width="20" height="20" />
                  <Text style={styles.filterTextActive}>
                    {selectedCategory}
                  </Text>
                </>
              )}
            </AnimatedButton>

            <View style={{width: 8}} />

            <AnimatedButton
              style={styles.filterButton}
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
              style={styles.filterButton}
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
              style={
                storeScoreModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton
              }
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
              style={
                replyNumModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton
              }
              onPress={() => {
                console.log('press 댓글수');
                setReplyNumModalVisible(true);
              }}>
              {replyNum === '전체' ? (
                <>
                  <SvgXml xml={svgXml.icon.reply} width="20" height="20" />
                  <Text style={styles.filterText}>{'댓글수'}</Text>
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
              style={
                priceRangeModalVisible
                  ? styles.filterButtonSelected
                  : styles.filterButton
              }
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
        backdropOpacity={0}
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
                setSelectedCategory('전체');
                setCategoryModalVisible(false);
              }}>
              <SvgXml xml={svgXml.icon.refresh} width="24" height="24" />
            </AnimatedButton>
          </View>

          {/* 카테고리 버튼들 */}
          <View style={{marginTop: 12}}>
            {catrgory.map(cateLine => {
              return (
                <View style={styles.categoryLine}>
                  {cateLine.map((name, index) => (
                    <CategoryButton
                      name={name}
                      onPress={setSelectedCategory}
                      selected={selectedCategory}
                    />
                  ))}
                </View>
              );
            })}
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

      {/* 댓글수 모달 */}
      <ListModal
        visible={replyNumModalVisible}
        setVisible={setReplyNumModalVisible}
        title={'댓글수'}
        value={replyNum}
        setValue={setReplyNum}
        valueList={['전체', '10 이상', '30 이상', '50 이상', '100 이상']}
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
    fontSize: 12,
    color: '#888888',
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    backgroundColor: 'white',
    borderRadius: 15,
    // elevation: 4,
  },
  filterButtonSelected: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    // elevation: 4,
  },
  filterText: {
    marginLeft: 1,
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
    fontWeight: 'bold',
  },
  filterTextActive: {
    marginLeft: 1,
    fontSize: 12,
    color: '#A4D65E',
    fontWeight: 'bold',
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
