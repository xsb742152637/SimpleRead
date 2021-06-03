/*
 * realm数据库 表信息
 * @Author: xie
 * @Date: 2021-05-05
 */
import Realm from 'realm';
import {cloneObj, isNull, getId} from '@/utils/function';

// 书架
const BookListSchema = {
  name: 'BookList',
  primaryKey: 'bookId',
  properties: {
    bookId: 'string', // 主键
    bookName: 'string', // 书名
    author: 'string?', //作者
    bookUrl: 'string', // 小说主页
    chapterUrl: 'string', // 小说目录
    imgUrl: 'string', // 封面图
    lastChapterTitle: 'string?', // 最新一章标题
    lastChapterTime: 'string?', // 最新更新时间
    hasNewChapter: {type: 'int', default: 0}, // 是否有新章节
    historyChapterTitle: 'string?', //最后一次阅读的章节名称
    chapterId: 'string?', //最后一次阅读的章节序号
    historyChapterPage: {type: 'int', default: 0}, //最后一次阅读的章节页数
    isEnd: {type: 'int', default: 0}, // 是否完结：0(不知道)、1(连载中)、2(完结)
    bookState: {type: 'int', default: 1}, // 状态：0(不显示)、1(正常显示)、2(置顶)、3(养肥)
    sourceKey: 'string?', //选中的当前源
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
    thisUrl: 'string', //章节路径
    title: 'string', //章节标题
    num: 'int', //章节数
    orderNum: 'int', //章节序号
  },
};

// 小说缓存的每一章内容
const BookChapterDetailSchema = {
  name: 'BookChapterDetail',
  primaryKey: 'chapterId',
  properties: {
    chapterId: 'string', //小说章节
    bookId: 'string',
    title: 'string?', //小说标题
    content: 'string?', //小说内容
    thisUrl: 'string?', //本章路径
    prevUrl: 'string?', //上一章路径
    nextUrl: 'string?', // 下一章路径
  },
};

// 阅读历史
const HistoryBookListSchema = {
  name: 'HistoryBookList',
  primaryKey: 'bookId',
  properties: {
    bookId: 'string', // 主键
    bookName: 'string', // 书名
    author: 'string?', //作者
    bookUrl: 'string', // 小说主页
    chapterUrl: 'string', // 小说目录
    imgUrl: 'string', // 封面图
    lastChapterTitle: 'string?', // 最新一章标题
    lastChapterTime: 'string?', // 最新更新时间
    hasNewChapter: {type: 'int', default: 0}, // 是否有新章节
    historyChapterTitle: 'string?', //最后一次阅读的章节名称
    chapterId: 'string?', //最后一次阅读的章节序号
    historyChapterPage: {type: 'int', default: 0}, //最后一次阅读的章节页数
    isEnd: {type: 'int', default: 0}, // 是否完结：0(不知道)、1(连载中)、2(完结)
    bookState: {type: 'int', default: 1}, // 状态：0(不显示)、1(正常显示)、2(置顶)、3(养肥)
    sourceKey: 'string?', //选中的当前源
    saveTime: 'date', // 最后保存时间
    orderNum: {type: 'int', default: 0}, // 序号
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
    fontFamily: 'string?', // 字体类型
    lineHeight: 'double', // 行间距
    brightness: 'string?', // 屏幕亮度
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

let realm = new Realm({schema: schemaArray, schemaVersion: 6});

// 最底层的查询方法，传入表名和需要查询的主键
let _findOne = (tableName, primaryKey) => {
  try {
    if (isNull(primaryKey)) {
      console.log(tableName, '传入了空值');
    } else {
      return realm.objectForPrimaryKey(tableName, primaryKey);
    }
  } catch (e) {
    console.log('查询一条数据失败：', tableName, primaryKey);
    console.log(e);
  }
  return null;
};
// 最底层的保存方法，传入表名和需要更新的数据对象
let _saveRow = (tableName, rows) => {
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        if (rows.length) {
          rows.forEach(row => {
            realm.create(tableName, row, true);
          });
        } else {
          realm.create(tableName, rows, true);
        }
        resolve(cloneObj(rows));
      });
    } catch (e) {
      console.log('数据更新失败：', tableName, rows);
      reject(e);
    }
  });
};

// 最底层的删除方法，传入需要删除的数组对象或单个对象
let deleteRow = rows => {
  try {
    if (isNull(rows)) {
      console.log('没有数据可以删除', rows);
    } else {
      realm.write(() => {
        realm.delete(rows);
        console.log('数据删除成功：');
      });
    }
  } catch (e) {
    console.log('数据删除失败：', rows);
  }
};

// 书架 查询正常显示的全部小说，并按照修改时间倒序排列
const queryBookList = bookState => {
  if (!bookState) {
    bookState = [0, 1, 2];
  }
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
    return realm.objects('BookList').filtered(filter).sorted('saveTime', true);
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
const saveBook = rows => {
  return _saveRow('BookList', rows);
};
const deleteBook = bookId => {
  let rows = findBook(bookId);
  deleteRow(rows);
  deleteChapterByBookId(bookId);
  deleteDetailByBookId(bookId);
};
const deleteBookAll = () => {
  let rows = realm.objects('BookList');
  deleteRow(rows);
  rows = realm.objects('BookChapterList');
  deleteRow(rows);
  rows = realm.objects('BookChapterDetail');
  deleteRow(rows);
};

const queryChapterByBookId = (bookId, orderBy) => {
  console.log('orderBy：', orderBy);
  if (orderBy == undefined || orderBy == null) {
    orderBy = true;
  }
  try {
    return realm
      .objects('BookChapterList')
      .filtered('bookId == $0', bookId)
      .sorted('orderNum', orderBy);
  } catch (e) {
    console.log('查询失败！');
    console.log(e);
  }
  return [];
};
const queryChapterByThisUrl = (thisUrl, bookId) => {
  try {
    let data = realm
      .objects('BookChapterList')
      .filtered('thisUrl == $0 and bookId == $1', thisUrl, bookId);
    if (!isNull(data)) {
      return data[0];
    }
  } catch (e) {
    console.log('查询失败！');
    console.log(e);
  }
  return [];
};
// 查询最大章节序号
const getMaxChapterOrderNum = bookId => {
  let orderNum = 0;
  try {
    orderNum = realm
      .objects('BookChapterList')
      .filtered('bookId == $0', bookId)
      .max('orderNum');
    if (orderNum == undefined || orderNum == null) {
      orderNum = 0;
    }
  } catch (e) {
    console.log('查询失败！');
    console.log(e);
  }
  return orderNum;
};
const findChapter = primaryKey => {
  return _findOne('BookChapterList', primaryKey);
};

const saveChapter = rows => {
  return _saveRow('BookChapterList', rows);
};
const deleteChapterByBookId = bookId => {
  let rows = queryChapterByBookId(bookId);
  deleteRow(rows);
};

const queryDetailListByBookId = bookId => {
  try {
    return realm.objects('BookChapterDetail').filtered('bookId == $0', bookId);
  } catch (e) {
    console.log('查询失败！');
    console.log(e);
  }
  return [];
};
const queryDetailByThisUrl = (thisUrl, bookId) => {
  try {
    let data = realm
      .objects('BookChapterDetail')
      .filtered('thisUrl == $0 and bookId == $1', thisUrl, bookId);
    if (!isNull(data)) {
      return data[0];
    }
  } catch (e) {
    console.log('查询失败！');
    console.log(e);
  }
  return [];
};
const findDetail = primaryKey => {
  return _findOne('BookChapterDetail', primaryKey);
};

const saveDetail = rows => {
  return _saveRow('BookChapterDetail', rows);
};

const deleteDetailByBookId = bookId => {
  let rows = queryDetailListByBookId(bookId);
  deleteRow(rows);
};

const findConfig = () => {
  let config;
  try {
    config = realm.objects('ReaderConfig');
    if (config && config.length > 0) {
      return config[0];
    }
  } catch (e) {
    console.log('配置查询失败！');
    console.log(e);
  }
  config = {
    configId: getId(),
    background: '#edefee',
    fontSize: 15,
    lineHeight: 1,
    dayNight: 0,
    turnPage: 4,
    volumePage: 0,
    isFirstOpen: 1,
  };
  saveConfig(config);
  return config;
};

const saveConfig = rows => {
  return _saveRow('ReaderConfig', rows);
};

module.exports = {
  deleteRow,

  queryBookList,
  findBook,
  saveBook,
  deleteBook,
  deleteBookAll,

  queryChapterByBookId,
  queryChapterByThisUrl,
  getMaxChapterOrderNum,
  findChapter,
  saveChapter,
  deleteChapterByBookId,

  queryDetailListByBookId,
  queryDetailByThisUrl,
  findDetail,
  saveDetail,
  deleteDetailByBookId,

  findConfig: findConfig,
  saveConfig: saveConfig,
};
