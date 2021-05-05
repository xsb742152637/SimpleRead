'use strict';
import {Dimensions} from 'react-native';

// 传入比例小数，返回宽度
export let getWidth = ratio => {
  return Dimensions.get('window').width * ratio;
};

export let cloneObj = obj => {
  console.log(obj.length);
  if (obj.length != undefined) {
    let a = new Array();
    for (let i = 0; i < obj.length; i++) {
      a.push(JSON.parse(JSON.stringify(obj[i])));
    }
    return a;
  } else {
    return JSON.parse(JSON.stringify(obj));
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
