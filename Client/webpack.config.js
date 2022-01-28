const path = require('path')

module.exports = {
  mode: "development",
  // mode: "production",
  entry: `./Src/index.js`,
  output: {
    path: `${__dirname}/Public`,
    filename: "bundle.js"
  },
  devServer: {
    // contentBase: path.join(__dirname, 'Public'),
    static: "Public",
    // publicPath: '/assets/',
    open: true
  }
};