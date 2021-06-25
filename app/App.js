import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
//StackNavigator导航
import 'react-native-gesture-handler';
import './utils/load/rootview';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// 公共样式参数
import StyleConfig from '@/config/styleConfig';

// 底部导航栏
import TabBar from './components/tabbar';
// 各功能页面
import BookRead from './views/bookread/index';
import Search from './views/search/index';
import SearchDetail from './views/search/detail';
import ReadHistory from './views/readhistory/index';

// 数据库

// 设置react-native路由导航
const Stack = createStackNavigator();

export default () => {
  console.log('状态栏高度：', StatusBar.currentHeight);
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={StyleConfig.color.headerBackground}
        barStyle={StyleConfig.color.headerText}
        hidden={false}
        animated={true}
        translucent={false}
        showHideTransition={'slide'}
      />
      <Stack.Navigator headerMode="none" initialRouteName="TabBar">
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="BookRead" component={BookRead} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="SearchDetail" component={SearchDetail} />
        <Stack.Screen name="ReadHistory" component={ReadHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  myBar: {
    opacity: 0,
  },
});
