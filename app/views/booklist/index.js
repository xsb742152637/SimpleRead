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
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import MyIcon from '@config/myIcon';
import AppStyles from '@utils/style';

export default class BookList extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isNewBook: false,
      bookList: [],
    };
  }

  // render渲染前触发，仅调用一次
  componentwillMount() {}

  // 初始加载
  componentDidMount() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        index: i,
        name: '我是：' + i,
      });
    }
    this.setState({bookList: data});
  }

  _goSearch() {
    this.props.navigation.navigate('Search');
  }
  _goReadHistory() {
    this.props.navigation.navigate('ReadHistory');
  }
  _getItem(item) {
    return (
      <TouchableOpacity>
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={styles.content}>
        <View style={styles.viewHeader}>
          <TouchableOpacity
            style={styles.myButton}
            onPress={() => this._goReadHistory()}>
            <MyIcon name={'yuedujilu'} size={AppStyles.fontSize.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._goSearch()}>
            <MyIcon name={'sousuo'} size={AppStyles.fontSize.icon} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.bookList}
          keyExtractor={item => item.index}
          renderItem={({item}) => this._getItem(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingRight: AppStyles.padding.baseLeft,
    paddingLeft: AppStyles.padding.baseLeft,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: AppStyles.color.baseBackground,
    flex: 1,
  },
  viewHeader: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    textAlign: 'right',
    paddingTop: AppStyles.padding.baseTop,
    paddingBottom: AppStyles.padding.baseTop,
  },
  myButton: {
    paddingLeft: AppStyles.padding.baseLeft,
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
});
