import {combineReducers} from 'redux';
import num from './num';
import user from './user';

//这里返回的combineReducers()就是 Store 的内容，后面想要获得的话，就是使用 store.user、store.num来获得对应store的数据
export default combineReducers({
  num: num,
  user: user,
});
