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
                    <p style="font-size: 36rpx; color: #333333;">{{dataInfo.storename}}</p>
                  </div>
                  <div class="list-item" v-if="dataInfo.datum">
                    <p>营业执照编号：{{dataInfo.datum.orgid}}</p>
                  </div>
                  <div class="list-item" v-if="dataInfo.datum">
                    <p>公司注册资金：{{dataInfo.datum.capitals}}万人民币</p>
                  </div>
                  <div class="list-item">
                    <p>公司注册地址：{{dataInfo.detailAddress}}</p>
                  </div>
                  <div class="list-item">
                    <p>公司客服电话：{{dataInfo.storephone}}</p>
                  </div>
                  <div class="list-item" v-if="dataInfo.datum">
                    <p>营业执照照片</p>
                    <div class="img-list">
                      <image :src="dataInfo.datum.cardphoto" class="image-item" mode="aspectFill"/>
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
      padding: 80rpx 30rpx 40rpx 30rpx;
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
      .list-item{
        width: 100%;
        padding: 25rpx 0;
        border-bottom: 1rpx solid #f4f4f4;
        p{
          font-size: 22rpx;
          color: #666666;
        }
        .img-list{
          margin-top: 20rpx;
          display: flex;
          .image-item{
            width: 245rpx;
            margin-right: 12rpx;
          }
        }
      }
    }
  }
}
</style>