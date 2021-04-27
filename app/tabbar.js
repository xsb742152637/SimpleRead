/*
 * @Author: zhangyu
 * @Date: 2021-01-09 23:50:02
 * @LastEditTime: 2021-01-10 01:00:18
 */
import React from 'react';
import {View} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import SVG from 'react-native-svg-uri';
import {
  home,
  selectedHome,
  message,
  selectedMessage,
  me,
  selectedMe,
} from './resources/svg/svg';

import Home from './views/home/index';
import Message from './views/message/index';
import Me from './views/me/index';

export default class TabBar extends React.Component {
  state = {
    selectedTab: 'home',
    pages: [
      {
        selected: 'home',
        title: '首页',
        renderIcon: () => <SVG width="20" height="20" svgXmlData={home} />,
        renderSelectedIcon: () => (
          <SVG width="20" height="20" svgXmlData={selectedHome} />
        ),
        onPress: () => this.setState({selectedTab: 'home'}),
        component: <Home />,
      },
      {
        selected: 'message',
        title: '消息',
        renderIcon: () => <SVG width="20" height="20" svgXmlData={message} />,
        renderSelectedIcon: () => (
          <SVG width="20" height="20" svgXmlData={selectedMessage} />
        ),
        onPress: () => this.setState({selectedTab: 'message'}),
        component: <Message />,
      },
      {
        selected: 'me',
        title: '我的',
        renderIcon: () => <SVG width="20" height="20" svgXmlData={me} />,
        renderSelectedIcon: () => (
          <SVG width="20" height="20" svgXmlData={selectedMe} />
        ),
        onPress: () => this.setState({selectedTab: 'me'}),
        component: <Me />,
      },
    ],
  };
  render() {
    const {selectedTab, pages} = this.state;
    return (
      <View style={{flex: 1}}>
        <TabNavigator>
          {pages.map((v, i) => (
            <TabNavigator.Item
              key={i}
              selected={selectedTab === v.selected}
              title={v.title}
              renderIcon={v.renderIcon}
              renderSelectedIcon={v.renderSelectedIcon}
              onPress={v.onPress}
              selectedTitleStyle={{color: '#333333'}}>
              {v.component}
            </TabNavigator.Item>
          ))}
        </TabNavigator>
      </View>
    );
  }
}
