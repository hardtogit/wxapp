<template>
  <scroll-view class="scroller-box"
    :scroll-y="true"
    :upper-threshold="-30" 
    :lower-threshold="50" 
    @scrolltoupper="scrolltoupper" 
    @scrolltolower="scrolltolower"
    :style="{height: WinHeight + 'px'}">
    <div class="news-list" v-if="newsList.data && newsList.data.length > 0">
      <button 
        v-for="(item, index) in newsList.data" 
        :key="item.id"
        class="news-item" 
        open-type="contact" 
        :plain="true"
        :session-from="'service|' + item.storeid + '|' + item.mid + '|' + item.id">
        <div class="user-pic-box">
          <image class="user-pic" mode="aspectFill" :src="item.headimg"/>
        </div>
        <div class="item-right">
          <div class="right-top-box">
            <p class="username">{{item.nickname}}</p>
            <p class="time">{{item.fromtime}}</p>
          </div>
          <div class="new-content">{{item.lastcontent}}</div>
        </div>
      </button>
    </div>
  </scroll-view>
</template>
<script>
import * as config from '@/config/common.config'
export default {
  data () {
    return {
      WinHeight: 0,
      newsList: {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      },
      Interval: null
    }
  },
  methods: {
    // 初始化数据
    InitalData () {
      this.newsList = {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      }
      this.Interval = null
    },
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.WinHeight = res.windowHeight
        },
        fail: (e) => {
          console.log(e)
        }
      })
    },
    // 下拉
    scrolltoupper (e) {
      this.GetChatList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 上拉
    scrolltolower (e) {
      if (Number(this.newsList.last_page) === Number(this.newsList.current_page)) {
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
      } else {
        this.GetChatList(this.newsList.last_page, config.LoadType.UP)
      }
    },
    GetChatList (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'StoreChatIndex',
        data: {
          page: 1
        }
      }).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].nickname = res.data.data[i].nickname || res.data.data[i].nickname !== '' ? res.data.data[i].nickname : '无名氏'
          }
        }
        if (loadType === config.LoadType.DOWN) {
          _this.newsList.data = res.data.data
          _this.newsList.current_page = res.data.current_page
          _this.newsList.last_page = res.data.last_page
          _this.newsList.total = res.data.total
          _this.newsList.attach = res.data.attach
        } else {
          res.data.data.map(item => {
            _this.newsList.data.push(item)
          })
          _this.newsList.current_page = res.data.current_page
          _this.newsList.last_page = res.data.last_page
          _this.newsList.total = res.data.total
          _this.newsList.attach = res.data.attach
        }
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
      })
    },
    GetNewChat () {
      const _this = this
      _this.$store.dispatch({
        type: 'StoreChatNewread'
      }).then(res => {
        if (res.data && res.data.length > 0) {
          let newsListObj = {}
          for (let i = 0; i < _this.newsList.data.length; i++) {
            newsListObj[_this.newsList.data[i].id] = _this.newsList.data[i]
          }
          for (let i = 0; i < res.data.length; i++) {
            newsListObj[res.data[i].id] = res.data[i]
          }
          let newList = []
          for (let i in newsListObj) {
            newList.push(newsListObj[i])
          }
          _this.newsList.data = newList
        }
      })
    }
  },
  onLoad () {
    this.getSystemInfo()
    this.InitalData()
    this.GetChatList(config.DefaultPage.Page, config.LoadType.DOWN)
  },
  mounted () {
    const _this = this
    this.Interval = setInterval(() => {
      _this.GetNewChat()
    }, 3000)
  },
  onUnload () {
    const _this = this
    clearInterval(_this.Interval)
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.scroller-box{
  width: 100%;
  background: #ffffff;
  .news-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 20rpx;
    .news-item{
      width: 100%;
      height: 135rpx;
      background: #ffffff!important;
      padding: 0!important;
      margin: 0!important;
      border: none!important;
      border-bottom: 1rpx solid #ebebeb!important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user-pic-box{
        width: 100rpx;
        height: 100rpx;
        border-radius: 4rpx;
        overflow: hidden;
        position: relative;
        background: #333333;
        .user-pic{
          width: 100rpx;
          height: 100rpx;
        }
      }
      .item-right{
        width: 590rpx;
        display: flex;
        flex-direction: column;
        .right-top-box{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .username{
            font-size: 30rpx;
            color: #333333;
          }
          .time{
            font-size: 22rpx;
            color: #9f9fa0;
          }
        }
        .new-content{
          width: 100%;
          text-align: left;
          margin-top: 16rpx;
          font-size: 26rpx;
          color: #999999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
<style lang="less">
page{
  background: #ffffff;
}
</style>




