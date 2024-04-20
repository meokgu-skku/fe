import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';

export default function HomeScreen() {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const [todaysPick, setTodaysPick] = useState({
    name: '율천회관',
    category: '한식',
    menu: '육회비빔밥',
    image: 'https://d2da4yi19up8sp.cloudfront.net/product/max.jpeg',
  });

  const [image, setImage] = useState(
    'https://d2da4yi19up8sp.cloudfront.net/product/loed4.png',
  );

  const helloAPI = async () => {
    try {
      const response = await axios.get(`${API_URL}/hello/security-test`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      console.log('response:', response.data.data);

      if (!response.data.data) {
        console.log('Error: No return data');
        return;
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <>
      <Header title={'홈'} isBackButton={false} />
      <View style={styles.entire}>
        {/* 먹구스꾸 오늘의 픽 */}
        <View style={styles.todayPick}>
          <Text style={styles.todayPickTitle}>먹구스꾸's 오늘의 픽</Text>
          {console.log('todaysPick:', todaysPick.image)}
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image
              source={{
                uri: 'https://picsum.photos/seed/picsum/200/300',
              }}
              resizeMode="cover"
              style={{
                width: 300,
                height: 300,
                borderRadius: 16,
                backgroundColor: 'red',
              }}
            />
          </View>
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
  todayPick: {
    width: '95%',
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
    elevation: 4, // for Android
  },
  todayPickTitle: {
    fontSize: 20,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
});
