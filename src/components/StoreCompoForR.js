import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLOR_TEXT70GRAY, COLOR_TEXT_BLACK, COLOR_TEXT60GRAY } from '../assets/color';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import ImageModal from 'react-native-image-modal';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';

const windowWidth = Dimensions.get('window').width;

export default function StoreCompoForR(props) {
  const navigation = useNavigation();
  const { storeData, index } = props;

  return (
    <Pressable
      key={index.toString()}
      style={{
        width: windowWidth - 32,
        height: windowWidth / 3,
      }}
      onPress={() => {
        console.log('가게 상세 페이지로 이동');
        navigation.navigate('StoreDetail', { data: storeData });
      }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.imageContainer}>
          <ImageModal
            swipeToDismiss={true}
            modalImageResizeMode="contain"
            imageBackgroundColor="transparent"
            overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
            resizeMode="cover"
            style={styles.image}
            source={{
              uri: storeData.image || 'https://via.placeholder.com/150',
            }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.storeName}>{storeData.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.reviewText}>
            <SvgXml xml={svgXml.icon.star} width="15" height="15" style={{}} />
              {storeData.score} ({storeData.reviewCount})
            </Text>
            <SvgXml
              xml={svgXml.icon.heart}
              width="15"
              height="15"
              style={{marginLeft: 7}}
            />
            <Text style={styles.heartText}>
              {storeData.heartCount}
            </Text>
          </View>
          <Text style={styles.reviewerName}>
            {storeData.firstReview.reviewer} 님
          </Text>
          <Text style={styles.reviewContent} numberOfLines={4}>
            {storeData.firstReview.body}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: windowWidth / 4,  
    height: windowWidth / 4, 
    borderWidth: 1,
    borderColor: COLOR_TEXT70GRAY,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  storeName: {
    fontSize: 19,  
    color: COLOR_TEXT_BLACK,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 16,  
    color: COLOR_TEXT70GRAY,
    marginLeft: 7,
  },
  heartText: {
    fontSize: 16, 
    color: COLOR_TEXT70GRAY,
    marginLeft: 7,
  },
  reviewerName: {
    fontSize: 14,  
    color: COLOR_TEXT70GRAY,
  },
  reviewContent: {
    fontSize: 15,  
    color: COLOR_TEXT60GRAY,
  },
});
