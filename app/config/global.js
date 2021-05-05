// 数据库
import Realm from 'realm';
// 数据库建表文件
import schemaArray from '@/config/modelSchema';
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

import AppApi from '@/utils/api';

global.realm = new Realm({schema: schemaArray, schemaVersion: 3});
global.storage = storage;
global.appStyles = AppStyles;
global.loading = Loading;
global.toast = Toast;
global.popup = Popup;
global.appApi = AppApi;
