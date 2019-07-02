<template>
  <div class="container-box">
    <div class="type-tab-menu">
      <div class="tab-item" :class="{'selected': selectedTab === 1}" @click="tabSwitch(1)">
        <p class="tab-name">待发货</p>
      </div>
      <div class="tab-item" :class="{'selected': selectedTab === 2}" @click="tabSwitch(2)">
        <p class="tab-name">待收货</p>
      </div>
      <div class="tab-item" :class="{'selected': selectedTab === 3}" @click="tabSwitch(3)">
        <p class="tab-name">已收货</p>
      </div>
    </div>
    <div class="scroller-container" :style="{height: WinHeight + 'px'}">
      <scroll-view
        :scroll-y="true"
        class="scroller-box"
        :upper-threshold="-30"
        :lower-threshold="50"
        @scrolltoupper="scrolltoupper"
        @scrolltolower="scrolltolower"
        :style="{height: WinHeight + 'px'}"
        v-if="orderList.data && orderList.data.length > 0">
        <div class="order-item" v-for="(item, index) in orderList.data" :key="item.orderid" @click="viewDetail(item.orderid)">
          <div class="top-box">
            <div class="about-shop">
              <div class="shop-name">
                <p>{{item.storename}}</p>
              </div>
            </div>
            <div class="product-main">
              <div class="pic-box">
                <image :src="orderList.attach[item.order.orders_detail[0].coverid]" class="pic-img" mode="aspectFill"/>
              </div>
              <div class="product-info">
                <div class="pro-name">{{item.order.orders_detail[0].goodsname}}</div>
                <div class="detail-bottom">
                  <div class="bottom-left">
                    <p class="pro-price">¥ {{item.order.orders_detail[0].unitprice}}</p>
                    <p class="num">X {{item.order.orders_detail[0].numbers}}</p>
                  </div>
                  <div class="all-price">实付: ¥ {{item.order.orders_detail[0].prices}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="order-detail">
            <!--<p class="yxq-time">有效期截止时间: {{item.order.expiredate}}</p>-->
            <!--<div class="xhm-btn"></div>-->
          </div>
        </div>
      </scroll-view>
      <nothing v-if="!orderList.data || orderList.data.length === 0" @on-refresh="onRefresh"></nothing>
    </div>
  </div>
</template>
<script>
  import * as config from '@/config/common.config'
  import Nothing from '@/components/nothing'
  export default {
    data () {
      return {
        WinHeight: 0,
        selectedTab: 1,
        orderStatus: 'waitdeliver',
        orderList: {
          current_page: 1,
          last_page: 1,
          data: [],
          total: 0,
          attach: {}
        }
      }
    },
    methods: {
      viewDetail (id) {
        const url = '../entityOrderDetail/main?orderid=' + id + '&entryType=' + this.orderStatus
        wx.navigateTo({ url })
      },
      tabSwitch (num) {
        if (num !== this.selectedTab) {
          this.selectedTab = num
          switch (num) {
            case 1:
              this.orderStatus = 'waitdeliver'
              break
            case 2:
              this.orderStatus = 'waittake'
              break
            case 3:
              this.orderStatus = 'completed'
              break
          }
          console.log(this.orderStatus)
          this.onRefresh()
        }
      },
      // 刷新页面
      onRefresh () {
        this.GetOrderList(config.DefaultPage.Page, config.LoadType.DOWN)
      },
      // 下拉
      scrolltoupper (e) {
        this.GetOrderList(config.DefaultPage.Page, config.LoadType.DOWN)
      },
      // 上拉
      scrolltolower (e) {
        if (Number(this.orderList.last_page) === Number(this.orderList.current_page)) {
          wx.showToast({
            title: '暂无更多数据',
            icon: 'none'
          })
        } else {
          this.GetOrderList(this.orderList.last_page, config.LoadType.UP)
        }
      },
      getSystemInfo () {
        const _this = this
        wx.getSystemInfo({
          success: (res) => {
            _this.WinHeight = res.windowHeight - res.windowWidth / 750 * 206
          },
          fail: (e) => {
            console.log(e)
          }
        })
      },
      GetOrderList (page, loadType) {
        const _this = this
        wx.showLoading({
          title: '数据加载中'
        })
        _this.$store.dispatch({
          type: 'GetOrderList',
          data: {
            page: page,
            status: _this.orderStatus,
            genre: 'Y'
          }
        }).then(res => {
          if (loadType === config.LoadType.DOWN) {
            _this.orderList.data = res.data.data
            _this.orderList.current_page = res.data.current_page
            _this.orderList.last_page = res.data.last_page
            _this.orderList.total = res.data.total
            _this.orderList.attach = res.data.attach
          } else {
            res.data.data.map(item => {
              _this.orderList.data.push(item)
            })
            _this.orderList.current_page = res.data.current_page
            _this.orderList.last_page = res.data.last_page
            _this.orderList.total = res.data.total
            _this.orderList.attach = res.data.attach
          }
          wx.hideLoading()
        }).catch(() => {
          wx.hideLoading()
        })
      }
    },
    onLoad (option) {
      this.queryObj = option
      if (this.queryObj && this.queryObj.entryType && this.queryObj.entryType === 'completed') {
        this.selectedTab = 2
        this.orderStatus = 'completed'
      }
      this.getSystemInfo()
      this.GetOrderList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    components: {
      Nothing
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../static/style/reset';
  .container-box{
    /*position: absolute;*/
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    .classify-tab-menu{
      height: 180rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #eeeeee;
      background: #ffffff;
      .tab-item{
        flex: 1;
        height: 180rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .tab-icon{
          width: 70rpx;
          height: 70rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          &.hx-icon{
            &::before{
              content: '';
              width: 50rpx;
              height: 45rpx;
              background: #cccccc;
              background-size: 100% 100%;
            }
          }
          &.wm-icon{
            &::before{
              content: '';
              width: 54rpx;
              height: 42rpx;
              background: #cccccc;
              background-size: 100% 100%;
            }
          }
          &.wl-icon{
            &::before{
              content: '';
              width: 65rpx;
              height: 60rpx;
              background: #cccccc;
              background-size: 100% 100%;
            }
          }
        }
        .tab-name{
          font-size: 28rpx;
          color: #cccccc;
          margin-top: 12rpx;
        }
      }
      .selected{
        background: #eeeeee;
        .tab-icon{
          &.hx-icon{
            &::before{
              content: '';
              width: 50rpx;
              height: 45rpx;
              background: #ab9985;
              background-size: 100% 100%;
            }
          }
          &.wm-icon{
            &::before{
              content: '';
              width: 54rpx;
              height: 42rpx;
              background: #ab9985;
              background-size: 100% 100%;
            }
          }
          &.wl-icon{
            &::before{
              content: '';
              width: 65rpx;
              height: 60rpx;
              background: #ab9985;
              background-size: 100% 100%;
            }
          }
        }
        .tab-name{
          color: #ab9985;
        }
      }
    }
    .type-tab-menu{
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      .tab-item{
        display: flex;
        align-items: center;
        width: 65px;
        height: 22px;
        line-height: 22px;
        background-color: #eee;
        border-radius: 11px;
        justify-content: center;
        /*border-bottom: 4rpx solid #ffffff;*/
        margin-left: 60rpx;
        &:first-child{
          margin-left: 0;
        }
        .tab-name{
          font-size: 24rpx;
          color: #666666;
        }
      }
      .selected{
        background-color: #F8E6E7;
        /*border-bottom: 4rpx solid #ff3333;*/
        .tab-name{
          color: #ff3333;
        }
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
    }
  }
  .order-item{
    width: 100%;
    padding: 0 30rpx;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    margin-bottom: 20rpx;
    .top-box{
      width: 100%;
      padding: 30rpx 0;
      display: flex;
      flex-direction: column;
      .about-shop{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &::after{
          content: '';
          display: block;
          width: 17rpx;
          height: 29rpx;
          background: url('../../../static/image/more_icon.png') no-repeat;
          background-size: 100% 100%;
        }
        .shop-name{
          display: flex;
          align-items: center;
          &::before{
            content: '';
            display: block;
            width: 32rpx;
            height: 32rpx;
            background: url('../../../static/image/order_store_icon.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 16rpx;
          }
          p{
            font-size: 24rpx;
            color: #333333;
          }
        }
      }
      .product-main{
        margin-top: 30rpx;
        width: 100%;
        height: 160rpx;
        display: flex;
        align-items: center;
        .pic-box{
          flex: 0 0 160rpx;
          width: 160rpx;
          height: 160rpx;
          border-radius: 5rpx;
          overflow: hidden;
          .pic-img{
            width: 160rpx;
            height: 160rpx;
          }
        }
        .product-info{
          flex: 1;
          height: 160rpx;
          padding-left: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .pro-name{
            font-size: 28rpx;
            color: #333333;
            line-height: 40rpx;
          }
          .detail-bottom{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .bottom-left{
              display: flex;
              align-items: flex-end;
              .pro-price{
                font-size: 24rpx;
                color: #ff3333;
              }
              .num{
                font-size: 24rpx;
                color: #333333;
                margin-left: 24rpx;
              }
            }
            .all-price{
              font-size: 24rpx;
              color: #333333;
            }
          }
        }
      }
    }
    .order-detail{
      width: 100%;
      /*height: 70rpx;*/
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1rpx solid #ebebeb;
      .yxq-time{
        font-size: 20rpx;
        color: #333333;
      }
      .xhm-btn{
        display: flex;
        align-items: center;
        &::before{
          content: '';
          width: 23rpx;
          height: 23rpx;
          background: url('../../../static/image/order_code_icon.png') no-repeat;
          background-size: 100% 100%;
        }
        &::after{
          content: '销核码';
          margin-left: 13rpx;
          font-size: 24rpx;
          color: #ab9985;
        }
      }
    }
  }
</style>
