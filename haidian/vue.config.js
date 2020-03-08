module.exports = {
    baseUrl: "./", // ./相对路径
    productionSourceMap: false,// 打包时不生成.map文件
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        open: true,
        /*proxy: {
            '/api': {
                target: '',
                changeOrigin: true
            }
        }*/
    }
}