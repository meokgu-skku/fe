/* eslint-disable react/no-unstable-nested-components */
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
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT70GRAY,
  COLOR_TEXT60GRAY,
  COLOR_DISABLE_GRAY,
} from '../../assets/color';
import Toast from 'react-native-toast-message';
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
import {FlatList, TextInput} from 'react-native-gesture-handler';
import StoreCompo from '../../components/StoreCompo';
import axios, {AxiosError} from 'axios';
import {API_URL, AUTO_COMPLETE} from '@env';
import AppContext from '../../components/AppContext';

const windowWidth = Dimensions.get('window').width;

const parseHighlightedText = text => {
  const parts = text.split(/(<strong>|<\/strong>)/g);
  return parts.map((part, index) => {
    if (part === '<strong>')
      return (
        <Text key={index} style={{fontFamily: 'NanumSquareRoundEB'}}>
          {parts[index + 1]}
        </Text>
      );
    if (part === '</strong>') return null;
    if (parts[index - 1] === '<strong>') return null;
    return <Text key={index}>{part}</Text>;
  });
};

export default function SearchScreen(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const {route} = props;
  const setSearch = route.params?.setSearch;
  const searchParam = route.params?.search;

  const [searchText, setSearchText] = useState('');
  const [recentSearch, setRecentSearch] = useState([]);

  const [autoCompleteData, setAutoCompleteData] = useState([]);

  useEffect(() => {
    if (searchParam) {
      setSearchText(searchParam);
      autocomplete(searchParam);
    }
    initRecentSearch();
  }, [searchParam]);

  useEffect(() => {
    initRecentSearch();
  }, []);

  const autocomplete = async inputString => {
    console.log('검색어:', inputString);
    try {
      const params = {
        query: inputString,
      };

      const queryString = new URLSearchParams(params).toString();

      const response = await axios.get(`${AUTO_COMPLETE}?${queryString}`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      const limitedResults = response.data.results.slice(0, 5);
      setAutoCompleteData(limitedResults);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  const initRecentSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/recents`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
      });

      console.log('response:', response.data.data.recentQueries);

      setRecentSearch(response.data.data.recentQueries);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  const deleteRecentSearch = async query => {
    try {
      console.log('context.accessToken:', context.accessToken);

      const response = await axios.delete(`${API_URL}/v1/recents`, {
        headers: {Authorization: `Bearer ${context.accessToken}`},
        data: {query: query},
      });

      console.log('response:', response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  return (
    <>
      <Header title={'검색'} isBackButton={true} noSafe={true} />
      <View style={styles.entire}>
        <View
          style={{
            alignItems: 'center',
            marginBottom: searchText.length == 0 ? 20 : 0,
          }}>
          {/* 검색창 */}
          <View
            style={{
              width: windowWidth - 32,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 4,
              paddingHorizontal: 8,
              elevation: 4,
              marginVertical: 15,
              justifyContent: 'center',

              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AnimatedButton
              onPress={() => {
                setSearch(searchText);
                navigation.goBack();
              }}
              style={{
                padding: 8,
              }}>
              <SvgXml xml={svgXml.icon.search} width="24" height="24" />
            </AnimatedButton>
            <TextInput
              placeholder={'율전의 맛집은 과연 어디?'}
              placeholderTextColor={'#888888'}
              style={styles.textInput}
              onChangeText={text => {
                setSearchText(text);
                autocomplete(text);
              }}
              blurOnSubmit={false}
              maxLength={200}
              value={searchText}
              onSubmitEditing={() => {
                setSearch(searchText);
                navigation.goBack();
              }}
              textAlignVertical="center"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              numberOfLines={1}
            />
          </View>
        </View>

        {/* 최근 검색어 부분 */}
        {searchText.length == 0 ? (
          <View style={{}}>
            <View style={styles.recentHeader}>
              <Text
                style={{
                  fontSize: 15,
                  color: COLOR_TEXT_BLACK,
                  fontFamily: 'NanumSquareRoundB',
                }}>
                최근 검색어
              </Text>
              <AnimatedButton
                onPress={() => {
                  console.log('최근 검색어 전부 삭제');
                  setRecentSearch([]);

                  for (let i = 0; i < recentSearch.length; i++) {
                    deleteRecentSearch(recentSearch[i].query);
                  }
                }}
                style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLOR_TEXT60GRAY,
                    fontFamily: 'NanumSquareRoundB',
                    marginBottom: 4,
                  }}>
                  전체 삭제
                </Text>
              </AnimatedButton>
            </View>
            <View style={{height: 80}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingTop: 15,
                }}>
                <View style={{width: 16}} />

                {recentSearch.map((item, index) => {
                  return (
                    <>
                      <AnimatedButton
                        style={styles.filterButton}
                        onPress={() => {
                          console.log('press item:', item.query);
                          setSearch(item.query);
                          navigation.goBack();
                        }}>
                        <Text style={styles.recentText}>{item.query}</Text>
                      </AnimatedButton>

                      <View style={{width: 7}} />
                    </>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={styles.searchArea}>
            <FlatList
              data={autoCompleteData}
              renderItem={({item, index}) => {
                return (
                  <AnimatedButton
                    style={styles.listButton}
                    onPress={async () => {
                      setSearch(item.org_display);
                      navigation.goBack();
                    }}>
                    <SvgXml xml={svgXml.icon.search} width="18" height="18" />
                    <Text style={styles.buttonText}>
                      {parseHighlightedText(item.highlighted_display)}
                    </Text>
                    <View style={{flex: 1}} />
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </AnimatedButton>
                );
              }}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
  },
  textInput: {
    marginLeft: 4,
    flex: 1,
    fontSize: 14,
    color: COLOR_TEXT_BLACK,
    fontFamily: 'NanumSquareRound',
    padding: 0,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    width: windowWidth - 32,
    // backgroundColor: 'blue',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 15,
    backgroundColor: COLOR_WHITE,
    borderColor: COLOR_PRIMARY,
    borderWidth: 1,
    height: 37,
  },
  recentText: {
    fontSize: 13,
    color: COLOR_TEXT_BLACK,
    textAlign: 'center',
    // lineHeight: 16,
    fontFamily: 'NanumSquareRoundB',
  },
  searchArea: {
    // backgroundColor: 'blue',
    flex: 1,
    width: windowWidth,
  },
  touchArea: {
    // backgroundColor: 'blue',
    flex: 1,
    width: windowWidth,
  },
  listButton: {
    marginStart: 18,
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    color: COLOR_TEXT_BLACK,
    marginStart: 6,
    fontFamily: 'NanumSquareRound',
    marginLeft: 2,
  },
  categoryText: {
    fontSize: 12,
    color: COLOR_PRIMARY,
    marginStart: 6,
    fontFamily: 'NanumSquareRoundEB',
    textAlign: 'right',
    marginBottom: 2.5,
  },
});
