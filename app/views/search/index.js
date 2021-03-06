/*
 * 搜索
 * @Author: xie
 * @Date: 2021-05-02
 */
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Dimensions,
  Keyboard,
  BackHandler,
} from 'react-native';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏
import {getId, textFormat, isNull} from '@/utils/function';
import Back from '@/components/back';
import MyIcon from '@/config/myIcon';
import StyleConfig from '@/config/styleConfig';
import Item from '@/components/item';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.scrollRef = null;
    this.state = {
      callbackKey: this.props.route.params.callbackKey,
      isLoad: false,
      isChange: false,
      searchText: '',
      bookList: [],
    };
    // 将this传递到监听方法中，不然在这个方法中无法正确访问this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  // 初始加载
  componentDidMount() {
    // 添加返回监听
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
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
    console.log('退回2');
    // 如果有全局回调的key，执行回调
    if (this.state.callbackKey) {
      global.callbacks[this.state.callbackKey]();
    }
  }
  // 开始搜索
  _searchBook() {
    let that = this;
    if (isNull(that.state.searchText)) {
      global.toast.add('请输入书名或作者名称');
      return;
    }
    if (that.state.isChange) {
      // 文本框失去焦点
      that.inputRef.current.blur();
      // 收起键盘
      Keyboard.dismiss();
      global.loading.show();
      // console.log(this.state.searchText);
      global.appApi
        .getSearchList(that.state.searchText)
        .then(res => {
          if (that.scrollRef != null) {
            that.scrollRef.scrollToOffset({
              viewPosition: 0,
              index: 0,
              animated: true,
            });
          }
          that.setState(
            {
              isChange: false,
              bookList: res,
            },
            () => {
              global.loading.hide();
            },
          );
        })
        .catch(error => {
          global.loading.hide();
          console.error(error);
        });
    }
  }
  _setSearchText(text) {
    this.setState({
      isChange: true,
      searchText: text,
    });
  }
  _getItem(data) {
    data.imgWidth = 85;
    data.imgHeight = 120;

    return (
      <TouchableOpacity
        activeOpacity={StyleConfig.opacity.active}
        onPress={() => {
          this._clickItem(data.item);
        }}>
        <Item data={data} navigation={this.props.navigation} />
      </TouchableOpacity>
    );
  }
  _ListEmptyComponent() {
    return (
      <TouchableOpacity
        style={{
          width: width,
          height: height,
          justifyContent: 'center',
          display: 'flex',
        }}
        activeOpacity={1}>
        <Text
          style={{
            textAlign: 'center',
            color: StyleConfig.color.text3,
          }}>
          {this.state.isLoad ? '正在搜索……' : '没有搜索结果'}
        </Text>
      </TouchableOpacity>
    );
  }
  _clickItem(item) {
    // 传递全局回调的key
    this.props.navigation.navigate('SearchDetail', item);
  }
  render() {
    return (
      <View style={global.appStyles.content}>
        <View style={global.appStyles.header}>
          <Back navigation={this.props.navigation} />
          <View style={styles.searchInputParent}>
            <TextInput
              ref={this.inputRef}
              autoFocus={true}
              clearButtonMode="while-editing"
              placeholder={'请输入关键字：书名/作者'}
              style={[global.appStyles.border, styles.searchInput]}
              onChangeText={text => this._setSearchText(text)}
            />
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={StyleConfig.opacity.active}
              onPress={() => this._searchBook()}>
              <Text style={global.appStyles.headerText}>搜索</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={global.appStyles.main}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={c => (this.scrollRef = c)}
            data={this.state.bookList}
            keyExtractor={item => item.key}
            renderItem={({item}) => this._getItem(item)}
            ListEmptyComponent={this._ListEmptyComponent()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchInputParent: {
    flex: 1,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
  },
  searchInput: {
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    paddingTop: StyleConfig.padding.text,
    paddingBottom: StyleConfig.padding.text,
    borderRadius: StyleConfig.radius.button,
    backgroundColor: '#efefef',
  },
});
