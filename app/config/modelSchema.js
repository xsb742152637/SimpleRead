/*
 * realm数据库 表信息
 * @Author: xie
 * @Date: 2021-05-05
 */
import Realm from 'realm';
import {cloneObj} from '@/utils/function';

// 书架
const BookListSchema = {
  name: 'BookList',
  primaryKey: 'bookId',
  properties: {
    bookId: 'string', // 主键
    bookName: 'string', // 书名
    author: {type: 'string', default: ''}, //作者
    bookUrl: 'string', // 小说主页
    chapterUrl: 'string', // 小说目录
    imgUrl: 'string', // 封面图
    lastChapterUrl: 'string', // 最新一章路径
    lastChapterTitle: 'string', // 最新一章标题
    lastChapterTime: 'string', // 最新更新时间
    hasNewChapter: {type: 'int', default: 0}, // 是否有新章节
    historyChapterTitle: {type: 'string', default: ''}, //最后一次阅读的章节名称
    detailId: {type: 'string', default: ''}, //最后一次阅读的章节序号
    historyChapterPage: {type: 'int', default: 0}, //最后一次阅读的章节页数
    isEnd: {type: 'int', default: 0}, // 是否完结：0(不知道)、1(连载中)、2(完结)
    bookState: {type: 'int', default: 1}, // 状态：0(不显示)、1(正常显示)、2(置顶)、3(养肥)
    sourceKey: {type: 'string', default: ''}, //选中的当前源
    saveTime: 'date', // 最后保存时间
    orderNum: {type: 'int', default: 0}, // 序号
  },
};

//小说章节目录
const BookChapterListSchema = {
  name: 'BookChapterList',
  primaryKey: 'chapterId',
  properties: {
    chapterId: 'string', //
    bookId: 'string', //BookList 的主键
    chapterUrl: 'string', //章节路径
    title: 'string', //章节标题
    num: 'int', //章节数
    orderNum: 'int', //章节序号
  },
};

// 小说缓存的每一章内容
const BookChapterDetailSchema = {
  name: 'BookChapterDetail',
  primaryKey: 'detailId',
  properties: {
    detailId: 'string', //小说编号
    chapterId: 'string', //BookChapterList 的主键
    bookName: 'string',
    content: 'string', //小说内容
    orderNum: 'int', //小说序号
  },
};

// 阅读历史
const HistoryBookListSchema = {
  name: 'HistoryBookList',
  primaryKey: 'bookId',
  properties: {
    bookId: 'string', // 主键
    bookName: 'string', // 书名
    author: {type: 'string', default: ''}, //作者
    bookUrl: 'string', // 小说主页
    chapterUrl: 'string', // 小说目录
    imgUrl: 'string', // 封面图
    lastChapterTitle: 'string', // 最新一章标题
    lastChapterTime: 'string', // 最新更新时间
    hasNewChapter: 'int', // 是否有新章节
    historyChapterTitle: {type: 'string', default: ''}, //最后一次阅读的章节名称
    historyChapterNum: 'int', //最后一次阅读的章节序号
    historyChapterPage: 'int', //最后一次阅读的章节页数
    isEnd: {type: 'int', default: 0}, // 是否完结：0(不知道)、1(连载中)、2(完结)
    bookState: {type: 'int', default: 1}, // 状态：0(养肥)、1(正常显示)、2(置顶)
    sourceKey: {type: 'string', default: ''}, //选中的当前源
    saveTime: 'date', // 最后保存时间
    orderNum: 'int', // 序号
  },
};

// 阅读页面配置
const ReaderConfigSchema = {
  name: 'ReaderConfig',
  primaryKey: 'configId',
  properties: {
    configId: 'string',
    background: 'string', // 背景
    fontSize: 'int', // 字体大小
    fontFamily: {type: 'string', default: ''}, // 字体类型
    lineHeight: 'int', // 行间距
    brightness: 'string', // 屏幕亮度
    dayNight: {type: 'int', default: 0}, // 夜晚模式
    turnPage: {type: 'int', default: 1}, // 翻页模式：1(仿真)、2(覆盖)、3(平移)、4(上下)、5(自动上下翻页)
    volumePage: {type: 'int', default: 0}, // 是否音量翻页
    isFirstOpen: {type: 'int', default: 1},
  },
};

const schemaArray = [
  BookListSchema,
  BookChapterListSchema,
  BookChapterDetailSchema,
  HistoryBookListSchema,
  ReaderConfigSchema,
];

let realm = new Realm({schema: schemaArray, schemaVersion: 3});

// 最底层的查询方法，传入表名和需要查询的主键
let _findOne = (tableName, primaryKey) => {
  try {
    return cloneObj(realm.objectForPrimaryKey(tableName, primaryKey));
  } catch (e) {
    console.log('查询一条数据失败：', tableName, primaryKey);
    console.log(e);
  }
  return null;
};
// 最底层的保存方法，传入表名和需要更新的数据对象
let _saveRow = (tableName, row) => {
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        realm.create(tableName, row, true);
        resolve(cloneObj(row));
      });
    } catch (e) {
      console.log('数据更新失败：', tableName, row);
      reject(e);
    }
  });
};

// 最底层的删除方法，传入需要删除的数组对象或单个对象
let deleteRow = row => {
  try {
    realm.write(() => {
      realm.delete(row);
    });
  } catch (e) {
    console.log('数据删除失败：', row);
  }
};

// 书架 查询正常显示的全部小说，并按照修改时间倒序排列
const queryBookList = bookState => {
  if (!bookState) {
    bookState = [0, 1, 2];
  }
  console.log(bookState);
  try {
    let filter = [];
    if (bookState.length) {
      bookState.forEach(k => {
        filter.push(' bookState == ' + k);
      });
    } else {
      filter.push(' bookState == ' + bookState);
    }
    filter = filter.join(' or ');
    console.log(filter);
    return cloneObj(
      realm.objects('BookList').filtered(filter).sorted('saveTime', true),
    );
  } catch (e) {
    console.log('书架查询失败！');
    console.log(e);
  }
  return [];
};

// 根据主键查询一本小说
const findBook = primaryKey => {
  return _findOne('BookList', primaryKey);
};
// 保存一本小说
const saveBook = row => {
  return _saveRow('BookList', row);
};

const queryChapter = () => {
  try {
    console.log('书架查询失败！');
  } catch (e) {
    console.log('书架查询失败！');
  }
  return [];
};
const findChapter = primaryKey => {
  return _findOne('BookChapterList', primaryKey);
};
const saveChapter = row => {
  return _saveRow('BookChapterList', row);
};

module.exports = {
  deleteRow,

  queryBookList,
  findBook,
  saveBook,

  queryChapter,
  findChapter,
  saveChapter,
};
