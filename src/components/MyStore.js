import React, {useContext, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {COLOR_WHITE, COLOR_TEXT70GRAY, COLOR_PRIMARY} from '../assets/color';
import {useNavigation} from '@react-navigation/native';
import AppContext from './AppContext';
import {Dimensions} from 'react-native';
import AnimatedButton from './AnimationButton';

const windowWidth = Dimensions.get('window').width;

export default function MyStore(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const scrollViewRef = useRef();

  const {passData, onEndReached, hasMore} = props;

  const handleScroll = event => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const isCloseToEnd =
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 50;

    if (isCloseToEnd && hasMore) {
      onEndReached();
    }
  };

  return (
    <View style={styles.kingopass}>
      <Text style={styles.kingopassTitle}>찜한 가게</Text>
      {passData.length === 0 ? (
        <Text style={styles.noStoreText}>찜한 가게가 없습니다</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollViewContent}
          horizontal={true}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {/* <View style={{width: 16}} /> */}
          {passData.map((data, index) => {
            return (
              <AnimatedButton
                key={index.toString()}
                style={styles.kingopassKard}
                onPress={() => {
                  //TODO: 찜한 가게  불러올 때 가게 id가 안나옴
                  console.log('찜한 가게 페이지로 이동', data);
                  navigation.navigate('StoreDetail', {data: data});
                }}>
                <Image
                  source={{
                    uri: data.image,
                  }}
                  resizeMode="cover"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    borderRadius: 10,
                    width: 140,
                    height: 140,
                    backgroundColor: '#000000',
                    opacity: 0.4,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    borderRadius: 10,
                    width: 140,
                    height: 140,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      // color: COLOR_WHITE,
                      // fontWeight: 'bold',
                      color: COLOR_WHITE,
                      // fontWeight: 'bold',
                      fontFamily:
                        Platform.OS == 'android'
                          ? 'NIXGONFONTS M 2.0'
                          : 'NIXGONM-Vb',
                      // textAlign: 'left',
                      margin: 10,
                    }}>
                    {data.name}
                  </Text>
                </View>
              </AnimatedButton>
            );
          })}
          {/* <View style={{width: 16}} /> */}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kingopass: {
    marginTop: 15,
    width: windowWidth,
    paddingHorizontal: 0,
  },
  kingopassTitle: {
    fontSize: 20,
    marginLeft: 26,
    color: COLOR_PRIMARY,
    // fontWeight: '700',
    fontFamily: Platform.OS == 'android' ? 'NIXGONFONTS M 2.0' : 'NIXGONM-Vb',
    marginBottom: 10,
  },
  kingopassKard: {
    height: 140,
    width: 140,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  noStoreText: {
    fontSize: 16,
    color: COLOR_TEXT70GRAY,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollViewContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});
