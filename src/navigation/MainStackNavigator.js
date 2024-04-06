import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Easing, Linking, Platform, SafeAreaView, StatusBar} from 'react-native';
import {COLOR_WHITE} from '../assets/color';
import SignupScreen from '../screens/SignupScreen';

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
    // <SignupScreen></SignupScreen>
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      <MainStack.Navigator
        initialRouteName="signup"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <MainStack.Screen name="signup" component={SignupScreen} />
        {/* <MainStack.Screen
          name="main"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardOverlayEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        /> */}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
