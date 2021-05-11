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
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
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
      isChange: false,
      searchText: '',
      bookList: [],
    };
  }

  componentDidMount() {

  }
  // 开始搜索
  _searchBook() {
    let that = this;
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
      <Item
        data={data}
        navigateName={'SearchDetail'}
        navigation={this.props.navigation}
      />
    );
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
            ref={c => (this.scrollRef = c)}
            data={this.state.bookList}
            keyExtractor={item => item.key}
            renderItem={({item}) => this._getItem(item)}
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
