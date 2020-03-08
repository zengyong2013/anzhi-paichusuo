<template>
    <div>
        <div style="margin-top:20px;width: 70%;justify-content: space-around"  class="flex-column-center">
            <div class="flex-column-center"><div style="width: 100px">操作人：</div><Input v-model="actionPeople"/></div>
            <div class="flex-column-center">
                <div style="">登录期间：</div>
                <DatePicker style='width:200px' placeholder="登录期间" v-model="totalTime" type="daterange"></DatePicker>
        
            </div>
            <Button @click="search()" type="primary">查询</Button>
        </div>
        <Table style="margin-top:40px" :data="list" :columns="columns" class="table-container"></Table>
        <div style="width: 100%" class="flex-all-center"><Page @on-change="pageChange" style="margin-top:20px" :page-size="pageSize"  :total="totalCount" /></div>
    </div>
</template>

<script>
    import {formatTime} from '@/config/util'
    export default {
        name: "loginLog",
        inject : ['refresh'],
        data(){
            return {
                actionPeople:'',
                totalCount : 100,
                pageSize : 10,
                currPage : 1,
                startTime : '',
                totalTime:['',''],
                endTime : '',
                columns : [
                    {title : '序号' , key : 'sort' , render:(h , params) => { return h('div' , params.index + 1) } },
                    {title : '操作人' , key : 'name'},
                    {title : '操作类型' , key : 'operationType' , render:(h , params) => {return this.renderOperation(h , params)}},
                    {title : '登录时间' , key : 'operationTime' , render:(h , params) => {return this.renderTime(h , params)}},
                    {title : '登录状态' , key : 'status' , render:(h , params) => {return this.renderStatus(h , params)}},
                    {title : '操作' , key : 'action' , render:(h , params) => { return this.renderAction(h , params)} },
                ],
                list : []
            }
        },
        mounted(){
            this.getList()
        },
        methods : {
            search(){
                this.currPage = 1
                this.getList()
            },
            pageChange(currPage){
                this.currPage = currPage
            },
            getList(){
                let data = { current : this.currPage , size : this.pageSize}
                if(this.actionPeople) data.name = this.actionPeople
                 if(this.totalTime[0]!='')
                {
                    data.startTime = formatTime(this.totalTime[0])
                    data.endTime = formatTime(this.totalTime[1])
                   
                }
                this.reqPost('/logs/findLoginByPage' , data).then(res => {
                    if(res.code != 2000) return this.$Message.warning('拉取数据失败')
                    this.list = res.data.list
                    this.totalCount = res.data.count
                })
            },
            del(params){
                let id = params.row.id
                this.reqPost('/logs/deleteById' , {id}).then(res => {
                    if(res.code != 2000) return this.$Message.warning('删除出错')
                    this.$Message.success('删除成功')
                    this.refresh()
                })
            },
            renderAction(h , params){
                return h('i-button' , { class:'ivu-btn-small ivu-btn-error'  ,on : { click : () => this.del(params) }} , '删除')
            },
            renderOperation(h , params){
                if(params.row.operationType == 0) return h('div' , '登录')
                if(params.row.operationType == 1) return h('div' , '登出')
                if(params.row.operationType == 2) return h('div' , '添加')
                if(params.row.operationType == 3) return h('div' , '删除')
                if(params.row.operationType == 4) return h('div' , '修改')
                return h('div' , '未知')
            },
            renderTime(h , params){
                return h('div' , params.row.operationTime.replace('T' , ' '))
            },
            renderStatus(h , params){
                if(params.row.status) return h('div' , '成功')
                return h('div' , '失败')
            }
        }
    }
</script>

<style scoped>

</style>