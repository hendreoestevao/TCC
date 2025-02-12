const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  resolve: {
    fallback: {
      "fs": false, // Caso esteja usando algo como 'fs'
      "path": require.resolve("path-browserify")
    }
  },
  plugins: [
    new NodePolyfillPlugin()
  ]
};
