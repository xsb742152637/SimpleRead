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
import MyIcon from '@config/myIcon';
import AppStyles from '@utils/style';
import StyleConfig from '@config/styleConfig';
import Loading from '@utils/load/loading';
import Toast from '@utils/load/toast';
import storage from '@config/storage';

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
    Loading.show();
    storage
      .load({
        key: 'bookList',
      })
      .then(ret => {
        this.setState({bookList: ret});
        Loading.hide();
      })
      .catch(err => {
        Loading.hide();
      });

    // this._goSearch();

    // let item = {
    //   author: '景家二少爷',
    //   imgUrl:
    //     'http://static.zongheng.com/upload/cover/e4/6d/e46d4870e69ec5da264216f030139efe.jpeg',
    //   intro:
    //     '这是‘历朝皆以弱灭，独汉以强亡’的汉末三国，这是充满了铁血、杀戮，又不失温情与信义的时代；是赋予万千中国人民族名称的时代；是吊打四方蛮夷一骑当五胡的的时代。',
    //   key: 1,
    //   len: '375661字',
    //   name: '稗史三国',
    //   state: '连载',
    //   type: '历史军事',
    //   url: 'http://book.zongheng.com/book/846142.html',
    // };
    // this.props.navigation.navigate('SearchDetail', item);
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
  _getContent(str) {
    let strs = str.replace(/&nbsp;/g, '').split('\n');
    let strNew = '';
    for (let i = 0; i < strs.length; i++) {
      let s = strs[i].toString().trim().replace('· ', '');
      console.log(s);
      if (s != '') {
        strNew += s + ' ';
      }
    }
    return strNew;
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
            <Text style={styles.itemName}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.itemAuthor}>
              {'还未读过'}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {'最新章节：' + item.newChapter}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {'更新情况：' + this._getContent(item.time)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    let isEmpty = this.state.bookList.length == 0;
    return (
      <View style={AppStyles.content}>
        <View style={AppStyles.header}>
          <View>
            <Text>简 阅</Text>
          </View>
          <View style={styles.tools}>
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
            style={styles.main}
            data={this.state.bookList}
            keyExtractor={item => item.key}
            renderItem={({item}) => this._getItem(item)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    paddingTop: StyleConfig.padding.baseTop,
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
  },
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
    paddingTop: StyleConfig.padding.baseTop,
    paddingBottom: StyleConfig.padding.baseTop,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    backgroundColor: '#fff',
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
