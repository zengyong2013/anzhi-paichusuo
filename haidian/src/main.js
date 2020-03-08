import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import router from "./router/index"; // 路由
import {beforeRouter} from "./router/index"; // 路由拦截
import axios from "./api/index"; // 网络请求配置
import store from "./store";
import 'babel-polyfill' // 解决ie兼容问题
import iView from "iview";
import "iview/dist/styles/iview.css";
import "./css/public.less"; // 公共css样式
Vue.use(iView);
// 工具
import {backPage, isNotNull, isBlank} from "./config/util";
// 配置文件
import {indexPage, loginPage} from "./config/config";
// 引入mock文件
// require('./mock/index') // mock 方式，正式发布时，注释掉该处即可
import {reqGet , reqPost , reqPut , reqDelete , reqUploadFile} from "./request/request";
import { getFullUrl } from './request/base'

Vue.prototype.$axios = axios
Vue.prototype.$backPage = backPage
Vue.prototype.$isNotNull = isNotNull
Vue.prototype.$isBlank = isBlank
Vue.prototype.$indexPage = indexPage
Vue.prototype.$loginPage = loginPage
Vue.prototype.reqGet = reqGet
Vue.prototype.reqPost = reqPost
Vue.prototype.reqPut = reqPut
Vue.prototype.reqDelete = reqDelete
Vue.prototype.reqUploadFile = reqUploadFile
Vue.prototype.getFullUrl = getFullUrl
// 解决跳转同一个路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 路由跳转前事件
router.beforeEach((to, from, next) => {
    beforeRouter(to, from, next)
})
// 路由切换 滚到到顶部
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
    if(to.name !== loginPage){
        // 如果不是登录页 内容区域滚动到顶部
        Vue.nextTick(() => {
            document.getElementById('main_content').scrollTo(0, 0);
        })
    }
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
