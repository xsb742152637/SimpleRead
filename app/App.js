import React from 'react';
//StackNavigator导航
import 'react-native-gesture-handler';
import './utils/load/rootview';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import TabBar from 'tabbar';

import BookRead from './views/bookread/index';
import Search from './views/search/index';
import SearchDetail from './views/search/detail';
import ReadHistory from './views/readhistory/index';

// 设置react-native路由导航
const Stack = createStackNavigator();

export default () => {
  return (
    <NavigationContainer>
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
