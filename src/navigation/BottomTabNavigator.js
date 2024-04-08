/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../assets/svg';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {
  Easing,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
} from '../assets/color';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/home/HomeScreen';
import ListMainScreen from '../screens/list/ListMainScreen';
import ListDetailScreen from '../screens/list/ListDetailScreen';
import MapScreen from '../screens/map/MapScreen';
import MypageScreen from '../screens/mypage/MypageScreen';

const BottomTab = createBottomTabNavigator();

const customCardStyleInterpolator = ({current, next, layouts}) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0], // transition from right to left
          }),
        },
        {
          scale: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.9],
              })
            : 1,
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  };
};

const HomeStack = createStackNavigator();
function HomeNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // cardOverlayEnabled: true,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyleInterpolator: customCardStyleInterpolator,
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const MapStack = createStackNavigator();
function MapNavigator() {
  return (
    <MapStack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // cardOverlayEnabled: true,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyleInterpolator: customCardStyleInterpolator,
      }}>
      <MapStack.Screen name="Map" component={MapScreen} />
    </MapStack.Navigator>
  );
}

const ListStack = createStackNavigator();
function ListNavigator() {
  return (
    <ListStack.Navigator
      initialRouteName="ListMain"
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // cardOverlayEnabled: true,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyleInterpolator: customCardStyleInterpolator,
      }}>
      <ListStack.Screen name="ListMain" component={ListMainScreen} />
      <ListStack.Screen name="ListDetail" component={ListDetailScreen} />
    </ListStack.Navigator>
  );
}

const MypageStack = createStackNavigator();
function MypageNavigator() {
  return (
    <MypageStack.Navigator
      initialRouteName="Mypage"
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // cardOverlayEnabled: true,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyleInterpolator: customCardStyleInterpolator,
      }}>
      <MypageStack.Screen name="Mypage" component={MypageScreen} />
    </MypageStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="HomeNavigator"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 56,
          backgroundColor: COLOR_BACKGROUND,
          // backgroundColor: 'red',
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: 'NotoSansKR-Regular',
        },
        tabBarActiveTintColor: COLOR_PRIMARY,
      }}>
      <BottomTab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: '홈',
          tabBarIcon: props => (
            <SvgXml
              // fill={props.focused ? '#A55FFF' : '#888888'}
              width={28}
              height={28}
              xml={
                props.focused ? svgXml.baricon.homeColor : svgXml.baricon.home
              }
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="MapNavigator"
        component={MapNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: '지도',
          tabBarIcon: props => (
            <SvgXml
              // fill={props.focused ? '#A55FFF' : '#888888'}
              width={28}
              height={28}
              xml={props.focused ? svgXml.baricon.mapColor : svgXml.baricon.map}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="ListNavigator"
        component={ListNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: '리스트',
          tabBarIcon: props => (
            <SvgXml
              // fill={props.focused ? '#A55FFF' : '#888888'}
              width={28}
              height={28}
              xml={
                props.focused ? svgXml.baricon.listColor : svgXml.baricon.list
              }
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="MypageNavigator"
        component={MypageNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: '프로필',
          tabBarIcon: props => (
            <SvgXml
              // fill={props.focused ? '#A55FFF' : '#888888'}
              width={28}
              height={28}
              xml={
                props.focused
                  ? svgXml.baricon.prifileColor
                  : svgXml.baricon.prifile
              }
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
