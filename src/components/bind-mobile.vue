<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <div class="wdq-tm-cover" @click="showFunc"></div>
          <!--弹框内容 start-->
            <div class="pop-out-box">
              <div class="pop-main">
                <div class="card-container">
                  <div class="close-btn" @click="showFunc"></div>
                  <div class="form-item">
                    <p class="item-name">手机号码</p>
                    <input type="text" class="input-text" placeholder="填写您的手机号码" v-model="phone">
                  </div>
                  <div class="form-item">
                    <p class="item-name">验证码</p>
                    <input type="text" class="input-text" placeholder="填写验证码" v-model="verificationCode">
                    <div class="verification-code-btn" :class="{'is-send': isSendCode}" @click.stop="SendSecurityCode">{{verificationBtnText}}</div>
                  </div>
                  <button class="submit-btn" @click="SubmitFunc">确认提交</button>
                </div>
              </div>
            </div>
          <!--弹框内容 end-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true,
      // 弹框基本配置 end
      phone: '',
      verificationCode: '',
      isSendCode: false,
      verificationBtnText: '获取验证码'
    }
  },
  methods: {
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    },
    // 弹框基本配置 end
    showOtherPop (type) {
      this.$emit('popShow', type)
    },
    // 发送短消息
    SendSecurityCode () {
      const _this = this
      if (!_this.isSendCode) {
        _this.isSendCode = true
        wx.showLoading({
          title: '短信发送中'
        })
        _this.$store.dispatch({
          type: 'SendSecurityCode',
          data: {
            mobile: _this.phone
          }
        }).then(res => {
          _this.CountDown()
          wx.hideLoading()
          wx.showToast({
            title: '短信发送成功',
            icon: 'success'
          })
        }).catch(() => {
          _this.isSendCode = false
          wx.hideLoading()
          wx.showToast({
            title: '短信发送失败',
            icon: 'none'
          })
        })
      }
    },
    // 短信倒计时
    CountDown () {
      const _this = this
      let time = 60
      setInterval(function () {
        if (time !== 0) {
          _this.verificationBtnText = time + 's后再试'
          time -= 1
        } else {
          _this.verificationBtnText = '获取验证码'
        }
      }, 1000)
    },
    SubmitFunc () {
      const _this = this
      if (_this.phone === '') {
        return wx.showToast({
          title: '请填写手机号码',
          icon: 'none'
        })
      }
      if (_this.verificationCode === '') {
        return wx.showToast({
          title: '请填写验证码',
          icon: 'none'
        })
      }
      wx.showLoading({
        title: '提交中'
      })
      _this.$store.dispatch({
        type: 'Bindmobile',
        data: {
          mobile: _this.phone,
          code: _this.verificationCode
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        if (_this.$attrs.callBack) {
          _this.$attrs.callBack()
        }
        _this.$emit('BindmobileSuccess', res.data.uid, res.data.phone)
        _this.popShow = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../static/style/reset';
.pop-out-box{
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  .pop-main{
    position: relative;
    width: 100%;
    background: #ffffff;
    .card-container{
      width: 100%;
      padding: 70rpx 30rpx 40rpx 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .close-btn{
        width: 36rpx;
        height: 36rpx;
        background: url('../../static/image/close_icon.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 20rpx;
        top: 20rpx;
      }
      .form-item{
        width: 100%;
        height: 80rpx;
        border-bottom: 1rpx solid #f4f4f4;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .item-name{
          font-size: 24rpx;
          color: #333333;
          flex: 0 0 160rpx;
        }
        .input-text{
          flex: 1;
          font-size: 24rpx;
          color: #333333;
        }
        .verification-code-btn{
          width: 140rpx;
          height: 54rpx;
          border-radius: 4px;
          background-color: #ff3333;
          line-height: 54rpx;
          text-align: center;
          font-size: 22rpx;
          color: #ffffff;
          &.is-send{
            color: #ffffff;
            background: #cccccc;
          }
        }
      }
      .hzxz-btn{
        width: 242rpx;
        height: 60rpx;
        background: #ffffff;
        border-radius: 30rpx;
        border: 1rpx solid #ab9985;
        font-size: 24rpx;
        line-height: 58rpx;
        color: #333333;
        margin-top: 40rpx;
      }
      .submit-btn{
        margin-top: 37rpx;
        width: 100%;
        height: 86rpx;
        background: #ab9985;
        border-radius: 5rpx;
        font-size: 24rpx;
        line-height: 86rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
