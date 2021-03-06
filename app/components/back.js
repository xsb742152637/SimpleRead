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
} from 'react-native';
import {goBack} from '@/utils/function';
import MyIcon from '@/config/myIcon';
import AppStyles from '@/utils/style';
import StyleConfig from '@/config/styleConfig';

export default class Back extends React.Component {
  constructor(props) {
    super(props);
  }
  _goBack() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this._goBack()}>
          <MyIcon
            name={'fanhuishangyizhang'}
            style={global.appStyles.headerIcon}
            size={StyleConfig.fontSize.icon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
