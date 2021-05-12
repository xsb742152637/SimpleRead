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
import {getId, textFormat, isNull} from '@/utils/function';

export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;

    console.log(bookInfo);
    this.scrollRef = null;
    this.state = {
      bookInfo: bookInfo,
      key: bookInfo.bookName,
      chapterId: bookInfo.chapterId,
      page: 1,
      thisUrl: '',
      prevUrl: '',
      nextUrl: '',
      listUrl: bookInfo.chapterUrl,
      content: '',
      title: '',
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  UNSAFE_componentWillMount() {
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
    // this.props.navigation.goBack(null);
    console.log('退回');
    if (this.state.bookInfo.callback) {
      this.state.bookInfo.callback();
    }
    return false;
  }

  // 上一章/下一章
  _clickButton(type) {
    let thisUrl;
    if (type) {
      if (isNull(this.state.prevUrl)) {
        global.toast.add('已经是第一章了……');
        return;
      }
      thisUrl = this.state.prevUrl;
    } else {
      if (isNull(this.state.nextUrl)) {
        global.toast.add('已经是最后一章了……');
        return;
      }
      thisUrl = this.state.nextUrl;
    }

    let chapter = global.realm.queryChapterByThisUrl(
      thisUrl,
      this.state.bookInfo.bookId,
    );
    if (isNull(chapter)) {
      console.log('没有找到缓存的目录', thisUrl, this.state.bookInfo.bookId);
    } else {
      console.log('找到缓存的目录', chapter);
      this.setState(
        {
          thisUrl: thisUrl,
          chapterId: chapter.chapterId,
          prevUrl: '',
          nextUrl: '',
        },
        () => {
          this._loadDetail();
        },
      );
    }
  }

  // 请求html内容，并缓存
  _loadDetail(detail) {
    let that = this;
    if (isNull(detail) && !isNull(this.state.chapterId)) {
      detail = global.realm.findDetail(this.state.chapterId);
      console.log('根据ID找内容');
    }
    if (isNull(detail)) {
      detail = global.realm.queryDetailByThisUrl(
        this.state.thisUrl,
        this.state.bookInfo.bookId,
      );
      console.log('根据路径找内容');
    }
    if (isNull(detail)) {
      console.log('没找到');
      that._saveDetail();
    } else {
      console.log('找到了');
      // console.log('找到了', detail);
      let title = detail.title;
      that.setState(
        {
          title: title,
          content: detail.content,
          prevUrl: detail.prevUrl,
          nextUrl: detail.nextUrl,
        },
        () => {
          that._saveBook();
          if (that.scrollRef != null) {
            that.scrollRef.scrollTo({x: 0, y: 0, animated: true});
          }
        },
      );
    }
  }

  // 记录阅读进度
  _saveBook() {
    let that = this;
    let bookId = this.state.bookInfo.bookId;

    // 保存阅读进度
    let book = {
      bookId: bookId,
      saveTime: new Date(),
      historyChapterTitle: that.state.title,
      chapterId: that.state.chapterId,
      historyChapterPage: that.state.page,
    };
    // console.log('记录进度');
    global.realm.saveBook(book);
  }

  // 保存章节列表
  _saveChapter() {
    let that = this;
    let bookId = this.state.bookInfo.bookId;
    global.loading.show();
    console.log('开始缓存目录');
    console.log(this.state.thisUrl);
    global.appApi
      .getChapterList(this.state.listUrl, bookId)
      .then(res => {
        console.log('章节总数：' + res.length);
        if (res.length > 0) {
          global.realm.saveChapter(res);
          let thisChapter = res[0];

          console.log('第一章：', thisChapter);
          that.setState(
            {
              page: 1,
              chapterId: thisChapter.chapterId,
              thisUrl: thisChapter.thisUrl,
              prevUrl: '',
              nextUrl: '',
              content: '',
              title: thisChapter.title,
            },
            () => {
              global.loading.hide();
              that._saveDetail();
            },
          );
        } else {
          alert('获取章节信息失败');
        }
      })
      .catch(error => {
        global.loading.hide();
        console.error(error);
      });
  }

  // 保存当前章的内容
  _saveDetail() {
    let that = this;
    global.loading.show();
    // console.log(this.state.thisUrl);
    console.log('开始请求内容');
    global.appApi
      .getChapter(this.state.thisUrl)
      .then(res => {
        // console.log(res);
        // 保存一章的明细
        let title = res.title ? res.title : that.state.title;
        let detail = {
          chapterId: that.state.chapterId,
          bookId: that.state.bookInfo.bookId,
          title: title,
          content: res.content,
          thisUrl: this.state.thisUrl,
          prevUrl: res.prevUrl,
          nextUrl: res.nextUrl,
        };
        if (isNull(detail.chapterId)) {
          console.log('主键缺失');
        } else {
          console.log('保存本章内容');
          global.realm.saveDetail(detail);
        }

        that._loadDetail(detail);
        global.loading.hide();
      })
      .catch(error => {
        global.loading.hide();
        console.error(error);
      });
  }

  // 初始加载
  componentDidMount() {
    // 如果有明细ID，直接从数据库获取本章内容
    // 否则缓存章节目录，并打开第一章
    console.log(this.state.bookInfo.chapterId);
    // 如果是第一次阅读这本书，缓存目录，并获取第一章
    if (isNull(this.state.bookInfo.chapterId)) {
      this._saveChapter();
    } else {
      this._loadDetail();
    }
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
