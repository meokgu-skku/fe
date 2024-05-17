import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Easing, Linking, Platform, SafeAreaView, StatusBar} from 'react-native';
import {COLOR_WHITE} from '../assets/color';
import SplashScreen from '../screens/signup/SplashScreen';
import LoginScreen from '../screens/signup/LoginScreen';
import FindPasswordScreen from '../screens/signup/FindPasswordScreen';
import SignupScreen from '../screens/signup/SignupScreen';
import StoreDetailScreen from '../screens/detail/StoreDetailScreen';
import ReviewWriteScreen from '../screens/detail/ReviewWriteScreen';
import CheckEmailScreen from '../screens/signup/CheckEmailScreen';
import ProfileSetScreen from '../screens/signup/ProfileSetScreen';

import BottomTabNavigator from './BottomTabNavigator';

const MainStack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLOR_WHITE,
  },
};

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function reset(routes) {
  navigationRef.current?.reset(routes);
}

export default function MainStackNavigator() {
  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      <MainStack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <MainStack.Screen name="Splash" component={SplashScreen} />
        <MainStack.Screen name="Login" component={LoginScreen} />
        <MainStack.Screen name="FindPassword" component={FindPasswordScreen} />
        <MainStack.Screen name="Signup" component={SignupScreen} />
        <MainStack.Screen name="CheckEmail" component={CheckEmailScreen} />
        <MainStack.Screen name="ProfileSet" component={ProfileSetScreen} />
        <MainStack.Screen
          name="BottomTab"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
            cardOverlayEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <MainStack.Screen name="StoreDetail" component={StoreDetailScreen} />
        <MainStack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
