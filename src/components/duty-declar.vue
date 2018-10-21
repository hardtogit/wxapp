<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <!--弹框内容 start-->
            <div class="duty-contianer">
              <p class="title">免责声明</p>
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
      article: '<div style="font-size: 14px; line-height: 30px;">小宝荐平台为产品销售平台，用户应悉知所购买产品是真实意愿表达。因平台有推荐分销机制并具有及时结算功能，用户在购买券码产品后24小时内可全额退款，24小时后如仍需退款，则平台将扣除佣金部分后退款，退款比例根据商品佣金设置的比例结算，退款比例约在30%-70%之间。用户购买的其他商品可在购买后，48小时内（平台未发货前）全额退款。</div>'
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
