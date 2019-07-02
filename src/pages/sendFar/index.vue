<template>
  <div>
    <div class="header">
      <div class="left">
        <div class="text">请选择快递</div>
        <div class="subText">快递单号可不填，系统会自动派发单号</div>
      </div>
      <div class="right">
        <div class="img" @click="Scan"></div>
      </div>
    </div>
    <div class="item">
      <div class="title">快递公司</div>
      <picker @change="PickerChange" range-key="name" :value="index" :range="companies">
        <div :class="['picker', 'input',!choice&&'default']">
          {{choice&&companie.name||'请选择快递公司'}}
          <i class="fa fa-angle-right"></i>
        </div>
      </picker>
    </div>
    <div class="item">
      <div class="title">快递单号</div>
      <input class="input" v-model="expno" placeholder="请输入快递单号">
    </div>
    <div class="btn" @click="SendFar">
      确认提交
    </div>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        companies: [],
        companie: {},
        index: 0,
        choice: false,
        params: {},
        expno: ''
      }
    },
    methods: {
      GetCompany () {
        this.$store.dispatch({
          type: 'GetCompany'
        }).then((data) => {
          let Arr = []
          Object.keys(data.data).forEach((key) => {
            Arr.push({id: key, name: data.data[key]})
          })
          this.companies = Arr
        }).catch((e) => {
          console.log(e)
        })
      },
      PickerChange (e) {
        this.index = e.target.value
        this.companie = this.companies[e.target.value]
        this.choice = true
      },
      SendFar () {
        if (!this.choice) {
          wx.showToast({
            title: '快递公司必须填写',
            icon: 'none'
          })
          return
        }
        wx.showLoading({
          title: '处理中...'
        })
        this.$store.dispatch({
          type: 'SendFar',
          data: {
            orderid: this.params.id,
            expid: this.companie.id,
            expno: this.expno
          }
        }).then(() => {
          wx.showToast({
            title: '发货成功'
          })
          wx.hideLoading()
          wx.navigateBack()
        }).catch(() => {
          wx.showToast({
            title: '发货失败',
            icon: 'none'
          })
          wx.hideLoading()
        })
      },
      Scan () {
        const $this = this
        wx.scanCode({
          success: function (res) {
            console.log(res.result)
            $this.expno = res.result
            $this.FindCompany(res.result)
          },
          fail () {
            wx.showToast({
              title: '扫码失败',
              icon: 'none'
            })
          }
        })
      },
      FindCompany (id) {
        this.$store.dispatch({
          type: 'FindCompany',
          data: {
            number: id
          }
        }).then((data) => {
          this.companie = {
            name: data.data[0].com,
            id: data.data[0].comid
          }
          this.choice = true
          console.log(data)
        })
      }
    },
    onLoad (options) {
      this.companie = {}
      this.companies = []
      this.index = 0
      this.choice = false
      this.params = {}
      this.expno = ''
      this.params = options
      this.GetCompany()
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../static/style/reset';
  .header{
    display: flex;
    padding: 20px;
    align-items: center;
    border-bottom: 0.5px solid #eee;
    .left{
      flex:1;
      .text{
        font-size: 25px;
        color: #333;
        font-weight: bold;
      }
      .subText{
        font-size: 16px;
        color: #999;
        margin-top: 10px;
      }
    }
    .right{
        width: 24px;
      .img{
        width: 100%;
        height: 24px;
        background-image:url("../../../static/image/scan.png") ;
        background-size: 100% 100%;
      }
    }
  }
  .item{
    padding: 30px 20px 0 20px;
    .title{
      font-size: 14px;
      color:#777
    }
    .input{
      padding: 15px 0;
      font-size: 16px;
      border-bottom: 0.5px solid #eee;
      color: #333;
      &.default{
        color: #999;
      }
      .fa{
        float: right;
      }
    }
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
}

</style>
<style>
  page{
    background-color: #fff;
  }
</style>
