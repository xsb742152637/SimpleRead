/*
 * 搜索
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
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import Back from '@/components/back';
import MyIcon from '@/config/myIcon';
import StyleConfig from '@/config/styleConfig';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      isChange: false,
      searchText: '',
      bookList: [],
    };
  }

  componentDidMount() {
    // this._searchBook();
    // setTimeout(() => {
    //   this._initBook();
    // }, 1000);
    // global.loading.hide();
  }
  // 开始搜索
  _searchBook() {
    let that = this;
    if (that.state.isChange) {
      // 文本框失去焦点
      that.inputRef.current.blur();
      // 收起键盘
      Keyboard.dismiss();
      global.loading.show();
      console.log(this.state.searchText);
      global.appApi
        .getSearchList(that.state.searchText)
        .then(res => {
          console.log(res);
          that.setState(
            {
              isChange: false,
              bookList: res,
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
  }
  _loadBook() {
    let that = this;
    let index = (that.state.pages - 1) * that.state.rows;
    for (let i = 0; i < that.state.rows; i++) {
      let data = that.state.searchList[index + i];
      console.log(index + i);
      // console.log(data);
      global.appApi
        .getBookInfo(data)
        .then(book => {
          let bookList = that.state.bookList;
          bookList.push(book);
          that.setState({bookList: bookList});
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  _initBook() {
    // 文本框失去焦点
    this.inputRef.current.blur();
    // 收起键盘
    Keyboard.dismiss();
    let data = [
      {
        author: '清粥白菜',
        imgUrl:
          'http://static.zongheng.com/upload/cover/2016/08/1470102734203.jpg',
        intro: '游戏男带着技能系统穿越，给你不一样的三国！',
        key: 0,
        len: '397669字',
        name: '三国技能系统',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/591854.html',
      },
      {
        author: '景家二少爷',
        imgUrl:
          'http://static.zongheng.com/upload/cover/e4/6d/e46d4870e69ec5da264216f030139efe.jpeg',
        intro:
          '这是‘历朝皆以弱灭，独汉以强亡’的汉末三国，这是充满了铁血、杀戮，又不失温情与信义的时代；是赋予万千中国人民族名称的时代；是吊打四方蛮夷一骑当五胡的的时代。',
        key: 1,
        len: '375661字',
        name: '稗史三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/846142.html',
      },
      {
        author: '清粥白菜',
        imgUrl:
          'http://static.zongheng.com/upload/cover/38/da/38daad994ec3ed415a8052d4ead7514d.jpeg',
        intro:
          '统率（冰）、武力（雷）、智力（火）、政治（土），四维属性（元素）操控出一个不一样的三国。',
        key: 2,
        len: '336488字',
        name: '卡尔戏三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/719623.html',
      },
      {
        author: '幽灵机师',
        imgUrl:
          'http://static.zongheng.com /upload/cover/2013/09/1379817940080.jpg',
        intro:
          '这是和“历史”记载中完全不同的时代。这是属于英雄和强者的时代。和你们比起来，或许我真的什么都不算。但是对不起，我还是要抢你们的戏。=================↑所以说这本书是不是不该分到“历史”里？ =================新书《星之战场》已上传，书号459560',
        key: 3,
        len: '1112931字',
        name: '魔三国',
        state: '完结',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/259397.html',
      },
      {
        author: '陆子羽',
        imgUrl:
          'http://static.zongheng.com/upload/cover/2014/08/1408338823967.jpg',
        intro: '三国难见三国，重活一世，傲气重生。',
        key: 4,
        len: '664575字',
        name: '傲三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/385373.html',
      },
      {
        author: '鼎宗显义',
        imgUrl:
          'http://static.zongheng.com/upload/cover/b7/1e/b71e619d8e3e1683d08872ca7fb2ed85.jpeg',
        intro:
          '以前读过很多三国类小说，但是时间线基本都是黄巾之乱开始，我读过这种同类别的太多了，有点疲乏。后来我想找关于三国鼎立时间线的来读，但是我发现这种类别的很少，读过几部也是以蜀国诸葛亮北伐为主线的几部，关于吴国的就更少了，所以我萌生了自己来写一部吴国后期的三国类小说，当然由于是第一次写，所以也不想写成纯历史类，因为我驾驭不了，所以在设定上就取巧，给自己留点余地，不然第一次写，定位太难，肯定是写不下去的，望各位看见这本书的读者嘴下留情。',
        key: 5,
        len: '916812字',
        name: '寻戏三国',
        state: '连载',
        type: '科幻游戏',
        url: 'http://book.zongheng.com/book/870808.html',
      },
      {
        author: '杏花醉',
        imgUrl:
          'http://static.zongheng.com/upload/cover/2017/01/1484309422090.jpg',
        intro:
          '一朝穿越，两世为人，命运的罗盘将他匆匆赶入三国乱世。智才的谋划，武将的搏杀，人性的抉择，时运的无奈，这一切才是真正的三国。且看吕布温候如何搅乱三国，书写属于自己的一段传奇。',
        key: 6,
        len: '1264306字',
        name: '虎啸三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/638625.html',
      },
      {
        author: '北国的雪',
        imgUrl:
          'http://static.zongheng.com/upload/cover/2015/07/1438313313261.jpg',
        intro:
          '经历多了，陈涛终于明白一件事情：他不是穿越到的时代，是传说中的妹子三国……',
        key: 7,
        len: '1393762字',
        name: '娘三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/489189.html',
      },
      {
        author: '别部大司马',
        imgUrl:
          'http://static.zongheng.com/upload/cover/2015/05/1432105060610.jpg',
        intro: '穿越三国，以冀州为基石，重收汉末人才。',
        key: 8,
        len: '1921984字',
        name: '争霸三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/469161.html',
      },
      {
        author: 'A4铜版纸',
        imgUrl:
          'http://static.zongheng.com/upload/cover/4d/60/4d609e56beac0d43073bc128d82fef6c.png',
        intro:
          '波澜壮阔的三国故事，五胡乱华的幕后黑手，小道士混迹三国，拯救泱泱中华！',
        key: 9,
        len: '129604字',
        name: '道门三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/1057953.html',
      },
      {
        author: '冒烟的凤凰',
        imgUrl:
          'http://static.zongheng.com/upload/cover/d8/c6/d8c62c901a3c9d6986971da00dbd4f1a.jpeg',
        intro:
          '刘备：“兄弟如手足，女人如衣服。”林峰：“谁动我手足，我穿他衣服！”曹操：“人之美妻，吾之所欲。”林峰：“在美女成为别人妻子前，把她变成我老婆！”孙权：“孤这一生，唯爱娇娃美女......”林峰：“闭嘴，我看上你妹子孙尚香了，以后你就当个混吃等死人畜无害的小舅子吧！”',
        key: 10,
        len: '1519754字',
        name: '三国集美录',
        state: '完结',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/898601.html',
      },
      {
        author: '竹在野',
        imgUrl:
          'http://static.zongheng.com/upload/cover/c3/f3/c3f3abf260716e9bea53ab380c9e0197.jpeg',
        intro:
          '穿越季汉少主，好像是能扶得起来的那位。别名《安汉》，庆祝理想国建国1800年。因为新冠穿越，睁眼就被曹操追杀，好不容易抱到了刘备的大腿，才发现自己最后要死这人手里？刘安之：汉末真要命，小爷想回家',
        key: 11,
        len: '567196字',
        name: '少将军三国行',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/978814.html',
      },
      {
        author: '镜空洞',
        imgUrl:
          'http://static.zongheng.com/upload/cover/e9/d0/e9d0bdd6ca7a61f5b904af83bc2752f8.jpeg',
        intro:
          '九世善人刘亮因机缘巧合穿越到东汉170年，意外成了糜竺，依靠糜家财力的支持，与另外几大财团联手开创金钱帝国，名声找名人点评，金钱财团支持，美女岂能抵挡后世渣男名句，组成理想梦之队，与当世精英开创另类三国。',
        key: 12,
        len: '63060字',
        name: '三国金主',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/1014145.html',
      },
      {
        author: '用玻璃杯喝茶',
        imgUrl:
          'http://static.zongheng.com/upload/cover/88/5c/885c3a8ab9fcf8fbe61482a08dbb76a8.jpeg',
        intro: '……这是一个穿越者在异世三国闯荡奋起的故事。',
        key: 13,
        len: '2234794字',
        name: '异世三国',
        state: '完结',
        type: '奇幻玄幻',
        url: 'http://book.zongheng.com/book/894662.html',
      },
      {
        author: '何处是我乡',
        imgUrl:
          'http://static.zongheng.com/upload/cover/07/82/078250b72e3d1b50d3ffd8714998853a.jpeg',
        intro:
          '纵横三国之后又被选中搅动三界这一切是机缘巧合，还是有心人的安排？',
        key: 14,
        len: '565100字',
        name: '游戏三国',
        state: '连载',
        type: '科幻游戏',
        url: 'http://book.zongheng.com/book/901980.html',
      },
      {
        author: '三国不演义',
        imgUrl:
          'http://static.zongheng.com/upload/cover/fe/9b/fe9b521beb8eafdc3ddb6ce4a33a9c87.jpeg',
        intro: '铭记内心的善良与仇恨我为你取名“方铭”',
        key: 15,
        len: '7337字',
        name: '国王餐厅',
        state: '连载',
        type: '悬疑灵异',
        url: 'http://book.zongheng.com/book/946997.html',
      },
      {
        author: '三国烤鱼',
        imgUrl:
          'http://static.zongheng.com/upload/cover /fb/50/fb50a16a170966ced3219a5a555fd786.jpeg',
        intro: '武之巅，剑之极，什么？你这个系统居然要吃灵石？',
        key: 16,
        len: '24529字',
        name: '武极之剑道',
        state: '连载',
        type: '奇幻玄幻',
        url: 'http://book.zongheng.com/book/951866.html',
      },
      {
        author: '泽宇兄弟',
        imgUrl:
          'http://static.zongheng.com/upload/cover/ce/b5/ceb548c75ef5e2d59e66ebfc799e0187.jpeg',
        intro: '滚滚长江东逝水，浪花淘尽英雄；白发渔樵江渚上…',
        key: 17,
        len: '23436字',
        name: '将三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/1060238.html',
      },
      {
        author: '宏乐',
        imgUrl:
          'http://static.zongheng.com/upload/cover/00/ee/00ee633f83fdbb0858179b4c87efab741583662167701.jpeg',
        intro:
          '穿越三国，附身到濒死的汉少帝身上，带着坚贞的唐姬，隐居山野。可一想到三国乱世的惨，五胡乱华的悲，这年混乱的年代呀，拿什么拯救你。赵云、张辽、太史慈……三国名将都到碗里来。甄姬、貂蝉、大小乔……三国六绝都去榻上去。',
        key: 18,
        len: '23443字',
        name: '三国少帝',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/947653.html',
      },
      {
        author: '木三千',
        imgUrl:
          'http://static.zongheng.com/upload/cover/fb/80/fb805124ae3d16f9d33664f47ec8dcda.jpeg',
        intro:
          '这里是你闻所未闻的三国，它对你来说很陌生，却又很亲切。这里龙、猫、狗三足鼎力，它们又会擦出怎样的火花呢?',
        key: 19,
        len: '2515字',
        name: '动物三国',
        state: '连载',
        type: '历史军事',
        url: 'http://book.zongheng.com/book/967835.html',
      },
    ];
    this.setState({
      bookList: data,
      isChange: false,
    });
  }
  _setSearchText(text) {
    this.setState({
      isChange: true,
      searchText: text,
    });
  }
  _goDetail(item) {
    this.props.navigation.navigate('SearchDetail', item);
  }
  _getItem(item) {
    return (
      <TouchableOpacity
        activeOpacity={StyleConfig.activeOpacity}
        onPress={() => {
          this._goDetail(item);
        }}>
        <View style={styles.itemView}>
          <View>
            <Image
              source={{uri: item.imgUrl}}
              style={{width: 80, height: 120}}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.bookName}</Text>
            <Text numberOfLines={1} style={styles.itemAuthor}>
              {item.author}
            </Text>
            <Text numberOfLines={1} style={styles.itemNewChapter}>
              {item.type + ' | ' + item.state + ' | ' + item.len}
            </Text>
            <Text numberOfLines={3} style={styles.itemIntro}>
              {item.intro}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={global.appStyles.content}>
        <View style={global.appStyles.header}>
          <Back navigation={this.props.navigation} />
          <View style={styles.searchInputParent}>
            <TextInput
              ref={this.inputRef}
              autoFocus={true}
              clearButtonMode="while-editing"
              placeholder={'请输入关键字：书名/作者'}
              style={styles.searchInput}
              onChangeText={text => this._setSearchText(text)}
            />
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={StyleConfig.activeOpacity}
              onPress={() => this._searchBook()}>
              <Text>搜索</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={global.appStyles.main}>
          <FlatList
            data={this.state.bookList}
            keyExtractor={item => item.bookId}
            renderItem={({item}) => this._getItem(item)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchInputParent: {
    flex: 1,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
  },
  searchInput: {
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: StyleConfig.radius,
    backgroundColor: '#efefef',
  },
  itemView: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: StyleConfig.padding.baseTop,
    paddingTop: StyleConfig.padding.baseTop,
    paddingBottom: StyleConfig.padding.baseTop,
    paddingRight: StyleConfig.padding.baseLeft,
    paddingLeft: StyleConfig.padding.baseLeft,
    backgroundColor: '#fff',
  },
  itemContent: {
    paddingLeft: StyleConfig.padding.baseLeft,
    flex: 1,
  },
  itemName: {
    color: '#000',
    fontSize: 15,
    // fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
  },
  itemAuthor: {
    color: StyleConfig.color.text,
    fontSize: 12,
    paddingBottom: 5,
  },
  itemIntro: {
    color: StyleConfig.color.detailText,
    fontSize: 12,
  },
  itemNewChapter: {
    color: StyleConfig.color.detailText,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
    // borderWidth: 1,
    // borderColor: 'red',
    // borderStyle: 'solid',
  },
});
