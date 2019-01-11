<template>
  <div class="page-container">
    <div class="pay-return-box">
      <div class="pay-status">
        <p>购买支付成功</p>
      </div>
      <button v-if="UserInfo&&!UserInfo.phone" class="bind-btn" open-type="getPhoneNumber" @getphonenumber="Bindmobilebyauth"><div class="text"><div>绑定手机号</div><div class="tip">核销码过期前15日会短信提醒您</div></div></button>
      <div class="use-btn" @click="GoToOrderDetail">立即使用核销码</div>

    </div>
    <div v-if="GoodsInfo&&GoodsInfo.qrcode" class="qrcode">
      <image @click="preImage" class="qun-qrcode" :src='GoodsInfo&&GoodsInfo.qrcode'/>
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
    <div class="share-rule-box" v-if="ruleShow">
      <div class="rule-item">
        <div class="item-header">
          <div class="item-title" style="background: #16bd14;">分享规则</div>
          <div class="condition">所有页面都可分享</div>
          <div class="close"><image @click="hiddenRule" class="image" src="../../../static/image/close_icon.png" alt=""/> </div>
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
    <div class="back-btn" @click="GoToMeView">返回个人中心</div>
    <!--手机绑定弹出层 start-->
    <bind-mobile ref="bindMobile" @BindmobileSuccess='BindmobileSuccess'></bind-mobile>
    <!--手机绑定弹出层 end-->
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
    <circle-menu class="circleMenu" ref="circleMenu"
                 type="top" :number="4"
                 :btn="true" :circle="true"
                 :btns="[{text:'商户',extend:'信息',fn:()=>popShowFunc('shopinfoPop')},{text:'技术',extend:'支持', fn:()=>popShowFunc('technicalSupportPop')},
                 {text:'商户',extend:'合作',fn:()=>popShowFunc('becomeBusinessPop')},{text:'会员',extend:'中心',fn:()=>GoToMeView()}
                 ]">
    </circle-menu>
  </div>
</template>
<script>
import {reLogin} from '@/utils/utils'
import shopinfoPop from '@/components/shopinfo-pop'
import technicalSupportPop from '@/components/technical-support-pop'
import becomeBusinessPop from '@/components/become-business-pop'
import contractPop from '@/components/contract-pop'
import SN from '@/config/localstorage.name'
import bindMobile from '@/components/bind-mobile'
import circleMenu from '@/components/circle-menu'

export default {
  data () {
    return {
      RecommendList: [],
      tipsShow: false,
      optionObj: null,
      tabSelected: 0,
      ruleShow: true
    }
  },
  computed: {
    UserInfo () {
      return this.$store.state.app.UserInfo
    },
    GoodsInfo () {
      return this.$store.state.app.GoodsInfo
    }
  },
  components: {
    shopinfoPop,
    technicalSupportPop,
    becomeBusinessPop,
    contractPop,
    bindMobile,
    circleMenu
  },
  methods: {
    // 初始化数据
    InitalData () {
      this.RecommendList = []
      this.tipsShow = false
      this.optionObj = null
      this.tabSelected = 0
    },
    preImage () {
      wx.downloadFile({
        url: this.GoodsInfo.qrcode,
        success (res) {
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showModal({
                  title: '小提示',
                  content: '二维码已保存到手机相册，使用微信扫一扫扫码加群,更多优惠商品等你来！',
                  showCancel: false
                })
              }
            })
          }
        }
      })
    },
    GoToMeView () {
      const url = '../me/main'
      wx.navigateTo({ url })
    },
    tabCheckFunc (num) {
      this.tabSelected = num
      this.GetRecommendGoods()
    },
    hiddenRule () {
      this.ruleShow = false
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
    BindmobileSuccess () {
      this.$store.dispatch({
        type: 'GetUserInfo'
      })
    },
    triggerBindMobile () {
      this.$refs.bindMobile.showFunc()
    },
    Bindmobilebyauth (e) {
      console.log(e)
      const _this = this
      let eDetail = e.mp.detail
      if (eDetail.encryptedData && eDetail.iv) {
        wx.showLoading({
          title: '手机绑定中'
        })
        _this.$store.dispatch({
          type: 'Bindmobilebyauth',
          data: {
            session_key: wx.getStorageSync(SN.Auth).session_key,
            iv: e.mp.detail.iv,
            encryptedData: e.mp.detail.encryptedData
          }
        }).then(res => {
          _this.$store.dispatch({
            type: 'GetUserInfo'
          })
          wx.hideLoading()
          wx.showToast({
            title: '手机绑定成功',
            icon: 'success'
          })
        }).catch(() => {
          wx.hideLoading()
          wx.showToast({
            title: '手机绑定失败',
            icon: 'none'
          })
        })
      } else {
        _this.triggerBindMobile()
      }
    },
    // 弹框弹出隐藏事件
    popShowFunc (type) {
      this.$refs[type].showFunc()
    }
  },
  // 滚动时隐藏菜单栏
  onPageScroll: function (e) {
    if (this.$refs.circleMenu.open === true) {
      this.$refs.circleMenu.open = false
      this.$refs.circleMenu.toggleAnimate = false
      this.$refs.circleMenu.MaskToggle = false
    }
  },
  onHide () {
    if (this.$refs.circleMenu.open === true) {
      this.$refs.circleMenu.open = false
      this.$refs.circleMenu.toggleAnimate = false
      this.$refs.circleMenu.MaskToggle = false
    }
  },
  onLoad (option) {
    this.optionObj = option
    this.GetRecommendGoods()
    reLogin()
    this.$store.dispatch({
      type: 'GetUserInfo'
    })
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
  .qun-qrcode{
    margin: 20px auto 0 auto;
    width: 164px;
    height: 164px;
  }
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
    .bind-btn{
      width: 524rpx;
      height: 89rpx;
      background: #f47023;
      justify-items: center;
      box-shadow: 0 10rpx 10rpx 0	rgba(7, 0, 2, 0.26);
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 34rpx;
      margin-top: 70rpx;
      text-align: center;
      .text{
        flex: 1;
        .tip{
          font-size: 10px;
          margin-top: 4px;
        }
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
  .back-btn{
    width: 524rpx;
    height: 89rpx;
    background: #f47023;
    box-shadow: 0 10rpx 10rpx 0	rgba(7, 0, 2, 0.26);
    border-radius: 10rpx;
    line-height: 89rpx;
    color: #ffffff;
    font-size: 34rpx;
    margin-top: 30rpx;
    text-align: center;
  }
  .share-card-box{
    margin-top: 70rpx;
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
    .close{
      flex: 1;
      text-align: right;
      .image{
        width: 24px;
        float: right;
        display: block;
        height: 24px;
        background: url("../../../static/image/close_icon.png");
        background-size: 100% 100%;
      }
    }
    margin-top: 30rpx;
    width: 710rpx;
    padding: 20rpx;
    position: relative;
    border-radius: 10rpx;
    border: 2rpx solid #eeeeee;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    margin-bottom: 30rpx;
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
