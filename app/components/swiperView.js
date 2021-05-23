/*
 * 左右滑动
 * @Author: xie
 * @Date: 2021-05-17
 */
import React from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
const {width} = Dimensions.get('window');

export default class SwiperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sports: 0, // 设置初始值
      limit: 0.1, // 滑动到屏幕的比例
      duration: 150, // 滑动动画持续时间
      maxPage: this.props.children.length, // 最大页数
      clickTurnPage: this.props.clickTurnPage || false, // 是否点击翻页
    };
    this.startTimestamp = 0; // 拖拽开始时间戳（用于计算滑动速度）
    this.endTimestamp = 0; // 拖拽结束时间戳用于计算滑动速度）
    this.page = 0; // 首次展示第一条数据（page 最小值为0，即从0开始，1为第二个条目）
  }
  UNSAFE_componentWillMount() {
    this.panResponder();
  }
  panResponder() {
    let that = this;
    that._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // 滑动开始，记录时间戳
        that.startTimestamp = evt.nativeEvent.timestamp;
      },
      onPanResponderMove: (evt, gestureState) => {
        // 滑动横向距离
        let x = gestureState.dx;
        // 实时改变滑动位置
        // if (x > 0) {
        //   that.setState({
        //     sports: new Animated.Value(-that.page * width + x),
        //   });
        // } else {
        //   that.setState({
        //     sports: new Animated.Value(x - that.page * width),
        //   });
        // }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // 滑动结束时间戳
        that.endTimestamp = evt.nativeEvent.timestamp;
        // 滑动距离，根据滑动距离与时间戳计算是否切换到下一个条目
        let x = gestureState.dx;
        // console.log(that.page, x);
        console.log('不知道', evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        if (that.state.clickTurnPage) {
          if (evt.nativeEvent.pageX <= width * 0.3) {
            x = 100;
            console.log('点击翻到上一页');
          } else if (evt.nativeEvent.pageX >= width * 0.6) {
            x = -100;
            console.log('点击翻到下一页');
          } else {
            console.log('不知道', evt.nativeEvent.pageX, width);
          }
        }
        return;
        // 上一页
        if (x > 0) {
          // 滑动距离大于屏幕1半，开启动画，滑动到下一个界面，或者滑动速度很快，并且滑动距离大于20，也滑动到下一个条目
          if (
            x > width * that.state.limit ||
            (that.endTimestamp - that.startTimestamp < 300 && x > 20)
          ) {
            console.log(-that.page * width);
            that.page -= 1;
            Animated.timing(that.state.sports, {
              toValue: -that.page * width,
              duration: that.state.duration,
              useNativeDriver: false,
            }).start(state => {
              // 动画完成，判断是否需要重置位置
              if (state.finished) {
                // 从第一页滑动到最后一页
                if (that.page <= 0) {
                  that.page = that.state.maxPage - 1;
                  that.setState({
                    sports: new Animated.Value(-that.page * width),
                  });
                }
              }
            });
          }
        } else if (x < 0) {
          // 下一页
          x = Math.abs(x);
          // 滑动距离大于屏幕1半，开启动画，滑动到下一个界面，或者滑动速度很快，并且滑动距离大于20，也滑动到下一个条目
          if (
            x > width * that.state.limit ||
            that.endTimestamp - that.startTimestamp < 300
          ) {
            that.page += 1;
            Animated.timing(that.state.sports, {
              toValue: -that.page * width,
              duration: that.state.duration,
              useNativeDriver: false,
            }).start(state => {
              // 动画完成，判断是否需要重置位置
              if (state.finished) {
                // 从最后一页滑动到第一页
                if (that.page >= that.state.maxPage) {
                  that.page = 0;
                  that.setState({
                    sports: new Animated.Value(0),
                  });
                }
              }
            });
          }
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return false;
      },
    });
  }
  render() {
    return (
      <Animated.View
        style={{...this.props.style, left: this.state.sports}}
        {...this._panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    );
  }
}
