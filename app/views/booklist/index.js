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
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
// 公共样式参数
import StyleConfig from '@/config/styleConfig';
import MyIcon from '@/config/myIcon';
import {
  getId,
  textFormat,
  mergeSpace,
  isNull,
  cloneObj,
} from '@/utils/function';
import Item from '@/components/item';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏

export default class BookList extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    this.state = {
      isSetting: false,
      isDelete: false, // 是否启动删除功能
      deleteIds: [], //
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
    this.setState({bookList: cloneObj(global.realm.queryBookList(1))});
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
  _clickItem(item) {
    // 传递全局回调的key
    if (this.state.isDelete) {
      let deleteIds = this.state.deleteIds;
      // 如果已经存在，则取消
      if (this.state.deleteIds.indexOf(item.bookId) >= 0) {
        deleteIds.splice(this.state.deleteIds.indexOf(item.bookId), 1);
      } else {
        deleteIds.push(item.bookId);
      }
      this.setState({
        deleteIds: deleteIds,
      });
    } else {
      item.callbackKey = 'bookList';
      this.props.navigation.navigate('BookRead', item);
    }
  }
  _showSetting() {
    this.setState({isSetting: true});
  }
  _onDismiss() {
    console.log('点到了');
    this.setState({isSetting: false});
  }
  _updateBooks() {
    console.log('更新');
  }
  _localImport() {
    console.log('导入');
  }
  _showDelete(isDelete) {
    console.log('删除', isDelete);
    this.setState({isSetting: false, isDelete: isDelete, deleteIds: []});
  }
  _setSelected(type) {
    let deleteIds = [];
    if (type) {
      this.state.bookList.map((value, index) => {
        deleteIds.push(value.bookId);
      });
    }
    this.setState({deleteIds: deleteIds});
  }
  _deleteBooks() {
    let rows = [];
    this.state.deleteIds.map((value, index) => {
      rows.push({bookId: value, bookState: 0});
    });
    if (rows.length > 0) {
      global.realm.saveBook(rows);
      this.state.deleteIds.map((value, index) => {
        global.realm.deleteDetailByBookId(value);
      });
      this.setState({isDelete: false});
      this._loadBookList();
    }
  }
  renderSetting() {
    return (
      <Modal
        animationType="fade" // 淡入淡出
        transparent={true} // 背景透明
        visible={this.state.isSetting} // 是否显示
        onDismiss={this._onDismiss.bind(this)}
        onRequestClose={this._onDismiss.bind(this)}>
        <Text
          style={{
            width: width,
            height: height,
          }}
          onPress={this._onDismiss.bind(this)}
        />
        <View
          style={[
            global.appStyles.padding,
            {
              backgroundColor: '#fff',
              width: 140,
              position: 'absolute',
              top: 45,
              right: 10,
              borderRadius: StyleConfig.radius.button,
            },
          ]}>
          <View>
            <TouchableOpacity
              style={styles.settingOpacity}
              activeOpacity={StyleConfig.opacity.active}
              onPress={this._updateBooks.bind(this)}>
              <MyIcon
                name={'shuaxin'}
                style={{
                  width: 30,
                  color: StyleConfig.color.text2,
                }}
                size={StyleConfig.fontSize.icon}
              />
              <Text
                style={{
                  color: StyleConfig.color.text2,
                }}>
                更新连载书
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.settingOpacity}
              activeOpacity={StyleConfig.opacity.active}
              onPress={this._localImport.bind(this)}>
              <MyIcon
                name={'shangchuan'}
                style={{
                  width: 30,
                  color: StyleConfig.color.text2,
                }}
                size={StyleConfig.fontSize.icon}
              />
              <Text
                style={{
                  color: StyleConfig.color.text2,
                }}>
                本地导入
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.settingOpacity}
              activeOpacity={StyleConfig.opacity.active}
              onPress={this._showDelete.bind(this, true)}>
              <MyIcon
                name={'bianji'}
                style={{
                  width: 30,
                  color: StyleConfig.color.text2,
                }}
                size={StyleConfig.fontSize.icon}
              />
              <Text
                style={{
                  color: StyleConfig.color.text2,
                }}>
                书籍管理
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  renderDelete() {
    if (this.state.isDelete) {
      return (
        <View
          style={[
            global.appStyles.card,
            {
              marginLeft: StyleConfig.padding.baseLeft,
              marginRight: StyleConfig.padding.baseLeft,
              display: 'flex',
              justifyContent: 'space-between',
            },
          ]}>
          <Text
            onPress={() => {
              this._setSelected(
                this.state.deleteIds.length === this.state.bookList.length
                  ? false
                  : true,
              );
            }}>
            {this.state.deleteIds.length === this.state.bookList.length
              ? '取消全选'
              : '全选'}
          </Text>
          <Text
            style={{
              color:
                this.state.deleteIds.length > 0
                  ? '#d00404'
                  : StyleConfig.color.text3,
            }}
            onPress={() => {
              this._deleteBooks();
            }}>
            删除所选({this.state.deleteIds.length})
          </Text>
          <Text onPress={this._showDelete.bind(this, false)}>完成</Text>
        </View>
      );
    }
  }

  renderItem(item) {
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
      <TouchableOpacity
        style={{position: 'relative'}}
        activeOpacity={StyleConfig.opacity.active}
        onPress={() => {
          this._clickItem(item);
        }}>
        <Item data={item2} navigation={this.props.navigation} />
        {this.renderSel(item)}
      </TouchableOpacity>
    );
  }
  renderSel(item) {
    if (this.state.isDelete) {
      let isSel = this.state.deleteIds.indexOf(item.bookId) >= 0;
      return (
        <MyIcon
          name={isSel ? 'xuanzhong' : 'weixuanzhong'}
          style={{
            width: 30,
            color: isSel
              ? StyleConfig.color.iconActive
              : StyleConfig.color.icon,
            position: 'absolute',
            right: 0,
            top: 20,
          }}
          size={StyleConfig.fontSize.icon}
        />
      );
    }
  }

  renderHeader() {
    return (
      <View style={global.appStyles.header}>
        <View>
          <Text style={global.appStyles.headerText}>简 阅</Text>
        </View>
        <View style={styles.tools}>
          {/*<TouchableOpacity*/}
          {/*  style={styles.myButton}*/}
          {/*  onPress={() => this._goReadHistory()}>*/}
          {/*  <MyIcon*/}
          {/*    name={'yuedujilu'}*/}
          {/*    style={global.appStyles.headerIcon}*/}
          {/*    size={StyleConfig.fontSize.icon}*/}
          {/*  />*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity
            style={styles.myButton}
            onPress={() => this._showSetting()}>
            <MyIcon
              name={'shezhi'}
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
    );
  }
  render() {
    let isEmpty = this.state.bookList.length == 0;
    return (
      <View style={global.appStyles.content}>
        {this.renderHeader()}
        {this.renderSetting()}
        {this.renderDelete()}

        {isEmpty ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>不要试图揣摩读书的快乐</Text>
            <Text style={styles.emptyText}>因为读书的快乐你想象不到</Text>
            <Text style={styles.emptyText}>快去书城逛逛吧……</Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={global.appStyles.main}
            data={this.state.bookList}
            keyExtractor={item => item.bookId}
            renderItem={({item}) => this.renderItem(item)}
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
    color: StyleConfig.color.text3,
    paddingTop: StyleConfig.padding.baseTop,
  },
  settingOpacity: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 30,
    // borderColor: 'red',
    // borderStyle: 'solid',
    // borderWidth: 1,
  },
});
