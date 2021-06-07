/*
 * 列表的一个对象
 * @Author: xie
 * @Date: 2021-05-10
 */
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {isNull} from '@/utils/function';
import StyleConfig from '@/config/styleConfig';

export default class Item extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // let item2 = {
    //   type: 1,
    //   itemName: '书名',
    //   imgUrl: '图片',
    //   itemTitle: '阅读进度或作者',
    //   itemInfo1: '11111',
    //   itemInfo2: '22222',
    // };
    let data = this.props.data;
    return (
      <View style={global.appStyles.card}>
        {isNull(data.imgUrl) ? (
          <Text />
        ) : (
          <View>
            <Image
              source={{uri: data.imgUrl}}
              style={{width: data.imgWidth, height: data.imgHeight}}
            />
          </View>
        )}
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{data.itemName}</Text>
          <Text numberOfLines={1} style={styles.itemTitle}>
            {data.itemTitle}
          </Text>
          <Text numberOfLines={1} style={styles.itemInfo}>
            {data.itemInfo1}
          </Text>
          <Text numberOfLines={3} style={styles.itemInfo}>
            {data.itemInfo2}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContent: {
    paddingLeft: StyleConfig.padding.baseLeft,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemName: {
    color: StyleConfig.color.titleText,
    fontSize: StyleConfig.fontSize.titleText,
  },
  itemTitle: {
    color: StyleConfig.color.text,
    fontSize: StyleConfig.fontSize.detailText,
  },
  itemInfo: {
    color: StyleConfig.color.detailText,
    fontSize: StyleConfig.fontSize.detailText,
  },
});
