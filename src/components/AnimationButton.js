import React from 'react';
import {TouchableOpacity, Animated, StyleSheet} from 'react-native';
import {usePressAnimation} from '../assets/UsePressAnimation';
import {COLOR_GRAY, COLOR_DISABLE_GRAY} from '../assets/color';

const AnimatedButton = ({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
}) => {
  const {scaleValue, handlePressIn, handlePressOut} = usePressAnimation();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={[
        // {transform: [{scale: scaleValue}]},
        style,
        disabled ? styles.disabledButton : {},
      ]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: COLOR_DISABLE_GRAY,
  },
});

export default AnimatedButton;
