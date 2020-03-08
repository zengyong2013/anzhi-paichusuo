<template>
    <div>
        <div style="margin-top:20px">注意：只保留最近24小时发送记录</div>
        <div class="flex-column-center" style="margin-top:20px">
            <div>家属姓名：</div><Input v-model="custodyName" style="width: 120px;margin-right:15px" />
            <div>被羁押人存款账号：</div><Input v-model="custodyAccount" style="width: 120px;margin-right:15px" />
            <div>短信接收号码：</div><Input v-model="phone" style="width: 120px;margin-right:15px" />
            <div>发送状态：</div>
            <Select v-model="sendStatus" style="width:120px;margin-right:15px">
                <Option value="''">无</Option>
                <Option value="1">成功</Option>
                <Option value="-1">发送中</Option>
                <Option value="0">失败</Option>
            </Select>
            <div class="flex-all-center">
                <Button @click="currPage = 1 , getList()" style="margin-right:20px" type="primary">查询</Button>
                <Button @click="exportExcel" type="primary">导出</Button>
            </div>
        </div>
        <Table style="margin-top:40px" :data="list" :columns="columns" class="table-container"></Table>
        <div style="width: 100%" class="flex-all-center"><Page @on-change="pageChange" style="margin-top:20px" :page-size="pageSize"  :total="totalCount" /></div>
    </div>
</template>

<script>
    export default {
        name: "messageHistory",
        inject : ['refresh'],
        data() {
            return {
                sendStatus : '',
                custodyName : '',
                custodyAccount : '',
                phone : '',
                columns : [
                    {title : '序号' , key : 'sort' , render:(h , params) => { return h('div' , params.index + 1) } },
                    {title : '被羁押人存款账号' , key : 'custodyAccount'},
                    {title : '家属姓名' , key : 'custodyName'},
                    {title : '短信接收号码' , key : 'phone'},
                    {title : '发送状态' , key : 'sendStatus' , render:(h , params)=>{ return this.renderStatus(h , params)}},
                    {title : '操作' , key : 'action' , render:(h , params) => { return this.renderAction(h , params)} },
                ],
                list : [],
                totalCount : 10,
                pageSize : 10,
                currPage : 1,
            }
        },
        mounted(){
            this.getList()
        },
        methods : {
            pageChange(currPage){
                this.currPage = currPage
                this.getList()
            },
            async getList(){
                let data = { current : this.currPage , size : this.pageSize}
                if(this.custodyName) data.custodyName = this.custodyName
                if(this.custodyAccount !== '') data.custodyAccount = this.custodyAccount
                if(this.phone !== '') data.phone = this.phone
                if(this.sendStatus !== '') data.sendStatus = this.sendStatus
                let res = await this.reqPost('/sms/findListByPage' , data)
                if(res.code != 2000) return this.$Message.warning('拉取数据出错')
                this.list = res.data.list
                this.totalCount = res.data.count
            },
            reSend(params){
                this.reqPost('/sms/deleteById' ,
                    {id : params.row.id , custodyAccount : params.row.custodyAccount , phone : params.row.phone})
                    .then(res => {
                        if(res.code != 2000) return this.$Message.warning('操作失败')
                        this.$Message.success('操作成功')
                        this.refresh()
                    }
                )
            },
            del(params){
                this.reqPost('/sms/deleteById' , {id : params.row.id}).then(res => {
                    if(res.code != 2000) return this.$Message.warning('操作失败')
                    this.$Message.success('操作成功')
                    this.refresh()
                })
            },
            exportExcel(){
                let data = {}
                if(this.custodyName) data.custodyName = this.custodyName
                if(this.custodyAccount) data.custodyAccount = this.custodyAccount
                if(this.phone) data.phone = this.phone
                if(this.sendStatus) data.sendStatus = this.messageStatus
                window.location = this.getFullUrl('/sms/findListByPage2Excel' , data )
            },
            renderStatus(h , params){
                if(params.row.sendStatus == 0) return h('div' , {style : { color : 'red'}} , '失败')
                if(params.row.sendStatus == 1) return h('div' , {style : { color : 'green'}} , '成功')
                if(params.row.sendStatus == -1) return h('div' , {style : { color : 'green'}} , '发送中')
            },
            renderAction(h , params){
                if(params.row.sendStatus == 0) return h('i-button' , {  class:'ivu-btn-small ivu-btn-primary',style:'margin-right:10px' ,on : { click : () => this.reSend(params) }} , '重新发送')
                if(params.row.sendStatus == 1) return h('i-button' , {  class:'ivu-btn-small ivu-btn-error' ,on : { click : () => this.del(params) }} , '删除')
            }
        }
    }
</script>

<style scoped>

</style>