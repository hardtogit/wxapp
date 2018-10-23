<template>
  <div class="container-box">
    <div class="top-card">
      <p class="name">累计个人奖励</p>
      <p class="price" v-if="UserInfo">¥ {{UserInfo.stats.spreaderrebate}}</p>
    </div>
    <!-- <div class="info-list">
      <div class="list-item">
        <p class="left-box">直接奖励</p>
        <p class="right-box">¥ </p>
      </div>
    </div> -->
    <div class="title-box">
      <p>直接销售</p>
    </div>
    <div class="scroller-container" :style="{height: WinHeight + 'px'}">
      <scroll-view class="scroller-box"
        :scroll-y="true"
        :upper-threshold="-30" 
        :lower-threshold="50"  
        @scrolltoupper="scrolltoupper" 
        @scrolltolower="scrolltolower"
        :style="{height: WinHeight + 'px'}"
        v-if="SalesRecord.data && SalesRecord.data.length > 0">
        <div class="data-list">
          <div class="data-item item-title">
            <div class="item-left">订单详情</div>
            <div class="item-center">购买人</div>
            <div class="item-right" style="text-align: right;">奖励</div>
          </div>
          <div class="data-item"  v-for="(item, index) in SalesRecord.data" :key="index">
            <!-- <div class="pro-info item-left">
              <image src="http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg" class="pro-pic" mode="aspectFill"/>
              <div class="pro-info-main">
                <p class="pone">{{item.order.orders_detail.goodsname}}</p>
                <p class="ptwo"><span>¥15.00</span><span>X 3</span></p>
              </div>
            </div> -->
            <div class="pro-info item-left">
              <div class="pro-info-main">
                <p class="pone">订单编号:{{item.order.id}}</p>
                <p class="ptwo">{{item.order.buytime}}</p>
              </div>
            </div>
            <div class="user-info item-center">
              <image :src="item.userinfo ? item.userinfo.headimgurl : ''" class="user-pic" mode="aspectFill"/>
              <p class="username">{{item.userinfo ? item.userinfo.nickname : ''}}</p>
            </div>
            <p class="bonus item-right">¥ {{item.amount}}</p>
          </div>
        </div>
      </scroll-view>
      <nothing v-if="!SalesRecord.data || SalesRecord.data.length === 0" @on-refresh="onRefresh"></nothing>
    </div>
  </div>
</template>
<script>
import * as config from '@/config/common.config'
import Nothing from '@/components/nothing'
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      WinHeight: 0,
      SalesRecord: {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      },
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
    // 刷新页面
    onRefresh () {
      this.GetSalesRecord(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 下拉
    scrolltoupper (e) {
      this.GetSalesRecord(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 上拉
    scrolltolower (e) {
      if (Number(this.SalesRecord.last_page) === Number(this.SalesRecord.current_page)) {
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
      } else {
        this.GetSalesRecord(this.SalesRecord.last_page, config.LoadType.UP)
      }
    },
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.WinHeight = res.windowHeight - res.windowWidth / 750 * 470
        },
        fail: (e) => {
          console.log(e)
        }
      })
    },
    GetSalesRecord (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetSalesRecord',
        data: {
          page: page
        }
      }).then(res => {
        if (loadType === config.LoadType.DOWN) {
          _this.SalesRecord.data = res.data.data
          _this.SalesRecord.current_page = res.data.current_page
          _this.SalesRecord.last_page = res.data.last_page
          _this.SalesRecord.total = res.data.total
        } else {
          res.data.data.map(item => {
            _this.SalesRecord.data.push(item)
          })
          _this.SalesRecord.current_page = res.data.current_page
          _this.SalesRecord.last_page = res.data.last_page
          _this.SalesRecord.total = res.data.total
        }
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
      })
    }
  },
  onLoad () {
    this.getSystemInfo()
    this.GetUserInfo()
    this.GetSalesRecord(config.DefaultPage.Page, config.LoadType.DOWN)
  },
  components: {
    Nothing
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
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
  .scroller-container{
    width: 100%;
    background: #ffffff;
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scroller-box{
    width: 100%;
    background: #ffffff;
    .data-list{
      width: 100%;
      padding: 0 20rpx;
      .data-item{
        width: 100%;
        height: 103rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #eeeeee;
        .item-left{
          width: 380rpx;
        }
        .item-center{
          width: 190rpx;
        }
        .item-right{
          width: 90rpx;
        }
        .pro-info{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .pro-pic{
            width: 64rpx;
            height: 64rpx;
            border-radius: 5rpx;
            border: 1rpx solid #eeeeee;
            overflow: hidden;
          }
          .pro-info-main{
            width: 300rpx;
            height: 64rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .pone{
              font-size: 20rpx;
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .ptwo{
              margin-top: 13rpx;
              font-size: 18rpx;
              color: #999999;
            }
          }
        }
        .user-info{
          display: flex;
          align-items: center;
          .user-pic{
            width: 38rpx;
            height: 38rpx;
            border-radius: 19rpx;
            overflow: hidden;
          }
          .username{
            flex: 1;
            padding-left: 10rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 20rpx;
            color: #333333;
          }
        }
        .bonus{
          font-size: 20rpx;
          color: #333333;
          text-align: right;
        }
      }
      .item-title{
        height: 70rpx;
        font-size: 24rpx;
        color: #333333;
      }
    }
  }
}
</style>

