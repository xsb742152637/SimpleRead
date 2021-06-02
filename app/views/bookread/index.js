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
  TouchableOpacity,
  ScrollView,
  Button,
  BackHandler,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import MyIcon from '@/config/myIcon';
import {getId, textFormat, isNull} from '@/utils/function';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏

export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;

    console.log(bookInfo);
    this.scrollRef = null;
    this.state = {
      isSetting: false,
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
    // 将this传递到监听方法中，不然在这个方法中无法正确访问this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.scrollTop = bookInfo.historyChapterPage;
  }

  // 上一章/下一章
  _clickButton(type) {
    let that = this;
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

    this.scrollTop = 0;
    let chapter = global.realm.queryChapterByThisUrl(
      thisUrl,
      this.state.bookInfo.bookId,
    );
    if (isNull(chapter)) {
      console.log('没有找到缓存的目录', thisUrl, this.state.bookInfo.bookId);
      global.realm.deleteChapterByBookId(that.state.bookInfo.bookId);
      global.loading.show();
      console.log('开始缓存目录');
      console.log(this.state.thisUrl);
      global.appApi
        .getChapterList(this.state.listUrl, that.state.bookInfo.bookId)
        .then(res => {
          console.log('章节总数：' + res.length);
          if (res.length > 0) {
            global.realm.saveChapter(res);
            that.setState(
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
          } else {
            alert('获取章节信息失败');
          }
        })
        .catch(error => {
          global.loading.hide();
          console.error(error);
        });
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
            that.scrollRef.scrollTo({x: 0, y: that.scrollTop, animated: true});
          }
        },
      );
    }
  }

  // 记录阅读进度
  _saveBook(bookState) {
    let that = this;
    let bookId = this.state.bookInfo.bookId;

    if (isNull(bookState)) {
      bookState = this.state.bookInfo.bookState;
      console.log('没传入状态');
    }
    // 保存阅读进度
    let book = {
      bookId: bookId,
      saveTime: new Date(),
      historyChapterTitle: that.state.title,
      chapterId: that.state.chapterId,
      historyChapterPage: that.state.page,
      bookState: bookState,
    };
    console.log('记录进度');
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
    // 添加返回监听
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
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

  componentWillUnmount() {
    // 注销监听
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  // 页面返回触发的方法
  handleBackButtonClick() {
    console.log('退回');
    let that = this;
    if (this.state.bookInfo.bookState === 0) {
      global.popup.show(
        {
          content: (
            <Text
              style={{
                fontSize: StyleConfig.fontSize.base,
                color: StyleConfig.color.text,
              }}>
              是否加入书架？
            </Text>
          ),
          cancelText: '不了',
          confirmText: '立即加入',
        },
        res => {
          console.log(res);
          that._saveBook(1);
          //关闭Popup
          global.popup.hide();
        },
        res => {
          console.log('关闭弹窗');
          setTimeout(function () {
            // 如果有全局回调的key，执行回调
            if (this.state.bookInfo.callbackKey) {
              global.callbacks[this.state.bookInfo.callbackKey]();
            }
            // 关闭
            that.props.navigation.goBack();
          }, 300);
        },
      );
      return true;
    } else {
      // 如果有全局回调的key，执行回调
      if (this.state.bookInfo.callbackKey) {
        global.callbacks[this.state.bookInfo.callbackKey]();
      }
    }
    return false;
  }

  _clickScreen(e) {
    console.log('\n点击屏幕位置：', e.nativeEvent.pageX, e.nativeEvent.pageY);
    let pageX = e.nativeEvent.pageX;
    if (this.state.isSetting) {
      this.setState({isSetting: false});
      console.log('关闭设置');
    } else {
      if (pageX <= width * 0.3) {
        console.log('上一页');
      } else if (pageX >= width * 0.9) {
        console.log('下一页');
      } else {
        this.setState({isSetting: true});
        console.log('打开设置');
      }
    }
  }
  _header() {
    if (this.state.isSetting) {
      console.log('加载头');
      return (
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => this._goBack()}>
            <MyIcon
              name={'fanhuishangyizhang'}
              style={global.appStyles.headerIcon}
              size={StyleConfig.fontSize.icon}
            />
          </TouchableOpacity>
          <Text>我时头</Text>
        </View>
      );
    }
  }
  _onMomentumScrollEnd(e) {
    if (e.nativeEvent.contentOffset.y != this.scrollTop) {
      this.scrollTop = e.nativeEvent.contentOffset.y;
      let that = this;
      let bookId = this.state.bookInfo.bookId;

      // 保存阅读进度
      let book = {
        bookId: bookId,
        saveTime: new Date(),
        historyChapterPage: this.scrollTop,
      };
      console.log('记录滑动进度', this.scrollTop);
      global.realm.saveBook(book);
    }
  }
  _content() {
    return (
      <ScrollView
        ref={c => (this.scrollRef = c)}
        style={styles.myScrollView}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          this._onMomentumScrollEnd(e);
        }}>
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
    );
  }
  render() {
    return (
      <View style={styles.myView}>
        {/*<TouchableOpacity*/}
        {/*  activeOpacity={1}*/}
        {/*  onPress={event => this._clickScreen(event)}>*/}
        {/*  /!*{this._header()}*!/*/}
        {/*</TouchableOpacity>*/}
        {this._content()}
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
    width: width,
    height: height,
    backgroundColor: StyleConfig.color.headerBackground,
  },
  headerView: {
    position: 'absolute',
    width: width,
    height: StyleConfig.headerHeight,
    left: 0,
    top: 0,
  },
  myView: {
    padding: 6,
    backgroundColor: StyleConfig.color.headerBackground,
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
