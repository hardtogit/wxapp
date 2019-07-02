<template>
  <div>
    <div class="item" @click="goBankPage">
      <div class="label">到账账户</div>
        <div :class="['picker', 'input',!bank&&'default']" >
          {{bank?bank.bankname+'('+bank.bankno+')':'请登陆商户后台绑定银行卡'}}
          <i class="fa fa-angle-right"></i>
        </div>
    </div>
    <div class="title">提现金额</div>
    <div class="amount">
      <span class="unit">¥</span>
      <input class="input" type="number" v-model="amount" placeholder="请输入提现金额">
    </div>
    <div class="tip" v-if="basicInfo.basic">
      最多可提现金额¥{{basicInfo.basic.balance}} <div class="all" @click="all">全部提现</div>
    </div>
    <div class="warm">
      注：单笔提现金额最低50元，最高20000元。
    </div>
    <div :class="['btn',disabled&&'disabled']" @click="withdraw">
      提现
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        bank: undefined,
        basicInfo: {},
        amount: undefined
      }
    },
    computed: {
      // 计算属性的 getter
      disabled: function () {
        if (!this.bank) {
          return true
        }
        if (!this.amount) {
          return true
        }
        if (this.amount < 50 || this.amount > 20000) {
          return true
        }
        if (this.basicInfo.basic) {
          if (this.amount > this.basicInfo.basic) {
            return true
          }
        }
        return false
      }
    },
    methods: {
      push (url) {
        wx.navigateTo({url})
      },
      getBank () {
        wx.showLoading()
        this.$store.dispatch({
          type: 'BankList'
        }).then((data) => {
          wx.hideLoading()
          data.data.banklist.forEach((bank, i) => {
            data.data.banklist[i].bankno = bank.bankno.slice(bank.bankno.length - 4)
          })
          this.bank = data.data.banklist[0]
        }).catch(() => {
          wx.hideLoading()
        })
      },
      goBankPage () {
        if (!this.bank) {
          wx.showToast({
            title: '请先绑定银行卡',
            icon: 'none'
          })
        } else {
          this.push('../businessBank/main?bankno=' + this.bank.bankno)
        }
      },
      // 获取商家基本信息
      GetBusinessBasicInfo (type) {
        const _this = this
        wx.showLoading({
          title: '数据加载中'
        })
        _this.$store.dispatch({
          type: 'GetBusinessBasicInfo'
        }).then(res => {
          // console.log(res)
          _this.basicInfo = res.data
          wx.hideLoading()
        }).catch(() => {
          wx.hideLoading()
        })
      },
      all () {
        if (this.basicInfo.basic.balance > 20000) {
          this.amount = 20000
        } else {
          this.amount = this.basicInfo.basic.balance
        }
      },
      withdraw () {
        if (this.disabled) {
          return
        }
        wx.showLoading({
          title: '处理中'
        })
        this.$store.dispatch({
          type: 'StoreWithdraw',
          data: {
            moneys: this.amount,
            bankid: this.bank.id
          }
        }).then(() => {
          wx.hideLoading()
          wx.showToast({
            title: '提现成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.GetBusinessBasicInfo()
            this.amount = undefined
          }, 1000)
        }).catch((data) => {
          wx.hideLoading()
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        })
      }
    },
    onLoad () {
      this.GetBusinessBasicInfo()
      const $this = this
      if (wx.getStorageSync('lastBank')) {
        this.bank = wx.getStorageSync('lastBank')
      } else {
        this.getBank()
      }
      this.$eventBus.$on('choiceBank', function (value) {
        console.log(value)
        $this.bank = value
      })
    }

  }
</script>
<style lang="less" scoped>
  @import '../../../static/style/reset';
  .item{
    padding: 20px 15px;
    border-bottom: 0.5px solid #eee;
    display: flex;
    .label{
      width: 64px;
      color: #333;
      font-size: 16px;
    }
    .input{
      font-size: 16px;
      color: #333;
      flex: 1;
      padding-left: 10px;
      &.default{
        color: #999;
      }
      .fa{
        float: right;
      }
    }
  }
  .title{
    font-size: 12px;
    color: #999;
    padding: 0 15px;
    margin-top: 15px;
  }
  .amount{
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 0.5px solid #eee;
    .unit{
      width: 40px;
      box-sizing: border-box;
      padding-left: 15px;
      color: #333;
      font-size: 25px;
    }
    .input{
      flex: 1;
      font-size: 19px;
    }
  }
  .tip{
    font-size: 12px;
    color: #666;
    padding: 10px 15px;
    .all{
      display: inline-block;
      color: #2666E1;
    }
  }
  .warm{
    font-size: 12px;
    color: #ff9933;
    padding-left: 15px;
  }
  .btn{
    width:300px;
    height:40px;
    line-height: 40px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin: 80px  auto 0 auto;
    background:linear-gradient(90deg,rgba(63,123,237,1) 0%,rgba(81,150,254,1) 100%);
    border-radius:20px;
    &.disabled{
      opacity: .5;
    }
  }
</style>
<style>
  page{
    background-color: #fff;
  }
</style>
