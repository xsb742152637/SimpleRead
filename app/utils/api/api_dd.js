/**
 * 顶点小说
 */
import cheerio from 'cheerio';
import request from '@/utils/ajax';
import {getId, textFormat, mergeSpace, isNull} from '@/utils/function';

let AppApi;
export default AppApi = {
  base: 'https://www.23us.tw',
  search: '/modules/article/search.php',
  _getUrl(url) {
    return this.base + url;
  },
  _getContent(str) {
    let strs = str.replace(/&nbsp;/g, '').split('<br>');
    let strNew = '';
    for (let i = 0; i < strs.length; i++) {
      let s = strs[i].toString().trim();
      if (s != '') {
        strNew += '\t\t' + s + '\n\n';
      }
    }
    return strNew;
  },
  getChapter(url) {
    let that = this;
    // 注意：这里params里面的key为全小写
    return new Promise((resolve, reject) => {
      request
        .fetchHtml(url)
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let title = $('#box_con .bookname h1').text();
          let content = textFormat($('#content').html());

          let btn = $('.bottem>a');
          let prevUrl = $($(btn)[1]).attr('href');
          let listUrl = $($(btn)[2]).attr('href');
          let nextUrl = $($(btn)[3]).attr('href');

          if (prevUrl.indexOf('javascript') >= 0 || prevUrl === listUrl) {
            prevUrl = '';
          }
          if (nextUrl.indexOf('javascript') >= 0 || nextUrl === listUrl) {
            nextUrl = '';
          }
          let data = {};
          data.title = title;
          data.content = content;
          data.listUrl = listUrl;
          data.prevUrl = prevUrl;
          data.nextUrl = nextUrl;
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getChapterList(url, bookId) {
    let that = this;
    // 注意：这里params里面的key为全小写
    return new Promise((resolve, reject) => {
      request
        .fetchHtml(url)
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let chapterList = [];
          $('#list dl dd').each(function (i, o) {
            chapterList.push({
              chapterId: getId(),
              bookId: bookId,
              thisUrl: that._getUrl($(o).find('a').attr('href')),
              title: $(o).find('a').text(),
              num: 0,
              orderNum: i,
            });
          });
          resolve(chapterList);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getBookInfo(data) {
    let that = this;
    // 注意：这里params里面的key为全小写
    return new Promise((resolve, reject) => {
      request
        .fetchHtml(data.bookUrl)
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let main = $('#maininfo');
          let imgUrl = $(main).find('#fmimg img').attr('src');
          let intro = that._getContent($(main).find('#intro').text());

          data.imgUrl = imgUrl;
          data.intro = textFormat(intro);
          data.chapterUrl = data.bookUrl;
          data.sourceKey = 'ddxs';
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getSearchList(searchkey) {
    let that = this;
    // 注意：这里params里面的key为全小写
    return new Promise((resolve, reject) => {
      request
        .fetchHtml(that._getUrl(that.search), {q: searchkey})
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let data = [];
          $('#checkform table #nr').each((i, o) => {
            let imgUrl = '';
            let td = $(o).find('td');
            let name = $(td[0]).find('a').text();
            let url = $(td[0]).find('a').attr('href');
            let lastChapterTitle = $(td[1]).find('a').text();
            let author = $(td[2]).text();
            let len = $(td[3]).text();
            let lastChapterTime = $(td[4]).text();
            let state = $(td[5]).text();

            let type = '';
            // console.log(name);
            // 排除表头
            if (isNull(url)) {
              return;
            }

            let item = {
              bookId: getId(),
              bookName: name,
              author: author,
              bookUrl: url,
              chapterUrl: '',
              imgUrl: imgUrl,
              lastChapterTitle: lastChapterTitle,
              lastChapterTime: lastChapterTime,
              type: type,
              state: state,
              isEnd: state.indexOf('连载') >= 0 ? 1 : 0,
              len: len,
            };
            data.push({
              type: 2,
              key: item.bookId,
              itemName: item.bookName,
              imgUrl: item.imgUrl,
              itemTitle: item.author,
              itemInfo1:
                item.lastChapterTime + ' | ' + item.state + ' | ' + item.len,
              itemInfo2: item.lastChapterTitle,
              item: item,
            });
          });
          resolve(data);
        })
        .catch(error => {
          reject(error);
          console.error(error);
        });
    });
  },
};
