<template>
  <div class="store" v-if="basicInfo">
    <div class="goPerson">
      <div class="btn" @click="ToMeCenter">
        <i class="fa fa-user"></i>切换到个人版
      </div>
    </div>
    <div class="card">
      <div class="withdraw" @click="goWithdraw">
      </div>
        <div class="text">可提现金额(元)</div>
      <div class="num">{{basicInfo.basic.balance}}</div>
      <div class="hrTwo"></div>
      <div class="goRecord" @click="push('../businessRecord/main')">资金明细一目了然<div class="fa  fa-angle-right"></div></div>
    </div>
    <div class="function">
        <div class="inner">
          <div class="send item" @click="push('../businessSend/main')">
              <div class="left">
                <div class="img"></div>
              </div>
            <div class="right">
              <div class="title">发货配送</div>
              <div class="description">有{{basicInfo.basic.waitdeliver}}个订单待处理</div>
            </div>
          </div>
          <div class="scan item" @click="ScanCodeFunc">
            <div class="left">
              <div class="img"></div>
            </div>
            <div class="right">
              <div class="title">扫码核销</div>
              <div class="description">有{{basicInfo.stats.V[5]}}个待核销订单</div>
            </div>
          </div>
        </div>
    </div>
    <div class="hr"></div>
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
      goWithdraw () {
        if (this.basicInfo.basic.balance > 50 || this.basicInfo.basic.balance === 50) {
          wx.navigateTo({ url: '../businessWithdraw/main' })
        }
      },
      push (url) {
        wx.navigateTo({url})
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
   @import "index";
</style>
<style>
  page{
    background-color: #fff;
  }
</style>
