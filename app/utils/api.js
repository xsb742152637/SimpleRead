import AppApi from '@/utils/api/api_dd';
import {
  getId,
  textFormat,
  isNull,
  mergeSpace,
  contentFormat,
  cloneObj,
} from '@/utils/function';

let AppApiBase;
export default AppApiBase = {
  // 保存目录
  getChapterList(isRequest, url, bookId) {
    return new Promise((resolve, reject) => {
      if (isRequest) {
        AppApi.getChapterList(url, bookId)
          .then(res => {
            console.log('章节总数：' + res.length);
            if (res.length > 0) {
              // 查询该小说现有目录，只保存不存在的目录

              let newMap = {};
              res.map((chapter, index) => {
                newMap[chapter.thisUrl] = chapter;
              });
              let oldChapterList = global.realm.queryChapterByBookId(bookId);
              if (oldChapterList != null) {
                oldChapterList.map((chapter, index) => {
                  if (newMap[chapter.thisUrl] != null) {
                    delete newMap[chapter.thisUrl];
                  }
                });
              }

              let updateChapterList = [];
              for (let key in newMap) {
                if (newMap[key] == null) {
                  continue;
                }
                console.log('更新：', newMap[key].title);
                updateChapterList.push(newMap[key]);
              }
              let book = cloneObj(global.realm.findBook(bookId));

              if (updateChapterList.length > 0) {
                AppApi.getBookInfo(book)
                  .then(res2 => {
                    console.log('更新成功2：', book.bookName);
                    global.realm.saveBook({
                      bookId: bookId,
                      lastChapterTitle: res2.lastChapterTitle,
                      lastChapterTime: res2.lastChapterTime,
                      hasNewChapter: 1,
                    });
                  })
                  .catch(error => {
                    console.log('更新失败1：', book.bookName);
                  });
                global.realm.saveChapter(updateChapterList);
              }
              console.log('成功更新目录数量：', updateChapterList.length);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        resolve(null);
      }
    });
  },
  // 保存一章内容
  getChapter(isRequestDetail, url, bookId, chapterId, title) {
    return new Promise((resolve, reject) => {
      if (isRequestDetail) {
        // console.log('请求小说：', url);
        AppApi.getChapter(url)
          .then(res => {
            // console.log(res);
            // 保存一章的明细
            if (isNull(res)) {
              resolve(res);
            } else {
              let title = res.title ? res.title : title;
              let detail = {
                chapterId: chapterId,
                bookId: bookId,
                title: title,
                content: res.content,
                thisUrl: url,
                prevUrl: res.prevUrl,
                nextUrl: res.nextUrl,
              };
              if (isNull(detail.chapterId)) {
                console.log('主键缺失');
              } else {
                console.log('保存本章内容');
                global.realm.saveDetail(detail);
              }
              resolve(detail);
            }
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } else {
        resolve(null);
      }
    });
  },
  getBookInfo(data) {
    return AppApi.getBookInfo(data);
  },
  getSearchList(searchkey) {
    return AppApi.getSearchList(searchkey);
  },
  checkUrl() {
    return AppApi.checkUrl();
  },
};
