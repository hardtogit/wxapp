<template>
  <div class="container-box">
    <div class="top-card">
      <p class="name">累计获得奖励</p>
      <p class="price" v-if="UserInfo">¥ {{UserInfo.stats.grandtotal}}</p>
    </div>
    <div class="title-box">
      <div class="item left active" @click="changeTab(1)">
         <div :class="{'text':true, 'active':activeItem===1}" >推荐购买</div>
      </div>
      <div class="item right" @click="changeTab(3)">
        <div :class="{'text':true, 'active':activeItem===3}" >分销售出</div>
      </div>
      <div class="item center" @click="changeTab(2)">
        <div :class="{'text':true, 'active':activeItem===2}" >购物返利</div>
      </div>
    </div>
    <div class="data-list">
      <div class="data-item item-title" v-for="(item,index) in list.data" :key="index">
        <div class="item-left"><div class="circle">收</div></div>
        <div class="item-center">
          <div class="goods">商品：{{item.order.goodsname}}}</div>
          <div class="buy-name">购买人：{{item.order.nickname}}</div>
          <div class="buy-time">时间：{{item.timeline}}</div>
        </div>
        <div class="item-right" style="text-align: right;">+{{item.cash}}</div>
      </div>
    </div>
    <div class="no-data" v-if="(!list.data || list.data.length === 0)&&list.current_page>1">
      <nothing   @on-refresh="onRefresh"></nothing>
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
      UserInfo: null,
      activeItem: 1,
      list: {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      }
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
      this.GetList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    changeTab (index) {
      this.activeItem = index
      this.list.data = []
      this.list.current_page = 1
      this.GetList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    GetList (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetAwardhistory',
        data: {
          page: page,
          type: this.activeItem
        }
      }).then(res => {
        _this.list.current_page = 1 + parseInt(_this.list.current_page)
        if (loadType === config.LoadType.DOWN) {
          console.log(res.data)
          _this.list.data = res.data.data
          _this.list.last_page = res.data.last_page
          _this.list.total = res.data.total
        } else {
          res.data.data.map(item => {
            _this.list.data.push(item)
          })
          _this.list.last_page = res.data.last_page
          _this.list.total = res.data.total
        }
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
      })
    }
  },
  onLoad () {
    this.GetUserInfo()
    this.GetList(config.DefaultPage.Page, config.LoadType.DOWN)
  },
  // 上拉
  onReachBottom () {
    if (Number(this.list.last_page) + 1 === Number(this.list.current_page)) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none'
      })
    } else {
      this.GetList(this.list.current_page, 'UP')
    }
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
  .title-box{
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
   .item{
     flex: 1;
     text-align: center;
     height: 100%;
     color:#333;
     padding: 0 10px;
     font-size: 14px;
     .text{
       height: 100%;
       box-sizing: border-box;
       line-height: 44px;
       &.active{
         border-bottom: 2px solid #ab9985;
         color:#ab9985
       }

     }
   }
  }

  .data-list{
    width: 100%;
    padding: 0 20rpx;
    background-color: #fff;
    .data-item{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #eeeeee;
      .item-left{
        flex: 0 42px;
        .circle{
          width: 24px;
          line-height: 24px;
          text-align: center;
          height: 24px;
          color: #fff;
          margin: 0  auto;
          font-size: 14px;
          border-radius: 50%;
          background-color: #ab9985;
        }
      }
      .item-center{
        font-size: 10px;
        color:#333;
        width:231px;
        .goods{
          margin-top: 8px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .buy-name{
          margin: 4px 0 4px 0;
        }
        .buy-time{
          margin-bottom: 8px;
        }

      }
      .item-right{
        flex:0 80px;
        font-size: 16px;
        color: #ab9985;
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

  }
  .no-data{
    margin-top: 200rpx;
  }

}
</style>

