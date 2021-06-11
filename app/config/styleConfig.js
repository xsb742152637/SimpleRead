/**
 * 全局样式变量
 */
let StyleConfig;
export default StyleConfig = {
  color: {
    baseBackground: '#e7e7e7', // 页面底色
    headerBackground: '#e7e7e7', // 页面头部
    headerText: '#32353a', // 顶部导航栏文字颜色
    headerIcon: '#32353a', // 顶部导航栏图标颜色

    border: '#e0e0e0', // 边框

    icon: '#afb0b2', // 底部导航栏未选中颜色
    iconActive: '#32353a', // 底部导航栏图标选中颜色

    button: '#d2d7c2', // 主要按钮背景色
    detailButton: '', // 次要按钮
    titleText: '#222222', // 标题
    text: '#5f5f5f', // 一般文字颜色
    detailText: '#a2a2a2', // 次要文字颜色
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
    active: 0.7, // 按下时，标签透明程度
    cardBackground: 0.5, // 卡片背景
    buttonBackground: 0.3, // 按钮背景
  },
  headerHeight: 50, // 页面头部高度
};
