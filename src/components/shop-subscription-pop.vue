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
                  <div class="gzh-box">
                    <div class="qrImg"></div>
                  </div>
                  <div class="ts-word">长按保存商家公众号二维码图片</div>
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
  border-radius: 14rpx 14rpx 0 0;
  .pop-main{
    position: relative;
    width: 100%;
    background: #ffffff;
    .card-container{
      width: 100%;
      padding: 130rpx 0 60rpx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .gzh-box{
        width: 350rpx;
        height: 350rpx;
        position: relative;
        &::before{
          content: '';
          display: block;
          width: 350rpx;
          height: 350rpx;
          background: #ab9985;
          transform: rotate(45deg);
        }
        .qrImg{
          width: 350rpx;
          height: 350rpx;
          position: absolute;
          top: 0;
          left: 0;
          background: #333333;
          z-index: 10;
        }
      }
      .ts-word{
        margin-top: 120rpx;
        font-size: 26rpx;
        color: #333333;
        padding-bottom: 20rpx;
        border-bottom: 2px solid #ab9985;
      }
    }
  }
}
</style>