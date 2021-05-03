/*
 * description: 网络请求工具类
 * author: 谢
 * time: 2021年05月03
 */

'use strict';

import queryString from 'query-string';
const Buffer = require('buffer').Buffer;
const iconvLite = require('iconv-lite');

const request = {};

request.fetchHtml = (url, params) => {
  if (params) {
    url += '?' + queryString.stringify(params);
  }
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.text();
        }
      })
      .then(responseJson => {
        // alert(responseJson);
        resolve(responseJson);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};
/**
 *
 * @param url 请求路径
 * @param timeout 超时时间 单位是秒
 * @param isUtf8 是否为utf8编码格式，
 * @param params 请求参数
 * @returns {Promise.<T>|*}
 */
request.ajax = (url, timeout, isUtf8, params) => {
  if (params) {
    url += '?' + queryString.stringify(params);
  }
  if (isUtf8 == null) {
    isUtf8 = true;
  }

  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest();

    if (timeout == null) {
      timeout = 60; //默认一分钟
    }
    timeout *= 1000;
    let time = false;
    let timer = setTimeout(function () {
      time = true;
      request.abort();
    }, timeout);

    if (!isUtf8) {
      request.responseType = 'arraybuffer';
    }
    request.onreadystatechange = e => {
      if (request.readyState === 4) {
        if (time) {
          // alert("超时")
          reject('请求超时：' + url);
        } else if (request.status === 200) {
          //如果没有超时，手动结束计时
          clearTimeout(timer);
          let htmlStr = '';
          if (!isUtf8) {
            //request.response是ArrayBuffer数据，可通过下面的方式得到其中可用的Uint8Array
            let b1 = new Uint8Array(request.response);
            //Buffer.from(b1,'hex')是把Uint8Array转化成Buffer类型数据
            htmlStr = iconvLite.decode(Buffer.from(b1, 'hex'), 'gbk');
          } else {
            htmlStr = request.responseText;
          }
          // console.log(htmlStr);
          resolve(htmlStr);
        } else if (request.status === 404 || request.status === 500) {
          resolve('null');
        }
      }
    };
    request.open('GET', url);
    request.send();
  });
};

module.exports = request;
