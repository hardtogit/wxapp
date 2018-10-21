<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <!--弹框内容 start-->
            <div class="duty-contianer">
              <p class="title">合同细则</p>
              <!-- <scoller-view scroll-y=true :style="{'height': '40rpx', 'width': '400rpx', 'margin-top': '40rpx;'}"> -->
              <div class="duty-main">
                <wxParse :content="article" @preview="preview" @navigate="navigate"/>
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
  props: {},
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true,
      // 弹框基本配置 end
      article: '<div style="font-size: 14px; line-height: 30px;">双方基于自愿原则达成合作，由我方提供软件支持，你方提供销售产品，通过该小宝荐软件平台分销产品。你方承诺所提供的产品为自己生产或合法代理销售的产品，对所售出的商品负有完全的质量保证责任。我方保障小宝荐平台的稳定运行，账务记录，以及必要的分销支持。通过小宝荐平台所销售的产品收入属于你方，你方支付所得收入的5%作为软件服务费，在商品结算时扣除。为保障购产品用的合法权益，双方达成一致意见，销售收入的30%作为产品质量保证金，质保时间为30天，最低平台保留质保金不低于3600元。保证金在活动结束30个工作日内，如无用户申诉，则全额支付给你方。</div>'
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
  height: 350rpx;
  overflow-y: scroll;
}
</style>
