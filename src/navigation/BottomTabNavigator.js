// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react/no-unstable-nested-components */
// import React from 'react';
// import {
//   CardStyleInterpolators,
//   createStackNavigator,
// } from '@react-navigation/stack';
// import {SvgXml} from 'react-native-svg';
// import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
// import {
//   Easing,
//   Linking,
//   Platform,
//   SafeAreaView,
//   StatusBar,
//   View,
// } from 'react-native';
// import {
//   COLOR_WHITE,
//   COLOR_BACKGROUND,
//   COLOR_GRAY,
//   COLOR_PRIMARY,
// } from '../assets/color';
// import SignupScreen from '../screens/SignupScreen';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// const BottomTab = createBottomTabNavigator();

// const customCardStyleInterpolator = ({current, next, layouts}) => {
//   return {
//     cardStyle: {
//       transform: [
//         {
//           translateX: current.progress.interpolate({
//             inputRange: [0, 1],
//             outputRange: [layouts.screen.width, 0], // transition from right to left
//           }),
//         },
//         {
//           scale: next
//             ? next.progress.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [1, 0.9],
//               })
//             : 1,
//         },
//       ],
//     },
//     overlayStyle: {
//       opacity: current.progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.5],
//       }),
//     },
//   };
// };

// export default function BottomTabNavigator() {
//   return (
//     <BottomTab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           height: 56,
//           backgroundColor: COLOR_BACKGROUND,
//           // backgroundColor: 'red',
//         },
//         tabBarShowLabel: false,
//         tabBarLabelStyle: {
//           fontFamily: 'NotoSansKR-Regular',
//         },
//         tabBarActiveTintColor: COLOR_PRIMARY,
//       }}>
//       <BottomTab.Screen
//         name="home"
//         component={Home}
//         options={{
//           tabBarShowLabel: false,
//           tabBarLabel: '홈',
//           tabBarIcon: props => (
//             <SvgXml
//               // fill={props.focused ? '#A55FFF' : '#888888'}
//               width={28}
//               height={28}
//               xml={
//                 props.focused
//                   ? svgXml.bottomTab.feedColor
//                   : svgXml.bottomTab.feed
//               }
//             />
//           ),
//         }}
//       />
//       <BottomTab.Screen
//         name="search"
//         component={Search}
//         options={{
//           tabBarLabel: '둘러보기',
//           tabBarIcon: ({color, size, focused}) =>
//             focused ? (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 14,
//                   // backgroundColor: backgroundColor,
//                   // margin: 0,
//                 }}>
//                 <SearchFavorite1Filled
//                   fill={color}
//                   width={size}
//                   height={size}
//                 />
//               </View>
//             ) : (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 14,
//                   // backgroundColor: backgroundColor,
//                   // margin: 0,
//                 }}>
//                 <SearchFavorite1
//                   stroke={color}
//                   width={size}
//                   height={size}
//                   scale={0.85}
//                   strokeWidth={2}
//                 />
//               </View>
//             ),
//         }}
//       />
//       <BottomTab.Screen
//         name="friendsManagement"
//         // component={FriendsManagementScreen}
//         component={FriendsManagement}
//         options={{
//           tabBarShowLabel: false,
//           tabBarLabel: '친구 관리',
//           tabBarIcon: ({color, size, focused}) =>
//             focused ? (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 14,
//                   // backgroundColor: backgroundColor,
//                   // margin: 0,
//                 }}>
//                 <Profile2UserFilled fill={color} width={size} height={size} />
//               </View>
//             ) : (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 14,
//                   // backgroundColor: backgroundColor,
//                   // margin: 0,
//                 }}>
//                 <Profile2User
//                   stroke={color}
//                   width={size}
//                   height={size}
//                   scale={0.85}
//                   strokeWidth={2}
//                 />
//               </View>
//             ),
//         }}
//       />
//       <BottomTab.Screen
//         name="profile"
//         component={MyPageNavigator}
//         options={{
//           tabBarShowLabel: false,
//           tabBarLabel: '프로필',
//           tabBarIcon: ({color, size, focused}) =>
//             focused ? (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 14,
//                   // backgroundColor: backgroundColor,
//                   // margin: 0,
//                 }}>
//                 <ProfileFilled fill={color} width={size} height={size} />
//               </View>
//             ) : (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 14,
//                   // backgroundColor: backgroundColor,
//                   // margin: 0,
//                 }}>
//                 <Profile
//                   stroke={color}
//                   width={size}
//                   height={size}
//                   strokeWidth={2}
//                 />
//               </View>
//             ),
//         }}
//       />
//     </BottomTab.Navigator>
//   );
// }
