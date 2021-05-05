/*
 * 书城
 * @Author: xie
 * @Date: 2021-05-02
 */
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';

export default class BookCity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={global.appStyles.content}>
        <Text>书城</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
