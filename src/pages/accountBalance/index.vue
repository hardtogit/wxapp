<template>
  <div class="container-box">
    <div class="top-card">
      <p class="name">账户余额</p>
      <p class="price" v-if="UserInfo">¥ {{UserInfo.balance}}</p>
    </div>
    <div class="title-box">
      <p>余额明细</p>
    </div>
    <div class="scroller-container" :style="{height: WinHeight + 'px'}">
      <scroll-view 
        class="scroller-box"
        :scroll-y="true"
        :upper-threshold="-30" 
        :lower-threshold="50" 
        @scrolltoupper="scrolltoupper" 
        @scrolltolower="scrolltolower"
        :style="{height: WinHeight + 'px'}"
        v-if="FinanceDetail.data && FinanceDetail.data.length > 0">
        <div class="data-list">
          <div class="data-item" v-for="(item, index) in FinanceDetail.data" :key="index">
            <div class="item-left">
              <div class="item-left-top">
                <div class="icon-common" :class="{'income-icon': item.cashType === 0}">{{item.cashType === 0 ? '收' : '支'}}</div>
                <p>{{item.title}}</p>
              </div>
              <p class="time">{{item.timeline}}</p>
            </div>
            <div class="item-right">
              <p style="color: #333333;" v-if="item.cashType === 1">{{item.cash}}</p>
              <p style="color: #ab9985;" v-if="item.cashType === 0">{{item.cash}}</p>
            </div>
          </div>
        </div>
      </scroll-view>
      <nothing v-if="!FinanceDetail.data || FinanceDetail.data.length === 0" @on-refresh="onRefresh"></nothing>
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
      FinanceDetail: {
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
      this.GetFinanceDetail(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 下拉
    scrolltoupper (e) {
      this.GetFinanceDetail(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 上拉
    scrolltolower (e) {
      if (Number(this.FinanceDetail.last_page) === Number(this.FinanceDetail.current_page)) {
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
      } else {
        this.GetFinanceDetail(this.FinanceDetail.last_page, config.LoadType.UP)
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
    GetFinanceDetail (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetFinanceDetail',
        data: {
          page: page
        }
      }).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.map(item => {
            item.cash = Number(item.cash) >= 0 ? '+' + item.cash : item.cash
            item.cashType = Number(item.cash) >= 0 ? 0 : 1 // 0为收入 1为支出
          })
        }
        if (loadType === config.LoadType.DOWN) {
          _this.FinanceDetail.data = res.data.data
          _this.FinanceDetail.current_page = res.data.current_page
          _this.FinanceDetail.last_page = res.data.last_page
          _this.FinanceDetail.total = res.data.total
        } else {
          res.data.data.map(item => {
            _this.FinanceDetail.data.push(item)
          })
          _this.FinanceDetail.current_page = res.data.current_page
          _this.FinanceDetail.last_page = res.data.last_page
          _this.FinanceDetail.total = res.data.total
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
    this.GetFinanceDetail(config.DefaultPage.Page, config.LoadType.DOWN)
  },
  components: {
    Nothing
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
    margin-top: 20rpx;
    background: #ffffff;
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          .item-left-top{
            display: flex;
            align-items: center;
            .icon-common{
              width: 20rpx;
              height: 20rpx;
              border-radius: 10rpx;
              background: #999999;
              margin-right: 12rpx;
              font-size: 18rpx;
              line-height: 20rpx;
              color: #ffffff;
              text-align: center;
              &.income-icon{
                background: #ab9985;
              }
            }
            p{
              font-size: 24rpx;
              color: #666666; 
            }
          }
          .time{
            font-size: 20rpx;
            color: #999999;
            margin-top: 14rpx;
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

