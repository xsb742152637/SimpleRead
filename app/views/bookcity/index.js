/*
 * 书城
 * @Author: xie
 * @Date: 2021-05-02
 */
import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  PanResponder,
  Text,
} from 'react-native';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏

import StyleConfig from '@/config/styleConfig';

export default class BookCity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          {
            width: width,
            height: height,
            justifyContent: 'center',
            display: 'flex',
          },
        ]}>
        <Text style={{textAlign: 'center'}}>敬请期待</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
