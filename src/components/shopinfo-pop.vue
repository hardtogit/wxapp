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
                  <div class="list-item">
                    <p style="font-size: 16px; color: #333333;">{{dataInfo.storename}}</p>
                  </div>
                  <div class="content">
                  <div class="left" v-if="dataInfo.datum">
                        <image :src="dataInfo.datum.cardphoto" class="image-item" mode="aspectFill"/>
                  </div>
                  <div class="right">
                    <div class="list-item" v-if="dataInfo.datum">
                      <p>编&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp号：{{dataInfo.datum.orgid}}</p>
                    </div>
                    <div class="list-item" v-if="dataInfo.datum">
                      <p>注册资金：{{dataInfo.datum.regamount}}元人民币</p>
                    </div>
                    <div class="list-item">
                      <p>注册地址：{{dataInfo.detailAddress}}</p>
                    </div>
                    <div class="list-item">
                      <p>客服电话：{{dataInfo.storephone}}</p>
                    </div>
                  </div>
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
  props: {
    dataInfo: {
      type: Object,
      default: function () {
        return {
          datum: {}
        }
      }
    }
  },
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
      padding: 15px;
      /*flex-direction: column;*/
      align-items: center;
      position: relative;
      .content{
        display: flex;
        padding: 20px 0;
      }
      .close-btn{
        width: 15px;
        height: 15px;
        background: url('../../static/image/close_icon.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 15px;
        top: 15px;
      }
      .left{
        width:100px;
        height: 142px;
        .image-item{
          width: 100%;
          height: 100%;
          /*margin-right: 12rpx;*/
        }
      }
      .right{
        flex: 1;
        padding: 6px 0 6px 10px;
      }
      .list-item{
        width: 100%;
        padding-bottom: 22px;
        /*border-bottom: 1rpx solid #f4f4f4;*/
        p{
          font-size: 22rpx;
          color: #666666;
        }
        .img-list{
          /*margin-top: 20rpx;*/
          display: flex;
          .image-item{
            width: 100%;
            height: 100%;
            /*margin-right: 12rpx;*/
          }
        }
      }
    }
  }
}
</style>
