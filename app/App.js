import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import TabBar from './tabbar';
import Home from './views/home/index';
import Message from './views/message/index';
import Me from './views/me/index';

// 设置react-native路由导航
const AppStack = createStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode="none" initialRouteName="TabBar">
        <AppStack.Screen name="TabBar" component={TabBar} />
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Message" component={Message} />
        <AppStack.Screen name="Me" component={Me} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};