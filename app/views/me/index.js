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

export default class Me extends React.Component {
  constructor(props) {
    super(props);
  }

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
      <View>
        <Text>11</Text>
        <Text>22</Text>
        <TouchableOpacity onPress={() => this._back()}>
          <Text>看书</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
