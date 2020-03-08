import Main from "@/components/main/main";

export const routers = [
    {
        path: "/login",
        name: "login",
        meta: {
            hide: true,
            title: "登录",
            // singlePage: true // 单页
        },
        component: () => import("@/views/login/login")
    },
    {
        path: "/",
        name: "report",
        component: Main,
        meta: {
            hide: false,
            title: "统计报表",
            icon: "md-speedometer",
        },
        children: [
            {
                path: "/report/part1",
                name: "reportPart1",
                meta: {
                    hide: false,
                    title: "公众号注册人员信息表"
                },
                component: () => import("@/views/report/report1")
            },
            {
                path: "/report/part2",
                name: "reportPart2",
                meta: {
                    hide: false,
                    title: "被羁押人员账户综合信息查询",
                    permission: ['admin']
                },
                component: () => import("@/views/report/report2")
            },
        ]
    },
    {
        path: "/message",
        name: "message",
        component: Main,
        meta: {
            hide: false,
            title: "短信通知",
            icon: "md-cube",
            permission: ['admin1','admin']
        },
        children: [
            {
                path: "/message/send",
                name: "messageSend",
                meta: {
                    hide: false,
                    title: "短信发送",
                    permission: ['admin']
                },
                component: () => import("@/views/message/send")
            },
            {
                path: "/message/history",
                name: "messageHistory",
                meta: {
                    hide: false,
                    title: "历史记录",
                    permission: ['admin']
                },
                component: () => import("@/views/message/history")
            },
        ]
    },
    {
        path: "/system",
        name: "system",
        component: Main,
        meta: {
            hide: false,
            title: "系统管理",
            icon: "md-heart-outline",
        },
        children: [
            {
                path: "/system/role",
                name: "systemRole",
                meta: {
                    hide: false,
                    title: "角色管理",
                    icon: 'md-heart-outline'
                },
                component: () => import("@/views/system/role")
            },
            {
                path: "/system/account",
                name: "systemAccount",
                meta: {
                    hide: false,
                    title: "账号管理",
                    icon: 'md-heart-outline'
                },
                component: () => import("@/views/system/account")
            },
        ]
    },
    {
        path: "/log",
        name: "log",
        component: Main,
        meta: {
            hide: false,
            title: "日志管理",
            icon: "md-heart-outline",
        },
        children: [
            {
                path: "/login/log",
                name: "loginLog",
                meta: {
                    hide: false,
                    title: "登录日志",
                    icon: 'md-heart-outline'
                },
                component: () => import("@/views/log/login")
            },
            {
                path: "/action/log",
                name: "actionLog",
                meta: {
                    hide: false,
                    title: "操作日志",
                    icon: 'md-heart-outline'
                },
                component: () => import("@/views/log/action")
            },
        ]
    },
]