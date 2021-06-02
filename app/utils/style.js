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
import StyleConfig from '@/config/styleConfig';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏

module.exports = StyleSheet.create({
  content: {
    width: width,
    // height: height,
    height: '100%',
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
    backgroundColor: StyleConfig.color.headerBackground,
    height: StyleConfig.headerHeight,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    borderBottomWidth: 1,
    borderBottomColor: StyleConfig.color.border,
    borderStyle: 'solid',
    color: StyleConfig.color.headerText,
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
  },
  headerText: {
    color: StyleConfig.color.headerText,
  },
  headerIcon: {
    color: StyleConfig.color.headerIcon,
  },
  padding: {
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    paddingTop: StyleConfig.padding.baseTop,
    paddingBottom: StyleConfig.padding.baseTop,
  },
  border: {
    borderWidth: 1,
    borderColor: StyleConfig.color.border,
    borderStyle: 'solid',
  },

  card: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: StyleConfig.padding.baseTop,
    paddingTop: StyleConfig.padding.baseTop,
    paddingBottom: StyleConfig.padding.baseTop,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    backgroundColor:
      'rgba(255,255,255,' + StyleConfig.opacity.cardBackground + ')',
    borderRadius: StyleConfig.radius.base,
  },
});
