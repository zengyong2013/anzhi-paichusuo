import Vue from "vue";
import Router from "vue-router";
import {routers} from "./router";
import store from "../store";
import {indexPage, loginPage} from "../config/config";
import {Message} from 'iview';

Vue.use(Router);

export default new Router({
    routes: routers
});

// 路由跳转前事件
export const beforeRouter = (to, from, next) => {
    let arr = store.getters.getRouterArr
    if (to.path === "/") {
        // 默认跳转到配置的登录页
        next({
            name: loginPage
        })
    } else if (to.matched.length === 0) {
        // 如果未匹配到正确的路由
        Message.warning('地址不对哦！')
        // 如果上级也未匹配到路由则跳转首页页面，如果上级能匹配到则转上级路由
        from.name ? next({name: from.name}) : next('/')
    } else {
        // 判断是否有权限访问
        if(to.meta.isPermission) {
            Message.warning('没有权限哦！')
            // 转上级路由
            next({name: from.name})
            return
        }
        // 把路由数据push到vuex
        let flag = false
        if (arr.length < 1) {
            flag = true
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name === to.name) {
                    flag = false
                    break
                } else {
                    flag = true
                }
            }
        }
        if (flag) {
            // 如果不是登陆页面
            if(to.name !== 'login') {
                let item = {
                    fullPath: to.fullPath,
                    meta: to.meta,
                    name: to.name,
                    path: to.path
                }
                // 增加数据
                store.dispatch('pushRouter', item)
            }
        }
        next() // 默认跳转
    }
}