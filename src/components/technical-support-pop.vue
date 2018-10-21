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
                  <div class="top-header">
                    <div class="lxwm-box">联系我们</div>
                  </div>
                  <div class="about-main">
                    <p class="company-name">四川车库电子商务有限公司</p>
                    <p class="word-one">商户合作电话</p>
                    <p class="phone-num">18683810000</p>
                    <p class="word-two">(微信同号)</p>
                    <p class="address">公司地址: 成都市环球中心N31623</p>
                  </div>
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
      QRStr: '38468927492739847289749827349'
    }
  },
  methods: {
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    }
    // 弹框基本配置 end
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
      .top-header{
        width: 500rpx;
        height: 60rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        &::before{
          content: '';
          position: absolute;
          width: 100%;
          height: 1rpx;
          background: #ab9985;
          top: 30rpx;
          left: 0;
        }
        .lxwm-box{
          width: 310rpx;
          height: 60rpx;
          text-align: center;
          line-height: 60rpx;
          font-size: 30rpx;
          color: #ffffff;
          background: #ab9985;
          position: relative;
          &::before{
            content: '';
            position: absolute;
            width: 14rpx;
            height: 14rpx;
            background: #ffffff;
            border-radius: 7rpx;
            top: 23rpx;
            left: 20rpx;
          }
          &::after{
            content: '';
            position: absolute;
            width: 14rpx;
            height: 14rpx;
            background: #ffffff;
            border-radius: 7rpx;
            top: 23rpx;
            right: 20rpx;
          }
        }
      }
      .about-main{
        margin-top: 47rpx;
        width: 540rpx;
        border-radius: 15px;
        border: 1px solid #f8f3ed;
        box-shadow: 0px 10px 10px 0px rgba(171, 153, 133, 0.33);
        padding: 40rpx 30rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .company-name{
          font-size: 30rpx;
          color: #333333;
        }
        .word-one{
          margin-top: 28rpx;
          font-size: 24rpx;
          color: #666666;
        }
        .word-two{
          margin-top: 20rpx;
          font-size: 24rpx;
          color: #666666;
        }
        .phone-num{
          font-size: 36rpx;
          color: #ab9985;
          margin-top: 15rpx;
        }
        .address{
          font-size: 24rpx;
          color: #666666;
          margin-top: 30rpx;
        }
      }
    }
  }
}
</style>