// 数据库建表 与 增删改查方法
import realm from '@/config/modelSchema';
// 本次存储
import storage from '@/config/storage';
// 公共样式
import AppStyles from '@/utils/style';

// 正在加紧 提示框
import Loading from '@/utils/load/loading';
// 消息框
import Toast from '@/utils/load/toast';
// 对话框
import Popup from '@/utils/load/popup';

import AppApi from '@/utils/api_dd';

// let deviceHeight = Dimensions.get('window').height/Dimensions.get('window').width > 1.8 ? screenH + NativeModules.StatusBarManager.HEIGHT :  screenH;
global.realm = realm;
global.storage = storage;
global.appStyles = AppStyles;
global.loading = Loading;
global.toast = Toast;
global.popup = Popup;
global.appApi = AppApi;
// 全局回调
global.callbacks = {};
