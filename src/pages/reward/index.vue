<template>
  <div class="container-box">
    <div class="top-card">
      <p class="name">累计个人奖励</p>
      <p class="price" v-if="UserInfo">¥ {{UserInfo.stats.spreaderrebate}}</p>
    </div>
    <div class="info-list">
      <div class="list-item">
        <p class="left-box">已结算奖励金</p>
        <p class="right-box">¥ </p>
      </div>
      <div class="list-item">
        <p class="left-box">待结算奖励金</p>
        <p class="right-box">¥ </p>
      </div>
    </div>
    <div class="title-box">
      <p>奖励明细</p>
    </div>
    <scroll-view class="scroller-box"
      :scroll-y="true"
      :upper-threshold="-30" 
      :lower-threshold="50" 
      @scrolltoupper="scrolltoupper" 
      @scrolltolower="scrolltolower"
      :style="{height: WinHeight + 'px'}">
      <div class="data-list">
        <div class="data-item" v-for="(item, index) in dataList" :key="index">
          <div class="item-left">
            <div class="item-left-info">
              <p>商品：王大爷的饼干铺子卖的饼干</p>
              <p class="gmr">购买人：王大爷<span>[分销商]</span></p>
              <p class="time">2018-08-20</p>
            </div>
          </div>
          <div class="item-right">
            <p style="color: #ab9985;">+26.00</p>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      WinHeight: 0,
      dataList: 10,
      UserInfo: null
    }
  },
  methods: {
    // 获取用户基本信息
    GetUserInfo () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetUserInfo'
      }).then(res => {
        _this.UserInfo = res.data
        wx.setStorageSync(SN.UserInfo, res.data)
      })
    },
    scrolltoupper (e) {
      console.log(e)
    },
    scrolltolower (e) {
      console.log(e)
    },
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.WinHeight = res.windowHeight - res.windowWidth / 750 * 630
        },
        fail: (e) => {
          console.log(e)
        }
      })
    }
  },
  onLoad () {
    this.getSystemInfo()
    this.GetUserInfo()
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  .top-card{
    width: 100%;
    height: 350rpx;
    background: url('https://cdn.618000.com/wemini/images/20180906105847.jpg') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name{
      font-size: 32rpx;
      color: #333333;
    }
    .price{
      font-size: 76rpx;
      color: #333333;
      font-weight: bold;
      margin-top: 40rpx;
    }
  }
  .info-list{
    background: #ffffff;
    width: 100%;
    padding: 0 30rpx;
    .list-item{
      height: 80rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #ebebeb;
      .left-box{
        font-size: 28rpx;
        color: #333333;
      }
      .right-box{
        font-size: 28rpx;
        color: #ab9985;
      }
    }
  }
  .title-box{
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    p{
      font-size: 28rpx;
      color: #666666;
    }
    &::before{
      content: '';
      width: 40rpx;
      height: 2rpx;
      background: #ab9985;
      margin-right: 20rpx;
      display: block;
    }
    &::after{
      content: '';
      width: 40rpx;
      height: 2rpx;
      background: #ab9985;
      margin-left: 20rpx;
      display: block;
    }
  }
  .scroller-box{
    width: 100%;
    margin-top: 20rpx;
    background: #ffffff;
    .data-list{
      width: 100%;
      padding: 0 20rpx;
      .data-item{
        width: 100%;
        height: 150rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #eeeeee;
        .item-left{
          display: flex;
          align-items: center;
          &::before{
            content: '收';
            width: 50rpx;
            height: 50rpx;
            border-radius: 25rpx;
            background:  #ab9985;
            text-align: center;
            line-height: 50rpx;
            font-size: 28rpx;
            color: #ffffff;
            margin-right: 20rpx;
          }
          .item-left-info{
            display: flex;
            flex-direction: column;
            justify-content: center;
            p{
              font-size: 24rpx;
              color: #666666;
              margin-top: 13rpx;
              &:first-child{
                margin-top: 0;
              }
            }
            .gmr{
              span{
                font-size: 20rpx;
                color: #ab9985;
              }
            }
            .time{
              font-size: 20rpx;
            }
          }
        }
        .item-right{
          font-size: 32rpx;
        }
      }
    }
  }
}
</style>

