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
  Dimensions,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import {getId, textFormat} from '@/utils/function';

export default class Me extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  _back() {
    // alert('You tapped the next button2');
    this.props.navigation.navigate('BookRead');
    //返回
    // this.props.navigation.goBack()
    // 返回到第一层
    // this.props.navigation.popToTop()
  }

  _deleteAll() {
    let rows = global.realm.queryBookList();
    if (rows && rows.length > 0) {
      global.realm.deleteRow(rows);
    }

    rows = global.realm.queryChapterList();
    if (rows && rows.length > 0) {
      global.realm.deleteRow(rows);
    }

    rows = global.realm.queryDetailList();
    if (rows && rows.length > 0) {
      global.realm.deleteRow(rows);
    }
  }
  _getMaxChapterOrderNum() {
    let bookId = 'bbb';
    let orderNum = global.realm.getMaxChapterOrderNum(bookId);
    alert(orderNum);
  }
  _queryChapter() {
    let bookId = 'aaaaa';
    let orderNum = global.realm.queryChapter(bookId);
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
  render() {
    return (
      <View style={global.appStyles.content}>
        <Text>11</Text>
        <Text>22</Text>
        <TouchableOpacity
          style={global.appStyles.padding}
          onPress={() => this._back()}>
          <Text>看书</Text>
        </TouchableOpacity>
        <TouchableOpacity style={global.appStyles.padding} onPress={() => this._deleteAll()}>
          <Text>清空全部数据</Text>
        </TouchableOpacity>
        <TouchableOpacity style={global.appStyles.padding} onPress={() => this._saveChapter()}>
          <Text>保存章节</Text>
        </TouchableOpacity>
        <TouchableOpacity style={global.appStyles.padding} onPress={() => this._queryChapter()}>
          <Text>查询全部章节</Text>
        </TouchableOpacity>
        <TouchableOpacity style={global.appStyles.padding} onPress={() => this._getMaxChapterOrderNum()}>
          <Text>查询最大章节序号</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
