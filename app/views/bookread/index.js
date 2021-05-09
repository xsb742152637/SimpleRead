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
  BackHandler,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import {getId, textFormat} from '@/utils/function';

export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;

    // console.log(bookInfo);
    this.scrollRef = null;
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
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    // alert('退回');
    this.props.navigation.goBack(null);
    return true;
  }

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
            if (that.scrollRef != null) {
              that.scrollRef.scrollTo({x: 0, y: 0, animated: true});
            }
            global.loading.hide();
          },
        );
      })
      .catch(error => {
        global.loading.hide();
        console.error(error);
      });
  }

  _saveBook() {
    let that = this;
    let bookId = this.state.bookInfo.bookId;

    // 保存阅读进度
    let book = {
      bookId: bookId,
      saveTime: new Date(),
      historyChapterTitle: that.state.title,
      detailId: that.state.detailId,
      lastChapterUrl: that.state.lastChapterUrl,
      historyChapterPage: that.state.page,
    };
    global.realm.saveBook(book);
  }

  _saveChapter() {
    let that = this;
    let bookId = this.state.bookInfo.bookId;

    let orderNum = global.realm.getMaxChapterOrderNum(bookId);
    // 保存阅读进度
    let chapter = {
      chapterId: getId(),
      bookId: bookId,
      chapterUrl: that.state.lastChapterUrl,
      title: that.state.title,
      num: 0,
      orderNum: orderNum,
    };
    global.realm.saveChapter(chapter);
  }
  // 初始加载
  componentDidMount() {
    this._loadHtml();
  }

  render() {
    return (
      <View style={styles.myView}>
        <ScrollView ref={c => (this.scrollRef = c)} style={styles.myScrollView}>
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
