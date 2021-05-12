/*
 * 书架
 * @Author: xie
 * @Date: 2021-05-02
 */
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
// 公共样式参数
import StyleConfig from '@/config/styleConfig';
import MyIcon from '@/config/myIcon';
import {getId, textFormat, mergeSpace, isNull} from '@/utils/function';
import Item from '@/components/item';

export default class BookList extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    this.state = {
      bookList: [],
    };
  }

  // render渲染前触发，仅调用一次
  componentwillMount() {}

  // 初始加载
  componentDidMount() {
    this._loadBookList();
  }

  _loadBookList() {
    this.setState({bookList: global.realm.queryBookList(1)});
  }

  _goSearch() {
    this.props.navigation.navigate('Search');
  }
  _goReadHistory() {
    this.props.navigation.navigate('ReadHistory');
  }
  _callback() {
    console.log('回调');
    this._loadBookList();
  }
  _getItem(item) {
    let item2 = {
      type: 1,
      itemName: item.bookName,
      imgUrl: item.imgUrl,
      imgWidth: 70,
      imgHeight: 100,
      itemTitle: isNull(item.historyChapterTitle)
        ? '还未读过'
        : item.historyChapterTitle,
      itemInfo1: '最新章节：' + item.lastChapterTitle,
      itemInfo2: '更新情况：' + mergeSpace(textFormat(item.lastChapterTime)),
      item: item,
    };
    return (
      <Item
        data={item2}
        navigateName={'BookRead'}
        navigation={this.props.navigation}
        callback={() => {
          this._callback();
        }}
      />
    );
  }
  render() {
    let isEmpty = this.state.bookList.length == 0;
    return (
      <View style={global.appStyles.content}>
        <View style={global.appStyles.header}>
          <View>
            <Text style={global.appStyles.headerText}>简 阅</Text>
          </View>
          <View style={styles.tools}>
            <TouchableOpacity
              style={styles.myButton}
              onPress={() => this._loadBookList()}>
              <Text style={global.appStyles.headerText}>{'刷新'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.myButton}
              onPress={() => this._goReadHistory()}>
              <MyIcon
                name={'yuedujilu'}
                style={global.appStyles.headerIcon}
                size={StyleConfig.fontSize.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._goSearch()}>
              <MyIcon
                name={'sousuo'}
                style={global.appStyles.headerIcon}
                size={StyleConfig.fontSize.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {isEmpty ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>不要试图揣摩读书的快乐</Text>
            <Text style={styles.emptyText}>因为读书的快乐你想象不到</Text>
            <Text style={styles.emptyText}>快去书城逛逛吧……</Text>
          </View>
        ) : (
          <FlatList
            style={global.appStyles.main}
            data={this.state.bookList}
            keyExtractor={item => item.bookId}
            renderItem={({item}) => this._getItem(item)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tools: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'right',
  },
  myButton: {
    paddingLeft: StyleConfig.padding.baseLeft,
  },
  bookTitle: {
    fontSize: 30,
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  bookContent: {
    fontSize: 16,
    color: '#555',
  },
  emptyView: {
    alignItems: 'center',
    paddingTop: 250,
  },
  emptyText: {
    color: StyleConfig.color.detailText,
    paddingTop: StyleConfig.padding.baseTop,
  },
});
