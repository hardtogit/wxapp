<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <!--弹框内容 start-->
          <div class="duty-contianer">
            <p class="title">{{title}}</p>
            <!-- <scoller-view scroll-y=true :style="{'height': '40rpx', 'width': '400rpx', 'margin-top': '40rpx;'}"> -->
            <div class="duty-main">
              <wxParse :content="content" @preview="preview" @navigate="navigate"/>
            </div>
            <!-- </scoller-view> -->
            <div class="futy-bottom">
              <p class="close-btn" @click="showFunc">已阅读</p>
            </div>
          </div>
          <!--弹框内容 end-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import wxParse from 'mpvue-wxparse'
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        // 弹框基本配置 start
        popShow: false,
        showMask: true
      }
    },
    methods: {
      // 弹框基本配置 start
      showFunc () {
        this.popShow = !this.popShow
      }
      // 弹框基本配置 end
    },
    components: {
      wxParse
    }
  }
</script>

<style lang="less" scoped>
  @import '../../static/style/reset';
  .duty-contianer{
    width: 590rpx;
    background: #ffffff;
    border-radius: 10rpx;
    padding: 45rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title{
      font-size: 34rpx;
      color: #333333;
    }
    .futy-bottom{
      width: 100%;
      margin-top: 50rpx;
      display: flex;
      justify-content: flex-end;
      .close-btn{
        font-size: 32rpx;
        color: #52c152;
      }
    }
  }
  .duty-main{
    width: 100%;
    margin-top: 40rpx;
    line-height: 1.4;
    font-size: 28rpx;
    height: 350rpx;
    overflow-y: scroll;
  }
</style>
