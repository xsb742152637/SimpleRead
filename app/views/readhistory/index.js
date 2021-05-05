/*
 * 搜索
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
import Back from '@/components/back';
import StyleConfig from '@/config/styleConfig';

export default class ReadHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={global.appStyles.content}>
        <View style={global.appStyles.header}>
          <Back navigation={this.props.navigation} />
        </View>
        <Text>阅读历史</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
