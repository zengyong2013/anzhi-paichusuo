const axios = require('axios');
const { getCache } = require('../config/cache')
export const domain = 'http://39.106.223.161:8878'
import qs from 'qs';
/**
 *  fetchBase 请求基类
 *  url [string]  请求地址
 *  params [string/object/ArrayBuffer]  请求参数
 *  method [string]  请求方法
 *  return Promise
 **/
export const getFullUrl = (url , params) => {
    let userCache = getCache('user_info')
    if(userCache) params.token = userCache.token
    let paramsStr = []
    for(let i in params){
        paramsStr.push(i + '=' +params[i])
    }
    return domain + url + '?' + paramsStr.join('&')
}
export const fetchBase = (url , params = {} , method = 'get' , headers = { 'content-type': 'application/x-www-form-urlencoded' }) =>{
    let userCache = getCache('user_info')
    if(userCache) params.token = userCache.token
    var reqConfig = {
        headers:headers,
        baseURL:domain,
        url: url,
        method:method,
        timeout: 600000,
    }
    if(method == 'get') reqConfig.params = params
    if(method == 'post' || method == 'delete' || method == 'put') reqConfig.data = qs.stringify(params)
    return new Promise((resolve , reject) => {
        axios.request(reqConfig).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })

}