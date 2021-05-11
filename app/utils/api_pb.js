/**
 * 全局样式变量
 */
import cheerio from 'cheerio';
import request from '@/utils/ajax';
import {getId, textFormat, mergeSpace} from '@/utils/function';

let AppApi;
export default AppApi = {
  base: 'http://www.qishusk.com',
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
          let content = $('#main>.content').html();

          let btn = $('.chapter_go>a');
          let listUrl = $($(btn)[1]).attr('href');
          let prevUrl = $($(btn)[0]).attr('href');
          let nextUrl = $($(btn)[2]).attr('href');

          if (prevUrl.indexOf('javascript') >= 0 || prevUrl == listUrl) {
            prevUrl = '';
          }
          if (nextUrl.indexOf('javascript') >= 0 || nextUrl == listUrl) {
            nextUrl = '';
          }
          let data = {};
          data.title = '';
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
  getChapterList(url) {
    let that = this;
    // 注意：这里params里面的key为全小写
    return new Promise((resolve, reject) => {
      request
        .fetchHtml(url)
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let chapterList = [];
          $('#main>.list>dl>dd').each(function (i, o) {
            chapterList.push({
              chapterId: getId(),
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
          let other = $('.xiaoshuo>.info>p').split('&nbsp;');
          console.log(other);
          let intro = $('.new_chapter_list>p>a').text();
          let lastChapterTitle = $('.new_chapter_list>.new>a').text();
          let lastChapterTime = other[4].replact('更新：', '');
          let chapterUrl = $('.read_link>#read').attr('href');
          let author = $('#author').text();

          data.intro = textFormat(intro);
          data.lastChapterTitle = lastChapterTitle;
          data.lastChapterTime = lastChapterTime;
          data.chapterUrl = chapterUrl;
          data.author = author.replace(' / 作者：', '');
          data.sourceKey = 'pb';
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
        .fetchHtml(that._getUrl(that.search), {searchkey: searchkey})
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let data = [];
          $('.zhuopin').each((i, o) => {
            let imgUrl = $(o).find('img').attr('src');
            let name = $(o).find('.book_info h2 a').text();
            let intro = $(o).find('.p-intro').text();
            let url = $(o).find('.book_info h2 a').attr('href');
            let itemTitle = $(o).find('.p-new>a').text();

            let type = '';
            let state = $(o).find('.f-green').text();
            let len = '';
            // console.log(name);
            // 排除表头
            if (url == undefined || url == null || url === '') {
              return;
            }

            let item = {
              bookId: getId(),
              bookName: name,
              author: '',
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
              key: item.bookId,
              itemName: name,
              imgUrl: imgUrl,
              itemTitle: itemTitle,
              itemInfo1: state,
              itemInfo2: intro,
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
