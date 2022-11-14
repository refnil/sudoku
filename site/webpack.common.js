const path = require("path");
module.exports = {
    entry: {
        "index": "./src/index.js",
        "sudoku-caller": "./src/sudoku-caller.js",
        "sudoku-smart": "./src/sudoku-smart.js",
        "solid": "./src/solid.js",
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
            {
                test: /\.m?j|ts$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["solid"]
                    }
                }
            }
        ],
    },
    resolve: {
        extensions: [".js"],
    },
    devServer: {
        static: "./dist",
    },
};
