<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <div class="wdq-tm-cover" @click.stop="showFunc"></div>
          <!--弹框内容 start-->
          <div class="center-contianer" v-if="dataInfo">
            <div class="close-btn" @click="showFunc"></div>
            <div class="top-box">
              <image :src="dataInfo.userinfo.headimgurl" class="user-pic" mode="aspectFill"/>
              <p class="username">{{dataInfo.userinfo.nickname}}</p>
              <div class="star-list">
                <stars-level :score="score"></stars-level>
              </div>
              <p class="mgsp-str">他买过的商品</p>
            </div>
            <div class="produt-list" v-if="dataInfo.BoughtGoods && dataInfo.BoughtGoods.length > 0">
              <div class="list-item" v-for="(item, index) in dataInfo.BoughtGoods" :key="item.id" @click="ToGoodsDetail(item)">
                <div class="score-box">他的评分: {{item.rate}}</div>
                <image :src="item.cover" class="product-pic" mode="aspectFill"/>
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
import starsLevel from '@/components/stars-level'
export default {
  props: {
    dataInfo: {
      type: Object
    }
  },
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true,
      // 弹框基本配置 end
      article: '<div style="font-size: 14px;">免责申明内容放大镜看是否觉得舒服复活甲SDK回复是否会继父回家sad返回福建师大都会记得点击</div>'
    }
  },
  methods: {
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    },
    // 弹框基本配置 end
    ToGoodsDetail (Obj) {
      const url = '../goods/main?gid=' + Obj.id
      wx.navigateTo({ url })
    }
  },
  computed: {
    score: function () {
      return this.dataInfo && this.dataInfo.rate ? Number(this.dataInfo.rate) : 0
    }
  },
  components: {
    starsLevel
  }
}
</script>

<style lang="less" scoped>
@import '../../static/style/reset';
.center-contianer{
  width: 660rpx;
  background: #ffffff;
  border-radius: 10rpx;
  padding: 40rpx;
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
    top: 36rpx;
    right: 36rpx;
  }
  .top-box{
    width: 100%;
    padding-bottom: 27rpx;
    border-bottom: 1rpx solid #ebebeb;
    display: flex;
    flex-direction: column;
    align-items: center;
    .user-pic{
      width: 70rpx;
      height: 70rpx;
      border-radius: 35rpx;
      overflow: hidden;
    }
    .username{
      font-size: 24rpx;
      color: #565656;
      margin-top: 18rpx;
    }
    .star-list{
      margin-top: 14rpx;
    }
    .mgsp-str{
      font-size: 22rpx;
      color: #e64340;
      margin-top: 24rpx;
    }
  }
  .produt-list{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 25rpx;
    .list-item{
      width: 270rpx;
      height: 270rpx;
      position: relative;
      overflow: hidden;
      .product-pic{
        width: 270rpx;
        height: 270rpx;
      }
      .score-box{
        height: 48rpx;
        padding: 0 12rpx;
        line-height: 48rpx;
        font-size: 20rpx;
        color: #ffffff;
        background: #e64340;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}
</style>
