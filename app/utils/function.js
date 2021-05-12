'use strict';
import {Dimensions} from 'react-native';

// 传入比例小数，返回宽度
export let getWidth = ratio => {
  return Dimensions.get('window').width * ratio;
};

// 对象克隆
export let cloneObj = obj => {
  if (isNull(obj)) {
    return obj;
  } else {
    if (Array.isArray(obj)) {
      let a = new Array();
      // console.log('克隆数组', obj);
      for (let i = 0; i < obj.length; i++) {
        a.push(JSON.parse(JSON.stringify(obj[i])));
      }
      return a;
    } else {
      // console.log('克隆对象', obj);
      return JSON.parse(JSON.stringify(obj));
    }
  }

};

// 自动生成uuid
export let getId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .toUpperCase();
};

// 将从html得到的文本格式化
export let textFormat = str => {
  str = removeHtmlTab(str);
  str = escape2Html(str);
  str = trimBr(str);
  return str;
};
// 删除html标签
export let removeHtmlTab = str => {
  return str.replace(/<[^<>]+?>/g, '');
};
//转意符换成普通字符
export let escape2Html = str => {
  let arrEntities = {
    lt: '<',
    gt: '>',
    nbsp: ' ',
    amp: '&',
    quot: '"',
    copy: '©',
    oelig: 'œ',
    scaron: 'š',
    Yuml: 'Ÿ',
    circ: 'ˆ',
    tilde: '˜',
    ndash: '–',
    mdash: '—',
    lsquo: '‘',
    rsquo: '’',
    sbquo: '‚',
    ldquo: '“',
    rdquo: '”',
    bdquo: '„',
    dagger: '†',
    permil: '‰',
    lsaquo: '‹',
    rsaquo: '›',
    euro: '€',
  };
  return str.replace(
    /&(lt|gt|nbsp|amp|quot|copy|oelig|scaron|Yuml|circ|tilde|ndash|mdash|lsquo|rsquo|sbquo|ldquo|rdquo|bdquo|dagger|permil|lsaquo|rsaquo|euro);/gi,
    function (all, t) {
      return arrEntities[t];
    },
  );
};

//去除开头结尾换行,并将连续3次以上换行转换成2次换行
export let trimBr = str => {
  str = str.replace(/((\s| )*\r?\n){3,}/g, '\r\n\r\n'); //限制最多2次换行
  str = str.replace(/^((\s| )*\r?\n)+/g, ''); //清除开头换行
  str = str.replace(/((\s| )*\r?\n)+$/g, ''); //清除结尾换行
  return str;
};
// 将多个连续空格合并成一个空格
export let mergeSpace = str => {
  str = str.replace(/(\s| )+/g, ' ');
  return str;
};
export let isNull = str => {
  let state = str == undefined || str === null || str === '' || str === 'null';
  if (!state) {
    state = JSON.stringify(str) === '{}' || JSON.stringify(str) === '[]';
  }
  return state;
};
