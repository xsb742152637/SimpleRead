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

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      isChange: false,
      searchText: '',
      bookList: [],
    };
  }

  componentDidMount() {
    // this._searchBook();
    // setTimeout(() => {
    // }, 1000);
    // global.loading.hide();
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
      console.log(this.state.searchText);
      global.appApi
        .getSearchList(that.state.searchText)
        .then(res => {
          console.log(res);
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
  _loadBook() {
    let that = this;
    let index = (that.state.pages - 1) * that.state.rows;
    for (let i = 0; i < that.state.rows; i++) {
      let data = that.state.searchList[index + i];
      console.log(index + i);
      // console.log(data);
      global.appApi
        .getBookInfo(data)
        .then(book => {
          let bookList = that.state.bookList;
          bookList.push(book);
          that.setState({bookList: bookList});
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  _setSearchText(text) {
    this.setState({
      isChange: true,
      searchText: text,
    });
  }
  _goDetail(item) {
    this.props.navigation.navigate('SearchDetail', item);
  }
  _getItem(item) {
    return (
      <TouchableOpacity
        activeOpacity={StyleConfig.activeOpacity}
        onPress={() => {
          this._goDetail(item);
        }}>
        <View style={styles.itemView}>
          <View>
            <Image
              source={{uri: item.imgUrl}}
              style={{width: 80, height: 120}}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.bookName}</Text>
            <Text numberOfLines={1} style={styles.itemAuthor}>
              {item.author}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {item.type + ' | ' + item.state + ' | ' + item.len}
            </Text>
            <Text numberOfLines={3} style={styles.itemIntro}>
              {item.intro}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
              style={styles.searchInput}
              onChangeText={text => this._setSearchText(text)}
            />
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={StyleConfig.activeOpacity}
              onPress={() => this._searchBook()}>
              <Text>搜索</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={global.appStyles.main}>
          <FlatList
            data={this.state.bookList}
            keyExtractor={item => item.bookId}
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
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: StyleConfig.radius.button,
    backgroundColor: '#efefef',
  },
  itemView: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
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
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
  },
});
