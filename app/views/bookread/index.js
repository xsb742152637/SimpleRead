/*
 * 阅读
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
import cheerio from 'cheerio';
import StyleConfig from '@/config/styleConfig';

export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;

    // console.log(bookInfo);
    this.scrollViewRef = null;
    this.state = {
      bookInfo: bookInfo,
      key: bookInfo.bookName,
      detailId: '',
      page: 1,
      lastChapterUrl: bookInfo.lastChapterUrl,
      prevUrl: '',
      nextUrl: '',
      listUrl: '',
      content: '',
      title: '',
    };
  }

  // render渲染前触发，仅调用一次
  componentwillMount() {}

  // 上一章/下一章
  _clickButton(type) {
    let lastChapterUrl;
    if (type) {
      if (this.state.prevUrl == '') {
        global.toast.add('已经是第一章了……');
        return;
      }
      lastChapterUrl = this.state.prevUrl;
    } else {
      if (this.state.nextUrl == '') {
        global.toast.add('已经是最后一章了……');
        return;
      }
      lastChapterUrl = this.state.nextUrl;
    }

    this.setState(
      {
        lastChapterUrl: lastChapterUrl,
        prevUrl: '',
        nextUrl: '',
      },
      () => {
        this._loadHtml();
      },
    );
  }

  // 请求html内容，并缓存
  _loadHtml() {
    let that = this;
    global.loading.show();
    // console.log(this.state.lastChapterUrl);
    global.appApi
      .getChapter(this.state.lastChapterUrl)
      .then(res => {
        // console.log(res);
        console.log(res.prevUrl);
        that.setState(
          {
            title: res.title,
            content: res.content,
            listUrl: res.listUrl,
            prevUrl: res.prevUrl,
            nextUrl: res.nextUrl,
          },
          () => {
            that._saveBook();
            global.loading.hide();
          },
        );
        if (that.scrollViewRef != null) {
          that.scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        }
      })
      .catch(error => {
        global.loading.hide();
        console.error(error);
      });
  }

  _saveBook() {
    let that = this;
    let bookId = this.state.bookInfo.bookId;
    let books = global.realm.objects('BookList');
    let book = global.realm.objectForPrimaryKey('BookList', bookId);
    global.realm.write(() => {
      global.realm.create(
        'BookList',
        {
          bookId: bookId,
          saveTime: new Date(),
          historyChapterTitle: that.state.title,
          detailId: that.state.detailId,
          lastChapterUrl: that.state.lastChapterUrl,
          historyChapterPage: that.state.page,
        },
        true,
      );

      global.toast.add('记录成功……');
    });
  }
  // 初始加载
  componentDidMount() {
    this._loadHtml();
  }

  render() {
    return (
      <View style={styles.myView}>
        <ScrollView
          ref={c => (this.scrollViewRef = c)}
          style={styles.myScrollView}>
          <Button
            title={'上一章'}
            accessibilityLabel="accessibility title"
            disabled={false}
            testID={'buttonTag'}
            onPress={() => {
              this._clickButton(true);
            }}
          />
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.bookContent}>{this.state.content}</Text>
          <Button
            title={'下一章'}
            style={styles.myButton}
            accessibilityLabel="accessibility title"
            disabled={false}
            testID={'buttonTag'}
            onPress={() => {
              this._clickButton(false);
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#CCE8CF',
  },
  myView: {
    padding: 6,
    backgroundColor: '#CCE8CF',
  },
  myButton: {
    backgroundColor: '#FAF9DE',
    color: '#000',
    borderRadius: 10,
  },
  title: {
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
