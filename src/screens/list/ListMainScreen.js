/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
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
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import StoreCompo from '../../components/StoreCompo';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function ListMainScreen() {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('전체');

  const catrgory = [
    '전체',
    '한식',
    '양식',
    '일식',
    '중식',
    '분식',
    '치킨',
    '피자',
    '버거',
    '아시안',
    '카페',
  ];

  //TODO: 서버에서 데이터 받아오기
  //임시 데이터
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

  //TODO: 필터링 하는 함수

  //리스트 위에 필터 버튼들
  //TODO: 필터 버튼 누르면 필터링 되도록 기능 추가
  const FilterButtons = () => {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <AnimatedButton
          style={styles.filterButton}
          onPress={() => {
            console.log('정렬 버튼 누름');
          }}>
          <View style={{flexDirection: 'row'}}>
            <SvgXml xml={svgXml.icon.filter} width="20" height="20" />
            <Text style={styles.filterButtonText}>거리순</Text>
            <SvgXml xml={svgXml.icon.arrowDown} width="20" height="20" />
          </View>
        </AnimatedButton>

        <AnimatedButton
          style={styles.filterButton}
          onPress={() => {
            console.log('할인 버튼 누름');
          }}>
          <View style={{flexDirection: 'row'}}>
            <SvgXml xml={svgXml.icon.persentBlack} width="20" height="20" />
            <Text style={styles.filterButtonText}>성대생 할인</Text>
            <SvgXml xml={svgXml.icon.arrowDown} width="20" height="20" />
          </View>
        </AnimatedButton>

        <AnimatedButton
          style={styles.filterButton}
          onPress={() => {
            console.log('평점 필터 버튼 누름');
          }}>
          <View style={{flexDirection: 'row'}}>
            <SvgXml xml={svgXml.icon.starBlack} width="20" height="20" />
            <Text style={styles.filterButtonText}>평점</Text>
            <SvgXml xml={svgXml.icon.arrowDown} width="20" height="20" />
          </View>
        </AnimatedButton>

        <AnimatedButton
          style={styles.filterButton}
          onPress={() => {
            console.log('초기화 버튼 누름');
          }}>
          <View style={{flexDirection: 'row'}}>
            <SvgXml xml={svgXml.icon.refresh} width="20" height="20" />
          </View>
        </AnimatedButton>
      </View>
    );
  };

  return (
    <>
      <Header title={'리스트'} isBackButton={false} />
      <View style={styles.entire}>
        {/* 카테고리 선택 목록 */}
        <View
          style={{height: 45, borderBottomWidth: 0.5, borderColor: '#D9D9D9'}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              // backgroundColor: 'red',
              padding: 8,
            }}
            horizontal={true}>
            {catrgory.map((item, index) => {
              return (
                <AnimatedButton
                  onPress={() => {
                    setSelectedCategory(item);
                  }}
                  style={{
                    height: 28,
                    paddingHorizontal: 8,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={
                      selectedCategory === item
                        ? styles.categoryButtonSelected
                        : styles.categoryButton
                    }>
                    {item}
                  </Text>
                </AnimatedButton>
              );
            })}
            <View
              style={{
                height: 28,
                paddingHorizontal: 8,
              }}
            />
          </ScrollView>
        </View>

        {/* 가게 목록 */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <FlatList
            data={storeDartDatas}
            style={{flex: 1, width: windowWidth}}
            ListFooterComponent={() => <View style={{height: 16}} />}
            ListHeaderComponent={() => <FilterButtons />}
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
  textMain: {
    fontSize: 50,
    color: COLOR_PRIMARY,
  },
  buttonTest: {
    backgroundColor: COLOR_PRIMARY,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: COLOR_WHITE,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  categoryButton: {
    fontSize: 12,
    fontColor: '#949494',
  },
  categoryButtonSelected: {
    fontSize: 12,
    fontColor: '#000000',
    fontWeight: 'bold',
  },
  filterButton: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 15,
    paddingHorizontal: 4,
    paddingVertical: 5,
    marginTop: 12,
  },
  filterButtonText: {
    fontSize: 12,
    marginHorizontal: 3,
    fontColor: '#000000',
    fontWeight: 'bold',
  },
});
