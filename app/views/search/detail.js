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
  _addBookList(type) {
    let that = this;
    let d = that.state.bookInfo;
    let rows = global.realm.queryBookList();
    // 判断是否已存在
    let isHave = false;
    let bookId = d.bookId;
    let bookUrl = that.state.bookInfo.bookUrl;
    rows.forEach(e => {
      if (e.bookUrl === bookUrl) {
        // 直接阅读的数据，在书架是不显示，可以再次添加
        if (e.bookState == 0) {
          bookId = e.bookId;
        } else {
          isHave = true;
          return false;
        }
      }
    });
    if (isHave) {
      global.toast.add('书架已存在这本书，别点了哦……');
    } else {
      let item = {
        bookId: bookId,
        bookName: d.bookName,
        author: d.author,
        bookUrl: d.bookUrl,
        chapterUrl: d.chapterUrl,
        imgUrl: d.imgUrl,
        lastChapterTitle: d.lastChapterTitle,
        lastChapterTime: d.lastChapterTime,
        hasNewChapter: 0,
        isEnd: d.isEnd,
        bookState: type ? 0 : 1, // 直接阅读的小说状态为不显示
        sourceKey: d.sourceKey,
        saveTime: new Date(),
      };

      global.realm.saveBook(item).then(row => {
        if (type) {
          that.props.navigation.navigate('BookRead', row);
        } else {
          global.toast.add('成功加入书架，快去阅读吧……');
        }
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
                  style={{width: 170, height: 260}}
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
                  activeOpacity={StyleConfig.opacity.active}
                  onPress={() => this._addBookList(true)}>
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
                  activeOpacity={StyleConfig.opacity.active}
                  onPress={() => this._addBookList(false)}>
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
    paddingTop: StyleConfig.padding.baseTop,
  },
  bookName: {
    fontSize: 25,
    color: StyleConfig.color.text,
  },
  other: {
    color: StyleConfig.color.detailText,
  },
  introP: {
    marginTop: StyleConfig.padding.baseTop,
    borderWidth: 1,
    borderColor: StyleConfig.color.border,
    borderStyle: 'solid',
    minHeight: 200,
    borderRadius: StyleConfig.radius.base,
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
    borderColor: StyleConfig.color.button,
    borderStyle: 'solid',
    borderRadius: StyleConfig.radius.button,
  },
  myButton1: {
    backgroundColor: StyleConfig.color.button,
  },
  buttonText: {
    color: StyleConfig.color.titleText,
  },
  emptyText: {
    textAlign: 'center',
    paddingTop: 250,
    color: StyleConfig.color.detailText,
  },
});
