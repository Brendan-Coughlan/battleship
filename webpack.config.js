// webpack.config.js (CommonJS config)
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/scripts/sketch.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, "src"),
        type: "javascript/esm",
      },
    ],
  },
};
