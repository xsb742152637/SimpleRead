/*
 * @Author: zhangyu
 * @Date: 2021-01-05 20:43:07
 * @LastEditTime: 2021-01-09 23:22:31
 */
import React from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import {
  getId,
  textFormat,
  isNull,
  mergeSpace,
  contentFormat,
  getByteLength,
} from '@/utils/function';
const {width, height} = Dimensions.get('window');
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

  _handleScroll() {
    console.log('_handleScroll');
  }
  _onScrollEndDrag() {
    console.log('_onScrollEndDrag');
  }
  _showControlStation_LR() {
    console.log('_showControlStation_LR');
  }

  //每页
  renderRow(rowData) {
    return (
      <View>
        <TouchableOpacity style={{flex: 1, width: width}} activeOpacity={1}>
          {this.renderContent(rowData.item)}
        </TouchableOpacity>
      </View>
    );
  }

  //当前页正文
  renderContent(rowData) {
    // console.log(rowData);
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          width: width,
          height: height,
          borderWidth: 0.1,
        }}
        onStartShouldSetResponder={() => true}
        onResponderRelease={evt => {
          this._showControlStation_LR(evt);
        }}>
        <Text
          style={{
            fontSize: this.state.font_size,
            marginLeft: 10,
            marginBottom: 5,
          }}>
          {this.state.title}
        </Text>
        <View style={{alignSelf: 'center', flex: 1}}>
          {rowData
            ? rowData.map((value, index) => {
                return (
                  <Text
                    style={{
                      fontSize: this.state.font_size,
                      lineHeight: this.state.line_height,
                    }}
                    key={index}>
                    {value ? value : ' '}
                  </Text>
                );
              })
            : null}
        </View>
        <View
          style={{
            marginBottom: 2,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={{fontSize: 12}}>{this.state.time}</Text>
          <Text style={{fontSize: 12}}>
            {' 第 ' + (1 + 1) + '/' + 2 + ' 页 '}
            {/*{this.state.pageStr+'  第 '+(rowData.num + 1) + ' / ' + this.state.chapterLength+' 章'}*/}
          </Text>
        </View>
      </View>
    );
  }

  _content() {
    return (
      <FlatList
        pagingEnabled={true}
        horizontal={true}
        initialNumToRender={100}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={this._handleScroll.bind(this)}
        onScrollEndDrag={this._onScrollEndDrag.bind(this)}
        data={this.state.pages}
        keyExtractor={(value, index) => index}
        renderItem={this.renderRow.bind(this)}
        ListEmptyComponent={this._ListEmptyComponent()}
      />
    );
  }
  _ListEmptyComponent() {
    return <Text>暂无数据</Text>;
  }
  _content2() {
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
