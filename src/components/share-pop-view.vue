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
                  <div class="share-list">
                    <button class="share-item" open-type="share" :plain="true">
                      <div class="icon-common wx-icon"></div>
                      <p>发给好友</p>
                    </button>
                    <div class="center-line"></div>
                    <button class="share-item" :plain="true" @click="BuildPoster">
                      <div class="icon-common hbtj-icon"></div>
                      <p>海报推荐</p>
                    </button>
                  </div>
                  <div class="pygm-btn">朋友购买可获得¥{{spreaderrebate}}奖励</div>
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
  props: {
    spreaderrebate: {
      type: String,
      default: '0'
    },
    minrebate: {
      type: String,
      default: '0'
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
    showFunc (type) {
      if (type) {
        this.popShow = false
      } else {
        this.popShow = !this.popShow
      }
    },
    // 弹框基本配置 end
    BuildPoster () {
      this.$emit('BuildPoster')
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
  border-radius: 14rpx 14rpx 0 0;
  .pop-main{
    position: relative;
    width: 100%;
    background: #ffffff;
    .card-container{
      width: 100%;
      padding: 80rpx 20rpx 40rpx 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .share-list{
        width: 400rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .share-item{
          height: 120rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border: none!important;
          padding: 0!important;
          margin: 0!important;
          .icon-common{
            width: 80rpx;
            height: 80rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            &.wx-icon{
              width: 80rpx;
              height: 80rpx;
              background: url('../../static/image/share_fre_icon.png') no-repeat;
              background-size: 100% 100%;
            }
            &.hbtj-icon{
              width: 80rpx;
              height: 80rpx;
              background: url('../../static/image/share_quan_icon.png') no-repeat;
              background-size: 100% 100%;
            }
          }
          p{
            font-size: 24rpx;
            color: #333333;
          }
        }
        .center-line{
          width: 1px;
          height: 122rpx;
          background: #eeeeee;
        }
      }
      .pygm-btn{
        margin-top: 50rpx;
        width: 100%;
        height: 86rpx;
        border-radius: 5px;
        background: #ab9985;
        line-height: 86rpx;
        text-align: center;
        font-size: 26rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
