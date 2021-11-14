const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new AddAssetHtmlPlugin({
          filepath: require.resolve('./src/wasmjs/init_go.js'),
        }),
        new AddAssetHtmlPlugin({
          filepath: require.resolve('./src/wasmjs/wasm_exec.js'),
        }),
      ],
    },
  },
};
