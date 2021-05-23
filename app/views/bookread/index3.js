/*
 * @Author: zhangyu
 * @Date: 2021-01-05 20:43:07
 * @LastEditTime: 2021-01-09 23:22:31
 */
import React from 'react';
import {Text, StyleSheet, Dimensions, View, ScrollView} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import {
  getId,
  textFormat,
  isNull,
  mergeSpace,
  contentFormat,
} from '@/utils/function';
import {setSpText, scaleSize} from '@/utils/screenUtil';

const {width, height} = Dimensions.get('window'); // 可用显示屏幕的宽高，不包括顶部的状态信息栏
const {width2, height2} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏

export default class BookRead3 extends React.Component {
  constructor(props) {
    super(props);

    let chapterId = 'A4A57781-B5D6-40FD-9DB7-140FAF554470';
    let detail = global.realm.findDetail(chapterId);

    this.state = {
      title: detail.title,
      content: contentFormat(detail.content),
    };
  }
  componentDidMount() {}
  getLength(str) {
    //将非ascii码转换为2个ascii码
    str = str.replace(/[^\x00-\xff]/g, '**');
    return str.length;
  }
  render() {
    let fontSize = 39.27;
    let aa = '中';
    let bb = 'ab';
    // eslint-disable-next-line no-undef
    console.log(
      this.getLength('中'),
      this.getLength('a'),
      this.getLength('？'),
      this.getLength('?'),
      this.getLength('.'),
      this.getLength('》'),
      this.getLength('。'),
    );
    // console.log(
    //   '屏幕宽度：',
    //   width,
    //   Dimensions.get('screen').width,
    //   ', 字体大小：',
    //   fontSize,
    // );
    // console.log('高度宽度：', height, Dimensions.get('screen').height);
    return (
      <View style={global.appStyles.content}>
        <ScrollView
          style={styles.myScrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // horizontal ={true}
          pagingEnabled={true}
          alwaysBounceVertical={true}>
          <Text style={{fontSize: fontSize}}>{'不同于罗马军方的地方'}</Text>
          <Text style={{fontSize: fontSize}}>{'abcdefghija'}</Text>
          <Text style={{fontSize: fontSize}}>{'ABCDEFGHIJa'}</Text>
          <Text style={{fontSize: fontSize}}>{'，，，，，，，，，，a'}</Text>
          <Text style={{fontSize: fontSize}}>{'""""""""""a'}</Text>
          <Text style={{fontSize: fontSize}}>{'“”“”“”“”“”a'}</Text>
          <Text style={{fontSize: fontSize}}>{'<<<<<<<<<<a'}</Text>
          <Text style={{fontSize: fontSize}}>{'>>>>>>>>>>a'}</Text>
          <Text style={{fontSize: fontSize}}>{'《《《《《《《《《《a'}</Text>
          <Text style={{fontSize: fontSize}}>{'》》》》》》》》》》a'}</Text>
          {/*<Text>{this.state.content}</Text>*/}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  myScrollView: {},
});
