import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
// 全局变量
import './app/config/global';

AppRegistry.registerComponent(appName, () => App);
