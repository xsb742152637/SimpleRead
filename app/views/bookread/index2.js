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
  Modal,
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
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏
import Back from '@/components/back';

export default class BookRead2 extends React.Component {
  constructor(props) {
    super(props);

    let chapterId = 'A4A57781-B5D6-40FD-9DB7-140FAF554470';
    let detail = global.realm.findDetail(chapterId);
    let font_size = 20;
    let line_height = font_size + 4;
    let pages = contentFormat(
      detail.title + '\n\n' + detail.content,
      font_size,
      line_height,
    );
    // console.log(pages[1].join(''));
    // console.log('页数：', pages.length);
    // console.log('第一页行数：', pages[0]);
    // console.log('第二行内容：', pages[0][0]);

    this.state = {
      title: detail.title,
      pages: pages,
      font_size: font_size,
      line_height: line_height,
      isSetting: false,
    };
    this.scrollRef = null;
    this.x = 0; // 当前的偏移量
  }
  componentDidMount() {}

  _handleScroll(e) {
    // console.log('_handleScroll');
    this.x = e.nativeEvent.contentOffset.x;
  }
  _onScrollEndDrag() {
    console.log('翻页');
  }
  _showControlStation_LR(evt) {
    console.log('点击', evt.nativeEvent.pageX, evt.nativeEvent.pageY);
    if (evt.nativeEvent.pageX <= width * 0.3) {
      this.scrollRef.scrollToOffset({
        offset: this.x - width,
        animated: true,
      });
    } else if (evt.nativeEvent.pageX >= width * 0.6) {
      this.scrollRef.scrollToOffset({
        offset: this.x + width,
        animated: true,
      });
    } else {
      console.log('点击中间');
      this.setState({isSetting: !this.state.isSetting});
    }
  }

  _content() {
    return (
      <FlatList
        pagingEnabled={true}
        horizontal={true}
        initialNumToRender={100}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={c => (this.scrollRef = c)}
        onScroll={this._handleScroll.bind(this)}
        onScrollEndDrag={this._onScrollEndDrag.bind(this)}
        data={this.state.pages}
        keyExtractor={(value, index) => index}
        renderItem={this.renderContent.bind(this)}
        ListEmptyComponent={this._ListEmptyComponent()}
      />
    );
  }
  //当前页正文
  renderContent(rowData) {
    // console.log(rowData);
    return (
      <View>
        <TouchableOpacity style={{flex: 1, width: width}} activeOpacity={1}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              width: width,
              height: height,
              paddingTop: 10,
            }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={evt => {
              this._showControlStation_LR(evt);
            }}>
            <View style={{alignSelf: 'center', flex: 1}}>
              {rowData.item
                ? rowData.item.map((value, index) => {
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
                justifyContent: 'space-between',
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
              }}>
              <Text style={{fontSize: 12}}>{this.state.time}</Text>
              <Text style={{fontSize: 12}}>
                {' 第 ' +
                  (rowData.index + 1) +
                  '/' +
                  this.state.pages.length +
                  ' 页 '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  _ListEmptyComponent() {
    return <Text>暂无数据</Text>;
  }
  _onShow() {
    console.log('显示弹出框');
  }
  _onDismiss() {
    console.log('关闭弹出框');
  }
  _onRequestClose() {
    console.log('返回按钮');
    this.setState({isSetting: !this.state.isSetting});
  }
  readerSetting() {
    return (
      <Modal
        animationType="fade" // 淡入淡出
        transparent={true} // 背景透明
        visible={this.state.isSetting} // 是否显示
        onShow={this._onShow.bind(this)}
        onDismiss={this._onDismiss.bind(this)}
        onRequestClose={this._onRequestClose.bind(this)}>
        <view style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <view style={global.appStyles.header}>
            <Back navigation={this.props.navigation} />
          </view>
          <view style={[global.appStyles.header, {height: 'auto'}]}>
            <view style={styles.st_row}>
              <view>
                <Text>上一章</Text>
              </view>
              <view>
                <Text>目录</Text>
              </view>
              <view>
                <Text>下一章</Text>
              </view>
            </view>
            <view style={styles.st_row}>
              <view>
                <text>字号</text>
              </view>
              <view>
                <text>减</text>
              </view>
              <view>
                <text>19</text>
              </view>
              <view>
                <text>加</text>
              </view>
            </view>
            <view style={styles.st_row}>
              <view>
                <text>字号</text>
              </view>
              <view>
                <text>白色</text>
              </view>
              <view>
                <text>咖色</text>
              </view>
              <view>
                <text>护眼</text>
              </view>
              <view>
                <text>灰蓝</text>
              </view>
              <view>
                <text>夜间</text>
              </view>
            </view>
            {/*<view style={styles.st_row}>翻页</view>*/}
          </view>
        </view>
      </Modal>
    );
  }
  render() {
    return (
      <View>
        <View style={{width: width, height: height}}>{this._content()}</View>
        {this.readerSetting()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  st_row: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
});
