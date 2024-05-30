/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {COLOR_WHITE, COLOR_PRIMARY, COLOR_TEXT70GRAY} from '../assets/color';
import {useNavigation} from '@react-navigation/native';
import AppContext from './AppContext';
import {Dimensions} from 'react-native';
import StoreCompoForR from './StoreCompoForR';

const windowWidth = Dimensions.get('window').width;

export default function MyReview(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const {myReviews, onEndReached, hasMore} = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = Math.floor(offsetX / pageWidth + 0.5);
    setCurrentIndex(currentPage);

    if (currentPage === myReviews.length - 1 && hasMore) {
      onEndReached();
    }
  };

  const Indicator = Array.from({length: myReviews.length}, (_, index) => (
    <View
      key={index.toString()}
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 3.5,
        backgroundColor: index === currentIndex ? COLOR_PRIMARY : '#D9D9D9',
      }}
    />
  ));

  return (
    <View style={styles.myReview}>
      <Text style={styles.myReviewTitle}>내 리뷰</Text>
      {myReviews.length === 0 ? (
        <Text style={styles.noReviewText}>리뷰가 없습니다</Text>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}
            horizontal={true}
            pagingEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}>
            {myReviews.map((reviewData, index) => {
              return (
                <StoreCompoForR
                  key={index.toString()}
                  storeData={reviewData}
                  index={index}
                />
              );
            })}
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 8,
            }}>
            {Indicator}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  myReview: {
    marginTop: 15,
    width: windowWidth - 32,
    padding: 12,
    paddingHorizontal: 10,
    backgroundColor: COLOR_WHITE,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    height: 200,
  },
  myReviewTitle: {
    fontSize: 20,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
  noReviewText: {
    marginTop: 20,
    fontSize: 16,
    color: COLOR_TEXT70GRAY,
    textAlign: 'center',
  },
});
