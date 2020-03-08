import Vue from 'vue'
import Router from 'vue-router'
import index from '@/page/index'
import remittance from '@/page/remittance'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'index',
            component: index
        },
        {
            path: '/remittance',
            name: 'remittance',
            component: remittance
        }
    ]
})