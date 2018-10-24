<template>
  <div class="container-box">
    <div class="scroller-container">
      <scroll-view class="scroller-box"
        v-if="list.data && list.data.length > 0">
        <div class="data-list">
          <div class="data-item"  v-for="(item, index) in list.data" :key="index">
            <div class="left">
              <div class="amount">{{item.amount}}</div>
              <div class="time">{{item.timeline}}</div>
            </div>
            <div class="right">
              <span v-if="item.status===1" >提交申请</span>
              <span v-if="item.status===2" class="ing">提款中</span>
              <span v-if="item.status===3" class="success">提款成功</span>
              <span v-if="item.status===4" class="fail">提款失败
                <span @click="openReason(item.backmsg)" class="reason">?</span>
              </span>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="no-data" v-if="(!list.data || list.data.length === 0)&&list.current_page>1">
      <nothing   @on-refresh="onRefresh"></nothing>
      </div>
    </div>
    <tip-pop ref="tipPop" title="失败原因" :content="reason"></tip-pop>
  </div>
</template>
<script>
import tipPop from '@/components/tip-pop'
import Nothing from '@/components/nothing'
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      list: {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      },
      reason: '',
      UserInfo: null
    }
  },
  components: {
    tipPop,
    Nothing
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
      this.list.current_page = 1
      this.Getlist(this.list.current_page, 'DOWN')
    },
    openReason (msg) {
      console.log(msg)
      this.reason = msg
      this.$refs.tipPop.showFunc()
    },
    Getlist (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetWithdrawRecord',
        data: {
          page: page
        }
      }).then(res => {
        _this.list.current_page = 1 + parseInt(_this.list.current_page)
        if (loadType === 'DOWN') {
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
        wx.stopPullDownRefresh()
      }).catch(() => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    }
  },
  onLoad () {
    this.GetUserInfo()
    this.list.current_page = 1
    this.Getlist(this.list.current_page, 'DOWN')
  },
  // 下拉
  onPullDownRefresh (e) {
    this.list.current_page = 1
    this.Getlist(this.list.current_page, 'DOWN')
  },
  // 上拉
  onReachBottom () {
    if (Number(this.list.last_page) + 1 === Number(this.list.current_page)) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none'
      })
    } else {
      this.Getlist(this.list.current_page, 'UP')
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  /*background: #fff;*/
  .data-list{
    .data-item{
      display: flex;
      width: 100%;
      align-items: center;
      padding: 24rpx 30rpx 24rpx 30rpx;
      border-bottom: 1rpx solid #ddd;
      .left{
        flex: 1;
        .amount{
          font-size:36rpx;
          color:#333;
        }
        .time{
          font-size: 24rpx;
          color: #999;
          margin-top: 12rpx;
        }

      }
      .right{
        flex: 1;
        text-align: right;
        font-size: 28rpx;
        .ing{
          color:#1890ff ;
        }
        .success{
          color: #52c41a;
        }
        .fail{
          color:#f5222d ;
          .reason{
            width: 30rpx;
            height: 30rpx;
            display: inline-block;
            text-align: center;
            line-height: 30rpx;
            border-radius: 50%;
            background-color: #ddd;
            color: #f6f6f6;
          }
        }

      }
  }
  }
  .no-data{
    margin-top: 400rpx;
  }
}
</style>
<style>
  page{
    background-color: #fff;
  }
</style>

