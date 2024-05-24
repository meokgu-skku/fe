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
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BlurView} from '@react-native-community/blur';
import {Svg, SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import MapDart from '../../components/MapDart';
import Modal from 'react-native-modal';
import {Dimensions} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import StoreCompo from '../../components/StoreCompo';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import axios, {AxiosError} from 'axios';
import {API_URL} from '@env';
import AppContext from '../../components/AppContext';
import ListModal from '../../components/ListModal';

const windowWidth = Dimensions.get('window').width;

export default function MapScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [isEnabled, setIsEnabled] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [storeScoreModalVisible, setStoreScoreModalVisible] = useState(false);
  const [replyNumModalVisible, setReplyNumModalVisible] = useState(false);
  const [priceRangeModalVisible, setPriceRangeModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [myLocation, setMyLocation] = useState({latitude: 0, longitude: 0}); // [latitude, longitude]
  const [storeData, setStoreData] = useState({});

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [storeScore, setStoreScore] = useState('전체');
  const [replyNum, setReplyNum] = useState('전체');
  const [priceRange, setPriceRange] = useState('전체');

  const [selectSale, setSelectSale] = useState(false);
  const [likedStore, setLikedStore] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const closeStoreModalVisible = () => {
    setStoreModalVisible(false);
  };

  const getMyLocation = async () => {
    if (myLocation.latitude !== 0) {
      setMyLocation({latitude: 0, longitude: 0});
      return;
    }

    const platformPermissions = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      let result = await request(platformPermissions);
      console.log(result);
    } catch (err) {
      console.warn(err);
    }

    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude, position.coords.longitude);
        const {latitude, longitude} = position.coords;

        setMyLocation({
          latitude: latitude,
          longitude: longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  //TODO: storeDartDatas를 서버에서 받아와서 저장해야함
  const [storeDartDatas, setStoreDartDatas] = useState([
    {
      name: '율천회관',
      category: '한식',
      menu: '육회비빔밥',
      latitude: 37.296736,
      longitude: 126.970762,
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/max.jpeg',
      score: 4.5,
      reviewCount: 100,
      heartCount: 20,
      firstReview: {
        reviewer: '엄승주',
        body: '가게 내부 깨끗하고, 서비스 친절해서 개좋음. 기대안하고 첨 갔는데 걍 인생 oo 맛봄. 지림.',
      },
    },
    {
      name: '자스민',
      category: '아시안',
      menu: '월남쌈',
      latitude: 37.298612,
      longitude: 126.972889,
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
      score: 4.5,
      reviewCount: 100,
      heartCount: 20,
      firstReview: {
        reviewer: '엄승주',
        body: '가게 내부 깨끗하고, 서비스 친절해서 개좋음. 기대안하고 첨 갔는데 걍 인생 oo 맛봄. 지림.',
      },
    },
    {
      name: '키와마루아지',
      category: '일식',
      menu: '라멘',
      latitude: 37.29693,
      longitude: 126.968718,
      image: 'https://d2da4yi19up8sp.cloudfront.net/product/pro.jpeg',
      score: 4.5,
      reviewCount: 100,
      heartCount: 20,
      firstReview: {
        reviewer: '엄승주',
        body: '가게 내부 깨끗하고, 서비스 친절해서 개좋음. 기대안하고 첨 갔는데 걍 인생 oo 맛봄. 지림.',
      },
    },
  ]);

  const catrgory = [
    ['한식', '양식', '일식', '중식'],
    ['분식', '치킨', '피자', '버거'],
    ['아시안', '카페', '전체', ''],
  ];

  //TODO: 백엔드 업데이트 되면 사용
  const loadStoreDatas = async () => {
    try {
      // console.log('context.accessToken:', context.accessToken);

      const params = {
        discountForSkku: true,
      };

      const queryString = new URLSearchParams(params).toString();

      const response = await axios.get(`${API_URL}/v1/restaurants`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      console.log('response:', response.data.data.restaurants.content[0]);

      setStoreDartDatas(response.data.data.restaurants.content);
    } catch (e) {
      console.log('error', e);
    }
  };

  //TODO: 카테고리별로 필터링하는 함수

  useEffect(() => {
    // loadStoreDatas();
  }, []);

  return (
    <>
      <Header title={'지도'} isBackButton={false} />
      <View style={styles.entire}>
        <MapView
          style={{flex: 1, width: windowWidth}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.297861,
            longitude: 126.971458,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {storeDartDatas.map((data, index) => {
            if (
              selectedCategory !== '전체' &&
              data.category !== selectedCategory
            ) {
              return null;
            }
            return (
              <MapDart
                data={data}
                onPress={() => {
                  setStoreModalVisible(true);
                  setStoreData(data);
                }}
              />
            );
          })}
          {myLocation.latitude !== 0 ? (
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
            />
          ) : null}
        </MapView>

        <View style={{position: 'absolute', top: 6, alignItems: 'center'}}>
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
              navigation.navigate('Search');
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
            style={{marginTop: 16}}>
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

        {/*TODO: 나침반 버튼, gps버튼 기능 추가*/}
        {/* 나침반 버튼*/}
        {/* <AnimatedButton
          style={[styles.cornerButton, {left: 16}]}
          onPress={() => {
            console.log('press compass');
          }}>
          <SvgXml xml={svgXml.icon.compass} width="30" height="30" />
        </AnimatedButton> */}

        {/* gps 버튼*/}
        <AnimatedButton
          style={[styles.cornerButton, {right: 16}]}
          onPress={() => {
            console.log('press gps');
            getMyLocation();
          }}>
          <SvgXml xml={svgXml.icon.gps} width="24" height="24" />
        </AnimatedButton>
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

      {/* 가게 모달 */}
      <Modal
        isVisible={storeModalVisible}
        hasBackdrop={true}
        backdropOpacity={0}
        onSwipeComplete={closeStoreModalVisible}
        swipeDirection={'down'}
        onBackdropPress={closeStoreModalVisible}
        // coverScreen={false}
        onBackButtonPress={closeStoreModalVisible}
        onModalHide={closeStoreModalVisible}
        style={{justifyContent: 'flex-end', margin: 0}}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={styles.modalContent}>
          <StoreCompo storeData={storeData} index={1} />
        </View>
      </Modal>
    </>
  );
}

function CategoryButton(props) {
  const {name, onPress, selected} = props;

  return (
    <AnimatedButton
      style={
        selected === name
          ? styles.categoryModalButtonSelected
          : styles.categoryModalButton
      }
      onPress={() => {
        onPress(name);
      }}>
      <Text
        style={
          selected === name
            ? styles.categoryModalButtonTextSelected
            : styles.categoryModalButtonText
        }>
        {name}
      </Text>
    </AnimatedButton>
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
    elevation: 4,
  },
  filterButtonSelected: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    elevation: 4,
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
  cornerButton: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'white',
    borderRadius: 15,
    height: 30,
    width: 30,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  categoryModalButton: {
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  categoryModalButtonSelected: {
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  categoryModalButtonText: {
    fontSize: 16,
    color: COLOR_TEXT60GRAY,
  },
  categoryModalButtonTextSelected: {
    fontSize: 16,
    color: COLOR_TEXT70GRAY,
    fontWeight: 'bold',
  },
  categoryLine: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
