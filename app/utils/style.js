/**
 * 全局样式变量
 */
'use strict';

import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import StyleConfig from '@config/styleConfig';

module.exports = StyleSheet.create({
  content: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: StyleConfig.color.baseBackground,
  },
  main: {
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    paddingBottom: StyleConfig.padding.baseTop,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: StyleConfig.color.header,
    height: StyleConfig.headerHeight,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    borderBottomWidth: 1,
    borderBottomColor: StyleConfig.color.border,
    borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
  },
  padding: {
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    paddingTop: StyleConfig.padding.baseTop,
    paddingBottom: StyleConfig.padding.baseTop,
  },
});
