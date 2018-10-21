<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <!--弹框内容 start-->
            <div class="authorize-contianer">
              <div class="authorize-tips">
                <div class="wx-icon"></div>
                <p class="tips-text">授权您的公开信息(昵称和头像)</p>
                <p class="tips-text">便于查看优惠信息哦~</p>
              </div>
              <button open-type="getUserInfo" :plain="true" @getuserinfo="BindGetUserInfo" class="login-btn">微信登陆</button>
            </div>  
          <!--弹框内容 end-->  
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SN from '@/config/localstorage.name'
export default {
  props: {},
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true
      // 弹框基本配置 end
    }
  },
  methods: {
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    },
    // 弹框基本配置 end
    BindGetUserInfo (e) {
      const _this = this
      if (e.mp.detail.userInfo) {
        wx.showLoading({
          title: '授权登陆中'
        })
        _this.$store.dispatch({
          type: 'SynchroData',
          data: {
            encryptedData: e.mp.detail.encryptedData,
            iv: e.mp.detail.iv,
            session_key: wx.getStorageSync(SN.Auth).session_key
          }
        }).then(obj => {
          wx.hideLoading()
          _this.$emit('successFunc')
        }).catch(() => {
          wx.hideLoading()
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../static/style/reset';
.authorize-contianer{
  width: 510rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10rpx;
  .authorize-tips{
    width: 100%;
    height: 290rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10rpx 10rpx 0 0;
    .wx-icon{
      width: 105rpx;
      height: 105rpx;
      background: url('https://cdn.618000.com/wemini/images/wx.png') no-repeat;
      background-size: 100% 100%;
    }
    .tips-text{
      margin-top: 12rpx;
      color: #7b7b7b;
      font-size: 24rpx;
      &:first-child{
        margin-top: 40rpx;
      }
    }
  }
  .login-btn{
    width: 100%;
    height: 90rpx;
    background: #22aa44;
    font-size: 32rpx;
    line-height: 90rpx;
    color: #ffffff;
    border: none;
    margin: 0;
    padding: 0;
    border-radius: 0 0 10rpx 10rpx;
  }
}
</style>



