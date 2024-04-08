module.exports = {
  presets: ['module:@react-native/babel-preset'],
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // react-native-dotenv
    [
      'module:react-native-dotenv',
      {
        envName: 'API_URL',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
