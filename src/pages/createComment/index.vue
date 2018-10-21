<template>
  <div class="page-container">
    <div class="comment-box" v-if="orderInfo">
      <div class="shop-name">
        <p>{{orderInfo.storeinfo.storename}}</p>
      </div>
      <div class="box-center">
        <image :src="orderInfo.attach[orderInfo.order_detail[0].coverid]" class="shop-pic" mode="aspectFill"/>
        <div class="score-box">
          <p class="score-name">评分:</p>
          <div class="score-list">
            <span class="star-icon" v-for="(item, index) in totleStar" :key="index" :class="{'full-star': (index+1) <= fullStarNum}" @click="scoreChange(item)"></span>
          </div>
        </div>
      </div>
      <div class="text-box">
        <textarea placeholder="在此输入评论内容" placeholder-style="color: #cccccc; font-size: 24rpx;" class="text-input" maxlength='300' v-model="commentCont"/>
      </div>
      <div class="pic-list">
        <div class="pic-item" v-for="(item, index) in picList" :key="item">
          <image :src="item" mode="aspectFill" class="img-style"/>
          <div class="delete-btn" @click="deleteImg(index)"></div>
        </div>
        <div class="add-pic-btn pic-item" @click="ChooseImg"></div>
      </div>
    </div>
    <div class="sub-btn" @click="submitFunc">提交</div>
  </div>
</template>
<script>
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      queryObj: null,
      orderInfo: null,
      totleStar: 5,
      fullStarNum: 0,
      commentCont: '',
      picList: [],
      picNumLimit: 5,
      formPicList: []
    }
  },
  methods: {
    deleteImg (index) {
      this.picList.splice(index, 1)
    },
    InitialData () {
      this.queryObj = null
      this.orderInfo = null
      this.totleStar = 5
      this.fullStarNum = 0
      this.commentCont = ''
      this.picList = []
      this.picNumLimit = 5
      this.formPicList = []
    },
    uploadImg (i, cb) {
      const _this = this
      wx.uploadFile({
        url: 'https://api.new.618000.com/miniapp/discuss/attach', // 仅为示例，非真实的接口地址
        filePath: _this.picList[i],
        name: 'file',
        header: {
          'AuthToken': wx.getStorageSync(SN.Auth).session_token,
          'AppId': 1
        },
        formData: {},
        success: function (res) {
          let resObj = JSON.parse(res.data)
          if (resObj && resObj.code === 1) {
            _this.formPicList.push(resObj.data.id)
            if (i < (_this.picList.length - 1)) {
              i++
              _this.uploadImg(i, cb)
            } else {
              cb()
            }
          } else {
            wx.hideLoading()
            return wx.showModal({
              title: '提示',
              content: '图片上传失败',
              showCancel: false,
              confirmText: '知道了'
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          return wx.showModal({
            title: '提示',
            content: '图片上传失败2',
            showCancel: false,
            confirmText: '知道了'
          })
        }
      })
    },
    // 图片选择
    ChooseImg () {
      const _this = this
      let piclimit = _this.picNumLimit - _this.picList.length
      if (piclimit > 0) {
        wx.chooseImage({
          count: piclimit,
          sizeType: 'compressed',
          success: function (res) {
            _this.picList = _this.picList.concat(res.tempFilePaths)
          },
          fail: function () {
            wx.showToast({
              title: '图片选择失败',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '最多选择' + _this.picNumLimit + '张图片',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    },
    // 改变分数
    scoreChange (num) {
      this.fullStarNum = num
    },
    submitFunc () {
      const _this = this
      if (this.commentCont === '') {
        return wx.showModal({
          title: '提示',
          content: '评论不能为空',
          showCancel: false,
          confirmText: '知道了'
        })
      }
      if (this.commentCont.length < 5) {
        return wx.showModal({
          title: '提示',
          content: '评论不能小于5个字',
          showCancel: false,
          confirmText: '知道了'
        })
      }
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      if (_this.picList && _this.picList.length > 0) {
        _this.uploadImg(0, function () {
          _this.CreateComment()
        })
      } else {
        _this.CreateComment()
      }
    },
    CreateComment () {
      const _this = this
      _this.$store.dispatch({
        type: 'CreateComment',
        data: {
          gid: _this.orderInfo.order_detail[0].gid,
          orderid: _this.orderInfo.id,
          piclist: _this.formPicList,
          content: _this.commentCont,
          rate: _this.fullStarNum
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      })
    },
    GetOrderDetail () {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetOrderDetail',
        data: {
          id: _this.queryObj.orderid,
          getstore: 1
        }
      }).then(res => {
        _this.orderInfo = res.data
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
      })
    }
  },
  computed: {
  },
  onLoad (option) {
    const _this = this
    _this.InitialData()
    _this.queryObj = option
    _this.GetOrderDetail()
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.page-container{
  width: 100%;
  .comment-box{
    width: 100%;
    padding: 35rpx 20rpx;
    background: #fff;
    display: flex;
    flex-direction: column;
    .shop-name{
      display: flex;
      align-items: center;
      &::before{
        content: '';
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
    .box-center{
      display: flex;
      align-items: center;
      margin-top: 35rpx;
      .shop-pic{
        width: 80rpx;
        height: 80rpx;
        background: #333333;
        border-radius: 5px;
        overflow: hidden;
      }
      .score-box{
        display: flex;
        align-items: center;
        margin-left: 30rpx;
        .score-name{
          font-size: 28rpx;
          color: #333333;
        }
        .score-list{
          display: flex;
          align-items: center;
          margin-left: 45rpx;
          .star-icon{
            width: 40rpx;
            height: 38rpx;
            background: url('../../../static/image/star_gray_icon.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 20rpx;
            &.full-star{
              background: url('../../../static/image/star_on_icon.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .text-box{
      margin-top: 30rpx;
      width: 100%;
      border-top: 1rpx solid #eeeeee;
      border-bottom: 1rpx solid #eeeeee;
      padding: 20rpx 0;
      .text-input{
        box-sizing: border-box;
        color: #333333; 
        font-size: 24rpx;
        width: 100%;
        height: 170rpx;
        padding: 0 20rpx;
      }
    }
    .pic-list{
      margin-top: 10rpx;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .pic-item{
        width: 155rpx;
        height: 155rpx;
        background: #fafafa;
        margin-right: 20rpx;
        margin-top: 20rpx;
        position: relative;
        &:nth-child(4n){
          margin-right: 0;
        }
        .img-style{
          width: 155rpx;
          height: 155rpx;
        }
        .delete-btn{
          position: absolute;
          width: 35rpx;
          height: 35rpx;
          background: url('../../../static/image/sqshfw_btn_delete_normal.png') no-repeat;
          background-size: 100% 100%;
          top: -15rpx;
          right: -15rpx;
          z-index: 10;
        }
      }
      .add-pic-btn{
        background: #fafafa;
        border: 1rpx dotted #d7d7d7;
        display: flex;
        align-items: center;
        justify-content: center;
        &::before{
          content: '+';
          font-size: 100rpx;
          color: #cccccc;
          font-weight: bold;
        }
      }
    }
  }
  .sub-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 88rpx;
    background: #ff3333;
    line-height: 100rpx;
    color: #fff;
    font-size: 32rpx;
    text-align: center;
  }
}
</style>


