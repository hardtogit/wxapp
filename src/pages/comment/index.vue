<template>
  <div class="container-box">
    <div class="comment-classify">
      <div class="classify-item" :class="{'item-seleted': SelectedCommentType === CommentTypeList.All}" @click="TypeChoice(CommentTypeList.All)">全部</div>
      <div class="classify-item" :class="{'item-seleted': SelectedCommentType === CommentTypeList.Good}" @click="TypeChoice(CommentTypeList.Good)">好评</div>
      <div class="classify-item" :class="{'item-seleted': SelectedCommentType === CommentTypeList.Ordinary}" @click="TypeChoice(CommentTypeList.Ordinary)">中评</div>
      <div class="classify-item" :class="{'item-seleted': SelectedCommentType === CommentTypeList.Bad}" @click="TypeChoice(CommentTypeList.Bad)">差评</div>
    </div>
    <div class="scroller-container" :style="{height: WinHeight + 'px'}">
      <scroll-view class="scroller-box"
        :scroll-y="true"
        :upper-threshold="-30"
        :lower-threshold="50"
        @scrolltoupper="scrolltoupper"
        @scrolltolower="scrolltolower"
        :style="{height: WinHeight + 'px'}"
        v-if="CommentInfo.data && CommentInfo.data.length > 0"
        :scroll-with-animation="true">
        <div class="comment-list" v-if="CommentInfo.data.length > 0">
          <div v-for="(item, index) in CommentInfo.data" :key="item.id">
            <comment-item :dataInfo="item" @ShowCommentDetail="ShowCommentDetail"></comment-item>
          </div>
        </div>
      </scroll-view>
      <nothing
        v-if="!CommentInfo.data || CommentInfo.data.length === 0"
        @on-refresh="onRefresh">
      </nothing>
    </div>
    <!--评论详情弹出层 start-->
    <purchase-history-pop ref="purchaseHistoryPop" :dataInfo="commentDetailInfo"></purchase-history-pop>
    <!--评论详情弹出层 end-->
  </div>
</template>
<script>
import commentItem from '@/components/comment-item'
import * as config from '@/config/common.config'
import Nothing from '@/components/nothing'
import purchaseHistoryPop from '@/components/purchase-history-pop'
export default {
  data () {
    return {
      WinHeight: 0,
      CommentInfo: {
        current_page: 1,
        last_page: 1,
        data: [],
        total: 0
      },
      SelectedCommentType: config.CommentType.All,
      CommentTypeList: config.CommentType,
      queryObj: null,
      commentDetailInfo: null
      // ScrollTopNum: 0
    }
  },
  methods: {
    ShowCommentDetail (id) {
      let commentInfo = {}
      for (let i = 0; i < this.CommentInfo.data.length; i++) {
        if (this.CommentInfo.data[i].id === id) {
          commentInfo = this.CommentInfo.data[i]
          break
        }
      }
      wx.showLoading({
        title: '加载中'
      })
      this.$store.dispatch({
        type: 'GetCommentatorBoughtGoods',
        data: {
          uid: commentInfo.userid
        }
      }).then(obj => {
        commentInfo.BoughtGoods = obj.data
        wx.hideLoading()
        this.commentDetailInfo = commentInfo
        this.$refs.purchaseHistoryPop.showFunc()
      }).catch(() => {
        wx.hideLoading()
      })
    },
    onRefresh () {
      this.GetCommentList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    TypeChoice (type) {
      this.SelectedCommentType = type
      // this.ScrollTopNum = 0
      this.GetCommentList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 下拉触发事件
    scrolltoupper (e) {
      this.GetCommentList(config.DefaultPage.Page, config.LoadType.DOWN)
    },
    // 上拉触发事件
    scrolltolower (e) {
      if (this.CommentInfo.last_page === Number(this.CommentInfo.current_page)) {
        console.log('暂无更多数据')
      } else {
        this.GetCommentList(this.CommentInfo.last_page, config.LoadType.UP)
      }
    },
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.WinHeight = res.windowHeight - res.windowWidth / 750 * 120
        },
        fail: (e) => {
          console.log(e)
        }
      })
    },
    GetCommentList (page, loadType) {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetCommentList',
        data: {
          gid: _this.queryObj.gid,
          page: page,
          storeid: _this.queryObj.storeid,
          lv: _this.SelectedCommentType
        }
      }).then(obj => {
        if (loadType === config.LoadType.DOWN) {
          _this.CommentInfo = []
          setTimeout(() => {
            _this.CommentInfo = obj.data
            wx.hideLoading()
          }, 100)
        } else {
          obj.data.data.map(item => {
            _this.CommentInfo.data.push(item)
          })
          _this.CommentInfo.current_page = obj.data.current_page
          _this.CommentInfo.last_page = obj.data.last_page
          _this.CommentInfo.total = obj.data.total
          wx.hideLoading()
        }
      }).catch(() => {
        wx.hideLoading()
      })
    }
  },
  onLoad (option) {
    this.queryObj = option
    this.getSystemInfo()
    this.SelectedCommentType = config.CommentType.All
    this.GetCommentList(config.DefaultPage.Page, config.LoadType.DOWN)
  },
  components: {
    commentItem,
    Nothing,
    purchaseHistoryPop
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  .comment-classify{
    width: 100%;
    height: 120rpx;
    padding: 35rpx 20rpx;
    display: flex;
    align-items: center;
    .classify-item{
      width: 50px;
      height: 20px;
      background: #fff;
      border-radius: 10px;
      text-align: center;
      line-height: 19px;
      font-size: 13px;
      color: #666;
      margin-right: 10px;
      box-sizing: border-box;
      border: 0.5px solid #eee;
      &.item-seleted{
        background:rgba(235,61,62,.1);
        border: 0.5px solid rgba(235,61,62,.1);
        color: #EB3D3E;
      }
    }
  }
  .scroller-container{
    width: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scroller-box{
    width: 100%;
    background: #ffffff;
    .comment-list{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>

