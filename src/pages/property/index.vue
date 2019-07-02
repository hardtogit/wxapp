<template>
  <div class="container-box">
    <div class="card" >
      <div class="flex" v-if="UserInfo">
        <div class="left">
          <div class="text">
            钱包(元)
          </div>
          <div class="num">
            {{UserInfo.balance}}
          </div>
        </div>
        <div class="right">
          <div :class="['withdraw',UserInfo.balance < 1&&'disabled']" @click="withdraw">提现</div>
        </div>
      </div>
      <div class="bottom" v-if="UserInfo">
        <!--<div class="iincome" >推荐收入 {{UserInfo.stats.spreaderrebate}}</div>-->
        <div class="tincome" >累计收入{{UserInfo.stats.grandtotal}}</div>
      </div>

      <div class="goRecord" @click="push('../withdrawRecord/main')">
        <div class="hr">

        </div>
        提现明细一目了然<div class="fa  fa-angle-right"></div>
      </div>
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
  export default {
    data () {
      return {
        activeItem: 1,
        list: {
          current_page: 1,
          last_page: 1,
          data: [],
          total: 0
        }
      }
    },
    computed: {
      UserInfo () {
        return this.$store.state.app.UserInfo
      }
    },
    methods: {
      // 获取用户基本信息
      GetUserInfo () {
        this.$store.dispatch({type: 'GetUserInfo'})
      },
      // 刷新页面
      onRefresh () {
        this.GetList(config.DefaultPage.Page, config.LoadType.DOWN)
      },
      // 用户提现（目前是全额提现）
      withdraw () {
        if (this.UserInfo.balance < 1) {
          wx.showToast({
            title: '最低提款金额为1元',
            icon: 'none'
          })
          return
        }
        const _this = this
        wx.showLoading({
          title: '提现发起中'
        })
        this.$store.dispatch({
          type: 'Withdraw',
          data: {
            amount: this.UserInfo.balance
          }
        }).then(() => {
          wx.hideLoading()
          _this.$refs.tipPop.showFunc()
          _this.GetUserInfo()
        }).catch((data) => {
          wx.hideLoading()
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        })
      },
      push (url) {
        wx.navigateTo({ url })
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
    .card{
      width: 345px;
      height: 170px;
      margin: 0 auto;
      background-image: url("https://cdn.618000.com/static/images/topbg.png");
      background-size: 100% 100%;
      box-sizing: border-box;
      padding: 15px;
      .flex{
        display: flex;
        align-items: center;
        color: #fff;
        .left{
          flex: 1;
          .text{
            font-size: 12px;
          }
          .num{
            font-size: 32px;
            margin-top: 10px;
          }
        }
        .right{
          flex: 1;
          text-align: right;
          .withdraw{
            display: inline-block;
            width: 70px;
            height: 27px;
            background:linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0.8) 100%);
            border-radius: 13.5px;
            font-size: 13px;
            text-align: center;
            line-height: 27px;
            color:#F65C4A;
            &.disabled{
              background:linear-gradient(90deg,rgba(255,255,255,.6) 0%,rgba(255,255,255,0.48) 100%);
            }
          }
        }
      }
      .bottom{
        margin-top: 25px;
        font-size: 12px;
        color: #fff;
        display: flex;
        .iincome{
          margin-right: 10px;
        }
      }
      .hr{
        height: 0.5px;
        background-color: #fff;
        opacity: 0.2;
      }
      .goRecord{
        /*border-top: 0.5px solid rgb(255,255,255,.1);*/
        height: 35px;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 35px;
        margin-top: 18px;
        color:#fff;
        .fa{
          display: inline-block;
          float: right;
          position: relative;
          top:8px
        }
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
<style>
  page{
    background-color: #fff;
  }
</style>

