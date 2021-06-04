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
              global.realm.saveChapter(res);
            } else {
              alert('获取章节信息失败');
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
        console.log('请求小说：', url);
        AppApi.getChapter(url)
          .then(res => {
            // console.log(res);
            // 保存一章的明细
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
          })
          .catch(error => {
            reject(error);
            console.error(error);
          });
      } else {
        resolve(null);
      }
    });
  },
};
