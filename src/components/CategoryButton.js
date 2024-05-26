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
} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_BACKGROUND,
  COLOR_GRAY,
  COLOR_PRIMARY,
  COLOR_TEXT_BLACK,
  COLOR_TEXT70GRAY,
  COLOR_TEXT60GRAY,
} from '../assets/color';
import AnimatedButton from './AnimationButton';

export default function CategoryButton(props) {
  const {name, onPress, selected} = props;

  return (
    <AnimatedButton
      style={
        selected === name
          ? styles.categoryModalButtonSelected
          : styles.categoryModalButton
      }
      onPress={() => {
        if (name == '') return;
        onPress(name);
      }}>
      <Text
        style={
          selected === name
            ? styles.categoryModalButtonTextSelected
            : styles.categoryModalButtonText
        }>
        {name}
      </Text>
    </AnimatedButton>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  dart: {
    padding: 3,
    alignItems: 'center',
    backgroundColor: COLOR_WHITE,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },
  dartText: {
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
  },
  textInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 12,
    color: '#888888',
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 4,
  },
  filterButtonSelected: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 7,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    elevation: 4,
  },
  filterText: {
    marginLeft: 1,
    fontSize: 12,
    color: COLOR_TEXT_BLACK,
    fontWeight: 'bold',
  },
  filterTextActive: {
    marginLeft: 1,
    fontSize: 12,
    color: '#A4D65E',
    fontWeight: 'bold',
  },
  filterTextFade: {
    marginLeft: 1,
    fontSize: 12,
    color: COLOR_GRAY,
    fontWeight: 'bold',
  },
  cornerButton: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'white',
    borderRadius: 15,
    height: 30,
    width: 30,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalTitle: {
    fontSize: 20,
    color: COLOR_TEXT70GRAY,
    fontWeight: '700',
  },
  categoryModalButton: {
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  categoryModalButtonSelected: {
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  categoryModalButtonText: {
    fontSize: 16,
    color: COLOR_TEXT60GRAY,
  },
  categoryModalButtonTextSelected: {
    fontSize: 16,
    color: COLOR_TEXT70GRAY,
    fontWeight: 'bold',
  },
  categoryLine: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
