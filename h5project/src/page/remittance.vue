<template>
  <div class="bgcontainer">
    <div v-show="page==1">
      <p class="title">汇款信息</p>
      <div class="form">
        <div class="item flex">
          <div class="name">
            在押人员收款账号
            <span>*</span>
          </div>
          <input type="number" v-model="custodyAccount" placeholder="请输入在押人员收款账号" />
        </div>

        <div class="item flex">
          <div class="name">
            账号再次确认
            <span>*</span>
          </div>
          <input type="number" v-model="custodyAccount2" placeholder="请再次输入账号" />
        </div>
        <div class="submit">
          <van-button @click="submit" type="primary">提交信息</van-button>
        </div>

        <div class="tipcon flex">
          <div class="name">提示：</div>
          <div class="con">系统将根据录入信息生成二维码；用户通过微信、支付宝、银联闪付等软件扫描二维码存款</div>
        </div>
      </div>
    </div>

    <div v-show="page==2">
      <p class="title">汇款操作说明</p>
      <van-steps direction="vertical" :active="-1">
        <van-step>
          <h3>步骤1 录入在押人员收款账号</h3>
          <p>请您按照短信信息填写在押人员收款账号，收款账号需两次填写完全一致。</p>
        </van-step>
        <van-step>
          <h3>步骤2 提交信息后，显示汇款二维码</h3>
          <p>请您长按图片，保存二维码图片到相册后，退出界面。</p>
        </van-step>
        <van-step>
          <h3>步骤3 扫描或识别二维码进行缴费</h3>
          <p>
            该二维码图片，作为您指定缴费的唯一入口，扫码即可缴费。
            您可使用微信扫一扫，选取图片库中该二维码，即可跳转至缴费画面，输入缴费金额支付即可。
            支持支付宝渠道扫一扫，选取相册中，该二维码图片即可跳转至缴费画面，输入金额提交即可。
            支持农业银行，掌上银行扫码缴费。可自助注册农行掌银渠道，扫描缴费二维码可缴费。
          </p>
        </van-step>
        <van-step>
          <h3>步骤4 保存二维码后，返回上一级可再次生成二维码</h3>
          <p>保存二维码后，可返回至录入在押人员汇款码界面，再次生成二维码</p>
        </van-step>
      </van-steps>
    </div>

    <div v-show="page == 3">
      <div class="thead">
        <h3>在押人员家属汇款二维码</h3>
        <p>收款人账号：{{custodyAccount}}</p>
      </div>
      <div v-if="page==3" id="qrcode"></div>
      <div class="tipcon">
        <p>提示：</p>
        <div class="tipdesc">请您长按图片，保存二维码图片到相册后，退出界面。</div>
        <div class="tipdesc">该二维码图片，作为您指定缴费的唯一入口，扫码即可缴费。</div>
        <div class="tipdesc">您可使用微信扫一扫，选取图片库中该二维码，即可跳转至缴费画面，输入缴费金额支付即可。</div>
        <div class="tipdesc">支持支付宝渠道扫一扫，选取相册中，该二维码图片即可跳转至缴费画面，输入金额提交即可。</div>
        <div class="tipdesc">支持农业银行，掌上银行扫码缴费。可自助注册农行掌银渠道，扫描缴费二维码可缴费。</div>
      </div>
    </div>

    <div class="foot flex">
      <div class="fitem" @click="page=1">汇款</div>
      <div class="fitem" @click="page=2">操作说明</div>
    </div>
  </div>
</template>

<script>
import { Dialog, Notify, Toast } from "vant";
import QRCode from "qrcodejs2"; // 引入qrcode
export default {
  name: "index",
  data() {
    return {
      openId: "",
      custodyAccount: "",
      custodyAccount2: "",
      checked: false,
      page: 1,
      folkId: ""
    };
  },
  watch: {
    page(newV) {
      if (newV != 3) {
        this.custodyAccount = "";
        this.custodyAccount2 = "";
      }
    }
  },
  created() {
    if (localStorage.getItem("params")) {
      let data = JSON.parse(localStorage.getItem("params"));
      this.openId = data.phone;
      this.folkId = data.folkId;
    }
  },
  methods: {
    submit() {
      if (this.custodyAccount == "") {
        Notify({ type: "warning", message: "请输入在押人员收款账号" });
        return;
      }
      if (this.custodyAccount2 == "") {
        Notify({ type: "warning", message: "请再次输入在押人员收款账号" });
        return;
      }
      if (this.custodyAccount != this.custodyAccount2) {
        Notify({ type: "warning", message: "两次输入账号不一致" });
        return;
      }
      let params = {
        openId: this.openId,
        custodyAccount: this.custodyAccount,
        folkId: this.folkId
      };
      Dialog.confirm({
        itle: "温馨提示",
        message: "提交信息将直接生成二维码<br/>信息将无法修改"
      })
        .then(() => {
          this.saveCustody(params);
        })
        .catch(() => {
          // on cancel
        });
    },
    saveCustody(params) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      setTimeout(() => {
        Toast.clear();
      }, 2000);
      this.$server.saveCustody(params).then(data => {
        Toast.success({
          duration: 3000, // 持续展示 toast
          message: data.msg
        });
        //生成二维码
        this.getQRCode(params);
      });
    },

    //生成二维码
    getQRCode(params) {
      Toast.loading({
        message: "生成二维码中",
        forbidClick: true
      });
      setTimeout(() => {
        Toast.clear();
      }, 2000);
      this.$server.getQRCodeStr(params).then(data => {
        this.page = 3;
        setTimeout(() => {
          let qrcode = new QRCode("qrcode", {
            width: 200,
            height: 200,
            text: data.data, // 二维码地址
            colorDark: "#000",
            colorLight: "#fff"
          });
        }, 1000);
      });
    }
  }
};
</script>

<style scoped lang='scss'>
.form {
  padding: 0 20px;
}
p.title {
  font-size: 30px;
  text-align: left;
  color: #333;
  font-weight: bold;
  padding-left: 30px;
  margin-top: 30px;
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
    width: 230px;
    text-align: left;
    font-size: 24px;
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

.tipcon {
  align-items: flex-start;
  margin-top: 30px;
  .name {
    font-size: 26px;
    line-height: 38px;
    color: #737373;
  }
  .con {
    flex: 1;
    font-size: 26px;
    line-height: 38px;
    color: #737373;
  }
}

.foot {
  position: fixed;
  width: 100%;
  height: 70px;
  bottom: 0;
  left: 0;
  z-index: 1;
  border-top: 1px solid #ddd;
  .fitem:first-child {
    border-right: 1px solid #ddd;
  }
  .fitem {
    flex: 1;
    text-align: center;
    line-height: 70px;
  }
}
/deep/ .van-step__title {
  h3 {
    color: #333;
    font-weight: bold;
    font-size: 28px;
    margin-top: 5px;
  }
  p {
    margin-top: 10px;
    line-height: 40px;
  }
}

.thead {
  padding-left: 180px;
  margin-top: 130px;
  h3 {
    font-size: 34px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    font-size: 28px;
    color: #333333;
  }
}
#qrcode {
  /deep/ img {
    width: 300px;
    height: 300px;
    display: block;
    margin: 40px auto 0px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
  }
}
.tipcon {
  padding: 0 30px;
  margin-top: 80px;
  p {
    font-size: 30px;
    color: #333333;
    font-weight: bold;
    line-height: 40px;
  }
  .tipdesc {
    font-size: 26px;
    color: #737373;
    line-height: 40px;
  }
}
</style>
