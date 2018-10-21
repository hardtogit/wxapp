<template>
  <div class="container-box" v-if="basicInfo">
    <div class="header-card">
      <div class="to-me-admin" @click="ToMeCenter">
        <p>切换到个人版</p>
      </div>
      <div class="wallet-icon"></div>
      <p class="sentence-one">可提现金</p>
      <p class="price">¥ {{basicInfo.basic.balance}}</p>
    </div>
    <div class="card-common">
      <div class="card-title">
        <div class="card-title-left">
          <p>店铺总览</p>
        </div>
        <div class="card-title-right">
          <p>数据最后更新日期：2018.9.21</p>
        </div>
      </div>
      <div class="card-content shop-survey-box">
        <div class="survey-item">
          <p class="item-title">展示量</p>
          <p class="item-data">54656</p>
        </div>
        <div class="survey-item">
          <p class="item-title">订单量</p>
          <p class="item-data">54656</p>
        </div>
        <div class="survey-item">
          <p class="item-title">用户量</p>
          <p class="item-data">54656</p>
        </div>
        <div class="survey-item">
          <p class="item-title">分享奖</p>
          <p class="item-data">54656</p>
        </div>
        <div class="survey-item">
          <p class="item-title">精英奖量</p>
          <p class="item-data">54656</p>
        </div>
      </div>
    </div>
    <div class="card-common">
      <div class="card-title">
        <div class="card-title-left">
          <p>数据概况</p>
        </div>
        <div class="card-title-right">
          <p>仅统计最近一个月数据</p>
        </div>
      </div>
      <div class="card-content chart-box">
        <div class="switch-tab-menu">
          <div class="tab-item tab-selected">浏览</div>
          <div class="tab-item">销量</div>
          <div class="tab-item">用户</div>
          <div class="tab-item">退单</div>
          <div class="tab-item">分享</div>
          <div class="tab-item">提现</div>
        </div>
        <div class="chart-main">
          <ec-canvas class="canvas" id="mychart-dom-bar" canvas-id="mychart-bar" :ec="ec"></ec-canvas>
        </div>
      </div>
    </div>
    <div class="card-common">
      <div class="card-title">
        <div class="card-title-left">
          <p>已核销订单</p>
        </div>
        <div class="card-title-right">
          <p>合计已核销金额</p>
          <p class="price-green">￥98989.00</p>
        </div>
      </div>
      <div class="card-content write-off-box" v-if="VirtualList.data">
        <div class="data-item item-title">
          <div class="td-one">商品/规格/核销数量</div>
          <div class="td-two">核销码</div>
          <div class="td-three">买家</div>
          <div class="td-four">核销时间</div>
        </div>
        <div class="data-item" v-for="(item, index) in VirtualList.data" :key="item.usetime">
          <div class="td-one good-info">
            <p class="good-name">{{item.order.goodsname}}</p>
            <div class="mode-list">
              <div class="mode-item" v-for="(a, aIndex) in item.specList" :key="aIndex">{{a}}</div>
              <div class="number">x{{item.order.numbers}}</div>
            </div>
          </div>
          <div class="td-two">
            <div class="code-list" v-if="item.verifycode && item.verifycode.length > 0">
              <p v-for="(a, aIndex) in item.verifycode" :key="aIndex">{{a.verifycode}}</p>
            </div>
          </div>
          <div class="td-three user-info">
            <p class="username">{{item.userinfo.nickname}}</p>
            <p class="phone">{{item.userinfo.mobile ? item.userinfo.mobile : '未绑定'}}</p>
          </div>
          <div class="td-four item-time">
            <p>{{item.useDate}}</p>
            <p>{{item.useDateTime}}</p>
          </div>
        </div>
        <div class="show-more-btn" @click="ShowMoreVirtual">加载更多</div>
      </div>
    </div>
    <cover-view class="bottom-tab-menu">
      <cover-view class="tab-item" @click="GoToNews">
        <cover-view class="tab-icon">
          <cover-image class="icon-pic" mode="scaleToFill" src="https://cdn.618000.com/wemini/images/tuijian_icon.png"></cover-image>
        </cover-view>
        <cover-view class="tab-name">消息中心</cover-view>
      </cover-view>
      <cover-view class="tab-item">
        <cover-view class="tab-icon">
          <cover-image class="icon-pic" mode="scaleToFill" src="https://cdn.618000.com/wemini/images/jiaocheng_icon.png"></cover-image>
        </cover-view>
        <cover-view class="tab-name">使用教程</cover-view>
      </cover-view>
      <cover-view class="tab-item">
        <cover-view class="tab-icon">
          <cover-image class="icon-pic" mode="scaleToFill" src="https://cdn.618000.com/wemini/images/jianyong_icon.png"></cover-image>
        </cover-view>
        <cover-view class="tab-name">如何降佣</cover-view>
      </cover-view>
      <cover-view class="tab-item" @click="ScanCodeFunc">
        <cover-view class="tab-icon">
          <cover-image class="icon-pic" mode="scaleToFill" src="https://cdn.618000.com/wemini/images/saoma_icon.png"></cover-image>
        </cover-view>
        <cover-view class="tab-name">扫码核销</cover-view>
      </cover-view>
    </cover-view>
  </div>
</template>

<script>
import * as config from '@/config/common.config'
export default {
  data () {
    return {
      basicInfo: null,
      echartsData: [],
      VirtualList: {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      }
    }
  },
  methods: {
    GoToNews () {
      const url = '../news/main'
      wx.navigateTo({ url })
    },
    // 切换到个人中心
    ToMeCenter () {
      wx.redirectTo({
        url: '../me/main'
      })
    },
    // 获取商家基本信息
    GetBusinessBasicInfo (type) {
      const _this = this
      if (!type || type !== 'refresh') {
        wx.showLoading({
          title: '数据加载中'
        })
      }
      _this.$store.dispatch({
        type: 'GetBusinessBasicInfo'
      }).then(res => {
        // console.log(res)
        _this.basicInfo = res.data
        if (type && type === 'refresh') {
          wx.stopPullDownRefresh()
        } else {
          wx.hideLoading()
        }
      }).catch(() => {
        if (type && type === 'refresh') {
          wx.stopPullDownRefresh()
        } else {
          wx.hideLoading()
        }
      })
    },
    // 获取商户统计图数据接口
    GetBusinessStatisticsData () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetBusinessStatisticsData',
        data: {
          start: '',
          end: ''
        }
      }).then(res => {
        console.log(res)
        _this.echartsData = res.data
      }).catch(() => {
      })
    },
    // 核销请求
    VirtualVerify (code) {
      wx.showLoading({
        title: '核销中'
      })
      this.$store.dispatch({
        type: 'VirtualVerify',
        data: {
          code: code
        }
      }).then(res => {
        let validNum = 0
        if (res.data) {
          for (let i in res.data) {
            if (res.data[i].status !== 0) {
              validNum += 1
            }
          }
        }
        wx.hideLoading()
        wx.showModal({
          title: '核销成功',
          content: '本次成功核销' + validNum + '张使用券',
          showCancel: false,
          confirmText: '知道了'
        })
        this.GetVirtualList(config.DefaultPage.Page, config.LoadType.DOWN)
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '核销失败',
          icon: 'none'
        })
      })
    },
    // 扫码验证
    ScanCodeFunc () {
      const _this = this
      wx.scanCode({
        scanType: 'qrCode',
        success: function (res) {
          console.log(res.result)
          _this.VirtualVerify(res.result)
        },
        fail () {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          })
        }
      })
    },
    // 获取商户订单列表
    GetShopOrderList () {
      this.$store.dispatch({
        type: 'GetShopOrderList',
        data: {
          page: 1,
          orderstatus: 'completed'
        }
      }).then(res => {
        console.log(res)
      })
    },
    // 获取商户核销记录列表
    GetVirtualList (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetVirtualList',
        data: {
          page: page
        }
      }).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let specList = []
            for (let x in res.data.data[i].order) {
              if (x.indexOf('tag') !== -1) {
                if (res.data.data[i].order[x] && res.data.data[i].order[x] !== '') {
                  specList.push(res.data.data[i].order[x])
                }
              }
            }
            res.data.data[i].specList = specList
            res.data.data[i].useDate = res.data.data[i].usetime.slice(0, 10)
            res.data.data[i].useDateTime = res.data.data[i].usetime.slice(11, res.data.data[i].usetime.length)
          }
        }
        if (loadType === config.LoadType.DOWN) {
          _this.VirtualList = []
          setTimeout(() => {
            _this.VirtualList = res.data
            wx.hideLoading()
          }, 100)
        } else {
          res.data.data.map(item => {
            _this.VirtualList.data.push(item)
          })
          _this.VirtualList.current_page = res.data.current_page
          _this.VirtualList.last_page = res.data.last_page
          _this.VirtualList.total = res.data.total
          wx.hideLoading()
        }
      })
    },
    // 加载更多核销记录
    ShowMoreVirtual (e) {
      if (this.VirtualList.last_page === Number(this.VirtualList.current_page)) {
        wx.showToast({
          title: '没有更多数据',
          icon: 'none'
        })
      } else {
        this.GetVirtualList(this.VirtualList.last_page, config.LoadType.UP)
      }
    }
  },
  computed: {
    xAxisData () {
      let list = []
      for (let i = 0; i < 30; i++) {
        list.push(i + 1 + '日')
      }
      return list
    },
    yAxisData () {
      let list = []
      for (let i = 0; i < 30; i++) {
        list.push(Math.floor(Math.random() * (1000 - 1 + 1)) + 1)
      }
      return list
    },
    options () {
      const _this = this
      return {
        grid: {
          x: 60,
          y: 15,
          x2: 15,
          y2: 30
        },
        xAxis: {
          name: '',
          nameLocation: 'start',
          nameTextStyle: {
            color: '#333333',
            padding: [40, 0, 0, 0]
          },
          nameGap: '20',
          boundaryGap: false,
          axisLine: {
            show: false,
            lineStyle: {
              type: 'dotted'
            }
          },
          axisTick: {
            length: 15,
            lineStyle: {
              color: '#e6e6e6',
              type: 'dotted'
            }
          },
          axisLabel: {
            margin: 20,
            interval: 5
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e6e6e6',
              type: 'dotted'
            }
          },
          data: _this.xAxisData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              type: 'dotted'
            }
          },
          axisTick: {
            length: 15,
            lineStyle: {
              color: '#e6e6e6',
              type: 'dotted'
            }
          },
          axisLabel: {
            margin: 20
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e6e6e6',
              type: 'dotted'
            }
          }
        },
        series: [{
          data: _this.yAxisData,
          type: 'line',
          symbol: 'circle',
          showAllSymbol: true,
          label: {
            show: true,
            color: '#999999'
          },
          itemStyle: {
            color: '#ff7a30'
          },
          lineStyle: {
            color: '#ff7a30'
          }
        }]
      }
    },
    ec () {
      return {
        options: this.options
      }
    }
  },
  onLoad () {
    this.GetBusinessBasicInfo()
    // this.GetShopOrderList()
    this.GetVirtualList(config.DefaultPage.Page, config.LoadType.DOWN)
  },
  onPullDownRefresh () {
    this.GetBusinessBasicInfo('refresh')
    this.GetVirtualList(config.DefaultPage.Page, config.LoadType.DOWN)
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 250rpx;
  background: #f5f5f5;
  overflow-x: hidden;
  .header-card{
    width: 100%;
    height: 420rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url('https://cdn.618000.com/wemini/images/20180906105847.jpg') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .to-me-admin{
      position: absolute;
      left: 30rpx;
      top: 30rpx;
      display: flex;
      align-items: center;
      &::before{
        content: '';
        width: 24rpx;
        height: 24rpx;
        background: url('../../../static/image/tuijian_icon.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 8rpx;
      }
      p{
        font-size: 24rpx;
        color: #333333;
      }
    }
    .wallet-icon{
      width: 170rpx;
      height: 170rpx;
      background: url('../../../static/image/balance_icon.png') no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
    }
    .sentence-one{
      font-size: 25rpx;
      color: #333333;
      margin-top: 30rpx;
    }
    .price{
      margin-top: 30rpx;
      font-size: 70rpx;
      color: #333333;
      font-weight: bold;
    }
  }
  .card-common{
    margin-top: 20rpx;
    width: 100%;
    background: #ffffff;
    .card-title{
      width: 100%;
      height: 80rpx;
      padding: 0 30rpx;
      border-bottom: 1rpx solid #ebebeb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card-title-left{
        display: flex;
        align-items: center;
        &::after{
          content: '';
          width: 18rpx;
          height: 18rpx;
          background: url('../../../static/image/notice_icon.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 18rpx;
        }
        p{
          font-size: 34rpx;
          color: #333333;
        }
      }
      .card-title-right{
        display: flex;
        align-items: center;
        p{
          font-size: 22rpx;
          color: #888888;
        }
        .price-green{
          font-size: 32rpx;
          color: #42c642;
          margin-left: 7rpx;
        }
      }
    }
    .card-content{
      width: 100%;
      padding: 30rpx;
    }
    .shop-survey-box{
      display: flex;
      align-items: center;
      .survey-item{
        flex: 1;
        height: 65rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        border-left: 1rpx solid #eeeeee;
        &:first-child{
          border-left: none;
        }
        .item-title{
          font-size: 24rpx;
          color: #888888;
        }
        .item-data{
          font-size: 28rpx;
          color: #333333;
        }
      }
    }
    .chart-box{
      width: 100%;
      display: flex;
      flex-direction: column;
      .switch-tab-menu{
        width: 100%;
        display: flex;
        align-items: center;
        .tab-item{
          height: 50rpx;
          padding: 0 5rpx;
          line-height: 47rpx;
          border-bottom: 3rpx solid transparent;
          font-size: 24rpx;
          color: #888888;
          margin-left: 45rpx;
          &:first-child{
            margin-left: 0;
          }
          &.tab-selected{
            color: #42c642;
            border-bottom: 3rpx solid #42c642;
          }
        }
      }
      // .chart-main{
      //   margin-top: 30rpx;
      //   width: 100%;
      //   height: 260rpx;
      //   background: #333333;
      // }
    }
    .write-off-box{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .data-item{
        width: 100%;
        display: flex;
        align-items: center;
        padding: 25rpx 0;
        border-bottom: 1rpx solid #eeeeee;
        justify-content: space-between;
        &.item-title{
          font-size: 24rpx!important;
          color: #333333;
          text-align: center;
        }
        .td-one{
          flex: 0 0 240rpx;
          width: 240rpx;
        }
        .td-two{
          flex: 0 0 120rpx;
          width: 120rpx;
        }
        .td-three{
          flex: 0 0 150rpx;
          width: 150rpx;
        }
        .td-four{
          flex: 0 0 120rpx;
          width: 120rpx;
        }
        .good-info{
          .good-name{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 20rpx;
            color: #888888;
          }
          .mode-list{
            margin-top: 10rpx;
            width: 100%;
            display: flex;
            align-items: center;
            .mode-item{
              height: 30rpx;
              padding: 0 12rpx;
              background: #cccccc;
              font-size: 20rpx;
              line-height: 30rpx;
              color: #fff;
              text-align: center;
              margin-right: 10rpx;
              border-radius: 10rpx;
            }
            .number{
              font-size: 20rpx;
              color: #42c642;
            }
          }
        }
        .code-list{
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          p{
            font-size: 22rpx;
            color: #666666;
            text-decoration: line-through;
            line-height: 30rpx;
          }
        }
        .user-info{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .username{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 20rpx;
            color: #666666;
            text-align: center;
          }
          .phone{
            margin-top: 12rpx;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 20rpx;
            color: #666666;
            text-align: center;
          }
        }
        .item-time{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          p{
            font-size: 20rpx;
            color: #888888;
            line-height: 30rpx;
          }
        }
      }
      .show-more-btn{
        width: 200rpx;
        height: 60rpx;
        margin-top: 20rpx;
        font-size: 26rpx;
        color: #333333;
        border: 1rpx solid #dddddd;
        text-align: center;
        line-height: 60rpx;
        border-radius: 8rpx;
      }
    }
  }
}
.bottom-tab-menu{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 112rpx;
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #dbdcde;
  background: #ffffff;
  .tab-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    .tab-icon {
      width: 72rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-pic{
        width: 48rpx;
        height: 48rpx;
      }
    }
    .tab-name {
      font-size: 20rpx;
      color: #8d8d8d;
    }
  }
}
</style>
<style>
.chart-main{
  width: 690rpx;
  height: 400rpx;
}
ec-canvas {
  width: 690rpx!important;
  height: 400rpx!important;
}
</style>
