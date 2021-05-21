/*
 * @Author: zhangyu
 * @Date: 2021-01-05 20:43:07
 * @LastEditTime: 2021-01-09 23:22:31
 */
import React from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
} from 'react-native';
import StyleConfig from '@/config/styleConfig';
import {
  getId,
  textFormat,
  isNull,
  mergeSpace,
  contentFormat,
} from '@/utils/function';
import {setSpText, scaleSize} from '@/utils/screenUtil';

export default class BookRead3 extends React.Component {
  constructor(props) {
    super(props);

    let chapterId = 'A4A57781-B5D6-40FD-9DB7-140FAF554470';
    let detail = global.realm.findDetail(chapterId);

    this.state = {
      title: detail.title,
      content: detail.content,
    };
  }
  componentDidMount() {}

  render() {
    return (
      <View style={global.appStyles.content}>
        <ScrollView
          style={styles.myScrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // horizontal ={true}
          pagingEnabled ={true}
          alwaysBounceVertical ={true}
        >
          {/*<Text>{this.state.title}</Text>*/}
          <Text>{this.state.content}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  myScrollView: {
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'solid',
  },
});
