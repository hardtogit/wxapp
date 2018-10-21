<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <!--弹框内容 start-->
          <div class="coupon-container" v-if="dataInfo">
            <div class="close-btn" @click="showFunc"></div>
            <div class="card-header">
              <p class="title">新人专享</p>
              <p class="subtitle">有且只有一次机会领取</p>
            </div>
            <div class="card-content">
              <div class="user-pic-box">
                <image src="https://cdn.618000.com/wemini/images/logo-mini.png" class="user-pic" mode="aspectFill"/>
              </div>
              <p class="prompt-word">为您省钱{{dataInfo.firstchit}}元</p>
              <div class="coupon-item">
                <div class="item-left">
                  <p class="name">{{dataInfo.topic}}</p>
                  <div class="validity-time">
                    <p>有效期至{{expireday}}</p>
                  </div>
                </div>
                <div class="item-center">
                  <div class="center-line"></div>
                </div>
                <div class="item-right">
                  <p class="price">¥ <span class="big-word">{{priceInteger}}</span>{{priceDecimal}}</p>
                </div>
              </div>
              <div class="receive-btn" @click="receiveFunc">立即领取</div>
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
  props: {
    dataInfo: {
      type: Object
    }
  },
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
    receiveFunc () {
      const _this = this
      wx.showToast({
        title: '成功领取',
        icon: 'success'
      })
      _this.showFunc()
    }
  },
  computed: {
    priceInteger () {
      let num = 0
      if (this.dataInfo && this.dataInfo.firstchit) {
        num = Math.round(Number(this.dataInfo.firstchit))
      }
      return num
    },
    priceDecimal () {
      let decimal = '.00'
      if (this.dataInfo && this.dataInfo.firstchit) {
        let num = Math.floor((Number(this.dataInfo.firstchit) - this.priceInteger) * 100)
        decimal = '.' + (num >= 10 ? num : ('0' + num))
      }
      return decimal
    },
    expireday () {
      let time = '0000-00-00'
      if (this.dataInfo && this.dataInfo.expireday) {
        time = this.dataInfo.expireday.slice(0, 10)
      }
      return time
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../static/style/reset';
.coupon-container{
  width: 600rpx;
  background: #f74937;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .card-header{
    width: 100%;
    height: 165rpx;
    background: #fa3f2a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .title{
      font-size: 40rpx;
      color: #ffffff;
    }
    .subtitle{
      font-size: 24rpx;
      color: #ffffff;
      margin-top: 20rpx;
    }
  }
  .card-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    padding: 45rpx 0 90rpx 0; 
    .user-pic-box{
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
      .user-pic{
        width: 100rpx;
        height: 100rpx;
      }
    }
    .prompt-word{
      margin-top: 32rpx;
      color: #fff;
      font-size: 24rpx;
    }
    .coupon-item{
      margin-top: 40rpx;
      width: 520rpx;
      height: 130rpx;
      background: #ffffff;
      display: flex;
      align-items: center;
      position: relative;
      border-radius: 8rpx;
      overflow: hidden;
      .item-left{
        flex: 0 0 350rpx;
        padding: 0 15rpx 0 30rpx;
        width: 350rpx;
        height: 130rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name{
          font-size: 32rpx;
          color: #333333;
        }
        .validity-time{
          margin-top: 18rpx;
          display: flex;
          align-items: center;
          &::before{
            content: '';
            width: 22rpx;
            height: 22rpx;
            background: url('../../static/image/icon_time.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 8rpx;
          }
          p{
            font-size: 22rpx;
            color: #8c8c8c;
          }
        }
      }
      .item-center{
        flex: 0 0 16rpx;
        width: 16rpx;
        height: 130rpx;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .center-line{
          width: 1rpx;
          height: 75rpx;
          border-left: 1rpx dotted #727272;
        }
        &::before{
          content: '';
          width: 16rpx;
          height: 16rpx;
          border-radius: 8rpx;
          background: #f74937;
          position: absolute;
          left: 0;
          top: -8rpx;
        }
        &::after{
          content: '';
          width: 16rpx;
          height: 16rpx;
          background: #f74937;
          position: absolute;
          left: 0;
          bottom: -8rpx;
          border-radius: 8rpx;
        }
      }
      .item-right{
        flex: 0 0 154rpx;
        width: 154rpx;
        height: 130rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .price{
          font-size: 22rpx;
          color: #f83a2b;
          .big-word{
            font-size: 36rpx;
          }
        }
      }
    }
    .receive-btn{
      width: 520rpx;
      height: 90rpx;
      background: #f4f400;
      border: 1rpx solid #a52230;
      box-shadow: 0px 10rpx 10rpx 0px rgba(7, 0, 2, 0.56);
      border-radius: 10rpx;
      margin-top: 40rpx;
      font-size: 36rpx;
      color: #724300;
      line-height: 90rpx;
      text-align: center;
    }
  }
  .close-btn{
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    width: 48rpx;
    height: 48rpx;
    z-index: 10;
    background: url('../../static/image/hb_icon_guanbi.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
