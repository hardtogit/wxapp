<template>
  <div class="comment-item" @click="showDetail">
    <div class="user-pic">
      <image :src="dataInfo.userinfo&&dataInfo.userinfo.headimgurl" class="pic-img"/>
    </div>
    <div class="comment-item-main">
      <div class="user-info">
        <div class="left-box">
          <p class="username">{{dataInfo.userinfo&&dataInfo.userinfo.nickname}}</p>
          <div class="star-list">
            <stars-level :score="score"></stars-level>
          </div>
        </div>
        <!-- <div class="create-time">1小时前</div> -->
        <div class="create-time">{{dataInfo.ratetime}}</div>
      </div>
      <div class="comment-detail">{{dataInfo.ratecontent}}</div>
      <div class="img-list" v-if="dataInfo.piclist && dataInfo.piclist.length > 0">
        <image v-for="(item, index) in dataInfo.piclist" :key="index" :src="item" class="img-item"/>
      </div>
      <div class="look-num"><p>浏览 {{dataInfo.views}}</p></div>
      <div class="shop-reply" v-if="dataInfo.isreplay !== 0">[商家回复] {{dataInfo.replaycontent}}</div>
    </div>
  </div>
</template>
<script>
import starsLevel from '@/components/stars-level'
export default {
  props: {
    dataInfo: {
      type: Object,
      default: function () {
        return {
          userinfo: {}
        }
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    showDetail () {
      this.$emit('ShowCommentDetail', this.dataInfo.id)
    }
  },
  computed: {
    score: function () {
      return Number(this.dataInfo.rate)
    }
  },
  components: {
    starsLevel
  }
}
</script>
<style lang="less" scoped>
@import '../../static/style/reset';
.comment-item{
  width: 710rpx;
  overflow: hidden;
  padding: 40rpx 20rpx;
  background: #ffffff;
  box-shadow: 0px 10rpx 10rpx 0px	rgba(7, 0, 2, 0.17);
  border-radius: 10rpx;
  border: 1px solid #f7f7f7;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .user-pic{
    flex: 0 0 68rpx;
    width: 68rpx;
    height: 68rpx;
    border-radius: 34rpx;
    overflow: hidden;
    .pic-img{
      width: 68rpx;
      height: 68rpx;
      background: #fafafa;
    }
  }
  .comment-item-main{
    width: 575rpx;
    display: flex;
    flex-direction: column;
    .user-info{
      display: flex;
      height: 68rpx;
      justify-content: space-between;
      .left-box{
        display: flex;
        height: 68rpx;
        flex-direction: column;
        justify-content: center;
        .username{
          font-size: 28rpx;
          color: #333333;
        }
        .star-list{
          margin-top: 10rpx;
        }
      }
      .create-time{
        font-size: 20rpx;
        color: #bababa;
      }
    }
    .comment-detail{
      margin-top: 10rpx;
      font-size: 28rpx;
      line-height: 34rpx;
      color: #010101;
    }
    .look-num{
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      &::before{
        content: '';
        width: 32rpx;
        height: 32rpx;
        background: url('../../static/image/view_icon.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 10rpx;
      }
      p{
        font-size: 20rpx;
        color: #888888;
      }
    }
    .img-list{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 10rpx;
      .img-item{
        width: 130rpx;
        height: 130rpx;
        margin-top: 8rpx;
        margin-right: 8rpx;
        background: #fafafa;
        &:nth-child(4n){
          margin-right: 0;
        }
      }
    }
    .shop-reply{
      margin-top: 30rpx;
      background: #eeeeee;
      padding: 20rpx;
      font-size: 24rpx;
      line-height: 28rpx;
      color: #333333;
    }
  }
}
</style>
