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
            <span class="rate">{{score}}</span><stars-level :score="score"></stars-level>
          </div>
        </div>
        <!-- <div class="create-time">1小时前</div> -->
        <div class="create-time">{{dataInfo.ratetime}}</div>
      </div>
      <div class="comment-detail">{{dataInfo.ratecontent}}</div>
      <div class="img-list" v-if="dataInfo.piclist && dataInfo.piclist.length > 0">
        <image v-for="(item, index) in dataInfo.piclist" :key="index" :src="item" class="img-item"/>
      </div>
      <!--<div class="look-num"><p>浏览 {{dataInfo.views}}</p></div>-->
      <div class="shop-reply" v-if="dataInfo.isreplay !== 0"><span class="label">[商家回复]</span> {{dataInfo.replaycontent}}</div>
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
  width: 345px;
  overflow: hidden;
  padding: 20px 0;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  /*margin-bottom: 10px;*/
  border-bottom: 0.5px solid #e8e8e8;
  .user-pic{
    flex: 0 0 35px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    overflow: hidden;
    .pic-img{
      width: 35px;
      height: 35px;
      background: #fafafa;
    }
  }
  .comment-item-main{
    flex: 1;
    padding-left: 10px;
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
          font-size: 14px;
          color: #333333;
          font-weight: bold;
        }
        .star-list{
          margin-top: 10rpx;
          .rate{
            float: left;
            font-size: 10px;
            margin-right: 4px;
            color: #FFB155;
          }
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
      color: #333;
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
      margin-top: 15px;
      background: #fafafa;
      padding: 15px;
      font-size: 14px;
      line-height: 16px;
      border-radius: 8px;
      color: #333333;
      .label{
        color: #666;
        font-size: 12px;
      }
    }
  }
}
</style>
