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
  Alert,
  ToastAndroid,
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏
import StyleConfig from '@/config/styleConfig';
import MyIcon from '@/config/myIcon';
import {getId, textFormat, isNull, cloneObj} from '@/utils/function';

export default class Me extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // this._bookRead();
  }
  _goReadHistory() {
    this.props.navigation.navigate('ReadHistory');
  }
  _needHelp() {
    global.alert.info(null, '抱歉，暂时没有问题案例……');
  }

  _callMe() {
    global.alert.info(
      '联系我们',
      '\n感谢您对简阅小说长期以来的支持\n\nQQ：742152637\n\n微信号：XX201802011300',
    );
  }

  renderHeader() {
    return (
      <View style={global.appStyles.header}>
        <View>
          <Text
            style={[
              global.appStyles.headerText,
              {fontSize: StyleConfig.fontSize.base},
            ]}>
            欢 迎 使 用 简 阅 小 说
          </Text>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={global.appStyles.content}>
        {this.renderHeader()}
        <View style={global.appStyles.padding}>
          <View style={[global.appStyles.card, {flexDirection: 'column'}]}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.myButton}
                onPress={() => this._goReadHistory()}>
                <MyIcon name={'yuedujilu'} size={StyleConfig.fontSize.icon} />
                <Text style={styles.myButtonText}>浏览历史</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.myButton}
                onPress={() => this._needHelp()}>
                <MyIcon name={'xiangqing'} size={StyleConfig.fontSize.icon} />
                <Text style={styles.myButtonText}>常见问题</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.myButton}
                onPress={() => this._callMe()}>
                <MyIcon name={'fasong'} size={StyleConfig.fontSize.icon} />
                <Text style={styles.myButtonText}>联系我们</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  myButton: {
    flex: 1,
    height: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  myButtonText: {
    marginTop: StyleConfig.padding.paddingTop,
  },
});
