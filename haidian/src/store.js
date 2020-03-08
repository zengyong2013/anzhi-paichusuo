import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //要设置的全局访问的state对象
    state: {
        // 已打开的路由数据
        routerArr: localStorage.getItem('dataRouter') ? JSON.parse(localStorage.getItem('dataRouter')) : [],
        // 用户信息数据 (实际生产中 该状态由接口返回决定)
        userData: {
            roles: ['admin'], // 用户拥有的角色 数组
            userName: '曾小晖',
            isLogin: false // 是否登陆
        },

    },
    //实时监听state值的变化(最新状态)
    getters: {
        getRouterArr(state) {  //路由数据
            return state.routerArr
        },
        getUserData(state) {  //userData 用户数据
            return state.userData
        }
    },
    // 自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    mutations: {
        pushRouterArr(state, data) {
            state.routerArr.push(data)
        },
        delRouterArr(state, index) {
            state.routerArr.splice(index, 1)
        }
    },
    // 用来异步触发mutations里函数的方法，context与store 实例具有相同方法和属性
    actions: {
        pushRouter(context, data) {
            context.commit('pushRouterArr', data);
        },
        delRouter(context, index) {
            context.commit('delRouterArr', index);
        }
    }
})
