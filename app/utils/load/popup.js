import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  BackHandler,
  StatusBar,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import {NavigationContainer} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
var pageHeight = height + StatusBar.currentHeight + 20;
var _this = null;
class Popup extends Component {
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      //显示、隐藏
      show: false,
      //弹窗高度
      popupHeight: 150,
      //动画值
      animatedValue: new Animated.Value(0),
      //取消文字
      cancelText: '取消',
      //确定文字
      confirmText: '确定',
      //标题
      title: '',
      //是否显示头部栏
      isHeader: true,
    };
    this.showAnimated = Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    });
    this.hideAnimated = Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    });
  }
  componentDidMount() {
    _this = this;
  }
  static show = (options, callback, closeCallback) => {
    let cancelText = options.cancelText || '取消';
    let confirmText = options.confirmText || '确定';
    let title = options.title || '';
    let isHeader = options.isHeader === false ? false : true;
    let popupHeight = options.popupHeight || 150;
    let content = options.content || <Text>无内容</Text>;
    _this.setState({
      show: true,
      cancelText,
      confirmText,
      title,
      isHeader,
      popupHeight,
      content,
      callback,
      closeCallback,
    });
    //动画值初始化为0
    _this.state.animatedValue.setValue(0);
    //开始执行动画
    _this.showAnimated.start();
  };
  static hide = () => {
    _this.popupHide();
  };
  // eslint-disable-next-line no-dupe-class-members
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  //安卓返回键关闭APP
  onBackPress = () => {
    if (this.state.show) {
      this.popupHide();
      return true;
    } else {
      return false;
    }
  };
  popupHide = () => {
    //动画值初始化为0
    this.state.animatedValue.setValue(1);
    //开始执行动画
    this.hideAnimated.start(() => {
      this.setState({show: false});
    });
    this.state.closeCallback && this.state.closeCallback();
  };
  onConfirm() {
    this.state.callback && this.state.callback({confirm: true});
  }
  render() {
    if (this.state.show) {
      const translateY = this.state.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.state.isHeader
            ? this.state.popupHeight + 50
            : this.state.popupHeight,
          0,
        ],
      });
      return (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: pageHeight,
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <StatusBar
            backgroundColor={'transparent'}
            barStyle={'transparent'}
            hidden={false}
            animated={true}
            translucent={true}
            showHideTransition={'slide'}
          />
          <TouchableOpacity
            style={styles.PopupPage}
            activeOpacity={1}
            onPress={this.popupHide}>
            <View />
          </TouchableOpacity>
          <Animated.View
            style={{
              width: width * 0.7,
              minHeight: this.state.popupHeight + 50,
              backgroundColor: '#FFF',
              transform: [{translateY: translateY}],
              display: 'flex',
              flexDirection: 'column',
              borderRadius: StyleConfig.radius.base,
            }}>
            <View
              style={{
                flex: 1,
                padding: StyleConfig.padding.baseTop,
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {this.state.content}
            </View>
            {this.header()}
          </Animated.View>
        </View>
      );
    } else {
      return <View />;
    }
  }
  header = () => {
    if (this.state.isHeader) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderColor: StyleConfig.color.border,
            borderTopWidth: 1,
            height: 50,
          }}>
          <TouchableOpacity onPress={this.popupHide}>
            <Text
              style={{
                color: '#999',
                paddingLeft: 15,
                paddingRight: 15,
                height: 50,
                lineHeight: 50,
              }}>
              {this.state.cancelText}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: StyleConfig.color.titleText,
              fontSize: StyleConfig.fontSize.titleText,
            }}>
            {this.state.title}
          </Text>
          <TouchableOpacity onPress={this.onConfirm.bind(this)}>
            <Text
              style={{
                color: StyleConfig.color.iconActive,
                paddingLeft: 15,
                paddingRight: 15,
                height: 50,
                lineHeight: 50,
              }}>
              {this.state.confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
}
export default Popup;
const styles = StyleSheet.create({
  PopupPage: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: width,
    height: pageHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
