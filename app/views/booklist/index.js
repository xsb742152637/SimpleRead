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
import {cloneObj} from '@/utils/function';
// 公共样式参数
import StyleConfig from '@/config/styleConfig';
import MyIcon from '@/config/myIcon';

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
    let bookList = global.realm.objects('BookList').sorted('saveTime', true);
    this.setState({bookList: cloneObj(bookList)});
  }

  _refresh() {
    this._loadBookList();
  }
  _goSearch() {
    this.props.navigation.navigate('Search');
  }
  _goReadHistory() {
    this.props.navigation.navigate('ReadHistory');
  }
  _goBookRead(item) {
    this.props.navigation.navigate('BookRead', item);
  }
  _getItem(item) {
    return (
      <TouchableOpacity
        activeOpacity={StyleConfig.activeOpacity}
        onPress={() => {
          this._goBookRead(item);
        }}>
        <View style={styles.itemView}>
          <View>
            <Image
              source={{uri: item.imgUrl}}
              style={{width: 70, height: 100}}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.bookName}</Text>
            <Text numberOfLines={1} style={styles.itemAuthor}>
              {item.historyChapterTitle == ''
                ? '还未读过'
                : item.historyChapterTitle}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {'最新章节：' + item.lastChapterTitle}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {'更新情况：' + item.lastChapterTime}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    let isEmpty = this.state.bookList.length == 0;
    return (
      <View style={global.appStyles.content}>
        <View style={global.appStyles.header}>
          <View>
            <Text>简 阅</Text>
          </View>
          <View style={styles.tools}>
            <TouchableOpacity
              style={styles.myButton}
              onPress={() => this._refresh()}>
              <Text>{'刷新'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.myButton}
              onPress={() => this._goReadHistory()}>
              <MyIcon name={'yuedujilu'} size={StyleConfig.fontSize.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._goSearch()}>
              <MyIcon name={'sousuo'} size={StyleConfig.fontSize.icon} />
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

  itemView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: StyleConfig.padding.baseTop,
    paddingTop: StyleConfig.padding.baseTop,
    paddingBottom: StyleConfig.padding.baseTop,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    backgroundColor: '#fff',
    borderRadius: StyleConfig.radius.base,
  },
  itemContent: {
    paddingLeft: StyleConfig.padding.baseLeft,
    flex: 1,
  },
  itemName: {
    color: '#000',
    fontSize: 15,
    // fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
  },
  itemAuthor: {
    color: StyleConfig.color.text,
    fontSize: 12,
    paddingBottom: 5,
  },
  itemIntro: {
    color: StyleConfig.color.detailText,
    fontSize: 12,
  },
  itemNewChapter: {
    color: StyleConfig.color.detailText,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
  },
});
