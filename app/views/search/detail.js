/*
 * 书城
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
  Image,
} from 'react-native';
import {getWidth} from '@/utils/function';
import Back from '@/components/back';
import MyIcon from '@/config/myIcon';
import StyleConfig from '@/config/styleConfig';

export default class SearchDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params,
      bookInfo: null,
    };
  }

  componentDidMount() {
    let that = this;
    // console.log(this.props.navigation.state.params);
    global.loading.show();
    global.appApi
      .getBookInfo(this.state.data)
      .then(res => {
        that.setState(
          {
            bookInfo: res,
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
  _readBook() {
    global.toast.add('开始阅读吧……');
  }
  _addBookList() {
    let that = this;
    let BookChapterDetail = global.realm.objects('BookList');
    // 判断是否已存在
    let isHave = false;
    let bookUrl = that.state.bookInfo.bookUrl;
    BookChapterDetail.forEach(e => {
      if (e.bookUrl === bookUrl) {
        isHave = true;
        return false;
      }
    });
    if (isHave) {
      global.toast.add('书架已存在这本书，别点了哦……');
    } else {
      let d = that.state.bookInfo;
      // console.log({
      //   bookId: d.bookId,
      //   bookName: d.bookName,
      //   author: d.author,
      //   bookUrl: d.bookUrl,
      //   chapterUrl: d.chapterUrl,
      //   imgUrl: d.imgUrl,
      //   lastChapterUrl: d.lastChapterUrl,
      //   lastChapterTitle: d.lastChapterTitle,
      //   lastChapterTime: d.lastChapterTime,
      //   hasNewChapter: 0,
      //   isEnd: d.isEnd,
      //   bookState: 1,
      //   sourceKey: '',
      //   saveTime: new Date(),
      // });
      // global.toast.add('成功加入书架，快去阅读吧……');
      global.realm.write(() => {
        global.realm.create(
          'BookList',
          {
            bookId: d.bookId,
            bookName: d.bookName,
            author: d.author,
            bookUrl: d.bookUrl,
            chapterUrl: d.chapterUrl,
            imgUrl: d.imgUrl,
            lastChapterUrl: d.lastChapterUrl,
            lastChapterTitle: d.lastChapterTitle,
            lastChapterTime: d.lastChapterTime,
            hasNewChapter: 0,
            isEnd: d.isEnd,
            bookState: 1,
            sourceKey: '',
            saveTime: new Date(),
          },
          true,
        );
        global.toast.add('成功加入书架，快去阅读吧……');
      });
    }
  }

  render() {
    let item = this.state.bookInfo;
    return (
      <View style={global.appStyles.content}>
        <View style={global.appStyles.header}>
          <Back navigation={this.props.navigation} />
        </View>
        <View style={global.appStyles.main}>
          {item == null ? (
            <Text style={styles.emptyText}>正在加载……</Text>
          ) : (
            <View>
              <View style={styles.row}>
                <Image
                  source={{uri: item.imgUrl}}
                  style={{width: 180, height: 260}}
                />
              </View>
              <View style={[styles.row, styles.bookName]}>
                <Text style={styles.bookName}>{item.bookName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.other}>
                  {item.author + ' | ' + item.state + ' | ' + item.len}
                </Text>
              </View>
              <View style={[styles.row, styles.buttonRow]}>
                <TouchableOpacity
                  activeOpacity={StyleConfig.activeOpacity}
                  onPress={() => this._readBook()}>
                  <View
                    style={[
                      global.appStyles.padding,
                      styles.myButton1,
                      styles.myButton,
                    ]}>
                    <Text style={styles.buttonText}>开始阅读</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={StyleConfig.activeOpacity}
                  onPress={() => this._addBookList()}>
                  <View style={[global.appStyles.padding, styles.myButton]}>
                    <Text>加入书架</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[global.appStyles.padding, styles.introP]}>
                <Text style={styles.title}>简介</Text>
                <Text style={styles.intro}>{item.intro}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    paddingBottom: StyleConfig.padding.baseTop,
  },
  bookName: {
    fontSize: 25,
    color: StyleConfig.color.text,
  },
  other: {
    color: StyleConfig.color.detailText,
  },
  introP: {
    borderWidth: 1,
    borderColor: StyleConfig.color.border,
    borderStyle: 'solid',
    minHeight: 200,
  },
  title: {
    fontSize: 20,
    color: StyleConfig.color.text,
  },
  intro: {
    color: StyleConfig.color.detailText,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  myButton: {
    width: getWidth(0.4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bcc1ad',
    borderStyle: 'solid',
    borderRadius: StyleConfig.radius,
  },
  myButton1: {
    backgroundColor: '#ced3bf',
  },
  buttonText: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    paddingTop: 250,
    color: StyleConfig.color.detailText,
  },
});
