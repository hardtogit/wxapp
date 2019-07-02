<template>
  <div>
    <div class="item" v-for="(bank,index) in bankList" wx:key="index" @click="choice(bank)">
      <div class="left">
        <div class="name">{{bank.bankname}}</div>
        <div class="num">尾号{{bank.bankno}}</div>
      </div>
      <div class="right">
        <div class="fa fa-check" v-if="choiceBankno===bank.bankno"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        bankList: [],
        choiceBankno: {}
      }
    },
    methods: {
      getBank () {
        wx.showLoading()
        this.$store.dispatch({
          type: 'BankList'
        }).then((data) => {
          wx.hideLoading()
          data.data.banklist.forEach((bank, i) => {
            data.data.banklist[i].bankno = bank.bankno.slice(bank.bankno.length - 4)
          })
          this.bankList = data.data.banklist
        }).catch(() => {
          wx.hideLoading()
        })
      },
      choice (bank) {
        this.$eventBus.$emit('choiceBank', bank)
        wx.navigateBack()
      }
    },
    onLoad (options) {
      this.getBank()
      this.choiceBankno = options.bankno
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../static/style/reset';
  .item{
    display: flex;
    padding: 10px 15px;
    align-items: center;
    border-bottom: 0.5px solid #eee;
    .left{
      flex: 1;
      .name{
        font-size: 16px;
      }
      .num{
        font-size: 14px;
        color: #999;
        margin-top: 6px;
      }
    }
    .right{
      width: 40px;text-align: right;

      .fa{

      }
    }
  }

</style>
<style>
  page{
    background-color: #fff;
  }
</style>
