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
  Modal,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  FlatList,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import MyIcon from '@/config/myIcon';
import {
  getId,
  textFormat,
  isNull,
  mergeSpace,
  contentFormat,
  cloneObj,
} from '@/utils/function';
const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏
import Back from '@/components/back';

export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;
    let readCF = cloneObj(global.realm.findConfig());
    this.state = {
      isLoad: true,
      isSetting: false,
      isChapter: false,
      bookInfo: bookInfo,
      key: bookInfo.bookName,
      chapterId: bookInfo.chapterId,
      thisUrl: '',
      contents: [],
      prevUrl: '',
      nextUrl: '',
      listUrl: bookInfo.chapterUrl,
      readCF: readCF,
      title: '',
      chapterOrder: false, // 目录排序方式
      chapterList: [], // 目录
      thisChapter: null,
      isSaveDetail: false, // 是否正在缓存，及缓存进度

      dayNight: readCF.dayNight,
      lineHeight: readCF.fontSize + readCF.fontSize * readCF.lineHeight,
      fontSize: readCF.fontSize,
      background: readCF.background,
      background2: readCF.dayNight === 1 ? '#1f1f1f' : readCF.background,
      selectedChapter: ['#9e7758', '#175b46'],
      textColor: ['#1f1f1f', '#7f7f7f'],
      selectedColor: ['#1f1f1f', '#7f7f7f'],

      logStr: '', // 翻页日志
    };

    this.details = [null, null, null];

    // 将this传递到监听方法中，不然在这个方法中无法正确访问this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.scrollRef = null;
    this.scrollRef_chapter = null;
    this.x =
      (isNull(bookInfo.historyChapterPage) ? 0 : bookInfo.historyChapterPage) *
      width; // 当前的偏移量
    this.x2 = this.x; // 当前的偏移量
    this.isShowLog = false; // 是否打印输出信息

    // console.log(bookInfo.historyChapterPage, width, this.x);
    if (this.isShowLog) {
      console.log(bookInfo);
    }

    // 每次最多缓存多少章，-1表示全部
    this.maxCache = 50;
    // 当前缓存了多少章了
    this.cacheProg = 0;
  }

  // 初始加载
  componentDidMount() {
    // 添加返回监听
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    this._loadDetail();
    // this._showChapter();
  }

  componentWillUnmount() {
    // 注销监听
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  // 上一章/下一章
  _changeChapter(type, isAuto) {
    let that = this;
    if (type) {
      if (isNull(this.details[0])) {
        global.toast.add('已经是第一章了……');
        return;
      }
      this.details[2] = cloneObj(this.details[1]);
      this.details[1] = cloneObj(this.details[0]);
      this.details[0] = null;
      if (isAuto) {
        this.x2 = this.details[1].pageNum * width;
      } else {
        // 手动点“上一章”按钮
        this.x2 = width;
      }
    } else {
      if (isNull(this.details[2])) {
        global.toast.add('已经是最后一章了……');
        return;
      }
      this.details[0] = cloneObj(this.details[1]);
      this.details[1] = cloneObj(this.details[2]);
      this.details[2] = null;
      this.x2 = width;
    }
    if (this.isShowLog) {
      // console.log(
      //   '翻页：',
      //   type,
      //   isAuto,
      //   this.details[1].title,
      //   Math.round(this.x2 / width),
      // );
    }
    this.setState(
      {
        isLoad: true,
        isSetting: false,
      },
      () => {
        that._loadDetail(that.details[1].chapterId, null);
      },
    );
  }

  // 记录阅读进度
  _saveBook(bookState) {
    let that = this;
    let bookId = this.state.bookInfo.bookId;

    if (isNull(bookState)) {
      bookState = this.state.bookInfo.bookState;
      if (this.isShowLog) {
        // console.log('没传入状态');
      }
    }
    // 保存阅读进度
    let book = {
      bookId: bookId,
      saveTime: new Date(),
      historyChapterTitle: that.details[1].title,
      chapterId: that.details[1].chapterId,
      historyChapterPage: Math.round(that.x / width),
      bookState: bookState,
    };
    console.log('记录进度', book, that.x, width);
    global.realm.saveBook(book);
  }

  // 页面返回触发的方法
  handleBackButtonClick() {
    console.log('退回');
    let that = this;
    if (this.state.bookInfo.bookState === 0) {
      global.alert.confirm(
        {
          okText: '立即加入',
          cancelText: '不了',
          message: '是否加入书架？',
        },
        () => {
          that._saveBook(1);
          that._closeAlter();
        },
        () => {
          that._closeAlter();
        },
      );
      return true;
    } else {
      // 如果有全局回调的key，执行回调
      if (that.state.bookInfo.callbackKey) {
        global.callbacks[that.state.bookInfo.callbackKey]();
      }
    }
    return false;
  }

  _closeAlter() {
    let that = this;
    setTimeout(function () {
      // 如果有全局回调的key，执行回调
      if (that.state.bookInfo.callbackKey) {
        global.callbacks[that.state.bookInfo.callbackKey]();
      }
      // 关闭
      that.props.navigation.goBack();
    }, 300);
  }

  // 请求html内容，并缓存
  _loadDetail(chapterId, thisUrl) {
    let that = this;
    if (isNull(thisUrl)) {
      chapterId = this.state.chapterId;
      thisUrl = this.state.thisUrl;
    }

    this.setState({contents: []}, () => {
      if (this.isShowLog) {
        console.log('初始加载', chapterId, thisUrl);
      }
      // 本章
      // console.log('开始加载当前章');
      setTimeout(() => {
        this._getDetail(this.details[1], chapterId, thisUrl)
          .then(thisDetail => {
            this.details[1] = thisDetail;

            let title = thisDetail.title;
            let thisDS = contentFormat(
              thisDetail.title + '\n\n' + thisDetail.content,
              that.state.fontSize,
              that.state.lineHeight,
            );
            thisDetail.pageNum = thisDS.length;

            // console.log('开始加载上一章');
            // // 上章
            this._getDetail(this.details[0], null, thisDetail.prevUrl)
              .then(prevDetail => {
                this.details[0] = prevDetail;

                if (!isNull(prevDetail)) {
                  let prevDS = contentFormat(
                    prevDetail.title + '\n\n' + prevDetail.content,
                    that.state.fontSize,
                    that.state.lineHeight,
                  );
                  prevDetail.pageNum = prevDS.length;
                  // 上一章的最后一页添加到当前章的最前面
                  thisDS.unshift(prevDS[prevDS.length - 1]);
                } else {
                  // 上一章的最后一页添加到当前章的最前面
                  thisDS.unshift(this.state.bookInfo.bookName.split(''));
                }

                // console.log('开始加载下一章');
                // 下章
                this._getDetail(this.details[2], null, thisDetail.nextUrl)
                  .then(nextDetail => {
                    this.details[2] = nextDetail;

                    if (!isNull(nextDetail)) {
                      let nextDS = contentFormat(
                        nextDetail.title + '\n\n' + nextDetail.content,
                        that.state.fontSize,
                        that.state.lineHeight,
                      );
                      nextDetail.pageNum = nextDS.length;
                      // 下一章的第一页添加到当前章的最后面
                      thisDS.push(nextDS[0]);
                    }

                    // console.log(
                    //   that.details[0].title,
                    //   that.details[0].pageNum,
                    //   that.details[1].title,
                    //   that.details[1].pageNum,
                    //   that.details[2].title,
                    //   that.details[2].pageNum,
                    // );
                    that.setState(
                      {
                        isLoad: false,
                        title: title,
                        contents: thisDS,
                        chapterId: thisDetail.chapterId,
                        thisUrl: thisDetail.thisUrl,
                        prevUrl: thisDetail.prevUrl,
                        nextUrl: thisDetail.nextUrl,
                      },
                      () => {
                        that._saveBook();

                        if (this.isShowLog) {
                          console.log(
                            '偏移：',
                            Math.round(this.x2 / width),
                            this.x,
                          );
                        }

                        let p = Math.round(this.x2 / width);
                        // console.log('点击：', p, this.state.contents.length, this.x);
                        let logStr =
                          p +
                          ' ' +
                          this.state.bookInfo.historyChapterPage +
                          ' ' +
                          this.state.contents.length;
                        this.setState({
                          logStr: logStr,
                        });

                        if (that.scrollRef) {
                          setTimeout(() => {
                            that.scrollRef.scrollToOffset({
                              offset: that.x2,
                              animated: false,
                            });
                          }, 50);
                        }
                      },
                    );
                  })
                  .catch(error => {
                    console.log(error);
                  });
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      }, 100);
    });
  }

  // 得到小说内容
  _getDetail(det, chapterId, thisUrl) {
    return new Promise((resolve, reject) => {
      if (det != null) {
        resolve(det);
      } else if (isNull(chapterId) && isNull(thisUrl)) {
        resolve(null);
      } else {
        let that = this;
        let bookId = this.state.bookInfo.bookId;
        let chapter = null;
        // 是否有目录缓存
        if (!isNull(chapterId)) {
          chapter = global.realm.findChapter(chapterId);
          if (this.isShowLog) {
            console.log('根据ID找到的：', chapter);
          }
        } else if (!isNull(thisUrl)) {
          chapter = global.realm.queryChapterByThisUrl(thisUrl, bookId);
          if (this.isShowLog) {
            console.log('根据路径找到的：', chapter);
          }
        }
        let isRequestList = isNull(chapter);
        // 目录无缓存
        if (isRequestList) {
          if (this.isShowLog) {
            console.log(
              '没有找到缓存的目录，删除该小说所有缓存目录和小说内容',
              thisUrl,
              bookId,
            );
          }
          // console.log('没有找到目录', thisUrl);
          global.realm.deleteChapterByBookId(bookId);
        } else if (this.isShowLog) {
          console.log('找到了目录', chapter);
        }

        global.appApi
          .getChapterList(isRequestList, this.state.listUrl, bookId)
          .then(res => {
            let detail = null;
            if (isRequestList && res.length > 0) {
              console.log('章节总数：' + res.length);
              chapter = res[0];
            } else {
              // 小说内容是否有缓存
              detail = that._findDetail(bookId, chapter);
            }

            // 小说明细没有缓存
            let isRequestDetail = isNull(detail);
            global.appApi
              .getChapter(
                isRequestDetail,
                chapter.thisUrl,
                bookId,
                chapter.chapterId,
                chapter.title,
              )
              .then(res => {
                if (isRequestDetail) {
                  detail = res;
                }
                resolve(detail);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  // 显示目录
  _showChapter(chapterOrder) {
    if (isNull(chapterOrder)) {
      chapterOrder = false;
    }
    let chapter = null;
    if (!isNull(this.details[1])) {
      chapter = global.realm.findChapter(this.details[1].chapterId);
    }

    if (this.scrollRef_chapter) {
      let x =
        !isNull(this.state.thisChapter) && !chapterOrder
          ? this.state.thisChapter.orderNum * 41
          : 0;
      // console.log(x, chapterOrder);
      this.scrollRef_chapter.scrollToOffset({
        offset: x,
        animated: false,
      });
    }

    // console.log('显示目录');
    this.setState({
      isChapter: true,
      isSetting: false,
      isSaveDetail: false,
      chapterOrder: chapterOrder,
      thisChapter: chapter,
      chapterList: global.realm.queryChapterByBookId(
        this.state.bookInfo.bookId,
        chapterOrder,
      ),
    });
  }

  _changeLeft(isLeft) {
    let readCF = this.state.readCF;
    readCF.isLeft = isLeft;
    console.log('翻页方式:', isLeft);
    global.realm.saveConfig(readCF);
    this.setState({
      isSetting: false,
      readCF: readCF,
    });
  }
  _changeFontSize(fontSize, lineHeight) {
    let readCF = this.state.readCF;
    if (fontSize != null) {
      readCF.fontSize = fontSize;
    }
    if (lineHeight != null) {
      readCF.lineHeight = lineHeight;
    }
    // console.log('改变字体:', fontSize);
    global.realm.saveConfig(readCF);
    this.setState(
      {
        isLoad: true,
        readCF: readCF,
        fontSize: readCF.fontSize,
        lineHeight: readCF.fontSize + readCF.fontSize * readCF.lineHeight,
      },
      () => {
        this._loadDetail();
      },
    );
  }

  _changeBackground(color, dayNight) {
    let readCF = this.state.readCF;
    if (dayNight === 0) {
      readCF.background = color;
    } else if (dayNight === 2) {
      // 再次点击夜间模式时，关闭夜间模式
      dayNight = 0;
      color = readCF.background;
    }
    readCF.dayNight = dayNight;
    // console.log('改变背景:', color, dayNight);
    global.realm.saveConfig(readCF);
    this.setState({
      isSetting: false,
      readCF: readCF,
      dayNight: dayNight,
      background: readCF.background,
      background2: color,
    });
  }

  _handleScroll(e) {
    this.x = e.nativeEvent.contentOffset.x;
  }

  _onScrollEndDrag() {
    // console.log('翻页');
  }

  _showControlStation_LR(evt) {
    // console.log('点击', evt.nativeEvent.pageX, evt.nativeEvent.pageY);
    if (
      evt.nativeEvent.pageX > width * 0.3 &&
      evt.nativeEvent.pageX < width * 0.6
    ) {
      // console.log('点击中间');
      this.setState({isSetting: !this.state.isSetting});
    } else if (!this.state.isLoad) {
      if (evt.nativeEvent.pageX <= width * 0.3) {
        if (this.state.readCF.isLeft === 1) {
          this.x += width;
        } else {
          this.x -= width;
        }
        // 向前翻页
        this.scrollRef.scrollToOffset({
          offset: this.x,
          animated: true,
        });
      } else if (evt.nativeEvent.pageX >= width * 0.6) {
        if (this.state.readCF.isLeft === 1) {
          this.x -= width;
        } else {
          this.x += width;
        }
        // 向后翻页
        this.scrollRef.scrollToOffset({
          offset: this.x,
          animated: true,
        });
      }

      let p = Math.round(this.x / width);
      // console.log('点击：', p, this.state.contents.length, this.x);
      // let logStr = p + ' ' + this.state.contents.length;
      // this.setState({
      //   logStr: logStr,
      // });
      if (p <= -1) {
        this._changeChapter(true, true);
      } else if (p >= this.state.contents.length - 1) {
        this._changeChapter(false, true);
      } else {
        this._saveBook();
      }
    }
  }

  _ListEmptyComponent() {
    return (
      <TouchableOpacity
        style={{
          width: width,
          height: height,
          justifyContent: 'center',
          display: 'flex',
        }}
        activeOpacity={1}
        onPress={() => {
          this.setState({isSetting: !this.state.isSetting});
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: this.state.textColor[this.state.dayNight],
            fontSize: this.state.fontSize,
            lineHeight: this.state.lineHeight,
          }}>
          {this.state.isLoad ? '正在加载……' : '暂无数据'}
        </Text>
      </TouchableOpacity>
    );
  }
  _onDismiss() {
    this.setState({isSetting: !this.state.isSetting});
  }
  _onRequestClose() {
    this.handleBackButtonClick();
    this.props.navigation.goBack();
  }
  _onDismiss2() {
    this.setState({isChapter: !this.state.isChapter});
  }

  _findDetail(bookId, chapter) {
    let detail = global.realm.findDetail(chapter.chapterId);
    // console.log('根据ID找内容');
    if (isNull(detail)) {
      detail = global.realm.queryDetailByThisUrl(chapter.thisUrl, bookId);
      // console.log('根据路径找内容');
    }
    return detail;
  }
  _saveDetails() {
    if (this.state.isSaveDetail === false) {
      // 正序查询全部小说目录
      let list = global.realm.queryChapterByBookId(
        this.state.bookInfo.bookId,
        false,
      );
      this._saveDetails2(this.state.bookInfo.bookId, list, 0, false);
    }
  }
  _saveDetails2(bookId, list, index, isStart) {
    let that = this;
    if (
      (that.maxCache > 0 && that.cacheProg >= that.maxCache) ||
      index >= list.length - 1
    ) {
      console.log(that.cacheProg, index, list.length);
      that.setState({isSaveDetail: true}, () => {
        if (that.state.isChapter) {
          that._showChapter();
        }
      });
      return;
    }
    let i = ++index;
    let chapter = list[index];
    // 从当前章节之后才开始缓存
    if (that.isShowLog) {
      console.log(
        'ID是否相等：',
        chapter.chapterId === that.state.chapterId,
        '路径是否相等：',
        chapter.thisUrl === that.state.thisUrl,
      );
    }
    if (!isStart) {
      that._saveDetails2(
        bookId,
        list,
        i,
        chapter.chapterId === that.state.chapterId ||
          chapter.thisUrl === that.state.thisUrl,
      );
    } else {
      // 小说内容是否有缓存
      let detail = that._findDetail(bookId, chapter);
      global.appApi
        .getChapter(
          isNull(detail),
          chapter.thisUrl,
          bookId,
          chapter.chapterId,
          chapter.title,
        )
        .then(res => {
          if (!isNull(res)) {
            if (this.isShowLog) {
              console.log(that.cacheProg + '下载成功：' + res.title);
            }
            that.cacheProg++;
            if (that.state.isChapter) {
              that.scrollRef_chapter.scrollToOffset({
                offset: chapter.orderNum * 41,
                animated: true,
              });
            }

            that.setState({isSaveDetail: [i, list.length]}, () => {
              setTimeout(() => {
                that._saveDetails2(bookId, list, i, isStart);
              }, 1000);
            });
          } else {
            if (this.isShowLog) {
              console.log(i + '存在缓存：' + detail.title);
            }
            if (that.state.isChapter) {
              that.scrollRef_chapter.scrollToOffset({
                offset: chapter.orderNum * 41,
                animated: true,
              });
            }

            that._saveDetails2(bookId, list, i, isStart);
          }
        })
        .catch(error => {
          alert(JSON.stringify(error));
        });
    }
  }

  renderContentList() {
    return (
      <FlatList
        // initialScrollIndex={this.state.contents.length > 0 ? 1 : 0}
        // getItemLayout={(data, index) => ({
        //   length: width,
        //   offset: width * index,
        //   index,
        // })}
        // initialNumToRender={100}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={c => (this.scrollRef = c)}
        onScroll={this._handleScroll.bind(this)}
        onScrollEndDrag={this._onScrollEndDrag.bind(this)}
        data={this.state.contents}
        keyExtractor={(value, index) => index}
        renderItem={this.renderContent.bind(this)}
        ListEmptyComponent={this._ListEmptyComponent()}
      />
    );
  }
  //当前页正文
  renderContent(rowData) {
    let p = '';
    let c = '';
    let t = '';
    if (rowData.index == 0) {
      if (isNull(this.details[0])) {
        p = 1;
        c = 1;
        t = '';
      } else {
        p = this.details[0].pageNum;
        c = this.details[0].pageNum;
        t = this.details[0].title;
      }
    } else if (
      rowData.index == this.state.contents.length - 1 &&
      !isNull(this.details[2])
    ) {
      p = 1;
      c = this.details[2].pageNum;
      t = this.details[2].title;
    } else if (!isNull(this.details[1])) {
      p = rowData.index;
      c = this.details[1].pageNum;
      t = this.details[1].title;
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          width: width,
          height: height - StatusBar.currentHeight,
          paddingTop: 10,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: this.state.background2,
        }}
        onStartShouldSetResponder={() => true}
        onResponderRelease={evt => {
          this._showControlStation_LR(evt);
        }}>
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            // borderStyle: 'solid',
            // borderWidth: 1,
            // borderColor: 'blue',
          }}>
          {rowData.item
            ? rowData.item.map((value, index) => {
                return (
                  <Text
                    style={{
                      color: this.state.textColor[this.state.dayNight],
                      fontSize: this.state.fontSize,
                      lineHeight: this.state.lineHeight,
                    }}
                    key={index}>
                    {value ? value : ' '}
                  </Text>
                );
              })
            : null}
        </View>
        <View
          style={{
            marginBottom: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 5,
          }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: this.state.textColor[this.state.dayNight],
              fontSize: 12,
            }}>
            {t}
          </Text>
          {this.renderLeft()}
          {this.renderCacheProg()}
          <Text
            style={{
              color: this.state.textColor[this.state.dayNight],
              fontSize: 12,
            }}>
            {this.state.logStr + ' 第 ' + p + '/' + c + ' 页 '}
          </Text>
        </View>
      </View>
    );
  }
  renderLeft() {
    if (this.state.readCF.isLeft === 1) {
      return (
        <Text
          style={{
            color: this.state.textColor[this.state.dayNight],
            fontSize: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: 'solid',
            width: 18,
            height: 18,
            textAlign: 'center',
            borderColor: this.state.selectedColor[this.state.dayNight],
          }}>
          左
        </Text>
      );
    }
  }
  renderCacheProg() {
    if (this.state.isSaveDetail != false && this.state.isSaveDetail != true) {
      return (
        <Text
          style={{
            color: this.state.textColor[this.state.dayNight],
            fontSize: 12,
          }}>
          {'缓' + this.cacheProg + ' '}
        </Text>
      );
    }
  }
  readerChapters() {
    return (
      <Modal
        animationType="fade" // 淡入淡出
        transparent={true} // 背景透明
        visible={this.state.isChapter} // 是否显示
        onDismiss={this._onDismiss2.bind(this)}
        onRequestClose={this._onDismiss2.bind(this)}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: width,
            height: height,
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={[
              global.appStyles.padding,
              {
                flex: 1,
                backgroundColor: this.state.background2,
              },
            ]}>
            <Text
              style={{
                paddingBottom: StyleConfig.padding.baseTop,
                paddingTop: StyleConfig.padding.baseTop,
                color: this.state.textColor[this.state.dayNight],
                fontSize: StyleConfig.fontSize.base,
              }}>
              {this.state.bookInfo.bookName}
            </Text>
            <Text
              style={{
                paddingBottom: StyleConfig.padding.baseTop,
                paddingTop: StyleConfig.padding.baseTop,
                color: this.state.textColor[this.state.dayNight],
                textAlign: 'right',
              }}
              onPress={() => {
                this._showChapter(!this.state.chapterOrder);
              }}>
              {this.state.chapterOrder ? '正序' : '倒序'}
            </Text>
            <FlatList
              initialScrollIndex={
                !isNull(this.state.thisChapter) && !this.state.chapterOrder
                  ? this.state.thisChapter.orderNum
                  : 0
              }
              getItemLayout={(data, index) => ({
                length: 41,
                offset: 41 * index,
                index,
              })}
              // initialNumToRender={100}
              showsVerticalScrollIndicator={false}
              ref={c => (this.scrollRef_chapter = c)}
              data={this.state.chapterList}
              keyExtractor={item => item.chapterId}
              renderItem={({item}) => this.readerChapterItem(item)}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: 'rgba(186,186,186,0.4)',
                    }}
                  />
                );
              }}
            />
            <Text
              style={{
                paddingBottom: StyleConfig.padding.baseTop * 4,
                paddingTop: StyleConfig.padding.baseTop,
                color: this.state.textColor[this.state.dayNight],
                textAlign: 'center',
              }}
              onPress={() => {
                this._saveDetails();
              }}>
              <MyIcon
                name={'xiazai'}
                style={{
                  color: this.state.textColor[this.state.dayNight],
                }}
                size={StyleConfig.fontSize.icon}
              />
              {this.state.isSaveDetail === false
                ? '  下载后面' +
                  (this.maxCache == -1 ? '全部' : this.maxCache) +
                  '章，没网也能看'
                : this.state.isSaveDetail === true
                ? '  下载完成'
                : '  下载进度：' +
                  this.cacheProg +
                  ' / ' +
                  this.state.isSaveDetail[0] +
                  ' / ' +
                  this.state.isSaveDetail[1]}
            </Text>
          </View>
          <Text
            style={{
              width: 80,
              height: height,
            }}
            onPress={() => {
              this._onDismiss2();
            }}
          />
        </View>
      </Modal>
    );
  }
  readerChapterItem(data) {
    return (
      <TouchableOpacity
        style={{
          height: 40,
          justifyContent: 'center',
          display: 'flex',
        }}
        activeOpacity={1}
        onPress={() => {
          this.details = [null, null, null];
          this.x2 = width;
          let that = this;
          this.setState(
            {
              isLoad: true,
              isChapter: false,
            },
            () => {
              that.x = 0;
              that._loadDetail(data.chapterId, data.thisUrl);
            },
          );
        }}>
        <Text
          numberOfLines={1}
          style={{
            color:
              !isNull(this.state.thisChapter) &&
              this.state.thisChapter.chapterId == data.chapterId
                ? this.state.selectedChapter[this.state.dayNight]
                : this.state.textColor[this.state.dayNight],
            fontSize: StyleConfig.fontSize.titleText,
            opacity: data.isSave == 1 ? 1 : 0.6,
          }}>
          {data.title}
        </Text>
      </TouchableOpacity>
    );
  }

  readerSetting() {
    let lhs = [
      {text: '极窄', num: 0.2},
      {text: '默认', num: 0.7},
      {text: '略宽', num: 1},
    ];
    let bcs = ['#edefee', '#d8d1bf', '#d7dcc8', '#cad0de'];
    return (
      <Modal
        animationType="fade" // 淡入淡出
        transparent={true} // 背景透明
        visible={this.state.isSetting} // 是否显示
        onDismiss={this._onDismiss.bind(this)}
        onRequestClose={this._onRequestClose.bind(this)}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: width,
            height: height,
          }}>
          <View
            style={[
              global.appStyles.header,
              {
                borderBottomColor: this.state.background2,
                backgroundColor: this.state.background2,
              },
            ]}>
            <Back navigation={this.props.navigation} />
          </View>
          <Text
            style={{
              flex: 1,
              width: width,
            }}
            onPress={() => {
              this._onDismiss();
            }}
          />
          <View
            style={[
              global.appStyles.header,
              {
                height: 'auto',
                width: width,
                flexDirection: 'column',
                paddingTop: StyleConfig.padding.baseTop,
                paddingBottom: StyleConfig.padding.baseTop * 3,
                borderBottomColor: this.state.background2,
                backgroundColor: this.state.background2,
              },
            ]}>
            <View style={styles.st_row}>
              <Text
                style={{color: this.state.textColor[this.state.dayNight]}}
                onPress={() => {
                  this._changeChapter(true, false);
                }}>
                上一章
              </Text>
              <Text
                style={{color: this.state.textColor[this.state.dayNight]}}
                onPress={() => {
                  this._showChapter();
                }}>
                目录
              </Text>
              <Text
                style={{color: this.state.textColor[this.state.dayNight]}}
                onPress={() => {
                  this._changeChapter(false, false);
                }}>
                下一章
              </Text>
            </View>
            <View style={styles.st_row}>
              <Text style={{color: this.state.textColor[this.state.dayNight]}}>
                翻页
              </Text>
              <Text
                style={[
                  styles.st_lh,
                  {
                    color: this.state.textColor[this.state.dayNight],
                    borderColor: this._getBorderColor(
                      this.state.readCF.isLeft === 1,
                    ),
                  },
                ]}
                onPress={() => {
                  this._changeLeft(1);
                }}>
                左手
              </Text>
              <Text style={{width: 70}} />
              <Text
                style={[
                  styles.st_lh,
                  {
                    color: this.state.textColor[this.state.dayNight],
                    borderColor: this._getBorderColor(
                      this.state.readCF.isLeft === 0,
                    ),
                  },
                ]}
                onPress={() => {
                  this._changeLeft(0);
                }}>
                右手
              </Text>
            </View>
            <View style={styles.st_row}>
              <Text style={{color: this.state.textColor[this.state.dayNight]}}>
                行距
              </Text>
              {lhs.map((value, index) => {
                return (
                  <Text
                    key={index}
                    style={[
                      styles.st_lh,
                      {
                        color: this.state.textColor[this.state.dayNight],
                        borderColor: this._getBorderColor(
                          this.state.fontSize +
                            this.state.fontSize * value.num ===
                            this.state.lineHeight,
                        ),
                      },
                    ]}
                    onPress={() => {
                      this._changeFontSize(null, value.num);
                    }}>
                    {value.text}
                  </Text>
                );
              })}
            </View>
            <View style={styles.st_row}>
              <Text style={{color: this.state.textColor[this.state.dayNight]}}>
                字号
              </Text>
              <Text
                style={[
                  styles.st_lh,
                  {
                    borderColor: this.state.background2,
                    color: this.state.textColor[this.state.dayNight],
                  },
                ]}
                onPress={() => {
                  this._changeFontSize(this.state.fontSize - 1, null);
                }}>
                -
              </Text>
              <Text
                style={{
                  width: 70,
                  textAlign: 'center',
                  color: this.state.textColor[this.state.dayNight],
                }}>
                {this.state.fontSize}
              </Text>
              <Text
                style={[
                  styles.st_lh,
                  {
                    borderColor: this.state.background2,
                    color: this.state.textColor[this.state.dayNight],
                  },
                ]}
                onPress={() => {
                  this._changeFontSize(this.state.fontSize + 1, null);
                }}>
                +
              </Text>
            </View>
            <View style={styles.st_row}>
              <View>
                <Text
                  style={{color: this.state.textColor[this.state.dayNight]}}>
                  背景
                </Text>
              </View>
              {bcs.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.st_bb,
                      {
                        borderRadius: 16,
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor:
                          value === this.state.background
                            ? this.state.selectedColor[this.state.dayNight]
                            : value,
                        backgroundColor: value,
                      },
                    ]}>
                    <Text
                      style={styles.st_bb}
                      onPress={() => {
                        this._changeBackground(value, 0);
                      }}
                    />
                  </View>
                );
              })}
              <View
                style={[
                  styles.st_bb,
                  {
                    borderRadius: 16,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor:
                      this.state.dayNight === 1
                        ? this.state.selectedColor[this.state.dayNight]
                        : '#1f1f1f',
                    backgroundColor: '#1f1f1f',
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this._changeBackground(
                      '#1f1f1f',
                      this.state.dayNight === 1 ? 2 : 1,
                    );
                  }}>
                  <MyIcon
                    name={'yejianmoshi'}
                    style={{
                      color: '#7f7f7f',
                    }}
                    size={15}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  _getBorderColor(type) {
    return type
      ? this.state.selectedColor[this.state.dayNight]
      : this.state.background2;
  }
  render() {
    return (
      <View style={[styles.content, {backgroundColor: this.state.background2}]}>
        <StatusBar
          backgroundColor={this.state.background2}
          barStyle={StyleConfig.color.headerText}
          hidden={false}
          animated={true}
          translucent={false}
          showHideTransition={'slide'}
        />
        <View style={{width: width, height: height}}>
          {this.renderContentList()}
        </View>
        {this.readerSetting()}
        {this.readerChapters()}
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
  },
  headerView: {
    position: 'absolute',
    width: width,
    height: StyleConfig.headerHeight,
    left: 0,
    top: 0,
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
  st_row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    paddingBottom: StyleConfig.padding.baseTop * 2,
  },
  st_lh: {
    width: 70,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(239,239,239,1)',
    borderRadius: StyleConfig.radius.button,
    backgroundColor:
      'rgba(239,239,239,' + StyleConfig.opacity.buttonBackground + ')',
    paddingTop: StyleConfig.padding.text,
    paddingBottom: StyleConfig.padding.text,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  st_bb: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
});
