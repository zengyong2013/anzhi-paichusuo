<template>
    <div>
        <div class="flex-column-center" style="margin-top:20px">
            <div>注册姓名：</div><Input v-model="name" style="width: 120px;margin-right:15px" />
            <div>身份证号：</div><Input v-model="idCard" style="width: 120px;margin-right:15px" />
            <div>手机号：</div><Input v-model="phone" style="width: 120px;margin-right:15px" />
            <div>收款人姓名：</div><Input v-model="payeeName" style="width: 120px;margin-right:15px" />
            <div>收款人手机号：</div><Input v-model="payeePhone" style="width: 120px;margin-right:15px" />
        </div>
        <div class="flex-column-center" style="margin-top:20px">
            <div>退款账户：</div><Input v-model="payeeAccount" style="width: 200px;margin-right:20px" />
            <div class="flex-all-center">
                <div>注册时间：</div>
                <DatePicker style="width:200px" v-model="totalTime" type="daterange" placeholder="注册时间"></DatePicker>
            </div>
            <div class="flex" style="margin-left:40px">
                <Button @click="currPage = 1 , getList()" style="margin-right:20px" type="primary">查询</Button>
                <Button @click="exportExcel" type="primary">导出</Button>
            </div>
        </div>
        <Modal v-model="showEdit" title="编辑" @on-ok="editOk" >
            <div >
                <div style="margin-top:20px" class="flex-column-center"><div>账号名称：</div><Input v-model="editName" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>电话号码：</div><Input v-model="editPhone" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>收款人姓名：</div><Input v-model="editPayeeName" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>收款人手机号：</div><Input v-model="editPayeePhone" style="width: 120px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center"><div>退款账户：</div><Input v-model="editPayeeAccount" style="width: 220px;margin-right:15px" /></div>
                <div style="margin-top:20px" class="flex-column-center">
                    <div>开户行：</div>
<!--                    <Input v-model="editDepositBank" style="width: 120px;margin-right:15px" />-->
                    <Select v-model="editDepositBank" style="width: 200px">
                        <Option  v-for="item in rankName" :value="item">{{item}}</Option>
                    </Select>
                </div>
                <div style="margin-top:20px" class="flex-column-center"><div>支行名称：</div><Input v-model="editBranchBankName" style="width: 120px;margin-right:15px" /></div>

            </div>
        </Modal>
        <Table style="margin-top:40px" :data="list" :columns="columns" class="table-container"></Table>
        <div style="width: 100%" class="flex-all-center"><Page @on-change="pageChange" style="margin-top:20px" :page-size="pageSize"  :total="totalCount" /></div>
    </div>
</template>

<script>
    import {formatTime} from "../../config/util"
    export default {
        name: "reportPart1",
        inject : ['refresh'],
        data(){
            return {
                editName : '',
                editPhone : '',
                editPayeeName : '',
                editPayeePhone : '',
                editPayeeAccount : '',
                editDepositBank : '',
                editBranchBankName : '',
                actionStyle:{cursor: 'pointer' , margin:'0 3px'},
                name : '',
                idCard : '',
                phone : '',
                payeeName : '',
                payeePhone : '',
                payeeAccount : '',
                startTime:null,
                totalTime:['',''],
                endTime:null,
                showEdit : false,
                editIndex : '',
                columns : [
                    {title : '序号' , key : 'sort' , render:(h , params) => { return h('div' , params.index + 1) } },
                    {title : '注册姓名' , key : 'name'},
                    {title : '身份证号' , key : 'idCard'},
                    {title : '手机号码' , key : 'phone'},
                    {title : '收款人姓名' , key : 'payeeName'},
                    {title : '收款人手机号' , key : 'payeePhone'},
                    {title : '退款账户' , key : 'payeeAccount'},
                    {title : '开户行' , key : 'depositBank'},
                    {title : '支行名称' , key : 'depositBank'},
                    {title : '注册时间' , key : 'insTime', render:(h , params) => {return this.renderTime(h , params)}},
                    {title : '操作' , width:120 , key : 'action' , render:(h , params) => { return this.renderAction(h , params)} },
                ],
                list : [],
                rankName: [
                    "招商银行",
                    "中国工商银行",
                    "中国农业银行",
                    "中国银行",
                    "中国建设银行",
                    "平安银行",
                    "交通银行",
                    "中信银行",
                    "兴业银行",
                    "光大银行",
                    "民生银行",
                    "中国邮政储蓄银行",
                    "上海浦东银行",
                    "广发银行"
                ],
                totalCount : 10 ,
                pageSize:10,
                currPage : 1
            }
        },
        mounted(){
            this.getList()
        },
        methods :{
            pageChange(currPage){
                this.currPage = currPage
                this.getList()
            },
            editOk(){
                let item = this.list[this.editIndex]
                let data = { id : item.id}
                if(this.editName !== '') data.name = this.editName
                if(this.editPhone !== '') data.phone = this.editPhone
                if(this.editPayeeName !== '') data.payeeName = this.editPayeeName
                if(this.editPayeePhone !== '') data.payeePhone = this.editPayeePhone
                if(this.editPayeeAccount !== '') data.payeeAccount = this.editPayeeAccount
                if(this.editDepositBank !== '') data.depositBank = this.editDepositBank
                if(this.editBranchBankName !== '') data.branchBankName = this.editBranchBankName
                this.reqPost('/custodyFolk/updateCustodyFolk' , data).then(res => {
                    if(res.code != 2000) return this.$Message.warning('修改出错')
                    this.$Message.success('修改成功')
                    this.refresh()
                })
            },
            edit(index){
                let item = this.list[index]
                this.editIndex = index
                this.editName  = item.name
                this.editPhone = item.phone
                this.editPayeeName  = item.payeeName
                this.editPayeePhone  = item.payeePhone
                this.editPayeeAccount  = item.payeeAccount
                this.editDepositBank  = item.depositBank
                this.editBranchBankName  = item.branchBankName
                this.showEdit = true
            },
            del(params){

                this.reqPost('/custodyFolk/deleteById', {id : params.row.id}).then(res => {
                    if(res.code != 2000) return this.$Message.warning('删除失败')
                    this.$Message.success('删除成功')
                    this.refresh()
                })
            },
            async getList(){
              
                let data = {current : this.currPage , size:this.pageSize}
                if(this.name) data.name = this.name
                if(this.idCard) data.idCard = this.idCard
                if(this.phone) data.phone = this.phone
                if(this.payeeName) data.payeeName = this.payeeName
                if(this.payeePhone) data.payeePhone = this.payeePhone
                if(this.payeeAccount) data.payeeAccount = this.payeeAccount
                if(this.totalTime[0]!='')
                {
                    data.startTime = formatTime(this.totalTime[0])
                    data.endTime = formatTime(this.totalTime[1])
                   
                }
                let res = await this.reqPost('/custodyFolk/findListByPage', data)
                if(res.code != 2000) return this.$Message.warning('获取数据出错')
                this.list = res.data.list
                this.totalCount = res.data.count
            },
            exportExcel(){
                let data = {}
                if(this.name) data.name = this.name
                data.idCard = this.idCard
                if(data.idCard == '') return this.$Message.warning('身份证号必须填写')
                if(this.phone) data.phone = this.phone
                if(this.payeeName) data.payeeName = this.payeeName
                if(this.payeePhone) data.payeePhone = this.payeePhone
                if(this.payeeAccount) data.payeeAccount = this.payeeAccount
                if(this.totalTime[0]!='')
                {
                    data.startTime = formatTime(this.totalTime[0])
                    data.endTime = formatTime(this.totalTime[1])
                   
                }
                window.location = this.getFullUrl('/custodyFolk/findListByPage2Excel' , data )
            },
           
            renderAction(h , params){
                return h('div' ,
                    { style : {display:'flex'} },
                    [
                        h('i-button', {class:'ivu-btn-small ivu-btn-primary', on: { click: () => { this.edit(params.index) } } }, ' 编辑'),
                        h('i-button', { class:'ivu-btn-small ivu-btn-error',style:'margin-left:10px', on: { click: () => { this.del(params) } } }, '删除')
                    ]
                )
            },
            renderTime(h , params){
                if(!params.row.insTime) return h('div' , '-')
                return h('div' , params.row.insTime.replace('T' , ' '))
            }
        },

    }
</script>

<style scoped>

</style>