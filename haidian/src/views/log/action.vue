<template>
    <div>
        <div style="margin-top:20px;width: 95%;justify-content: space-around"  class="flex-column-center">
            <div class="flex-column-center"><div style="width:100px">操作人：</div><Input v-model="name"/></div>
            <div class="flex-column-center">
                <div>业务类型：</div>
                <Select v-model="businessType" style="width:200px">
                    <Option v-for="item in actionList" :value="item.type">{{ item.name }}</Option>
                </Select>
            </div>
            <div class="flex-column-center">
                <div style="">操作期间：</div>
               <DatePicker style='width:200px' placeholder="操作期间" v-model="totalTime" type="daterange"></DatePicker>
        
               
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
        name: "actionLog",
        data(){
            return {
                businessType : '',
                name : '',
                totalCount : 100,
                pageSize : 10,
                currPage : 1,
                startTime : '',
                totalTime:['',''],
                endTime : '',
                actionList : [
                    {type : 0 , name : '登录'},
                    {type : 1 , name : '家属'},
                    {type : 2 , name : '在押人'},
                ],
                columns : [
                    {title : '序号' , key : 'sort' , render:(h , params) => { return h('div' , params.index + 1) } },
                    {title : '操作人' , key : 'name'},
                    {title : '业务类型' , key : 'businessType' , render:(h , params) => { return this.renderBusinessType(h , params)} },
                    {title : '操作类型' , key : 'operationType', render:(h , params) => { return this.renderOperation(h , params)} },
                    {title : '级别' , key : 'level'},
                    {title : '操作时间' , key : 'operationTime' , render:(h , params) => {return this.renderTime(h, params)} },
                    {title : '日志' , key : 'action' , render:(h , params) => { return this.renderAction(h , params)} },
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
            async getList(){
                let data = { current : this.currPage , size : this.pageSize}
                if(this.name) data.name = this.name
                if(this.businessType !== '') data.businessType = this.businessType
                if(this.totalTime[0]!='')
                {
                    data.startTime = formatTime(this.totalTime[0])
                    data.endTime = formatTime(this.totalTime[1])
                   
                }
                let res = await this.reqPost('/logs/findOperationByPage' , data)
                if(res.code != 2000) return this.$Message.warning('拉取数据出错')
                this.list = res.data.list
                this.totalCount = res.data.count
            },
            pageChange(currPage){
                this.currPage = currPage
                this.getList()
            },
            show(params){
                let data = this.getOperationName(params.row.operationType)
                this.$Modal.info({
                    title:'操作日志',
                    content : data + '操作成功',
                })
            },
            renderAction(h , params){
                return h('i-button' , { class:'ivu-btn-small ivu-btn-success' ,on : { click : () => this.show(params) }} , '查看')
            },
            renderBusinessType(h , params){
                if(params.row.businessType == 0) return h('div' , '登录')
                if(params.row.businessType == 1) return h('div' , '家属')
                if(params.row.businessType == 2) return h('div' , '在押人')
                return h('div' , '未知')
            },
            renderOperation(h , params){
                let data = this.getOperationName(params.row.operationType)
                return h('div' , data)
            },
            getOperationName(type){
                switch (type) {
                    case 0 :
                        return '登录'
                    case 1 :
                        return '登出'
                    case 2 :
                        return '添加'
                    case 3 :
                        return '删除'
                    case 4 :
                        return '修改'
                    case 5 :
                        return '未知操作'
                }
            },
            renderTime(h , params){
                if(!params.row.operationTime) return h('div' , '-')
                return h('div' , params.row.operationTime.replace('T' , ' '))
            }
        }
    }
</script>

<style scoped>

</style>