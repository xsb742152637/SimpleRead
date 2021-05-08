/*
 * @Author: zhangyu
 * @Date: 2021-01-05 20:43:07
 * @LastEditTime: 2021-01-09 23:22:31
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

export default class Me extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  _back() {
    // alert('You tapped the next button2');
    this.props.navigation.navigate('BookRead');
    //返回
    // this.props.navigation.goBack()
    // 返回到第一层
    // this.props.navigation.popToTop()
  }

  render() {
    return (
      <View style={global.appStyles.content}>
        <Text>11</Text>
        <Text>22</Text>
        <TouchableOpacity onPress={() => this._back()}>
          <Text>看书</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
