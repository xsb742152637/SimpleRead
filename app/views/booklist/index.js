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
import {getId, textFormat} from '@/utils/function';

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
    let a =
      '这是&lsquo;历朝皆以弱灭，独汉以强亡&rsquo;的汉末三国，这是充满了铁血、杀戮，又不失温情与信义的时代；是赋予万千中国人民族名称的时代；是吊打四方蛮夷一骑当五胡的的时代。可这也是中华历史中最黑暗的时代，诸侯混战使人口减少了十之七八，直接导致了之后的诸胡入侵，炎黄子孙竟沦落为两脚之羊，被当做粮食使用，华夏文明几近断绝。也许，一个意外出现的人，能煽动他的那双蝴蝶翅膀，给予这个时代不用的历史命运';
    console.log(textFormat(a));

    this.setState({bookList: global.realm.queryBookList(1)});
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
        activeOpacity={StyleConfig.opacity.active}
        onPress={() => {
          this._goBookRead(item);
        }}>
        <View style={global.appStyles.card}>
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

  itemContent: {
    paddingLeft: StyleConfig.padding.baseLeft,
    flex: 1,
  },
  itemName: {
    color: StyleConfig.color.titleText,
    fontSize: StyleConfig.fontSize.titleText,
    // fontWeight: 'bold',
    paddingTop: StyleConfig.padding.text,
    paddingBottom: StyleConfig.padding.text,
  },
  itemAuthor: {
    color: StyleConfig.color.text,
    fontSize: StyleConfig.fontSize.detailText,
    paddingBottom: StyleConfig.padding.text,
  },
  itemIntro: {
    color: StyleConfig.color.detailText,
    fontSize: StyleConfig.fontSize.detailText,
  },
  itemNewChapter: {
    color: StyleConfig.color.detailText,
    paddingTop: StyleConfig.padding.text,
    paddingBottom: StyleConfig.padding.text,
    fontSize: StyleConfig.fontSize.detailText,
  },
});
