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
import {goBack} from '@utils/function';
import cheerio from 'cheerio';
import storage from '@config/storage';
import StyleConfig from '@config/styleConfig';
import AppApi from '@utils/api';
import Toast from '@utils/load/toast';
import Loading from '@utils/load/loading';

export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    let bookInfo = this.props.route.params;

    // console.log(bookInfo);
    this.scrollViewRef = null;
    this.state = {
      bookInfo: bookInfo,
      key: bookInfo.name,
      thisUrl: bookInfo.thisUrl,
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
    let thisUrl;
    if (type) {
      if (this.state.prevUrl == '') {
        Toast.add('已经是第一章了……');
        return;
      }
      thisUrl = this.state.prevUrl;
    } else {
      if (this.state.nextUrl == '') {
        Toast.add('已经是最后一章了……');
        return;
      }
      thisUrl = this.state.nextUrl;
    }

    this.setState(
      {
        thisUrl: thisUrl,
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
    Loading.show();
    // console.log(this.state.thisUrl);
    AppApi.getChapter(this.state.thisUrl)
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
            Loading.hide();
          },
        );
        storage.save({
          key: this.state.key,
          data: {
            title: res.title,
            thisUrl: this.state.thisUrl,
          },
        });
        if (that.scrollViewRef != null) {
          that.scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        }
      })
      .catch(error => {
        Loading.hide();
        console.error(error);
      });
  }

  // 初始加载
  componentDidMount() {
    storage
      .load({
        key: this.state.key,
      })
      .then(ret => {
        this.setState({
          thisUrl: ret.thisUrl,
        });
        this._loadHtml();
      })
      .catch(err => {
        this._loadHtml();
      });
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
