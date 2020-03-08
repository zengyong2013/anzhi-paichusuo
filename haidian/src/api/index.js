/**
 *   @description 接口请求拦截
 *   @author Xiaohui Zeng
 *   @date 2019/10/5
 */
import axios from 'axios'

// 请求headers
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use(config => {
        const token = localStorage.getItem('userToken');
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.accessToken = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    })

// 响应拦截器
axios.interceptors.response.use(response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    })

export default axios