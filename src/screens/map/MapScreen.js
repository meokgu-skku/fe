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

export default function MapScreen() {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [storeData, setStoreData] = useState({});

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const closeStoreModalVisible = () => {
    setStoreModalVisible(false);
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

  //TODO: 검색어를 받아와서 검색하는 함수
  function searchStore(inputString) {
    console.log('검색어:', inputString);
  }

  //TODO: 카테고리별로 필터링하는 함수

  //TODO: 본인 위치 받아오는 함수

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
          {storeDartDatas.map((data, index) => (
            <MapDart
              data={data}
              onPress={() => {
                setStoreModalVisible(true);
                setStoreData(data);
              }}
            />
          ))}
        </MapView>

        <View style={{position: 'absolute', top: 6, alignItems: 'center'}}>
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

          {/* 필터 버튼들*/}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 6,
              justifyContent: 'space-between',
              alignItems: 'stretch',
              width: windowWidth - 32,
            }}>
            <AnimatedButton
              style={styles.filterButton}
              onPress={() => {
                console.log('press 카테고리');
                setCategoryModalVisible(true);
              }}>
              <SvgXml xml={svgXml.icon.shop} width="20" height="20" />
              <Text style={styles.filterText}>{'카테고리'}</Text>
            </AnimatedButton>

            <AnimatedButton
              style={styles.filterButton}
              onPress={() => {
                console.log('press 성대생 할인');
              }}>
              <SvgXml xml={svgXml.icon.persent} width="20" height="20" />
              <Text style={styles.filterText}>{'성대생 할인'}</Text>
            </AnimatedButton>

            <AnimatedButton
              style={styles.filterButton}
              onPress={() => {
                console.log('press 찜');
              }}>
              <SvgXml xml={svgXml.icon.emptyHeart} width="20" height="20" />
              <Text style={styles.filterText}>{'찜'}</Text>
            </AnimatedButton>

            {/* 임시로 만들어 둔 UI 입니다. 추후에 수정이 필요합니다. 피그마 대로 하려면 좀 걸릴거 같습니다. */}
            <View style={styles.filterButton}>
              <Text
                style={!isEnabled ? styles.filterText : styles.filterTextFade}>
                {'식당'}
              </Text>
              <Switch
                trackColor={{false: COLOR_PRIMARY, true: COLOR_PRIMARY}}
                thumbColor={'#D4EBFF'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text
                style={isEnabled ? styles.filterText : styles.filterTextFade}>
                {'카페'}
              </Text>
            </View>
          </View>
        </View>

        {/*TODO: 나침반 버튼, gps버튼 기능 추가*/}
        {/* 나침반 버튼*/}
        <AnimatedButton
          style={[styles.cornerButton, {left: 16}]}
          onPress={() => {
            console.log('press compass');
          }}>
          <SvgXml xml={svgXml.icon.compass} width="30" height="30" />
        </AnimatedButton>

        {/* gps 버튼*/}
        <AnimatedButton
          style={[styles.cornerButton, {right: 16}]}
          onPress={() => {
            console.log('press gps');
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
    color: COLOR_TEXT_BLACK,
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
  filterText: {
    marginLeft: 1,
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
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
