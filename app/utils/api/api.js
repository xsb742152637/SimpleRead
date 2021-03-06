/**
 * 全局样式变量
 */
import cheerio from 'cheerio';
import request from '@/utils/ajax';
import {getId, textFormat, mergeSpace, isNull} from '@/utils/function';

let AppApi;
export default AppApi = {
  base: 'http://search.zongheng.com',
  search: '/s',
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
          if (isNull(html)) {
            console.log('请求失败', html);
            resolve(null);
          } else {
            let $ = cheerio.load(html, {decodeEntities: false});
            let main = $('.reader_box');
            let title = $(main).find('.title_txtbox').text();
            let content = '';
            $(main)
              .find('.content>p')
              .each(function (i, o) {
                content += $(o).text() + '\n\n';
              });

            let btn = $(main).find('.chap_btnbox>a');
            let listUrl = $($(btn)[0]).attr('href');
            let prevUrl = $($(btn)[1]).attr('href');
            let nextUrl = $($(btn)[2]).attr('href');

            if (prevUrl.indexOf('javascript') >= 0) {
              prevUrl = '';
            }
            if (nextUrl.indexOf('javascript') >= 0) {
              nextUrl = '';
            }
            let data = {};
            data.title = title;
            data.content = content;
            data.listUrl = listUrl;
            data.prevUrl = prevUrl;
            data.nextUrl = nextUrl;
            resolve(data);
          }

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
          $('.volume-list li').each(function (i, o) {
            chapterList.push({
              chapterId: getId(),
              bookId: bookId,
              thisUrl: $(o).find('a').attr('href'),
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
          let main = $('.book-main');
          let imgUrl = $(main).find('.book-img img').attr('src');
          let intro = that._getContent($(main).find('.book-dec>p').text());
          let lastChapterTitle = $(main)
            .find('.book-new-chapter>.tit>a')
            .text();
          let lastChapterTime = $(main).find('.book-new-chapter>.time').text();
          let chapterUrl = $(main).find('.all-catalog').attr('href');

          data.imgUrl = imgUrl;
          data.intro = textFormat(intro);
          data.lastChapterTitle = lastChapterTitle;
          data.lastChapterTime = mergeSpace(
            textFormat(lastChapterTime)
              .replace(/((\s| )*\r?\n)+/g, '')
              .replace(/./g, ''),
          );
          data.chapterUrl = chapterUrl;
          data.sourceKey = 'xbqg';
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
        .fetchHtml(that._getUrl(that.search), {keyword: searchkey})
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let data = [];
          $('.search-tab>.search-result-list').each((i, o) => {
            let imgUrl = $(o).find('.imgbox img').attr('src');
            let name = $(o).find('.tit a').text();
            let intro = $(o).find('.se-result-infos>p').text();
            let url = $(o).find('.tit a').attr('href');

            let other = $(o).find('.bookinfo').children();
            let author = $(other[0]).text();
            let type = $(other[2]).text();
            let state = $(other[4]).text();
            let len = $(other[6]).text();
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
              intro: intro,
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
              itemInfo1: item.type + ' | ' + item.state + ' | ' + item.len,
              itemInfo2: item.intro,
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
