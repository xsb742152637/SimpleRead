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
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏
import StyleConfig from '@/config/styleConfig';
import {getId, textFormat, isNull, cloneObj} from '@/utils/function';

export default class BookCity extends React.Component {
  constructor(props) {
    super(props);
  }

  _back() {
    // alert('You tapped the next button2');
    // this.props.navigation.navigate('BookRead');
    //返回
    this.props.navigation.goBack();
    // 返回到第一层
    // this.props.navigation.popToTop()
  }

  _deleteAll() {
    let bookId = '3419E117-41F0-48E6-977D-358D312720E3';
    // global.realm.deleteBookAll();

    global.realm.deleteBookAll();
    // global.realm.deleteChapterByBookId(bookId);
    // global.realm.deleteDetailByBookId(bookId);
  }
  _getMaxChapterOrderNum() {
    let bookId = 'bbb';
    let orderNum = global.realm.getMaxChapterOrderNum(bookId);
    alert(orderNum);
  }
  _queryChapter() {
    let bookId = '53548BB6-32C6-4EC0-9345-29DCB2BE43E7';
    let orderNum = global.realm.queryChapterByBookId(bookId);
    console.log(orderNum);
  }
  _getOneChapter() {
    let chapterId = '7E4A2A21-57CD-4E43-A3D3-12B2D3CD0684';
    let orderNum = global.realm.findChapter(chapterId);
    console.log(orderNum);
  }
  _saveChapter() {
    let that = this;
    let bookId = 'aaaaa';

    let orderNum = global.realm.getMaxChapterOrderNum(bookId);
    // 保存阅读进度
    let chapter = {
      chapterId: getId(),
      bookId: bookId,
      chapterUrl: '啊发射点发射点',
      title: '测试2',
      num: 0,
      orderNum: 1,
    };
    global.realm.saveChapter(chapter);
  }
  _bookRead() {
    let bookId = '53548BB6-32C6-4EC0-9345-29DCB2BE43E7';
    this.props.navigation.navigate(
      'BookRead3',
      cloneObj(global.realm.findBook(bookId)),
    );
  }
  _goDetail() {
    let item = {
      author: '姜梵',
      bookId: '0CC61A7A-7E9C-479F-A3E6-BD811F9E5409',
      bookName: '三国之大汉崛起',
      bookUrl: 'https://www.23us.tw/23_23901/',
      chapterUrl: '',
      imgUrl: '',
      isEnd: 1,
      lastChapterTime: '19-0 6-06',
      lastChapterTitle: ' 第831章身份转变',
      len: '4936k',
      state: '连载',
      type: '',
    };
    this.props.navigation.navigate('SearchDetail', item);
  }
  render2() {
    return (
      <View style={global.appStyles.content}>
        <Text>11</Text>
        <Text>22</Text>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._back()}>
          <Text>返回</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._deleteAll()}>
          <Text>清空全部数据</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._saveChapter()}>
          <Text>保存章节</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._getOneChapter()}>
          <Text>查询某一章节</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._queryChapter()}>
          <Text>查询全部章节</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._getMaxChapterOrderNum()}>
          <Text>查询最大章节序号</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._bookRead()}>
          <Text>看小说</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._goDetail()}>
          <Text>明细页</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View
        style={[
          {
            width: width,
            height: height,
            justifyContent: 'center',
            display: 'flex',
          },
        ]}>
        <Text style={{textAlign: 'center'}}>敬请期待</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
