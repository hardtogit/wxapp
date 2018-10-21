<template>
  <div class="page-container">
    <div class="pay-return-box">
      <div class="pay-status">
        <p>购买支付成功</p>
      </div>
      <div class="use-btn" @click="GoToOrderDetail">立即使用核销码</div>
    </div>
    <div class="share-card-box">
      <div class="share-box-menu">
        <div class="menu-item" :class="{'is-selected': tabSelected === 0}" @click="tabCheckFunc(0)">附近的推荐</div>
        <div class="menu-item" :class="{'is-selected': tabSelected === 1}" @click="tabCheckFunc(1)">好友买过的</div>
      </div>
      <div class="goods-recommend" v-if="RecommendList && RecommendList.length > 0">
        <div class="recommend-item" v-for="(item, index) in RecommendList" :key="item.id" @click="GoToGoodsDetail(item.id)">
          <image :src="item.cover" class="goods-pic" mode="aspectFill"/>
          <div class="score">评分: {{item.rate}}</div>
        </div>
      </div>
    </div>
    <div class="share-rule-box">
      <div class="rule-item">
        <div class="item-header">
          <div class="item-title" style="background: #16bd14;">分享规则</div>
          <div class="condition">所有页面都可分享</div>
        </div>
        <div class="item-content">用户可随时分享页面给朋友，用户购买商品后，您将获得相应的商品推荐奖励，奖励最高标准在商品的右上角。您获得的实际奖励跟您的星级评分挂钩，星级越高，奖励越多！</div>
      </div>
      <div class="rule-item">
        <div class="item-header">
          <div class="item-title" style="background: #e64340;">级差规则</div>
          <div class="condition">用户购买后加入团队</div>
        </div>
        <div class="item-content">用户可随时分享页面给朋友，用户购买商品后，您将获得相应的商品推荐奖励，奖励最高标准在商品的右上角。您获得的实际奖励跟您的星级评分挂钩，星级越高，奖励越多！</div>
      </div>
    </div>
    <div class="share-tips" v-if="tipsShow">
      <p>分享页面已生成</p>
      <p>分享任意页面给朋友可获得最高**元</p>
    </div>
    <!-- 菜单导航 start -->
    <div class="tab-menu-box">
      <div class="tab-item" @click="popShowFunc('shopinfoPop')">
        <p>商户信息</p>
      </div>
      <div class="tab-item" @click="popShowFunc('technicalSupportPop')">
        <p>技术支持</p>
      </div>
      <div class="tab-item" @click="popShowFunc('becomeBusinessPop')">
        <p>我也要卖</p>
      </div>
      <div class="tab-item tab-selected" @click="GoToMeView()">
        <p>会员中心</p>
      </div>
    </div>
    <!-- 菜单导航 end -->
    <!--商家详情弹出层 start-->
    <shopinfo-pop ref="shopinfoPop" :dataInfo="GoodsInfo.storeInfo"></shopinfo-pop>
    <!--商家详情弹出层 end-->
    <!--技术支持弹出层 start-->
    <technical-support-pop ref="technicalSupportPop"></technical-support-pop>
    <!--技术支持弹出层 end-->
    <!--我也要卖弹出层 start-->
    <become-business-pop ref="becomeBusinessPop" @popShow="popShowFunc"></become-business-pop>
    <!--我也要卖弹出层 end-->
    <!--合同细则弹出层 start-->
    <contract-pop ref="contractPop"></contract-pop>
    <!--合同细则弹出层 end-->
  </div>
</template>
<script>
import shopinfoPop from '@/components/shopinfo-pop'
import technicalSupportPop from '@/components/technical-support-pop'
import becomeBusinessPop from '@/components/become-business-pop'
import contractPop from '@/components/contract-pop'
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      GoodsInfo: wx.getStorageSync(SN.PayGoodsInfo),
      RecommendList: [],
      tipsShow: false,
      optionObj: null,
      tabSelected: 0
    }
  },
  components: {
    shopinfoPop,
    technicalSupportPop,
    becomeBusinessPop,
    contractPop
  },
  methods: {
    // 初始化数据
    InitalData () {
      this.GoodsInfo = wx.getStorageSync(SN.PayGoodsInfo)
      this.RecommendList = []
      this.tipsShow = false
      this.optionObj = null
      this.tabSelected = 0
    },
    GoToMeView () {
      const url = '../me/main'
      wx.navigateTo({ url })
    },
    tabCheckFunc (num) {
      this.tabSelected = num
      this.GetRecommendGoods()
    },
    GetRecommendGoods () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetRecommendGoods',
        data: {
          limit: 2
        }
      }).then(res => {
        _this.RecommendList = res.data
      })
    },
    GoToOrderDetail () {
      const url = '../orderDetail/main?orderid=' + this.optionObj.orderid
      wx.navigateTo({ url })
    },
    GoToGoodsDetail (id) {
      const url = '../goods/main?gid=' + id
      wx.navigateTo({ url })
    },
    // 弹框弹出隐藏事件
    popShowFunc (type) {
      switch (type) {
        case 'shopinfoPop':
          this.$refs.shopinfoPop.showFunc()
          break
        case 'technicalSupportPop':
          this.$refs.technicalSupportPop.showFunc()
          break
        case 'becomeBusinessPop':
          this.$refs.becomeBusinessPop.showFunc()
          break
        case 'contractPop':
          this.$refs.contractPop.showFunc()
          break
      }
    }
  },
  onLoad (option) {
    this.optionObj = option
    this.GetRecommendGoods()
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.page-container{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 150rpx;
  .pay-return-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80rpx;
    .pay-status{
      display: flex;
      align-items: center;
      &::before{
        content: '';
        width: 95rpx;
        height: 84rpx;
        background: url('../../../static/image/paysuccess.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 25rpx;
      }
      p{
        font-size: 36rpx;
        color: #1aad19;
      }
    }
    .use-btn{
      width: 524rpx;
      height: 89rpx;
      background: #1aad19;
      box-shadow: 0 10rpx 10rpx 0	rgba(7, 0, 2, 0.26);
      border-radius: 10rpx;
      line-height: 89rpx;
      color: #ffffff;
      font-size: 34rpx;
      margin-top: 70rpx;
      text-align: center;
    }
  }
  .share-card-box{
    margin-top: 130rpx;
    width: 710rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .share-box-menu{
      width: 100%;
      height: 57rpx;
      border-bottom: 3rpx solid #eeeeee;
      display: flex;
      align-items: center;
      .menu-item{
        width: 260rpx;
        height: 54rpx;
        text-align: center;
        position: relative;
        font-size: 32rpx;
        color: #e64340;
        &.is-selected{
          &::after{
            content: '';
            position: absolute;
            width: 100%;
            height: 3rpx;
            bottom: -3rpx;
            left: 0;
            background: #e64340;
            z-index: 10;
          }
        }
      }
    }
    .goods-recommend{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .recommend-item{
        width: 345rpx;
        height: 345rpx;
        border-radius: 10rpx;
        margin-top: 35rpx;
        position: relative;
        overflow: hidden;
        background: #333333;
        .goods-pic{
          width: 345rpx;
          height: 345rpx;
        }
        .score{
          position: absolute;
          top: 10rpx;
          left: 0;
          background: #e64340;
          height: 48rpx;
          font-size: 24rpx;
          color: #ffffff;
          line-height: 48rpx;
          padding: 0 20rpx;
        }
      }
    }
  }
  .share-rule-box{
    margin-top: 30rpx;
    width: 710rpx;
    padding: 20rpx;
    position: relative;
    border-radius: 10rpx;
    border: 2rpx solid #eeeeee;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    margin-bottom: 60rpx;
    .rule-item{
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 22rpx;
      &:first-child{
        margin-top: 0;
      }
      .item-header{
        display: flex;
        align-items: center;
        .item-title{
          height: 60rpx;
          border-radius: 6rpx 0 0 6rpx;
          line-height: 60rpx;
          text-align: center;
          font-size: 24rpx;
          color: #ffffff;
          padding: 0 20rpx;
        }
        .condition{
          height: 60rpx;
          border-radius: 0 6rpx 6rpx 0;
          background: #cccccc;;
          line-height: 60rpx;
          text-align: center;
          font-size: 24rpx;
          color: #333333;
          padding: 0 25rpx;
        }
      }
      .item-content{
        width: 100%;
        margin-top: 22rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        color: #888888;
      }
    }
  }
  .share-tips{
    width: 510rpx;
    height: 210rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -105rpx;
    margin-left: -255rpx;
    background: rgba(0, 159, 30, 0.84);
    border-radius: 15rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p{
      font-size: 24rpx;
      line-height: 48rpx;
      color: #ffffff;
      padding: 0 140rpx;
      text-align: center;
    }
  }
}
.tab-menu-box{
  width: 100%;
  height: 120rpx;
  position: fixed;
  bottom: 60rpx;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background: #ffffff;
  padding: 0 30rpx;
  .tab-item{
    width: 160rpx;
    height: 60rpx;
    border-radius: 10rpx;
    border: 1rpx solid #dddddd;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    p{
      font-size: 24rpx;
      color: #999999;
    }
  }
  .tab-selected{
    border: none;
    background: #ff3333;
    p{
      color: #ffffff;
    }
  }
}
</style>
<style>
page{
  background: #ffffff;
}
</style>
