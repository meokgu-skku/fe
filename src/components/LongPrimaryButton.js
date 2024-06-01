import React, {useState, useCallback, useEffect} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {COLOR_WHITE, COLOR_PRIMARY, COLOR_DISABLE_GRAY} from '../assets/color';
import AnimatedButton from './AnimationButton';

export default function LongPrimaryButton(props) {
  const {text, action, disable} = props;

  return (
    <AnimatedButton
      onPress={() => {
        if (disable) return;
        action();
      }}
      style={[
        styles.buttonTest,
        disable
          ? {backgroundColor: COLOR_PRIMARY}
          : {backgroundColor: COLOR_PRIMARY},
      ]}
      // disabled={disable}
    >
      <Text style={[styles.buttonText, disable && styles.textDisabled]}>
        {text}
      </Text>
    </AnimatedButton>
  );
}

const styles = StyleSheet.create({
  buttonTest: {
    // backgroundColor: COLOR_PRIMARY,
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    fontSize: 14,
    color: COLOR_WHITE,
    // fontWeight: 'normal',
    alignSelf: 'center',
    fontFamily: 'NanumSquareRoundEB',
  },
  textDisabled: {
    color: COLOR_WHITE,
  },
});
