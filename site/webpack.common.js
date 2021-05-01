const path = require('path');
module.exports = {
  entry: {
    "index": "./src/index.js",
    "sudoku-caller": "./src/sudoku-caller.js",
    "sudoku-smart": "./src/sudoku-smart.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  experiments: {
    syncWebAssembly: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
