<template>
    <div>
        <div class="flex-column-center" style="margin-top:20px">
            <div>账号名称：</div><Input v-model="accountName" style="width: 120px;margin-right:15px" />
            <div>电话号码：</div><Input v-model="phone" style="width: 120px;margin-right:15px" />
            <div class="flex-all-center" style="margin-right:15px">
                <div style="width: 120px;">所属角色：</div>
                <Select v-model="roleId">
                    <Option v-for="item in roleList" :value="item.id">{{ item.name }}</Option>
                </Select>
            </div>
            <div class="flex-all-center" style="margin-right:15px">
                <div style="width: 120px;">启用状态：</div>
                <Select v-model="status">
                    <Option :value="0">禁用</Option>
                    <Option :value="1">启用</Option>
                </Select>
            </div>
            <div class="flex" style="margin-left:20px">
                <Button @click="currPage = 1 , getList()" style="margin-right:20px" type="primary">查询</Button>
                <Button @click="showAddAccount = true" type="primary">新增</Button>
            </div>
        </div>
        <Table style="margin-top:40px" :data="list" :columns="columns" class="table-container"></Table>
        <div style="width: 100%" class="flex-all-center"><Page @on-change="pageChange" style="margin-top:20px" :page-size="pageSize"  :total="totalCount" /></div>
        <Modal v-model="showAddAccount" title="新增账号" @on-cancel="initAddAccount" @on-ok="addAccountOk" >
            <div >
<!--                <div>角色编号：{{accountId}}</div>-->
                <div style="margin-top:20px" class="flex-column-center"><div>账号名称：</div><Input v-model="modalAccountName" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>电话号码：</div><Input v-model="modalPhone" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>邮箱地址：</div><Input v-model="emailAddress" style="width: 120px;margin-right:15px" /></div>
                <div class="flex-column-center" style="margin-top:20px">
                    <div>所属角色：</div>
                    <Select style="width: 120px" v-model="modalRole">
                        <Option v-for="item in roleList" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="flex-column-center" style="margin-top:20px">
                    <div>启用状态：</div>
                    <RadioGroup v-model="roleStatus">
                        <Radio :label="0">禁用</Radio>
                        <Radio :label="1">启用</Radio>
                    </RadioGroup>
                </div>
                <div class="flex-column-center" style="margin-top:20px">
                    <div style="width: 60px">备注：</div>
                    <textarea v-model="textareaValue" cols="60" rows="3"></textarea>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "systemAccount",
        inject : ['refresh'],
        data(){
            return {
                editId:'',
                textareaValue:'',
                modalAccountName : '',
                modalPhone : '',
                emailAddress : '',
                roleStatus : '',
                modalRole : '',
                accountId : 10001,
                showAddAccount : false,
                status : '',
                accountName : '',
                phone : '',
                roleId: '',
                roleList : [],
                list : [],
                actionStyle:{cursor: 'pointer' , margin:'0 3px'},
                columns : [
                    {title : '账号名称' , key : 'name'},
                    {title : '电话号码' , key : 'phone'},
                    {title : '邮箱地址' , key : 'email'},
                    {title : '所属角色' , key : 'roleName'},
                    {title : '启用状态' , key : 'enableStatus' , render:(h , params) => {return this.renderStatus(h , params)}},
                    {title : '操作' , key : 'action' , render:(h , params)=>{return this.renderAction(h , params)}},
                ],
                totalCount : 0,
                pageSize : 10,
                currPage : 3,
            }
        },
        mounted(){
            this.getRoleList()
            this.getList()
        },
        methods : {
            async getRoleList(){
                let res = await this.reqPost('/role/findListByPage')
                if(res.code != 2000) return this.$Message.warning('获取角色数据失败')
                this.roleList = res.data.list
            },
            pageChange(currPage){
                this.currPage = currPage
                this.getList()
            },
            async getList(){
                let data = {page : this.currPage , pageSize: 10}
                if(this.accountName) data.name = this.accountName
                if(this.phone) data.phone = this.phone
                if(this.roleId) data.roleId = this.roleId
                if(this.status !== '') data.enableStatus = this.status
                this.reqPost('/user/findListByPage' , data).then(res => {
                    if(res.code != 2000) return this.$Message.warning('拉取数据失败')
                    this.list = res.data.list
                    this.totalCount = res.data.count
                })
            },
            edit(index){
                let item = this.list[index]
                this.editId = item.id
                this.modalAccountName = item.name
                this.modalPhone = item.phone
                this.emailAddress = item.email
                this.modalRole = item.roleId
                this.roleStatus = item.enableStatus ? 1 : 0
                this.textareaValue = item.remark
                this.showAddAccount = true
            },
            addAccountOk(){
                let msg = ''
                if(!this.modalAccountName) msg = '账号名称未填写'
                if(!this.modalPhone) msg = '手机号未填写'
                if(!this.emailAddress) msg = '邮箱地址未填写'
                if(!this.modalRole) msg = '角色未选取'
                if(this.roleStatus === '') msg = '角色状态未选取'
                if(msg) return this.$Message.warning(msg)
                let data = {
                    name : this.modalAccountName,
                    phone : this.modalPhone,
                    roleId : this.modalRole,
                    email : this.emailAddress,
                    enableStatus : this.roleStatus == 1 ? true : false
                }
                if(this.textareaValue) data.remark = this.textareaValue
                if(this.editId) data.id = this.editId
                this.reqPost('/user/saveOrUpdateUser' , data).then(res => {
                    this.initAddAccount()
                    if(res.code != 2000) return this.$Message.warning('操作失败')
                    this.$Message.success('操作成功')
                    this.refresh()
                })
            },
            initAddAccount(){
                this.modalAccountName = ''
                this.modalPhone = ''
                this.emailAddress = ''
                this.modalRole = ''
                this.roleStatus = ''
                this.textareaValue = ''
                this.editId = ''
            },
            renderAction(h , params){
                return h('div' ,
                    { style : {display:'flex'} },
                    [
                        h('i-button', {class:'ivu-btn-small ivu-btn-error',style:'margin-right:10px', on: { click: () => { this.del(params.index) } } }, '删除'),
                        h('i-button', { class:'ivu-btn-small ivu-btn-primary',style:'margin-right:10px', on: { click: () => { this.edit(params.index) } } }, ' 编辑'),
                        h('i-button', { class:'ivu-btn-small ivu-btn-success',style:'margin-right:10px', on: { click: () => { this.detail(params.index) } } }, ' 详情')
                    ]
                )
            },
            renderStatus(h , params){
                if(params.row.enableStatus) return h('div' , '启用')
                return h('div' , '禁用')
            }
        }
    }
</script>

<style scoped>

</style>