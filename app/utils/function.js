'use strict';
import {Dimensions, PixelRatio} from 'react-native';
import {setSpText, scaleSize} from '@/utils/screenUtil';

// 传入比例小数，返回宽度
export let getWidth = ratio => {
  return Dimensions.get('window').width * ratio;
};

export let contentFormat = (content, font_size, line_height) => {
  // 一行可容纳文字数量
  let fontCount = parseInt(
    setSpText(Dimensions.get('window').width) / font_size - 1,
  );
  // 一屏可容纳文字行数
  let fontLines = parseInt(
    scaleSize(Dimensions.get('window').height) / line_height - 1,
  );
  console.log(fontCount, fontLines);
  const length = content.length;
  let array = [];
  let x = 0,
    y,
    m = 0;
  while (x < length) {
    let _array = [];
    let hh = 0;
    let fs = fontLines;
    for (var i = 0; i <= fontCount; i++) {
      y = x + fontCount;
      let str = content.substring(x, y);
      if (str.indexOf('\n') >= 0) {
        // console.log('换行');
        hh++;
        i++;
      }
      console.log(str);
      _array.push(str);
      x = y;
    }
    // console.log('第', m + 1, '页换行：', hh);
    array[m] = _array;
    m++;
    break;
  }
  return array;
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
