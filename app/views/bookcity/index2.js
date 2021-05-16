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
  Image,
} from 'react-native';
const {width} = Dimensions.get('window');

import StyleConfig from '@/config/styleConfig';

export default class SwiperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sports: 0, // 设置初始值
      limit: 0.2, // 滑动到屏幕的比例
      maxPage: this.props.children.length, // 最大页数
    };
    this.startTimestamp = 0; // 拖拽开始时间戳（用于计算滑动速度）
    this.endTimestamp = 0; // 拖拽结束时间戳用于计算滑动速度）
    this.page = 0; // 首次展示第一条数据（page 最小值为0，即从0开始，1为第二个条目）
  }
  UNSAFE_componentWillMount() {
    this.panResponder();
  }
  panResponder() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // 滑动开始，记录时间戳
        this.startTimestamp = evt.nativeEvent.timestamp;
      },
      onPanResponderMove: (evt, gestureState) => {
        // 滑动横向距离
        let x = gestureState.dx;
        // 实时改变滑动位置
        if (x > 0) {
          this.setState({
            sports: new Animated.Value(-this.page * width + x),
          });
        } else {
          this.setState({
            sports: new Animated.Value(x - this.page * width),
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // 滑动结束时间戳
        this.endTimestamp = evt.nativeEvent.timestamp;
        // 滑动距离，根据滑动距离与时间戳计算是否切换到下一个条目
        let x = gestureState.dx;
        // 上一页
        if (x > 0) {
          // 滑动距离大于屏幕1半，开启动画，滑动到下一个界面，或者滑动速度很快，并且滑动距离大于20，也滑动到下一个条目
          if (
            x > width * this.state.limit ||
            (this.endTimestamp - this.startTimestamp < 300 && x > 20)
          ) {
            this.page -= 1;
          }
          Animated.timing(this.state.sports, {
            toValue: -this.page * width,
            duration: 200,
            useNativeDriver: false,
          }).start(state => {
            // 动画完成，判断是否需要重置位置
            if (state.finished) {
              console.log('页数  ', this.page);
              if (this.page <= 0) {
                console.log('重置位置');
                this.page = 3;
                this.setState({
                  sports: new Animated.Value(-3 * width),
                });
              }
            }
          });
        } else {
          // 下一页
          x = Math.abs(x);
          // 滑动距离大于屏幕1半，开启动画，滑动到下一个界面，或者滑动速度很快，并且滑动距离大于20，也滑动到下一个条目
          if (
            x > width * this.state.limit ||
            this.endTimestamp - this.startTimestamp < 300
          ) {
            this.page += 1;
          }
          Animated.timing(this.state.sports, {
            toValue: -this.page * width,
            duration: 200,
            useNativeDriver: false,
          }).start(state => {
            // 动画完成，判断是否需要重置位置
            if (state.finished) {
              console.log('页数  ', this.page);
              if (this.page >= this.state.maxPage) {
                this.page = 0;
                this.setState({
                  sports: 0,
                });
              }
            }
          });
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return false;
      },
    });
  }
  render() {
    // console.log('位置:', this.state.sports);
    return (
      <Animated.View
        style={{...this.props.style, left: this.state.sports}}
        {...this._panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    );
  }
}
