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
                  <div class="pop-header-box">
                    <div class="header-title">全部评价</div>
                    <div class="close-btn" @click="showFunc"></div>
                  </div>
                  <div class="pop-main-cont">
                    <div class="comment-classify">
                      <div class="classify-item item-seleted">全部</div>
                      <div class="classify-item">好评</div>
                      <div class="classify-item">中评</div>
                      <div class="classify-item">差评</div>
                    </div>
                    <div class="scoller-box">
                      <!-- <scroll-view :scroll-y="true" class="scoller-mian" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower" :upper-threshold="-80" :lower-threshold="-80"> -->
                        <div class="comment-list">
                          <comment-item></comment-item>
                          <comment-item></comment-item>
                          <comment-item></comment-item>
                        </div>
                      <!-- </scroll-view> -->
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
import commentItem from '@/components/comment-item'
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
    scrolltoupper (e) {
      console.log(e)
    },
    scrolltolower (e) {
      console.log(e)
    }
  },
  components: {
    commentItem
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
  height: 90%;
  display: flex;
  flex-direction: column;
  .pop-main{
    flex: 1;
    position: relative;
    width: 100%;
    background: #f4f4f4;
    display: flex;
    flex-direction: column;
    .pop-header-box{
      width: 100%;
      height: 100rpx;
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      position: relative;
      background: #ffffff;
      .close-btn{
        width: 36rpx;
        height: 36rpx;
        background: url('../../static/image/close_icon.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 20rpx;
        top: 20rpx;
      }
      .header-title{
        font-size: 32rpx;
        color: #333333;
      }
    }
    .pop-main-cont{
      flex: 1;
      margin-top: 15rpx;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      .comment-classify{
        width: 100%;
        height: 120rpx;
        padding: 35rpx 20rpx;
        display: flex;
        align-items: center;
        .classify-item{
          width: 100rpx;
          height: 46rpx;
          background: #eeeeee;
          border-radius: 10rpx;
          text-align: center;
          line-height: 46rpx;
          font-size: 20rpx;
          color: #333333;
          margin-right: 20rpx;
          &.item-seleted{
            background: #fb0101;
            color: #ffffff;
          }
        }
      }
      .scoller-box{
        flex: 1;
        width: 100%;
        position: relative;
        // display: flex;
        // flex-direction: column;
        overflow-y: scroll;
      }
    }
  }
}
.scoller-mian{
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.comment-list{
  width: 100%;
  height: 4000rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>