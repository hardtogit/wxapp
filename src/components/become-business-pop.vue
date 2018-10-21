<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}" @catchtouchmove="preventD">
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
                    <p class="item-name">公司名称</p>
                    <input type="text" class="input-text" placeholder="填写您的公司名称" v-model="linkname">
                  </div>
                  <div class="form-item">
                    <p class="item-name">联系方式</p>
                    <input type="text" class="input-text" placeholder="填写您公司的联系方式" v-model="mobile">
                  </div>
                  <div class="form-item">
                    <p class="item-name">公司地址</p>
                    <input type="text" class="input-text" placeholder="填写您的公司地址" v-model="address">
                  </div>
                  <button class="hzxz-btn" @click="showOtherPop('contractPop')">合作细则</button>
                  <button class="submit-btn" @click="submitFunc">确认提交</button>
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
      linkname: '',
      mobile: '',
      address: ''
    }
  },
  watch: {
    popShow: function (newVal) {
      if (newVal) {
        this.linkname = ''
        this.mobile = ''
        this.address = ''
      }
    }
  },
  methods: {
    preventD () {
      return false
    },
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    },
    // 弹框基本配置 end
    showOtherPop (type) {
      this.$emit('popShow', type)
    },
    submitFunc () {
      const _this = this
      if (_this.linkname === '' || _this.mobile === '' || _this.address === '') {
        return wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
      }
      wx.showLoading({
        title: '提交中'
      })
      this.$store.dispatch({
        type: 'ApplyBecomeMerchant',
        data: {
          linkname: _this.linkname,
          mobile: _this.mobile,
          address: _this.address
        }
      }).then(res => {
        wx.hideLoading()
        _this.linkname = ''
        _this.mobile = ''
        _this.address = ''
        _this.showFunc()
        return wx.showModal({
          title: '提示',
          content: '申请提交成功,请耐心等待平台工作人员联系~',
          showCancel: false,
          confirmText: '知道了'
        })
      }).catch(() => {
        wx.hideLoading()
        return wx.showModal({
          title: '提示',
          content: '申请提交失败,请稍后重新试~',
          showCancel: false,
          confirmText: '知道了'
        })
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