/*
 * realm数据库 表信息
 * @Author: xie
 * @Date: 2021-05-05
 */

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
    bookState: {type: 'int', default: 1}, // 状态：0(养肥)、1(正常显示)、2(置顶)
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

module.exports = schemaArray;
