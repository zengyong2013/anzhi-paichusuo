<template>
  <div class="bgcontainer">
    <p>注册信息</p>
    <div class="form">
      <div class="item flex">
        <div class="name">
          姓名
          <span>*</span>
        </div>
        <input v-model="name" placeholder="请实名填写" />
      </div>

      <div class="item flex">
        <div class="name">
          身份证号
          <span>*</span>
        </div>
        <input v-model="idCard" placeholder="请填写身份证号" />
      </div>

      <div class="item flex">
        <div class="name">
          手机号码
          <span>*</span>
        </div>
        <input v-model="phone" type="number" placeholder="请填写手机号码" />
      </div>

      <div class="citem flex">
        <div class="item flex">
          <div class="name">
            验证码
            <span>*</span>
          </div>
          <input v-model="smsCode" type="number" maxlength="6" placeholder="请填写验证码" />
        </div>
        <van-button v-show="show" :disabled="!cancode" type="primary" @click="sendCode">获取验证码</van-button>
        <van-button v-show="!show" disabled type="primary">{{count}}s</van-button>
      </div>

      <div class="tip">在押人员出所退款账户信息登记</div>
      <div class="tipcon">（在押人员用于在押人员出所时，将消费剩余款项退回指定人员帐户，请务必填写准确，详见服务协议）</div>

      <div class="item flex">
        <div class="name">
          收款人姓名
          <span>*</span>
        </div>
        <input v-model="payeeName" placeholder="请填写收款人姓名" />
      </div>

      <div class="item flex">
        <div class="name">
          手机号码
          <span>*</span>
        </div>
        <input v-model="payeePhone" placeholder="请填写手机号码" />
      </div>

      <div class="item flex">
        <div class="name">
          开户行
          <span>*</span>
        </div>
        <input readonly v-model="depositBank" @click.stop="showrank=true" placeholder="请选择开户行" />
      </div>

      <div class="item flex">
        <div class="name">
          支行名称
          <span>*</span>
        </div>
        <input v-model="branchBankName" placeholder="请填写支行名称" />
      </div>

      <div class="item flex">
        <div class="name">
          银行账号
          <span>*</span>
        </div>
        <input type='number' v-model="payeeAccount" placeholder="请填写银行账号" />
      </div>

      <div class="agree flex">
        <van-checkbox v-model="agree" shape="square"></van-checkbox>
        <span @click="isxy=true">我已阅读并同意“在押人员家属存款”服务协议</span>
      </div>

      <div class="submit">
        <van-button @click="submit" :disabled="!agree" type="primary">提交注册</van-button>
      </div>
    </div>

    <van-dialog
      :closeOnClickOverlay="true"
      class="rankcon"
      width="90%"
      v-model="showrank"
      :showConfirmButton="false"
    >
      <div class="con">
        <input v-model='inputRankName' placeholder="请输入开户行名称">
        <ul>
          <li
            @click="setRankName(item)"
            class="flex"
            v-for="(item,index) in newRankName"
            :key="index"
          >{{item}}</li>
        </ul>
      </div>
    </van-dialog>

    <van-dialog
      :closeOnClickOverlay="true"
      class="xycon"
      width="80%"
      v-model="isxy"
      :showConfirmButton="false"
    >
      <div class="con">协议内容</div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog, Notify, Toast, DropdownMenu, DropdownItem } from "vant";
export default {
  name: "index",
  data() {
    return {
      value: 0,
      name: "",
      idCard: "",
      phone: "",
      payeeName: "",
      payeePhone: "",
      payeeAccount: "",
      depositBank: "",
      branchBankName: "",
      smsCode: '',
      agree: false,
      cancode: false,
      timer: null,
      show: true,
      count: "",
      option: [
        { text: "全部商品", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 }
      ],
      showrank: true,
      isxy: false,
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
      newRankName: [
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
      inputRankName:'',
    };
  },
  watch: {
    phone(newV) {
      let phonereg = /^1[23456789]\d{9}$/;
      this.cancode = phonereg.test(newV);
    },
    inputRankName(newV){
      this.newRankName=[];
      this.rankName.forEach(item=>{
        if(item.indexOf(newV)!=-1){
          this.newRankName.push(item);
        }
      })
    },
  },
  created() {
    if (localStorage.getItem("params")) {
      this.$router.push({ name: "remittance" });
      return;
    }
    Toast.setDefaultOptions({ duration: 500 });
  },
  methods: {
    setRankName(name) {
      this.depositBank = name;
      this.showrank = false;
    },
    //获取验证码
    sendCode() {
      //手机号码验证
      if (this.phone == "") {
        Notify({ type: "warning", message: "请输入手机号码" });
        return;
      }
      let phonereg = /^1[23456789]\d{9}$/;
      if (!phonereg.test(this.phone)) {
        Notify({ type: "warning", message: "请输入正确的手机号码" });
        return;
      }
      let paramObj = {
        openId: this.phone,
        phone: this.phone
      };
      Toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      setTimeout(() => {
        Toast.clear();
      }, 2000);
      this.$server.sendCode(paramObj).then(data => {
        Toast("验证码已发送");
        const TIME_COUNT = 10;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 1 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      });
    },
    submit() {
      //姓名验证
      if (this.name == "") {
        Notify({ type: "warning", message: "请输入姓名" });
        return;
      }
      let namereg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/; //验证姓名正则
      if (!namereg.test(this.name)) {
        Notify({ type: "warning", message: "请输入正确的姓名" });
        return;
      }
      //身份证号验证
      if (this.idCard == "") {
        Notify({ type: "warning", message: "请输入身份证号" });
        return;
      }
      let cardreg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
      if (!cardreg.test(this.idCard)) {
        Notify({ type: "warning", message: "请输入正确的身份证号" });
        return;
      }
      //手机号码验证
      if (this.phone == "") {
        Notify({ type: "warning", message: "请输入手机号码" });
        return;
      }
      let phonereg = /^1[23456789]\d{9}$/;
      if (!phonereg.test(this.phone)) {
        Notify({ type: "warning", message: "请输入正确的手机号码" });
        return;
      }
      //验证码
      if (this.smsCode == "") {
        Notify({ type: "warning", message: "请输入验证码" });
        return;
      }
      //收款人姓名验证
      if (this.payeeName == "") {
        Notify({ type: "warning", message: "请输入收款人姓名" });
        return;
      }
      if (!namereg.test(this.payeeName)) {
        Notify({ type: "warning", message: "请输入正确的收款人姓名" });
        return;
      }
      //收款人手机号码验证
      if (this.payeePhone == "") {
        Notify({ type: "warning", message: "请输入收款人手机号码" });
        return;
      }
      if (!phonereg.test(this.payeePhone)) {
        Notify({ type: "warning", message: "请输入正确的收款人手机号码" });
        return;
      }
      //开户行
      if (this.depositBank == "") {
        Notify({ type: "warning", message: "请选择开户行" });
        return;
      }
      //支行名称
      if (this.branchBankName == "") {
        Notify({ type: "warning", message: "请输入支行名称" });
        return;
      }
      //银行账户
      if (this.payeeAccount == "") {
        Notify({ type: "warning", message: "请输入收款人银行账户" });
        return;
      }
      //同意条约
      if (!this.agree) {
        Notify({ type: "warning", message: "请同意服务条约后提交注册" });
        return;
      }
      let params = {
        openId: this.phone,
        name: this.openId,
        idCard: this.idCard,
        phone: this.phone,
        payeeName: this.payeeName,
        payeePhone: this.payeePhone,
        payeeAccount: this.payeeAccount,
        depositBank: this.depositBank,
        branchBankName: this.branchBankName,
        smsCode: this.smsCode
      };
      Dialog.confirm({
        title: "温馨提示",
        message:
          "提交注册后信息将无法修改<br/>如需修改，请携带身份证件到海淀区看守所现场修改"
      })
        .then(() => {
          this.save(params);
        })
        .catch(() => {
          // on cancel
        });
    },
    save(params) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      setTimeout(() => {
        Toast.clear();
      }, 2000);
      this.$server.saveCustodyFolk(params).then(data => {
        params.folkId = data.data.folkId;
        localStorage.setItem("params", JSON.stringify(params));
        Toast.success({
          duration: 3000, // 持续展示 toast
          message: data.msg
        });
        setTimeout(() => {
          this.$router.push({ name: "remittance" });
        }, 500);
      });
    }
  }
};
</script>

<style scoped lang='scss'>
.form {
  padding: 0 20px;
}
p {
  font-size: 30px;
  text-align: left;
  color: #333;
  font-weight: bold;
  padding-left: 30px;
  margin-top: 30px;
}
.citem {
  margin: 20px auto 0;
  justify-content: space-between;
  /deep/ .van-button {
    flex: 1;
    margin-left: 30px;
    line-height: 70px;
  }
  .item {
    width: 420px;
    margin: 0;
    .name {
      width: 180px;
    }
  }
  /deep/ .van-button {
    height: 70px;
    border-radius: 10px;
  }
}
.item {
  width: 690px;
  height: 70px;
  border: 2px solid #ddd;
  margin: 20px auto 0;
  border-radius: 10px;
  padding-left: 20px;
  overflow: hidden;
  .name {
    width: 170px;
    flex-shrink: 0;
    text-align: left;
    font-size: 28px;
    color: #737373;
    span {
      color: red;
    }
  }
  input {
    flex: 1;
    height: 100%;
    text-align: left;
    margin-left: 10px;
  }
}

.tip {
  font-size: 24px;
  color: #3300ff;
  font-weight: bold;
  line-height: 30px;
  margin: 30px 0 10px;
}
.tipcon {
  font-size: 24px;
  color: #737373;
  line-height: 30px;
}
.agree {
  margin: 20px 0;
  span {
    text-decoration: underline;
    color: #3300ff;
    margin-left: 10px;
  }
}
.submit {
  margin-top: 40px;
  /deep/ .van-button {
    width: 100%;
  }
}
.xycon {
  padding: 10px;
  height: 80%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.rankcon {
  padding: 0px 0 0;
  height: 80%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  border-radius: 20px;
  .van-dialog__content {
    height: 100%;
  }
  .con {
    height: 100%;
    input{
      width: 90%;
      height: 70px;
      border:2px solid #dddd;
      margin: 30px auto;
      display: block;
      text-align: center;
      border-radius: 10px;
    }
  }
  li {
    justify-content: center;
    height: 100px;
    font-size: 30px;
    border-top: 1px solid #eeeeee;
    border-radius: 0;
  }
  li:last-child{
     border-bottom: 1px solid #eeeeee;
  }
}
input:disabled {
  background: #fff;
  border: none;
}
</style>
