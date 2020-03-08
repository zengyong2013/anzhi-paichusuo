<template>
    <div>
        <div class="flex-column-center" style="margin-top:20px">
            <div>角色名称：</div><Input v-model="searchRoleName" style="width: 120px;margin-right:15px" />
            <div>角色编号：</div><Input v-model="searchRoleCid" style="width: 120px;margin-right:15px" />
            <div class="flex" style="margin-left:20px">
                <Button style="margin-right:20px" @click="currPage = 1 , getRoleList()" type="primary">查询</Button>
                <Button @click="showAddRole = true" type="primary">新增</Button>
            </div>
        </div>
        <Table style="margin-top:40px" :data="list" :columns="columns" class="table-container"></Table>

        <Modal v-model="showAddRole" :title="roleModalTitle" @on-ok="addRoleOk" >
            <div >
<!--                <div>角色编号：{{roleNumber}}</div>-->
                <div style="margin-top:20px" class="flex-column-center"><div>角色名称：</div><Input v-model="roleName" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>角色描述：</div><Input v-model="roleDesc" style="width: 120px;margin-right:15px" /></div>
            </div>
        </Modal>
        <Modal v-model="showAuth" title="新增角色" @on-ok="editAuthOk" >
            <CheckboxGroup v-model="authSec">
                <div v-for="item in totalMenuList">
                    <Checkbox :label="item.id">{{item.name}}</Checkbox>
                </div>
            </CheckboxGroup>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "systemRole",
        inject:['refresh'],
        mounted(){
            this.getRoleList()
            this.getMenuList()
        },
        data(){
            return {
                editAuthRoleId : '' ,
                authSec : [],
                roleName:'',
                roleNumber:'J0003',
                roleDesc : '',
                showAddRole: false,
                showAuth : false,
                searchRoleName : '',
                searchRoleCid : '',
                roleModalTitle : '新增角色',
                list : [],
                actionStyle:{cursor: 'pointer' , margin:'0 3px'},
                totalMenuList : [],
                menuList: [
                    {id : 1, name :'报表统计'},
                    {id : 2, name :'短信发送'},
                    {id : 3, name :'系统管理'},
                ],
                columns : [
                    {title : '角色编号' , key : 'roleCid'},
                    {title : '角色名称' , key : 'name'},
                    {title : '角色描述' , key : 'remark'},
                    {title : '操作' , key : 'action' , render:(h , params)=>{return this.renderAction(h , params)}},
                ],
            }
        },
        methods : {
            getMenuList(){
                this.reqPost('/roleMenu/getMenu').then(res => {
                    if(res.code == 2000) this.totalMenuList = res.data
                })
            },
            addRoleOk(){
                let data = {name : this.roleName , remark:this.roleDesc}
                if(!this.roleName) return this.$Message.warning('角色名称不能为空')
                if(this.roleId) data.id = this.roleId
                this.reqPost('/role/saveOrUpdateRole',data).then(res => {
                    this.roleId = ''
                    this.roleName = ''
                    this.roleDesc = ''
                    if(res.code != 2000) return this.$Message.warning('操作出错')
                    this.$Message.success('操作成功')
                    this.refresh()
                })
            },
            del(index){
                let item = this.list[index]
                this.reqPost('/role/deleteById' , {id : item.id}).then(res => {
                    if(res.code != 2000) return this.$Message.warning('删除出错')
                    this.$Message.success('删除成功')
                    this.refresh()
                })
            },
            editRole(index){
                let item = this.list[index]
                this.roleId = item.id
                this.roleName = item.name
                this.roleDesc = item.remark
                this.roleModalTitle = '修改角色'
                this.showAddRole = true
            },
            editAuthOk(){
                console.log(this.authSec)
                if(this.authSec.length <= 0) return
                let ids = this.authSec.join(',')
                let roleId = this.editAuthRoleId
                this.reqPost('/roleMenu/updMenuByRoleId', {roleId , ids}).then(res => {
                    if(res.code != 2000) return this.$Message.warning('操作失败')
                    this.$Message.success('操作成功')
                    this.refresh()
                })
            },
            editAuth(params){
                this.showAuth = true
                this.authSec = []
                let roleId = params.row.id
                this.editAuthRoleId = roleId
                this.reqPost('/roleMenu/getRoleMenuByRoleId' , {roleId}).then(res => {
                    if(res.code != 2000) return this.$Message.warning('获取角色权限错误')
                    let data = res.data
                    for(let i in data) if(data[i]) this.authSec.push(data[i].menuId)
                })
            },
            async getRoleList(){
                let data = {}
                if(this.searchRoleCid) data.roleCid = this.searchRoleCid
                if(this.searchRoleName) data.name = this.searchRoleName
                let res = await this.reqPost('/role/findListByPage' , data)
                if(res.code != 2000) return this.$Message.warning('获取数据失败')
                this.list = res.data.list
            },
            renderAction(h , params){
                return h('div' ,
                    { style : {display:'flex'} },
                    [
                        h('i-button', { class:'ivu-btn-small ivu-btn-error',style:'margin-right:10px', on: { click: () => { this.del(params.index) } } }, '删除'),
                        h('i-button', { class:'ivu-btn-small ivu-btn-primary',style:'margin-right:10px', on: { click: () => { this.editRole(params.index) } } }, ' 编辑'),
                        h('i-button', { class:'ivu-btn-small ivu-btn-success', on: { click: () => { this.editAuth(params) } } }, ' 功能权限')
                    ]
                )
            }
        }
    }
</script>

<style scoped>

</style>