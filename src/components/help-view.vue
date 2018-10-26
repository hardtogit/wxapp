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
                  <div class="card-header">
                    <p class="title">系统帮助</p>
                    <div class="close-btn" @click="showFunc"></div>
                  </div>
                  <div class="card-content">
                     <wxParse :content="content">
                     </wxParse>
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
import wxParse from 'mpvue-wxparse'
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true,
      // 弹框基本配置 end
      showItem: -1,
      helpList: []
    }
  },
  methods: {
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    },
    // 弹框基本配置 end
    showItemFunc (num) {
      this.showItem = num
    }
  },
  components: {
    wxParse
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
      .card-header{
        width: 100%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .title{
          font-size: 34rpx;
          color: #333333;
        }
        .close-btn{
          width: 36rpx;
          height: 36rpx;
          background: url('../../static/image/close_icon.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: 20rpx;
          top: 22rpx;
        }
      }
      .card-content{
        width: 100%;
        padding: 20rpx;
        height: 600rpx;
        overflow-y: scroll;
        .help-item{
          display: flex;
          flex-direction: column;
          padding: 20rpx 0 20rpx 20rpx;
          position: relative;
          border-bottom: 1rpx solid #cccccc;
          overflow: hidden;
          &::before{
            content: '';
            width: 8rpx;
            height: 8rpx;
            background: #cccccc;
            top: 27rpx;
            left: 0;
            position: absolute;
          }
          .item-title-box{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title-name{
              font-size: 26rpx;
              color: #999999;
            }
            &::after{
              content: '';
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 10rpx;
              border-color: #ab9985 transparent transparent transparent;
            }
          }
          .item-cont{
            display: flex;
            flex-direction: column;
            padding-right: 35rpx;
            margin-top: 15rpx;
            overflow: hidden;
            p{
              font-size: 22rpx;
              color: #999999;
              line-height: 36rpx;
            }
          }
        }
      }
    }
  }
}
</style>
