import {useState} from 'react';
import {Animated} from 'react-native';

export const usePressAnimation = (initialValue = 1, toValue = 0.97) => {
  const [scaleValue] = useState(new Animated.Value(initialValue));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: initialValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return {
    scaleValue,
    handlePressIn,
    handlePressOut,
  };
};
