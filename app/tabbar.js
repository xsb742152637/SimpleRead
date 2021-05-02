/*
 * 底部导航
 * @Author: xie
 * @Date: 2021-05-02
 */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MyIcon from './config/myIcon';
import AppStyles from './utils/style';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BookList from './views/booklist/index';
import BookCity from './views/bookcity/index';
import Me from './views/me/index';

const Tab = createBottomTabNavigator();

const tabbarConfig = [
  {
    icon: 'shujia',
    selectedIcon: 'shujia',
    title: 'BookList',
  },
  {
    icon: 'fenlei',
    selectedIcon: 'fenlei',
    title: 'BookCity',
  },
  {
    icon: 'gerenzhongxin',
    selectedIcon: 'gerenzhongxin',
    title: 'Me',
  },
];

export default class TabBar extends React.Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="BookList"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let icon = '';
            let iconColor = focused
              ? AppStyles.color.iconActive
              : AppStyles.color.icon;
            let iconSize = focused
              ? AppStyles.fontSize.iconActive
              : AppStyles.fontSize.icon;
            tabbarConfig &&
              tabbarConfig.forEach(tabbar => {
                if (route.name === tabbar.title) {
                  icon = focused ? tabbar.selectedIcon : tabbar.icon;
                }
              });
            return <MyIcon name={icon} size={iconSize} color={iconColor} />;
          },
        })}
        tabBarOptions={{
          inactiveTintColor: AppStyles.color.icon, // 设置TabBar非选中状态下的标签和图标的颜色；
          activeTintColor: AppStyles.color.iconActive, // 设置TabBar选中状态下的标签和图标的颜色
          style: {
            // 整个底部导航栏样式
            fontSize: AppStyles.fontSize.icon,
          },
          labelStyle: {
            // 标签样式
            fontSize: AppStyles.fontSize.label,
          },
          iconStyle: {
            // 图标样式
          },
        }}>
        <Tab.Screen
          name="BookList"
          options={{title: '书架'}}
          component={BookList}
        />
        <Tab.Screen
          name="BookCity"
          options={{title: '书城'}}
          component={BookCity}
        />
        <Tab.Screen name="Me" options={{title: '我'}} component={Me} />
      </Tab.Navigator>
    );
  }
}
