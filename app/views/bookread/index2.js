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
  getByteLength,
} from '@/utils/function';
const {width} = Dimensions.get('window');
import SwiperView from '@/components/swiperView';

export default class BookRead2 extends React.Component {
  constructor(props) {
    super(props);

    let chapterId = 'A4A57781-B5D6-40FD-9DB7-140FAF554470';
    let detail = global.realm.findDetail(chapterId);
    let font_size = 15;
    let line_height = font_size + 15;
    let pages = contentFormat(detail.content, font_size, line_height);
    // console.log('页数：', pages.length);
    // console.log('第一页行数：', pages[0]);
    // console.log('第二行内容：', pages[0][0]);

    this.state = {
      title: detail.title,
      pages: pages,
      font_size: font_size,
      line_height: line_height,
    };
  }
  componentDidMount() {}

  _content() {
    return (
      <View
        style={[
          {
            width: width,
            height: '100%',
            backgroundColor: StyleConfig.color.baseBackground,
          },
        ]}>
        <SwiperView
          style={{
            width: width * this.state.pages.length,
            height: '100%',
            flexDirection: 'row',
          }}>
          {this.state.pages &&
            this.state.pages.map((rows, page) => (
              <View
                key={page}
                style={[
                  {
                    width: width,
                    height: '100%',
                    backgroundColor: StyleConfig.color.baseBackground,
                  },
                ]}>
                <Text>{'第' + page + '页'}</Text>
                {rows &&
                  rows.map((info, index) => (
                    <Text
                      key={index}
                      style={{
                        // width: width,
                        borderRightWidth: 1,
                        borderColor: 'red',
                        borderStyle: 'solid',
                        fontSize: this.state.font_size,
                        lineHeight: this.state.line_height,
                      }}>
                      {info}
                    </Text>
                  ))}
              </View>
            ))}
        </SwiperView>
      </View>
    );
  }
  render() {
    // let aa = '              槐诗愣了一下，嗅了嗅那一根手工卷';
    // console.log('空格：', this.state.font_size, getByteLength(aa));
    // console.log(this.state.pages[0]);
    return this._content();
    // return (
    //   <View style={global.appStyles.content}>
    //     <ScrollView style={styles.myScrollView}>
    //       {/*<Text>{this.state.title}</Text>*/}
    //       {this.state.pages[0] &&
    //         this.state.pages[0].map((info, index) => (
    //           <Text
    //             key={index}
    //             style={{
    //               fontSize: this.state.font_size,
    //               lineHeight: this.state.line_height,
    //             }}>
    //             {info}
    //           </Text>
    //         ))}
    //     </ScrollView>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  myScrollView: {},
});
