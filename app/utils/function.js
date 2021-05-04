'use strict';
import {Dimensions} from 'react-native';

// 传入比例小数，返回宽度
export let getWidth = ratio => {
  return Dimensions.get('window').width * ratio;
};
