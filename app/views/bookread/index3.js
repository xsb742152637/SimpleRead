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
  ScrollView,
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
import {NavigationContainer} from '@react-navigation/native';

export default class BookRead3 extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;
    let readCF = cloneObj(global.realm.findConfig());
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
      contents: [],
      readCF: readCF,
      title: '',

      dayNight: readCF.dayNight,
      lineHeight: readCF.fontSize + readCF.fontSize * readCF.lineHeight,
      fontSize: readCF.fontSize,
      background: readCF.background,
      background2: readCF.dayNight === 1 ? '#111111' : readCF.background,
      textColor: ['#111111', '#767676'],
      selectedColor: ['#111111', '#767676'],
    };
    console.log('aaa:' ,this.state.fontSize, this.state.lineHeight,readCF.lineHeight);
    // 将this传递到监听方法中，不然在这个方法中无法正确访问this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.historyChapterPage = bookInfo.historyChapterPage;
    this.scrollRef = null;
    this.x = 0; // 当前的偏移量
  }

  // 上一章/下一章
  _changeChapter(type) {
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

    this.historyChapterPage = 0;
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

  // 显示目录
  _showChapter() {
    console.log('显示目录');
  }
  _changeFontSize(fontSize, lineHeight) {
    let readCF = this.state.readCF;
    if (fontSize != null) {
      readCF.fontSize = fontSize;
    }
    if (lineHeight != null) {
      readCF.lineHeight = lineHeight;
    }
    console.log('改变字体:', fontSize);
    global.realm.saveConfig(readCF);
    this.setState(
      {
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
    console.log('改变背景:', color, dayNight);
    global.realm.saveConfig(readCF);
    this.setState({
      readCF: readCF,
      dayNight: dayNight,
      background: readCF.background,
      background2: color,
    });
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

      let contents = contentFormat(
        detail.title + '\n\n' + detail.content,
        that.state.fontSize,
        that.state.lineHeight,
      );
      that.setState(
        {
          title: title,
          contents: contents,
          prevUrl: detail.prevUrl,
          nextUrl: detail.nextUrl,
        },
        () => {
          that._saveBook();

          this.scrollRef.scrollToOffset({
            offset: that.historyChapterPage - width,
            animated: true,
          });
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

  _handleScroll(e) {
    // console.log('_handleScroll');
    this.x = e.nativeEvent.contentOffset.x;
  }
  _onScrollEndDrag() {
    console.log('翻页');
  }
  _showControlStation_LR(evt) {
    console.log('点击', evt.nativeEvent.pageX, evt.nativeEvent.pageY);
    if (evt.nativeEvent.pageX <= width * 0.3) {
      this.scrollRef.scrollToOffset({
        offset: this.x - width,
        animated: true,
      });
    } else if (evt.nativeEvent.pageX >= width * 0.6) {
      this.scrollRef.scrollToOffset({
        offset: this.x + width,
        animated: true,
      });
    } else {
      console.log('点击中间');
      this.setState({isSetting: !this.state.isSetting});
    }
  }

  _content() {
    return (
      <FlatList
        pagingEnabled={true}
        horizontal={true}
        initialNumToRender={100}
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
    return (
      <View>
        <TouchableOpacity
          style={{
            flex: 1,
            width: width,
            backgroundColor: this.state.background2,
          }}
          activeOpacity={1}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              width: width,
              height: height,
              paddingTop: 10,
            }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={evt => {
              this._showControlStation_LR(evt);
            }}>
            <View style={{alignSelf: 'center', flex: 1}}>
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
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
              }}>
              {/*<Text style={{fontSize: 12}}>{this.state.time}</Text>*/}
              <Text style={{fontSize: 12}}>
                {' 第 ' +
                  (rowData.index + 1) +
                  '/' +
                  this.state.contents.length +
                  ' 页 '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  _ListEmptyComponent() {
    return <Text>暂无数据</Text>;
  }
  _onShow() {
    console.log('显示弹出框');
  }
  _onDismiss() {
    console.log('关闭弹出框');
  }
  _onRequestClose() {
    console.log('返回按钮');
    this.setState({isSetting: !this.state.isSetting});
  }
  readerSetting() {
    let lhs = [
      {text: '窄', num: 0.2},
      {text: '默认', num: 0.5},
      {text: '宽', num: 1},
    ];
    let bcs = ['#edefee', '#d8d1bf', '#d7dcc8', '#cad0de'];
    return (
      <Modal
        animationType="fade" // 淡入淡出
        transparent={true} // 背景透明
        visible={this.state.isSetting} // 是否显示
        onShow={this._onShow.bind(this)}
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
              this._onRequestClose();
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
                        borderColor:
                          this.state.fontSize + this.state.fontSize * value.num === this.state.lineHeight
                            ? 'rgba(45,52,58,' +
                              StyleConfig.opacity.buttonBackground +
                              ')'
                            : 'rgba(239,239,239,' +
                              StyleConfig.opacity.buttonBackground +
                              ')',
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
                  {color: this.state.textColor[this.state.dayNight]},
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
                  {color: this.state.textColor[this.state.dayNight]},
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
                        : '#111111',
                    backgroundColor: '#111111',
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this._changeBackground(
                      '#111111',
                      this.state.dayNight === 1 ? 2 : 1,
                    );
                  }}>
                  <MyIcon
                    name={'yejianmoshi'}
                    style={{
                      color: '#767676',
                    }}
                    size={15}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.st_row}>
              <Text
                style={{color: this.state.textColor[this.state.dayNight]}}
                onPress={() => {
                  this._changeChapter(true);
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
                  this._changeChapter(false);
                }}>
                下一章
              </Text>
            </View>
            {/*<View style={styles.st_row}>翻页</View>*/}
          </View>
        </View>
      </Modal>
    );
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
        <View style={{width: width, height: height}}>{this._content()}</View>
        {this.readerSetting()}
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
    borderColor:
      'rgba(239,239,239,' + StyleConfig.opacity.buttonBackground + ')',
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
