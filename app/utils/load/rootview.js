import React, {Component} from 'react';
import {StyleSheet, AppRegistry, View, Text} from 'react-native';
import Loading from './loading';
import Toast from './toast';
const originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = (appKey, component) => {
  return originRegister(appKey, function () {
    const OriginAppComponent = component();
    return class extends Component {
      render() {
        return (
          <View style={styles.container}>
            <OriginAppComponent />
            {/* 提示 */}
            <Toast />
            {/* //加载动画 */}
            <Loading />
          </View>
        );
      }
    };
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
