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
  _queryAll() {
    let BookChapterDetail = global.realm.objects('BookChapterDetail');
    console.log(BookChapterDetail);
  }
  _addOne() {
    let tabName = 'BookChapterDetail';
    // detailId: 'string', //小说编号
    //   chapterId: 'string', //BookChapterList 的主键
    //   bookName: 'string',
    //   content: 'string', //小说内容
    //   orderNum: 'int', //小说序号
    let row1 = {
      detailId: '1',
      chapterId: '22',
      bookName: '不知道',
      content: 'asd爱德华嘎斯的发生',
      orderNum: 1,
    };
    global.realm.write(() => {
      global.realm.create(tabName, row1, true);
      global.toast.add('数据1新增成功');
    });
    let row2 = {
      detailId: '2',
      chapterId: '44',
      bookName: '不知道3',
      content: 'asd爱德和手动阀手动阀华嘎斯的发生',
      orderNum: 3,
    };
    global.realm.write(() => {
      global.realm.create(tabName, row2, true);
      global.toast.add('数据2新增成功');
    });

    let BookChapterDetail = global.realm.objects('BookChapterDetail');
    console.log(BookChapterDetail);
  }

  render() {
    return (
      <View style={global.appStyles.content}>
        <Text>11</Text>
        <Text>22</Text>
        <TouchableOpacity onPress={() => this._back()}>
          <Text>看书</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._queryAll()}>
          <Text>查看全部BookChapterDetail</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._addOne()}>
          <Text>新增一行</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
