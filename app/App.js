import React from 'react';
//StackNavigator导航
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import TabBar from './tabbar';

import BookCity from './views/bookcity/index';
import BookList from './views/booklist/index';
import BookRead from './views/bookread/index';
import Me from './views/me/index';
import Search from './views/search/index';
// 设置react-native路由导航
const Stack  = createStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="TabBar">
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="BookRead" component={BookRead} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
