import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Alert,
  BackHandler,
  StatusBar,
} from 'react-native';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏
import {getId, textFormat, isNull, cloneObj} from '@/utils/function';

var _this = null;
class MyAlert extends Component {
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      //取消文字
      cancelText: '关闭',
      //确定文字
      confirmText: '确定',
      //标题
      title: '消息',
    };
    this.confirmOption = {
      title: '注意',
      confirmText: '确定',
      cancelText: '关闭',
    }
  }
  componentDidMount() {
    _this = this;
  }
  static info = (title, message, callback) => {
    if (isNull(title)) {
      title = '消息';
    }
    Alert.alert(
      //标题
      title,
      message,
      [
        {
          text: '关闭',
          style: 'cancel',
          onPress: () => {
            if (!isNull(callback) && typeof callback == 'function') {
              callback();
            }
          },
        },
      ],
      //阻止点击提醒框外,取消提醒框
      {
        cancelable: true,
        onDismiss: () => {
          if (!isNull(callback) && typeof callback === 'function') {
            callback();
          }
        },
      },
    );
  };

  static confirm = (option, callback, callbackClose) => {
    let title = option.title || '提示';
    let okText = option.okText || '确定';
    let cancelText = option.cancelText || '关闭';
    Alert.alert(
      //标题
      title,
      option.message,
      //按钮,最多有三个,不写默认为确认按钮
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => {
            if (!isNull(callbackClose) && typeof callbackClose === 'function') {
              callbackClose();
            }
          },
        },
        {
          text: okText,
          onPress: () => {
            if (!isNull(callback) && typeof callback === 'function') {
              callback();
            }
          },
        },
      ],
      //阻止点击提醒框外,取消提醒框
      {
        cancelable: true,
        onDismiss: () => {
          if (!isNull(callbackClose) && typeof callbackClose === 'function') {
            callbackClose();
          }
        },
      },
    );
  };
}
export default MyAlert;
