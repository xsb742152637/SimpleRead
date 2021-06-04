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

export default class BookRead3 extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;
    let readCF = cloneObj(global.realm.findConfig());
    this.state = {
      isSetting: false,
      isChapter: false,
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
      chapterOrder: false, // 目录排序方式
      chapterList: [], // 目录

      dayNight: readCF.dayNight,
      lineHeight: readCF.fontSize + readCF.fontSize * readCF.lineHeight,
      fontSize: readCF.fontSize,
      background: readCF.background,
      background2: readCF.dayNight === 1 ? '#111111' : readCF.background,
      textColor: ['#111111', '#767676'],
      selectedColor: ['#111111', '#767676'],
    };
    // 将this传递到监听方法中，不然在这个方法中无法正确访问this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.historyChapterPage = bookInfo.historyChapterPage;
    this.scrollRef = null;
    this.scrollRef_chapter = null;
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

    this._loadDetail(null, thisUrl);
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

  // 初始加载
  componentDidMount() {
    // 添加返回监听
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    this._loadDetail();
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

  // 请求html内容，并缓存
  _loadDetail(chapterId, thisUrl) {
    if (isNull(thisUrl)) {
      chapterId = this.state.chapterId;
      thisUrl = this.state.thisUrl;
    }
    let that = this;
    this._getDetail(chapterId, thisUrl)
      .then(detail => {
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  // 得到小说内容
  _getDetail(chapterId, thisUrl) {
    let that = this;
    let bookId = this.state.bookInfo.bookId;
    let chapter = null;
    // 是否有目录缓存
    if (!isNull(chapterId)) {
      chapter = global.realm.findChapter(chapterId);
    } else if (!isNull(thisUrl)) {
      chapter = global.realm.queryChapterByThisUrl(thisUrl, bookId);
    }
    let isRequestList = isNull(chapter);
    // 目录无缓存
    if (isRequestList) {
      // console.log('没有找到缓存的目录，删除该小说所有缓存目录和小说内容', thisUrl, bookId);
      global.realm.deleteChapterByBookId(bookId);
    }
    return new Promise((resolve, reject) => {
      global.appApi
        .getChapterList(isRequestList, this.state.listUrl, bookId)
        .then(res => {
          let detail = null;
          if (isRequestList && res.length > 0) {
            console.log('章节总数：' + res.length);
            chapter = res[0];
          } else {
            // 小说内容是否有缓存
            detail = global.realm.findDetail(chapter.chapterId);
            console.log('根据ID找内容');
            if (isNull(detail)) {
              detail = global.realm.queryDetailByThisUrl(
                chapter.thisUrl,
                bookId,
              );
              console.log('根据路径找内容');
            }
          }

          // 小说明细没有缓存
          let isRequestDetail = isNull(detail);
          global.appApi
            .getChapter(
              isRequestDetail,
              that.state.thisUrl,
              bookId,
              chapter.chapterId,
              that.state.title,
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
    });
  }

  // 显示目录
  _showChapter() {
    console.log('显示目录');
    this.setState({
      isChapter: true,
      isSetting: false,
      chapterList: global.realm.queryChapterByBookId(
        this.state.bookInfo.bookId,
        this.state.chapterOrder,
      ),
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

  _handleScroll(e) {
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

  _ListEmptyComponent() {
    return <Text>暂无数据</Text>;
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
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          width: width,
          height: height - StatusBar.currentHeight,
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
          <Text style={{fontSize: 12}} />
          <Text style={{fontSize: 12}}>
            {' 第 ' +
              (rowData.index + 1) +
              '/' +
              this.state.contents.length +
              ' 页 '}
          </Text>
        </View>
      </View>
    );
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
                textAlign: 'right',
              }}
              onPress={() => {
                this._changeOrder();
              }}>
              {this.state.chapterOrder ? '正序' : '倒序'}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              ref={c => (this.scrollRef_chapter = c)}
              data={this.state.chapterList}
              keyExtractor={item => item.chapterId}
              renderItem={({item}) => this._getItem(item)}
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
  _getItem(data) {
    return (
      <Text
        style={{
          paddingBottom: StyleConfig.padding.baseTop,
          paddingTop: StyleConfig.padding.baseTop,
          color: this.state.textColor[this.state.dayNight],
          fontSize: StyleConfig.fontSize.titleText,
        }}
        onPress={() => {
          this._loadDetail(data.chapterId, data.thisUrl);
        }}>
        {data.title}
      </Text>
    );
  }
  _changeOrder() {
    let that = this;
    this.setState(
      {
        chapterOrder: !this.state.chapterOrder,
      },
      () => {
        that._showChapter();
      },
    );
  }

  readerSetting() {
    let lhs = [
      {text: '窄', num: 0.2},
      {text: '默认', num: 0.7},
      {text: '宽', num: 1},
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
                          this.state.fontSize +
                            this.state.fontSize * value.num ===
                          this.state.lineHeight
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
