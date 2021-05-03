/**
 * 全局样式变量
 */
import cheerio from 'cheerio';
import request from '@utils/ajax';

let AppApi;
export default AppApi = {
  base: 'http://www.xbiquge.la',
  search: '/modules/article/waps.php',
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
  getSearchList(searchkey) {
    let that = this;
    // 注意：这里params里面的key为全小写
    return new Promise((resolve, reject) => {
      request
        .fetchHtml(that._getUrl(that.search), {searchkey: searchkey})
        .then(html => {
          let $ = cheerio.load(html, {decodeEntities: false});
          let data = [];
          let len = $('table[class="grid"] tr').length;
          let thisI = 0;
          $('table[class="grid"] tr').each((i, o) => {
            // 排除表头
            if (i === 0) {
              thisI++;
              return;
            }
            let tds = $(o).find('td');
            let url = $(tds[0]).find('a').attr('href');
            let name = $(tds[0]).text();
            let author = $(tds[2]).text();
            let newChapter = $(tds[1]).find('a').text();

            request
              .fetchHtml(url)
              .then(html2 => {
                thisI++;
                let $2 = cheerio.load(html2, {decodeEntities: false});
                let con = $2('.box_con');
                let imgUrl = $2(con).find('#fmimg img').attr('src');
                let intro = that._getContent(
                  $2(con).find('#intro p:last-child').text(),
                );
                data.push({
                  key: i,
                  url: url,
                  name: name,
                  author: author,
                  newChapter: newChapter,
                  imgUrl: imgUrl,
                  intro: intro,
                });
                // console.log(newChapter);
                if (thisI >= len) {
                  resolve(data);
                }
              })
              .catch(error => {
                thisI++;
                if (thisI >= len) {
                  reject(error);
                }
                // console.error(error);
              });
          });
        })
        .catch(error => {
          reject(error);
          console.error(error);
        });
    });
  },
};
