<template>
  <div class="container-box" :style="{height: WinHeight + 'px'}">
    <div class="logo-box"></div>
    <p class="title-box">商家登陆管理后台</p>
    <div class="login-form">
      <div class="form-item">
        <input placeholder="请输入账号" class="text-input" v-model="Username"/>
      </div>
      <div class="form-item">
        <input placeholder="请输入密码" class="text-input" :password="true" v-model="Password"/>
      </div>
      <button :plain="true" class="sub-btn" @click="LoginSubmit">登陆</button>
    </div>
  </div>
</template>
<script>
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      WinHeight: 0,
      Username: '',
      Password: ''
    }
  },
  methods: {
    BusinessLoginNoPasswd () {
      wx.showLoading({
        title: '加载中'
      })
      this.$store.dispatch({
        type: 'BusinessLoginNoPasswd'
      }).then(res => {
        wx.setStorageSync(SN.StoreAuthToken, res.data[0].StoreAuthToken)
        wx.hideLoading()
        wx.redirectTo({
          url: '../businessManage/main'
        })
      }).catch(() => {
        console.log('免密登陆失败')
        wx.hideLoading()
      })
    },
    LoginSubmit () {
      const _this = this
      if (_this.Username === '') {
        return wx.showToast({
          title: '请输入账号',
          icon: 'none'
        })
      }
      if (_this.Password === '') {
        return wx.showToast({
          title: '请输入密码',
          icon: 'none'
        })
      }
      wx.showLoading({
        title: '加载中'
      })
      _this.$store.dispatch({
        type: 'BusinessLogin',
        data: {
          username: _this.Username,
          password: _this.Password
        }
      }).then(res => {
        wx.setStorageSync(SN.StoreAuthToken, res.data.StoreAuthToken)
        wx.hideLoading()
        wx.redirectTo({
          url: '../businessManage/main'
        })
      }).catch(() => {
        console.log('登陆失败')
        wx.hideLoading()
      })
    },
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.WinHeight = res.windowHeight
        },
        fail: (e) => {
          console.log(e)
        }
      })
    }
  },
  onLoad () {
    this.getSystemInfo()
    this.BusinessLoginNoPasswd()
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  &::before{
    content: '';
    width: 100%;
    height: 50%;
    background: #fb6308;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    z-index: -1;
  }
  .logo-box{
    width: 128rpx;
    height: 128rpx;
    background: url('../../../static/image/shanghu_logo.png') no-repeat;
    background-size: 100% 100%;
  }
  .title-box{
    font-size: 36rpx;
    color: #ffffff;
    margin-top: 33rpx;
  }
  .login-form{
    margin-top: 65rpx;
    width: 630rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10rpx 10rpx 0 rgba(7, 0, 2, 0.1);
    border-radius: 15rpx;
    background: #ffffff;
    padding: 80rpx 40rpx 150rpx 40rpx;
    .form-item{
      width: 100%;
      height: 70rpx;
      margin-top: 40rpx;
      &:first-child{
        margin-top: 0;
      }
      .text-input{
        box-sizing: border-box;
        width: 100%;
        height: 70rpx;
        border: 1px solid #cccccc;
        background: #ffffff;
        font-size: 24rpx;
        padding: 0 20rpx;
      }
    }
    .sub-btn{
      margin-top: 80rpx;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background: #fb6308;
      border: 1px solid #bb4601;
      border-radius: 10px;
      font-size: 36rpx;
      color: #ffffff;
    }
  }
}
</style>
<style>
page{
  background: #ffffff;
}
</style>


