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
const {width} = Dimensions.get('window');

import StyleConfig from '@/config/styleConfig';
import SwiperView from '@/components/swiperView';

export default class BookCity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[{width: width, height: '100%'}]}>
        <SwiperView
          style={{width: width * 5, height: '100%', flexDirection: 'row'}}>
          <View style={[{width, height: '100%', backgroundColor: '#ff0000'}]}>
            <Text>11111aaa</Text>
          </View>
          <View style={[{width, height: '100%', backgroundColor: '#ff6f00'}]}>
            <Text>222222bbb</Text>
          </View>
          <View style={[{width, height: '100%', backgroundColor: '#f7ff00'}]}>
            <Text>333333ccc</Text>
          </View>
          <View style={[{width, height: '100%', backgroundColor: '#44ff00'}]}>
            <Text>44444ddd</Text>
          </View>
          <View style={[{width, height: '100%', backgroundColor: '#0037ff'}]}>
            <Text>55555eee</Text>
          </View>
        </SwiperView>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
