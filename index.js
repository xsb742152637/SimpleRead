import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
// ćšć±ćé
import './app/config/global';

AppRegistry.registerComponent(appName, () => App);
