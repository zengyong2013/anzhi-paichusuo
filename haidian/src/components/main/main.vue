<template>
    <div class="layout-page">
        <Layout class="layout-div">
            <Sider
                ref="side1"
                hide-trigger
                collapsible
                :collapsed-width="78"
                :width="256"
                v-model="isCollapsed"
                :class="themeType==='light'?'themeLight':'themeDark'"
            >
                <!--:class="isCollapsed?'collapsed_left':''"-->
                <div class="logo" :class="headMaxWidth?'headMaxWidth':''">
                    <div style="font-size: 20px">海淀看守所</div>
<!--                    <img v-if="!isCollapsed && headMaxWidth" :src="headMaxWidthLogoImg" alt="">-->
<!--                    <img v-if="!isCollapsed && !headMaxWidth" :src="logoImg" alt="">-->
<!--                    <img v-if="isCollapsed" src="../../assets/main/logo-small.png" alt="">-->
                </div>
                <Menu
                    :active-name="activeName"
                    :theme="themeType"
                    width="auto"
                    :class="menuitemClasses"
                    :open-names="openNames"
                    accordion
                    ref="side_menu"
                    @on-select="menuNav"
                    @on-open-change="open"
                >
                    <Submenu v-if="!isCollapsed && !item.meta.hide && !item.meta.singlePage" :name="item.name" v-for="(item,index) in routersArr"
                             :key="item.name+index">
                        <template slot="title" v-if="!isCollapsed">
                            <Icon :type="item.meta.icon"/>
                            <span class="titlespan">{{item.meta.title}}</span>
                        </template>
                        <!--<Submenu v-if="!it.meta.hide" v-for="it in item.children" :name="it.name">
                            <template slot="title">{{it.meta.title}}</template>
                            <MenuItem name="3-1">Option 7</MenuItem>
                            <MenuItem name="3-2">Option 8</MenuItem>
                        </Submenu>-->
                        <MenuItem v-if="!isCollapsed && !it.meta.hide" v-for="it in item.children" :name="it.name">
                            <span>{{it.meta.title}}</span>
                        </MenuItem>
                    </Submenu>
                    <!--如果只有一个子路由-->
                    <MenuItem class="ivu-menu-submenu" :class="{ 'liActive': $route.name === it.name}" style="padding: 0!important;"
                              v-else-if="!isCollapsed && !item.meta.hide && item.meta.singlePage" v-for="it in item.children" :name="it.name">
                        <div class="ivu-menu-submenu-title">
                            <Icon :type="item.meta.icon"/>
                            <span style="margin-left: 10px">{{it.meta.title}}</span>
                        </div>
                    </MenuItem>
                    <Dropdown v-if="isCollapsed && !item.meta.hide" v-for="(item,index) in routersArr"
                              :key="item.name+index"
                              class="menuSmall" @on-click="dropdownNav">
                            <span :class="item.name === $route.meta.fuName?'active':''">
                                <Icon :type="item.meta.icon"/>
                            </span>
                        <DropdownMenu slot="list">
                            <template v-for="it in item.children" v-if="!it.meta.hide">
                                <DropdownItem :name="it.name" :selected="it.name === activeName">{{it.meta.title}}
                                </DropdownItem>
                            </template>
                        </DropdownMenu>
                    </Dropdown>
                </Menu>
            </Sider>
            <Layout>
                <!--头部-->
                <Header :style="{padding: 0}" class="header flexR">
                    <div class="header_left flexR">
                        <span>
                            <Icon
                                @click.native="collapsedSider"
                                :class="rotateIcon"
                                type="md-menu"
                                size="24"></Icon>
                        </span>
                        <span @click="refresh()">
                            <Icon type="ios-refresh" size="24"/>
                        </span>
                        <span>
                            <Breadcrumb>
                            <BreadcrumbItem>首页</BreadcrumbItem>
                            <BreadcrumbItem>{{$route.meta.fuTitle}}</BreadcrumbItem>
                            <BreadcrumbItem>{{$route.meta.title}}</BreadcrumbItem>
                        </Breadcrumb>
                        </span>
                    </div>
                    <!--头部右边-->
                    <div class="header_right flexR">
                        <span>
                            <Icon :type="isMaxWindow?'md-contract':'md-expand'" @click="maxWindow" size="18"/>
                        </span>
<!--                        <span>-->
<!--                            <Dropdown trigger="click">-->
<!--                                <Badge :count="3">-->
<!--                                    <Icon type="ios-notifications-outline" size="20"/>-->
<!--                                </Badge>-->
<!--                                <DropdownMenu slot="list">-->
<!--                                    <message></message>-->
<!--                                </DropdownMenu>-->
<!--                            </Dropdown>-->
<!--                       </span>-->
                        <span>
                            <Dropdown @on-click="personalSettings">
                            <a href="javascript:void(0)" style="color: #515A6E;">
                                <img src="../../assets/main/avatar.jpg" alt="" class="ivu-avatar ivu-avatar-small"
                                     style="margin-right: 5px">
                                {{userInfo.name}}
                            </a>
                            <DropdownMenu slot="list">
                                <!-- <DropdownItem name="grzx">个人中心</DropdownItem>
                                <DropdownItem name="sz" divided>设置</DropdownItem> -->
                                <DropdownItem name="logout">退出登陆</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        </span>
                        <span @click="optionDrawer = true">
                           <Icon type="md-more" size="20"/>
                        </span>
                    </div>
                </Header>
                <!--多页标签-->
                <div v-if="isTabsShow" class="tabsNav flexR">
                    <div class="xiala pointer" v-if="tabSwitch" @click="tabLeft">
                        <Icon type="ios-arrow-back" size="16"/>
                    </div>
                    <div class="left flexR" id="tabsNav">
                        <div class="flexR" id="tabsDiv" :style="{transform:transform}">
                            <div class="pointer flexR" v-for="(item,index) in $store.getters.getRouterArr">
                                <span :class="activeName === item.name?'active':''" @click="tabNav(item.name)">{{item.meta.title}}</span>
                                <Icon type="ios-close" size="24" @click="tabNavClose(item,index)"/>
                                <!--<Dropdown trigger="contextMenu" style="margin-left: 5px" @on-click="tabRightClick" @on-visible-change="tabRightStatus($event,item.name)">
                                    <a href="javascript:void(0)">
                                        <Icon type="ios-close" size="24" @click="tabNavClose(item,index)"/>
                                    </a>
                                    <DropdownMenu slot="list" v-if="item.meta.status">
                                        <DropdownItem :name="item.name+'/qt'">关闭其他</DropdownItem>
                                        <DropdownItem :name="item.name+'/left'">关闭左侧</DropdownItem>
                                        <DropdownItem :name="item.name+'/right'">关闭右侧</DropdownItem>
                                        <DropdownItem :name="item.name+'/qb'">全部关闭</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>-->
                            </div>
                        </div>

                    </div>
                    <div class="xiala pointer" v-if="tabSwitch" @click="tabRight">
                        <Icon type="ios-arrow-forward" size="16"/>
                    </div>
                    <div class="right">
                        <Dropdown style="margin-left: 5px;" @on-click="tabRightClick">
                            <div class="xiala pointer">
                                <Icon type="ios-arrow-down"/>
                            </div>
                            <DropdownMenu slot="list">
                                <DropdownItem name="qt">关闭其他</DropdownItem>
                                <!--                                <DropdownItem name="left">关闭左侧</DropdownItem>-->
                                <!--                                <DropdownItem name="right">关闭右侧</DropdownItem>-->
                                <DropdownItem name="qb">全部关闭</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <!--内容区-->
                <Content id="main_content"
                    :style="{height: (!isTabsShow?'calc(100vh - 64px)':'calc(100vh - 108px)'), margin: (!isTabsShow ? '24px 0 24px 24px':'0 0 24px 24px') }"
                    class="main_content">
                    <router-view v-if="isRouterViewShow"></router-view>
                </Content>
                <Drawer v-model="optionDrawer" class="optionDrawer">
                    <Divider slot="header" class="header">主题风格设置</Divider>
                    <div class="flexR imgs">
                        <Tooltip content="时尚酷黑" placement="top" transfer :class="themeType === 'dark'?'active':''">
                            <img src="../../assets/main/nav-theme-dark.svg" alt="" @click="themeSwitch(0)">
                        </Tooltip>
                        <Tooltip content="极简雅白" placement="top" transfer :class="themeType === 'light'?'active':''">
                            <img src="../../assets/main/nav-theme-light.svg" alt="" @click="themeSwitch(1)">
                        </Tooltip>
                    </div>
                    <Divider class="otherDiv">其他设置</Divider>
                    <div class="kaiguan flexR">
                        <span>开启多页签</span>
                        <i-switch v-model="isTabsShow" size="small"/>
                    </div>
                    <div class="kaiguan flexR">
                        <span>顶栏通顶</span>
                        <i-switch v-model="headMaxWidth" size="small"/>
                    </div>
                </Drawer>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    import {routers} from "@/router/router";
    import message from "../message/message";
    import darkImg from '@/assets/main/logo-dark.png'
    import lightImg from '@/assets/main/logo-light.png'
    import {themeData} from '@/config/config'
    import {getCache , delCache , setCache} from '../../config/cache'

    export default {
        name: "main-page",
        components: {message},
        provide(){ return { refresh : this.refresh ,tabNavClose : this.tabNavClose} },
        data() {
            return {
                activeName: "", // 子导航选中的name
                isCollapsed: false, // 是否收缩
                isMaxWindow: false, // 是否最大化窗口
                routersArr: [], // 路由数据
                openNames: [], // 导航打开的父栏目
                transform: 0, // 导航左右方向移动距离
                tabSwitch: false, // 是否显示左右切换图标
                userData: {}, // 登录用户数据
                optionDrawer: false, // 是否显示配置抽屉
                themeType: themeData.themeType ? themeData.themeType : 'dark', // 主题风格
                logoImg: themeData.themeType === 'dark' ? lightImg : darkImg, // 主题logo图片
                isTabsShow: themeData.isTabsShow ? true : false, // 是否显示多页签
                headMaxWidthLogoImg: darkImg, // 栏目是否通顶logo图片
                headMaxWidth: themeData.headMaxWidth ? true : false, // 栏目是否通顶（最大宽度）
                isRouterViewShow: true // 控制router-view的隐藏与展示
            }
        },
        created() {
            var data = getCache('user_info')
            let theme = getCache('theme')
            let isTabsShow = getCache('isTabsShow')
            let headMaxWidth = getCache('headMaxWidth')
            if(theme){
                this.themeType = theme.type
                this.logoImg = theme.logoImg
            }
            if(isTabsShow === true || isTabsShow === false) this.isTabsShow = isTabsShow
            if(headMaxWidth === true || headMaxWidth === false) this.headMaxWidth = headMaxWidth
            this.userInfo = data.userInfo
            this.setRouterArr()
        },
        mounted() {
            // 如果没有权限 回到默认首页 防止错误地址程序崩溃 跳转非法路由
            if (this.$route.meta.hide) {
                this.$router.push({
                        path: '/'
                    }
                )
            }
            // 页面刷新后 保存打开的路由数据到本地存储
            window.addEventListener('unload', this.saveState)
            this.activeName = this.$route.name
            this.openNames = []
            this.openNames.push(this.$route.meta.fuName)
            this.$nextTick(() => {
                // 重新渲染导航
                this.$refs.side_menu.updateOpened()
                // this.$refs.side_menu.updateActiveName()
            })
            // console.log(this.$route);
            document.title = this.$route.meta.title;
        },
        computed: {
            // 获取vuex 路由数据
            getRouterArrVuex() {
                return this.$store.getters.getRouterArr
            },
            // 收缩的图标
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            // 导航收缩
            menuitemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
        },
        methods: {
            // 收缩切换
            collapsedSider() {
                this.$refs.side1.toggleCollapse();
                this.$nextTick(() => {
                    // 重新渲染导航
                    this.$refs.side_menu.updateOpened()
                    this.$refs.side_menu.updateActiveName()
                })
            },
            // 处理路由数据 包含路由角色权限
            setRouterArr() {
                let self = this
                // 获取用户数据
                this.userData = this.$store.getters.getUserData
                for (let v of routers) {
                    if (v.children) {
                        let obj = setFuName(v.children, v)
                        v.children = obj.children
                        v.meta = obj.v.meta
                        if(v.children.length === 1){
                            v.meta.singlePage = true
                        }
                    }
                }
                function setFuName(chid, v) {
                    let flag = false // true有权限
                    let fuFlag = false // 父级 true有权限
                    v.meta.hideArr = [] // 用于记录子菜单是否有权限
                    // 开始处理父级
                    if (!self.$isBlank(v.meta.permission)) {
                        // 如果父级存在 meta.permission
                        for (let u of self.userData.roles) {
                            for (let fv of v.meta.permission) {
                                if (u === fv) {
                                    // 如果 v.permission有其中一个 = self.userData.roles权限 有权限
                                    fuFlag = true
                                    break
                                } else {
                                    // 一个都不等于 无权限
                                    fuFlag = false
                                }
                            }
                        }
                    } else {
                        // 父级不存在 meta.permission 有权限
                        fuFlag = true
                    }

                    // 开始处理子级
                    for (let k of chid) {
                        k.meta.fuName = v.name
                        k.meta.fuTitle = v.meta.title
                        // k.meta.status = true
                        for (let u of self.userData.roles) {
                            if (!self.$isBlank(k.meta.permission)) {
                                // 判断是否存在meta.roles
                                for (let ur of k.meta.permission) {
                                    if (u === ur) {
                                        // 如果 meta.roles有其中一个 = self.userData.roles权限 有权限
                                        flag = true
                                        break
                                    } else {
                                        // 一个都不等于 无权限
                                        flag = false
                                    }
                                }
                            } else {
                                // 不存在meta.roles 有权限
                                flag = true
                            }
                        }
                        if (flag) {
                            // 有权限
                            k.meta.hide = false // 是否显示导航 多页签
                            k.meta.isPermission = false // 是否有权限
                            v.meta.hideArr.push(1)
                        } else {
                            // 无权限
                            k.meta.hide = true
                            k.meta.isPermission = true
                            v.meta.hideArr.push(0)
                        }

                    }
                    // 如果父级 存在meta.permission
                    if (!self.$isBlank(v.meta.permission)) {
                        // 如果父级有权限
                        if (fuFlag) {
                            for (let f of v.meta.hideArr) {
                                if (f === 1) {
                                    // 有权限
                                    fuFlag = true
                                    break
                                } else {
                                    // 无权限
                                    fuFlag = false
                                }
                            }
                        }
                    } else {
                        for (let f of v.meta.hideArr) {
                            if (f === 1) {
                                // 有权限
                                fuFlag = true
                                break
                            } else {
                                // 无权限
                                fuFlag = false
                            }
                        }
                    }
                    // 父级有权限
                    if (fuFlag) {
                        // 如果路由配置里面 meta.hide=true 就隐藏
                        if (!self.$isBlank(v.meta.hide)) {
                            if (v.meta.hide) {
                                v.meta.hide = true
                                v.meta.isPermission = false // 有权限
                            }
                        } else {
                            // 有权限
                            v.meta.hide = false
                            v.meta.isPermission = false // 有权限
                        }
                    } else {
                        // 无权限
                        v.meta.hide = true
                        v.meta.isPermission = true // 无权限
                        // 把所有的子路由全部变成没权限
                        for (let z of chid) {
                            z.meta.hide = true
                        }
                    }
                    return {
                        children: chid,
                        v: v
                    }
                }

                this.routersArr = routers
                // console.log(this.routersArr);
            },
            // 导航跳转
            menuNav(name) {
                this.routerPush(name)
            },
            // 父级栏目展开收缩事件
            open(name) {
                this.openNames = ['' + name + '']
            },
            // 下拉菜单跳转
            dropdownNav(name) {
                this.routerPush(name)
            },
            // tab切换跳转
            tabNav(name) {
                this.routerPush(name)
            },
            // 路由跳转
            routerPush(name) {
                this.$router.push({
                    name: name
                })
                this.$nextTick(() => {
                    let w = document.getElementById('tabsDiv').offsetWidth
                    let zw = document.getElementById('tabsNav').offsetWidth
                    if (w > zw) {
                        this.tabSwitch = true
                    }
                })
            },
            // tab关闭
            tabNavClose(item, index) {
                let arr = this.$store.getters.getRouterArr
                // 判断是否是首页
                if (item.name !== this.$indexPage) {
                    this.$store.dispatch('delRouter', index)
                    if (index !== 0) {
                        this.$router.push({
                            name: arr[index - 1].name
                        })
                    }
                }
                this.$nextTick(() => {
                    let w = document.getElementById('tabsDiv').offsetWidth
                    let zw = document.getElementById('tabsNav').offsetWidth
                    if (w < zw) {
                        this.tabSwitch = false
                    }
                })
            },
            // tab最右侧下拉框右键选中
            tabRightClick(type) {
                let arr = this.$store.getters.getRouterArr
                this.tabSwitch = false
                switch (type) {
                    case 'qt':
                        for (let i = arr.length - 1; i > -1; i--) {
                            if (arr[i].name !== this.activeName) {
                                this.$store.dispatch('delRouter', i)
                            }
                        }
                        break
                    case 'qb':
                        // 判断是否是首页
                        if (this.$route.name !== this.$indexPage) {
                            for (let i = arr.length - 1; i > -1; i--) {
                                this.$store.dispatch('delRouter', i)
                            }
                        }
                        break
                }
            },
            // 窗口最大化
            maxWindow() {
                if (this.isMaxWindow) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                    this.isMaxWindow = false
                } else {
                    let element = document.documentElement
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                    this.isMaxWindow = true
                }
            },
            // 向左切换
            tabLeft() {
                this.transform = 'translateX(0px)'
            },
            // 向右切换
            tabRight() {
                let w = document.getElementById('tabsDiv').offsetWidth
                let zw = document.getElementById('tabsNav').offsetWidth
                if (w > zw) {
                    let s = -(w - zw)
                    this.transform = 'translateX(' + s + 'px)'
                }
            },
            // 页面刷新后 将vuex路由数据存储到本地
            saveState() {
                let arr = this.$store.getters.getRouterArr
                let arr1 = []
                for (let v of arr) {
                    let item = {
                        fullPath: v.fullPath,
                        meta: v.meta,
                        name: v.name,
                        path: v.path
                    }
                    arr1.push(item)
                }
                localStorage.setItem('dataRouter', JSON.stringify(arr1))
            },
            // 主题切换
            themeSwitch(type) {
                if (type === 0) {
                    this.themeType = 'dark'
                    this.logoImg = lightImg
                } else {
                    this.themeType = 'light'
                    this.logoImg = darkImg
                }
                setCache('theme' , {type : this.themeType , logoImg : this.logoImg})
            },
            // 页面刷新
            refresh() {
                // 先隐藏
                this.isRouterViewShow = false
                // $nextTick() 将回调延迟到下次 DOM 更新循环之后执行
                this.$nextTick(() => {
                    this.isRouterViewShow = true
                })
            },
            // 个人设置功能
            personalSettings(name) {
                if (name === 'logout') {
                    delCache('user_info')
                    this.$router.push({
                        name: this.$loginPage
                    })
                }
            }
        },
        watch: {
            isTabsShow(){
                setCache('isTabsShow' , this.isTabsShow)
            },
            headMaxWidth(){
                setCache('headMaxWidth' , this.headMaxWidth)
            },
            // 监听路由跳转
            $route() {
                this.activeName = this.$route.name
                this.openNames = []
                this.openNames.push(this.$route.meta.fuName)
                this.$nextTick(() => {
                    this.$refs.side_menu.updateOpened()
                    this.$refs.side_menu.updateActiveName()
                    this.saveState()
                })
                document.title = this.$route.meta.title ;
            },
            // 监听路由数组改变
            getRouterArrVuex(val) {
                if (val.length < 1) {
                    this.$router.push({
                        name: this.$indexPage
                    })
                }
                // 动态监听路由变化 自动滚动多页签导航
                this.$nextTick(()=>{
                    let zw = document.getElementById('tabsNav').offsetWidth // 总宽度
                    let w = document.getElementById('tabsDiv').offsetWidth // 导航宽度
                    if (w > zw) {
                        let s = -(w - zw)
                        this.transform = 'translateX(' + s + 'px)'
                    } else {
                        this.tabLeft()
                    }
                })
            }
        },
        filters: {}
    }
</script>

<style lang="less">
    @import "main";
</style>