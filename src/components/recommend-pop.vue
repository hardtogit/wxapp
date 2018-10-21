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
                  <div class="header-title">
                    <p>推荐商家</p>
                  </div>
                  <div class="form-item">
                    <p class="item-name">商家名称</p>
                    <input type="text" class="input-text" placeholder="填写商家名称">
                  </div>
                  <div class="form-item">
                    <p class="item-name">联系方式</p>
                    <input type="text" class="input-text" placeholder="填写商家联系方式">
                  </div>
                  <div class="form-item">
                    <p class="item-name">经营类别</p>
                    <input type="text" class="input-text" placeholder="填写商家经营商品类别">
                  </div>
                  <div class="prompt">
                    <p>所有成功推荐的商户当月销售额达到20万元，您自己的商户次月软件服务费提成比例下降1%</p>
                  </div>
                  <button class="submit-btn">确认提交</button>
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
    },
    // 弹框基本配置 end
    showOtherPop (type) {
      this.$emit('popShow', type)
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
      padding: 0rpx 30rpx 40rpx 30rpx;
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
      .header-title{
        width: 100%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        p{
          font-size: 32rpx;
          color: #333333;
        }
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
      .prompt{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 50rpx;
        &::before{
          content: '*';
          display: block;
          width: 40rpx;
          height: 30rpx;
          line-height: 30rpx;
          margin-right: 10rpx;
          font-size: 28rpx;
          color: #ab9985;
          text-align: center;
        }
        p{
          font-size: 24rpx;
          line-height: 30rpx;
          color: #ab9985;
        }
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