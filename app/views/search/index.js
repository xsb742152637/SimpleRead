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
} from 'react-native';
import MyIcon from '@config/myIcon';
import AppStyles from '@utils/style';
import AppApi from '@utils/api';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChange: false,
      searchText: '',
      bookList: [],
    };
  }

  componentDidMount() {
    this._searchBook();
  }
  // 开始搜索
  _searchBook() {
    if (this.state.isChange) {
      // console.log(this.state.searchText);
      AppApi.getSearchList(this.state.searchText)
        .then(res => {
          // console.log(res);
          this.setState({
            isChange: false,
            bookList: res,
          });
        })
        .catch(error => {
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
  // 返回
  _goBack() {
    this.props.navigation.goBack();
  }
  _getItem(item) {
    return (
      <TouchableOpacity activeOpacity={1}>
        <View style={styles.itemView}>
          <View>
            <Image
              source={{uri: item.imgUrl}}
              style={{width: 80, height: 120}}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.itemAuthor}>
              {item.author}
            </Text>
            <Text numberOfLines={3} style={styles.itemIntro}>
              {item.intro}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {item.newChapter}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity
              style={styles.myButton}
              onPress={() => this._goBack()}>
              <MyIcon
                name={'fanhuishangyizhang'}
                size={AppStyles.fontSize.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.searchInputParent}>
            <TextInput
              autoFocus={true}
              clearButtonMode="while-editing"
              placeholder={'请输入关键字：书名/作者'}
              style={styles.searchInput}
              onChangeText={text => this._setSearchText(text)}
            />
          </View>
          <View>
            <Text onPress={() => this._searchBook()}>搜索</Text>
          </View>
        </View>
        <View>
          <FlatList
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
  content: {
    paddingRight: AppStyles.padding.baseLeft,
    paddingLeft: AppStyles.padding.baseLeft,
    paddingTop: AppStyles.padding.baseTop,
    paddingBottom: AppStyles.padding.baseTop,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: AppStyles.color.baseBackground,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputParent: {
    flex: 1,
    paddingRight: AppStyles.padding.baseLeft,
    paddingLeft: AppStyles.padding.baseLeft,
  },
  searchInput: {
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
    paddingRight: AppStyles.padding.baseLeft,
    paddingLeft: AppStyles.padding.baseLeft,
    borderRadius: AppStyles.radius,
    backgroundColor: '#efefef',
  },
  itemView: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: AppStyles.padding.baseTop,
    paddingTop: AppStyles.padding.baseTop,
    backgroundColor: '#fff',
  },
  itemContent: {
    paddingLeft: AppStyles.padding.baseLeft,
    paddingRight: 5,
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
    color: '#474747',
    fontSize: 12,
    paddingBottom: 5,
  },
  itemIntro: {
    color: '#a2a2a2',
    fontSize: 12,
  },
  itemNewChapter: {
    color: '#a2a2a2',
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
  },
});
