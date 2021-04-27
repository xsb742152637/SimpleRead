/*
 * @Author: zhangyu
 * @Date: 2021-01-05 20:43:15
 * @LastEditTime: 2021-01-09 23:22:19
 */
import React from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.content}>
        <Text>首页</Text>
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
