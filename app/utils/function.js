'use strict';
import {Dimensions, PixelRatio} from 'react-native';
import {setSpText, scaleSize} from '@/utils/screenUtil';
const {width, height} = Dimensions.get('window'); // 可用显示屏幕的宽高，不包括顶部的状态信息栏
// const {width, height} = Dimensions.get('screen'); // 整个显示屏幕的宽高，包括顶部的状态信息栏

// 传入比例小数，返回宽度
export let getWidth = ratio => {
  return width * ratio;
};

// 获取字符串的字节长度
export let getByteLength = str => {
  //将非ascii码转换为2个ascii码
  str = str.replace(/[“”"]/g, '*');
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let a = str.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 4;
    } else if (a === ' ') {
      len += 1;
    } else {
      len += 2;
    }
  }
  return len / 2;
};
export let contentFormat = (content, font_size, line_height) => {
  // content = ' 了一下，\n嗅\n了卷';
  // content = '              槐诗愣了一下，\n嗅了嗅那一根手工卷';
  console.log(height, line_height);
  content = trimBr(content).toLowerCase();
  // console.log(content);

  // 一行可容纳文字数量
  let fontCount = parseInt((width / font_size) * 2) - 4;
  // 一屏可容纳文字行数
  let fontLines = parseInt(height / line_height - 1);
  console.log(fontCount, fontLines);

  let r = 0,
    p = 0;
  // 一行数据
  let row = [];
  // 一页数据
  let rows = [];
  // 分页结果
  let pages = [];
  for (let i = 0; i < content.length; i++) {
    let s = content.charAt(i);
    // console.log(s, s.indexOf('\n'));
    r += getByteLength(s);

    // 满一行 或 遇到换行符
    if (r > fontCount || s.indexOf('\n') >= 0) {
      // console.log(p, rows.length);
      if (s.indexOf('\n') >= 0) {
        s = '';
        // console.log(content.charAt(i - 1));
        // 第一行不允许有换行
        if (row.join('') == '' && (p == 0 || p >= fontLines - 1)) {
          continue;
        }
      }
      p++;
      rows.push(row.join(''));
      r = 0;
      row = [];
      // console.log('满了');
      // 满一页
      if (p >= fontLines) {
        pages.push(cloneObj(rows));
        rows = [];
        p = 0;
      }
    }
    row.push(s);
  }
  // 最后一行
  if (row.length > 0) {
    rows.push(row.join(''));
  }
  if (rows.length > 0) {
    pages.push(rows);
  }

  return pages;
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
