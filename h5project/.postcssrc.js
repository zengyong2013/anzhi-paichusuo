module.exports = {
    "plugins": {
        // to edit target browsers: use "browserslist" field in package.json
        "postcss-import": {},
        "autoprefixer": {},
        "postcss-px2rem-exclude": { // 添加的代码
            remUnit: 75,
            exclude: /node_modules/i // 忽略node_modules目录下的文件
        }
    }
}