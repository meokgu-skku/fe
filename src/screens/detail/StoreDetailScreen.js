/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT70GRAY,
  COLOR_TEXT_BLACK,
  COLOR_LIGHTGRAY,
} from '../../assets/color';
import AnimatedButton from '../../components/AnimationButton';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/svg';
import Header from '../../components/Header';
import AppContext from '../../components/AppContext';
import axios from 'axios';
import {API_URL} from '@env';
import {Dimensions} from 'react-native';
import ImageModal from 'react-native-image-modal';

const windowWidth = Dimensions.get('window').width;

export default function StoreDetailScreen(props) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const { route } = props;
  const restaurantId = route.params?.data?.id;
  const [restaurant, setRestaurant] = useState([]);
  const [isHearted, setIsHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(0);

  useEffect(() => {
    restaurantDetail();
  }, []);

  const restaurantDetail = async () => {
    console.log('Id: ', restaurantId);
    try {
      const params = {
        discountForSkku: false,
        like: false,
        sort: 'BASIC',
      };

      const queryString = new URLSearchParams(params).toString();
      
      const response = await axios.get(`${API_URL}/v1/restaurants/${queryString}`, {
        headers: { Authorization: `Bearer ${context.accessToken}` },
      });
      const data = response.data.data.restaurant;
      
      console.log('data: ', data);
      
      setRestaurant(data);
      setIsHearted(data.isLike);
      setHeartCount(data.likeCount);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

    const handleHeartPress = async () => {
      try {
        const newHeartedState = !isHearted;
        setIsHearted(newHeartedState);
        setHeartCount(newHeartedState ? heartCount + 1 : heartCount - 1);

        await axios.post(
          `${API_URL}/v1/restaurants/${restaurantId}/like`, 
          {
            isLike: newHeartedState,
          },
          {
            headers: { Authorization: `Bearer ${context.accessToken}` },
          },
        );
      } catch (error) {
        console.error('Error updating heart count:', error);
        setIsHearted(!newHeartedState);
        setHeartCount(newHeartedState ? heartCount - 1 : heartCount + 1);
      }
    };

    if (!restaurant) {
      return <Text>Loading...</Text>;
    }
  
    const renderMenuItem = ({item}) => (
      <>
      <View key={item.id} style={styles.menuItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.menuImage} />  
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.name}</Text>
          <Text style={styles.menuDescription}>{item.description}</Text>
          <Text style={styles.menuPrice}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.horizontalDivider} />
      </>
    );
  
    const renderReviewItem = ({item}) => (
      <>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewAuthor}>{item.author}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
          <Text style={styles.reviewText}>{item.text}</Text>
        </View>
        <View style={styles.horizontalDivider} />
      </>
    );

    // return (
    //   <>
    //     <Header title={'가게 상세 페이지'} isBackButton={true} />
    //     <View contentContainerStyle={styles.entire}>
    //         <View style={styles.storeImageContainer}>
    //           {/* <Image source={{ uri: restaurant.representativeImageUrl }} style={styles.storeImage} /> */}
    //           <ImageModal
    //             swipeToDismiss={true}
    //             modalImageResizeMode="contain"
    //             imageBackgroundColor="transparent"
    //             overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
    //             resizeMode="cover"
    //             style={styles.storeImage}
    //             source={{ uri: restaurant.representativeImageUrl }}
    //           />
    //         </View>
    //         <View style={styles.storeInfo}>
    //           <View style={styles.storeHeader}>
    //             <Text style={styles.storeName}>{restaurant.name}</Text>
    //             <Text style={styles.storeCategory}>{restaurant.categories}</Text>
    //           </View>
    //           <View style={styles.horizontalDivider} />
    //           <View style={styles.contactContainer}>
    //             <TouchableOpacity style={styles.contactButton}>
    //               <SvgXml xml={svgXml.icon.phone} width={24} height={24} />
    //               <Text style={styles.contactButtonText}>전화</Text>
    //             </TouchableOpacity>
    //             <View style={styles.verticalDivider} />
    //             <TouchableOpacity style={styles.contactButton} onPress={handleHeartPress}>
    //               <SvgXml xml={isHearted ? svgXml.icon.heartGrey : svgXml.icon.emptyHeartGrey} width={24} height={24} />
    //               <Text style={styles.contactButtonText}>{heartCount}</Text>
    //             </TouchableOpacity>
    //             <View style={styles.verticalDivider} />
    //             <TouchableOpacity style={styles.contactButton}>
    //               <SvgXml xml={svgXml.icon.starGrey} width={24} height={24} />
    //               <Text style={styles.contactButtonText}>{restaurant.ratingAvg}</Text>
    //             </TouchableOpacity>
    //             <View style={styles.verticalDivider} />
    //             <AnimatedButton style={styles.contactButton}
    //           onPress={() => {
    //             navigation.navigate('ReviewWrite', {data: restaurant});
    //           }}>
    //             <SvgXml xml={svgXml.icon.pen} width={24} height={24} />
    //           <Text style={styles.contactButtonText}>리뷰</Text>
    //         </AnimatedButton>
    //           </View>
    //           <View style={styles.horizontalDivider} />
    //           <View style={{flexDirection: 'row', marginTop: 6}}>
    //             <SvgXml style={styles.contactButtonIcon} xml={svgXml.icon.location} width={24} height={24}/>
    //             <Text style={styles.storeAddress}>
    //               위치: {restaurant.detailInfo}
    //             </Text>
    //           </View>
    //           <View style={{flexDirection: 'row'}}>
    //             <SvgXml style={styles.contactButtonIcon} xml={svgXml.icon.clock} width={24} height={24}/>
    //             <Text style={styles.storeHours}>
    //               운영시간: {restaurant.operatingStartTime} ~ {restaurant.operatingEndTime}
    //             </Text>
    //           </View>
    //           <View style={{flexDirection: 'row'}}>
    //             <SvgXml style={styles.contactButtonIcon}  xml={svgXml.icon.phone} width={24} height={24}/>
    //             <Text style={styles.storePhoneNum}>
    //               전화번호: {restaurant.detailInfo}
    //             </Text>
    //           </View>
    //         </View>
    //         <View style={styles.menuSection}>
    //           <Text style={styles.sectionTitle}>메뉴</Text>
    //           <FlatList
    //             data={restaurant.detailInfo}
    //             renderItem={renderMenuItem}
    //             keyExtractor={(item) => item.name}
    //           />
    //         </View>
    //         <View style={styles.reviewSection}>
    //           <Text style={styles.sectionTitle}>리뷰</Text>
    //           <FlatList
    //             data={restaurant.reviews}
    //             renderItem={renderReviewItem}
    //             keyExtractor={(item) => item.id}
    //           />
    //         </View>
    //     </View>
    //   </>
    // );
    const ListHeader = () => (
      <>
        <View style={styles.entire}>
          <View style={styles.storeImageContainer}>
            <ImageModal
              swipeToDismiss={true}
              modalImageResizeMode="contain"
              imageBackgroundColor="transparent"
              overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
              resizeMode="cover"
              style={styles.storeImage}
              source={{ uri: restaurant.representativeImageUrl }}
            />
          </View>
          <View style={styles.storeInfo}>
            <View style={styles.storeHeader}>
              <Text style={styles.storeName}>{restaurant.name}</Text>
              <Text style={styles.storeCategory}>{restaurant.categories}</Text>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.contactContainer}>
              <TouchableOpacity style={styles.contactButton}>
                <SvgXml xml={svgXml.icon.phone} width={24} height={24} />
                <Text style={styles.contactButtonText}>전화</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.contactButton} onPress={handleHeartPress}>
                <SvgXml xml={isHearted ? svgXml.icon.heartGrey : svgXml.icon.emptyHeartGrey} width={24} height={24} />
                <Text style={styles.contactButtonText}>{heartCount}</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.contactButton}>
                <SvgXml xml={svgXml.icon.starGrey} width={24} height={24} />
                <Text style={styles.contactButtonText}>{restaurant.ratingAvg}</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <AnimatedButton
                style={styles.contactButton}
                onPress={() => {
                  navigation.navigate('ReviewWrite', { data: restaurant });
                }}>
                <SvgXml xml={svgXml.icon.pen} width={24} height={24} />
                <Text style={styles.contactButtonText}>리뷰</Text>
              </AnimatedButton>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={{ flexDirection: 'row', marginTop: 6 }}>
              <SvgXml style={styles.contactButtonIcon} xml={svgXml.icon.location} width={24} height={24} />
              <Text style={styles.storeAddress}>
                위치: {restaurant.detailInfo}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <SvgXml style={styles.contactButtonIcon} xml={svgXml.icon.clock} width={24} height={24} />
              <Text style={styles.storeHours}>
                운영시간: {restaurant.operatingStartTime} ~ {restaurant.operatingEndTime}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <SvgXml style={styles.contactButtonIcon} xml={svgXml.icon.phone} width={24} height={24} />
              <Text style={styles.storePhoneNum}>
                전화번호: {restaurant.detailInfo}
              </Text>
            </View>
          </View>
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>메뉴</Text>
          </View>
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>리뷰</Text>
          </View>
        </View>
      </>
    );
  
    return (
      <>
        <Header title={'가게 상세 페이지'} isBackButton={true} />
        <FlatList
          ListHeaderComponent={ListHeader}
          data={restaurant}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.entire}
        />
      </>
    );
  }
  
  const styles = StyleSheet.create({
    entire: {
      backgroundColor: COLOR_BACKGROUND,
      alignItems: 'center',
    },
    storeImageContainer: {
      width: '100%',
      height: 240,
    },
    storeImage: {
      width: '100%',
      height: '100%',
    },
    storeInfo: {
      width: '100%',
      padding: 16,
      backgroundColor: COLOR_WHITE,
      elevation: 3,
    },
    storeHeader: {
      alignItems: 'right',
    },
    storeName: {
      fontSize: 24,
      color: COLOR_TEXT_BLACK,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    storeCategory: {
      fontSize: 16,
      color: COLOR_TEXT70GRAY,
      marginBottom: 16,
    },
    contactContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginVertical: 8,
      paddingHorizontal: 16,
    },
    contactButton: {
      alignItems: 'center',
    },
    contactButtonIcon: {
      marginVertical: 6,
      marginHorizontal: 2,
    },
    contactButtonText: {
      fontSize: 14,
      marginTop: 4,
    },
    verticalDivider: {
      width: 1,
      height: '100%',
      backgroundColor: COLOR_LIGHTGRAY,
      marginHorizontal: 16,
    },
    horizontalDivider: {
      width: '100%',
      height: 1,
      backgroundColor: COLOR_LIGHTGRAY,
    },
    storeAddress: {
      fontSize: 14,
      color: COLOR_TEXT70GRAY,
      marginVertical: 8,
    },
    storeHours: {
      fontSize: 14,
      color: COLOR_TEXT70GRAY,
      marginVertical: 8,
    },
    storePhoneNum: {
      fontSize: 14,
      color: COLOR_TEXT70GRAY,
      marginVertical: 8,
    },
    menuSection: {
      width: '94%',
      marginVertical: 16,
      backgroundColor: COLOR_WHITE,
      borderRadius: 10,
      padding: 10,
      shadowColor: COLOR_TEXT_BLACK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLOR_TEXT70GRAY,
      marginBottom: 10,
      marginTop: 2,
    },
    menuItem: {
      flexDirection: 'row',
    },
    menuImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    menuTextContainer: {
      marginLeft: 8,
      justifyContent: 'center',
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    menuDescription: {
      fontSize: 14,
      color: COLOR_TEXT70GRAY,
    },
    menuPrice: {
      fontSize: 14,
      color: COLOR_PRIMARY,
    },
    reviewSection: {
      width: '94%',
      backgroundColor: COLOR_WHITE,
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
      shadowColor: COLOR_TEXT_BLACK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    reviewItem: {
      
    },
    reviewAuthor: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    reviewDate: {
      fontSize: 12,
      color: COLOR_TEXT70GRAY,
      marginVertical: 4,
    },
    reviewText: {
      fontSize: 14,
    },
  });
