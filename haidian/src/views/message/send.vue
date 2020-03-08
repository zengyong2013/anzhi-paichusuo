<template>
    <div>
        <RadioGroup v-model="sendType">
            <Radio label="single">单人发送</Radio>
            <div style="margin-left:50px;margin-top:20px">
                <div>家属姓名 : <Input v-model="custodyName" /></div>
                <div style="margin-top:10px">被羁押人员存款账号 : <Input v-model="custodyAccount" /></div>
                <div style="margin-top:10px">短信接收号码 : <Input v-model="phone" /></div>
            </div>
            <Radio style="margin-top:20px" label="mutiple">批量发送</Radio>
            <div class="flex-column-center" style="margin-left:50px;margin-top:20px;">
                <Button @click="$refs.fileInput.click()" style="display: block">上传文件</Button>
                <div style="margin-left:20px" v-if="fileName">{{fileName}}</div>
            </div>
            <div class="flex" style="width: 100%;justify-content: space-around;margin-top:40px">
                <Button @click="send()" type="primary">发送</Button>
                <Button @click="reset" type="error">重置</Button>
            </div>
        </RadioGroup>

        <input type="file" @change="inputFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" ref="fileInput" hidden />
    </div>
</template>

<script>
    import {domain } from '../../request/base'
    import {getCache} from '../../config/cache'
    export default {
        name: "messageSend",
        data(){
            return {
                domain : domain,
                sendType : 'single',
                custodyAccount : '',
                custodyName : '',
                fileName : '',
                phone : ''
            }
        },
        methods : {
            send(){
                if(this.sendType == 'single') this.sendOneMsg()
                if(this.sendType == 'mutiple') this.sendManyMsg()
            },
            inputFile(event){
                console.log(event)
                let file = event.target.files[0]
                this.fileName = file.name
                this.sendType = 'mutiple'
            },
            sendManyMsg(){
                let formData = new FormData()
                formData.append('file', this.file)
                let userCache = getCache('user_info')
                formData.append('token', userCache.token)
                this.reqUploadFile('/sms/sendByExcel' , formData)
            },
            reset(){
                this.fileName = ''
                this.custodyAccount = ''
                this.phone = ''
                this.custodyName = ''
            },
            sendOneMsg(){
                let data = {custodyAccount : this.custodyAccount , phone : this.phone , custodyName : this.custodyName}
                this.reqPost('/sms/sendOneSms' , data).then(res => {
                    let status = '成功'
                    let method = 'success'
                    if(res.code != 2000) status = '失败'
                    if(res.data.status == 0) status = '失败'
                    let data = {
                        title:'短信提醒',
                        content : '<div>短信发送'+status +'<br/>24小时之内可至历史记录查询详情</div>'
                    }
                    status == '成功' ? this.$Modal.success(data) :  this.$Modal.error(data)
                })
            }
        }
    }
</script>

<style scoped>

</style>