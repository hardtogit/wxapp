<template>
  <div class="container-box">
    <div class="top-card">
      <p class="name">累计奖励</p>
      <p class="price">¥ 198.67</p>
    </div>
    <div class="info-list">
      <div class="list-item">
        <p class="left-box">已结算奖励</p>
        <p class="right-box">¥ 98.00</p>
      </div>
    </div>
    <div class="title-box">
      <p>我的团队</p>
    </div>
    <scroll-view class="scroller-box"
      :scroll-y="true"
      :upper-threshold="50" 
      :lower-threshold="50" 
      @scrolltoupper="scrolltoupper" 
      @scrolltolower="scrolltolower"
      :style="{height: WinHeight + 'px'}">
      <div class="data-list">
        <div class="list-title">
          <p style="color:#008d0a;">团队日销</p>
          <p class="center-line">/</p>
          <p style="color:#00249b;">团队周期内销售额</p>
        </div>
        <div class="data-item" v-for="(item, index) in dataList" :key="index">
          <div class="item-left">
            <image src="http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg" class="user-pic" mode="aspectFill"/>
            <div class="item-left-info">
              <p class="username">美丽小姐姐</p>
              <p class="time">2018-08-20</p>
            </div>
          </div>
          <div class="item-right">
            <p class="price-common day-money"><span class="small">¥</span><span>1520</span></p>
            <span class="center-line">/</span>
            <p class="price-common week-money"><span class="small">¥</span><span>6840</span></p>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      WinHeight: 0,
      dataList: 10
    }
  },
  methods: {
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
          _this.WinHeight = res.windowHeight - res.windowWidth / 750 * 550
        },
        fail: (e) => {
          console.log(e)
        }
      })
    }
  },
  onLoad () {
    this.getSystemInfo()
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
      .list-title{
        height: 80rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-bottom: 1rpx solid #eeeeee;
        p{
          font-size: 24rpx;
          color: #cccccc;
        }
        .center-line{
          margin: 0 5rpx;
        }
      }
      .data-item{
        width: 100%;
        height: 130rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #eeeeee;
        .item-left{
          display: flex;
          align-items: center;
          .user-pic{
            width: 88rpx;
            height: 88rpx;
            border-radius: 44rpx;
            overflow: hidden;
            margin-right: 20rpx;
          }
          .item-left-info{
            display: flex;
            flex-direction: column;
            justify-content: center;
            .username{
              font-size: 28rpx;
              color: #333333;
            }
            .time{
              margin-top: 18rpx;
              font-size: 24rpx;
              color: #666666;
            }
          }
        }
        .item-right{
          display: flex;
          align-items: center;
          .center-line{
            font-size: 30rpx;
            color: #cccccc;
            margin: 0 6rpx;
          }
          .price-common{
            display: flex;
            align-items: flex-end;
            font-size: 30rpx;
            .small{
              font-size: 20rpx;
            }
          }
          .day-money{
            color: #008d0a;
          }
          .week-money{
            color: #00249b;
          }
        }
      }
    }
  }
}
</style>

