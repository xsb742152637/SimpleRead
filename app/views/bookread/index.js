/*
 * 阅读
 * @Author: xie
 * @Date: 2021-05-02
 */
import React from 'react';
import {Text, StyleSheet, View, Dimensions, FlatList, TouchableOpacity, ScrollView, Button} from 'react-native';
import cheerio from 'cheerio';
import storage from '../../config/storage';


export default class BookRead extends React.Component {
  // 构造函数，可以在里面初始化props和state
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isNewBook: false,
      baseUrl: 'http://www.xbiquge.la',
      thisUrl: '/9/9673/4266254.html',
      prevUrl: '',
      nextUrl: '',
      bookHtml: '',
      bookTitle: '',
    }
  }

  // render渲染前触发，仅调用一次
  componentwillMount() {

  }

  // 组装请求路径
  _getUrl(url) {
    return this.state.baseUrl + this.state.thisUrl;
  }

  // 上一章/下一章
  _clickButton(type) {
    let thisUrl = this.state.thisUrl;
    if (type) {
      thisUrl = this.state.prevUrl;
    } else {
      thisUrl = this.state.nextUrl;
    }

    this.setState({
      isLoading: true,
      thisUrl: thisUrl,
      prevUrl: '',
      nextUrl: '',
    }, () => {
      this._loadHtml();
    });
  }

  _getContent(str) {
    let strs = str.replace(/&nbsp;/g,'').split('<br>');
    let strNew = '';
    for (let i = 0; i < strs.length; i++) {
      let s = strs[i].toString().trim();
      if (s != '') {
        strNew += '\t\t' + s + '\n\n';
      }
    }
    return strNew;
  }
  // 请求html内容，并缓存
  _loadHtml() {
    fetch(
      this._getUrl()
    )
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.text();
        }
      })
      .then((responseJson) => {
        // alert(responseJson);
        let $ = cheerio.load(responseJson,{decodeEntities:false});

        this.setState({
          isLoading: false,
          prevUrl: $($('.bottem2>a')[1]).attr('href'),
          nextUrl: $($('.bottem2>a')[3]).attr('href'),
          bookHtml: this._getContent($('#content').html().toString()),
          bookTitle: $('.bookname>h1').text(),
        });
        storage.save({
          key: 'klfn',
          data: {
            thisUrl: this.state.thisUrl
          },
        });
        // return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 初始加载
  componentDidMount() {
    if (this.state.isNewBook) {
      this._loadHtml();
    } else {
      storage
      .load({
        key: 'klfn',
      })
      .then(ret => {
        this.setState({
          isLoading: true,
          thisUrl: ret.thisUrl,
        });
        this._loadHtml();
      })
      .catch(err => {
        console.warn(err.message);
        alert(err.message);
        this._loadHtml();
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (<Text>正在加载……</Text>);
    }
    return (
      <View style={styles.myView}>
        <ScrollView style={styles.myScrollView}>
          <Button
            title={'上一章'}
            accessibilityLabel="accessibility title"
            disabled={false}
            testID={'buttonTag'}
            onPress={() => {this._clickButton(true)}}
        />
        <Text style={styles.bookTitle}>{this.state.bookTitle}</Text>
        <Text style={styles.bookContent}>{this.state.bookHtml}</Text>
        <Button
          title={'下一章'}
          style={styles.myButton}
          accessibilityLabel="accessibility title"
          disabled={false}
          testID={'buttonTag'}
          onPress={() => {this._clickButton(false)}}
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
  bookTitle: {
    fontSize: 30,
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  bookContent: {
    fontSize: 16,
    color: '#555',
  },
});

