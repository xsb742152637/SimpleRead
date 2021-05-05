module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'], //表示哪个目录开始设置绝对路径
        alias: {
          '@': './app',
        },
      },
    ],
  ],
};
