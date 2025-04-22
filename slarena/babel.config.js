module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
     // add this if you’re using TypeScript
           // add this only if you're using Flow
  ],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
