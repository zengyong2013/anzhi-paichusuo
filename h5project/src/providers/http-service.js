import axios from 'axios';
import { Toast } from 'vant'
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://39.106.223.161:8878'; //填写域名
import qs from 'qs'
//http request 拦截器
axios.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    return response
}, err => {
    Toast('服务器错误')
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                console.log('错误请求')
                break;
            case 401:
                console.log('未授权，请重新登录')
                break;
            case 403:
                console.log('拒绝访问')
                break;
            case 404:
                console.log('请求错误,未找到该资源')
                break;
            case 405:
                console.log('请求方法未允许')
                break;
            case 408:
                console.log('请求超时')
                break;
            case 500:
                console.log('服务器端出错')
                break;
            case 501:
                console.log('网络未实现')
                break;
            case 502:
                console.log('网络错误')
                break;
            case 503:
                console.log('服务不可用')
                break;
            case 504:
                console.log('网络超时')
                break;
            case 505:
                console.log('http版本不支持该请求')
                break;
            default:
                console.log(`连接错误${err.response.status}`)
        }
    } else {
        console.log(err)
        console.log('连接到服务器失败')
    }
    return Promise.resolve(err.response)
})


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(response => {
                if (response.data.code == 2000) {
                    resolve(response.data);
                } else {
                    Toast('请求失败')
                    reject(response.data)
                }
            })
            .catch(err => {
                Toast('请求失败')
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
    data = qs.stringify(data)
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                if (response.data.code == 2000) {
                    resolve(response.data);
                } else if (response.data.code == 5001) {
                    Toast.fail({
                        duration: 3000, // 持续展示 toast
                        message: response.data.msg
                    });
                    reject(response.data)
                } else {
                    Toast('请求失败')
                    reject(response.data)
                }
            }, err => {
                Toast('请求失败')
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {

    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 下面是获取数据的接口
 */

export const server = {
    /** 
     * 获取验证码
     */
    sendCode: function(paramObj) {
        return post('/gzh/getSms', paramObj);
    },

    /** 
     * 公众号在押人家属注册
     */
    saveCustodyFolk: function(paramObj) {
        return post('/gzh/saveCustodyFolk', paramObj);
    },

    /** 
     * 保存汇款信息
     */
    saveCustody: function(paramObj) {
        return post('/gzh/saveCustody', paramObj);
    },

    /** 
     * 生成二维码
     */
    getQRCodeStr: function(paramObj) {
        return post('/gzh/getQRCodeStr', paramObj);
    }


}