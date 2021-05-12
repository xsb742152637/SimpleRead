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
  BackHandler,
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
      lastBackPressed: null,
      callbackKey: 'bookList',
      bookList: [],
    };

    // 将this传递到监听方法中，不然在这个方法中无法正确访问this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  // render渲染前触发，仅调用一次
  componentwillMount() {}

  // 初始加载
  componentDidMount() {
    let that = this;
    // 添加返回监听
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    // 在全局变量中注册回调
    global.callbacks[this.state.callbackKey] = () => {
      console.log('回调');
      that._loadBookList();
    };
    this._loadBookList();
  }

  componentWillUnmount() {
    // 注销监听
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  // 页面返回触发的方法
  handleBackButtonClick() {
    console.log('首页返回');
    // 如果有全局回调的key，执行回调
    if (
      this.state.lastBackPressed &&
      this.state.lastBackPressed + 2000 >= Date.now()
    ) {
      //在2秒内按过back返回，可以退出应用
      BackHandler.exitApp();
      return false;
    }
    this.setState({lastBackPressed: Date.now()});
    global.toast.add('再按一次退出应用……');
    return true;
  }
  _loadBookList() {
    this.setState({bookList: global.realm.queryBookList(1)});
  }

  _goSearch() {
    // 传递全局回调的key
    this.props.navigation.navigate('Search', {
      callbackKey: this.state.callbackKey,
    });
  }
  _goReadHistory() {
    this.props.navigation.navigate('ReadHistory');
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
        callbackKey={'bookList'}
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
