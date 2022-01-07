/**
 * 全局样式变量
 */
import ColorConfig from '@/config/colorConfig';
let StyleConfig;
export default StyleConfig = {
  color: {
    baseBackground: '#efefef', // 页面底色

    headerBackground: ColorConfig.main3, // 页面头部
    headerText: '#ffffff', // 顶部导航栏文字颜色
    headerIcon: '#ffffff', // 顶部导航栏图标颜色


    icon: ColorConfig.main5, // 底部导航栏未选中颜色
    iconActive: ColorConfig.main3, // 底部导航栏图标选中颜色

    // 按钮
    button1: ColorConfig.main3,
    button2: ColorConfig.det3,
    button3: ColorConfig.sup3,

    // 边框
    border1: ColorConfig.main3,
    border2: ColorConfig.det3,
    border3: ColorConfig.sup3,

    // 文字
    text1: '#222222',
    text2: '#5f5f5f',
    text3: '#a2a2a2',

    cardBackground: 'rgba(255,255,255,0.7)', //
  },
  fontSize: {
    base: 18,
    icon: 18, // 图标
    iconActive: 20, // 图标
    titleText: 15, // 一般文字
    detailText: 12, // 次要文字

    label: 13, // 标签文字
  },
  padding: {
    baseTop: 10,
    baseLeft: 14,
    text: 5, // 文字、输入框等边距
  },
  radius: {
    base: 6,
    button: 12,
  },
  opacity: {
    active: 0.5, // 按下时，标签透明程度
    cardBackground: 0.7, // 卡片背景
    buttonBackground: 0.3, // 按钮背景
  },
  headerHeight: 50, // 页面头部高度
};
