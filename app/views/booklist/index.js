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
    let bookList = global.realm.objects('BookList').sorted('saveTime');
    this.setState({bookList: bookList});

    // this._goSearch();

    // let item = {
    //   author: '木三千',
    //   bookId: '4B2B8B90-E9D3-411A-A5BF-F3470EFCE352',
    //   bookName: '动物三国',
    //   bookUrl: 'http://book.zongheng.com/book/967835.html',
    //   chapterUrl: '',
    //   imgUrl:
    //     'http://static.zongheng.com/upload/cover/fb/80/fb805124ae3d16f9d33664f47ec8dcda.jpeg',
    //   intro:
    //     '这里是你闻所未闻的三国，它对你来说很陌生，却又很亲切。这里龙、猫、狗三足鼎力，它们又会擦出怎样的火花呢?',
    //   isEnd: 1,
    //   len: '2515字',
    //   state: '连载',
    //   type: '历史军事',
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
              {'还未读过'}
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
            keyExtractor={item => item.bookId}
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
