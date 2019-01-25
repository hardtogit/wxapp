<template>
  <div class="goods-card" @click="clickFn">
    <img class="cover" :src="img" alt="">
    <div class="title">{{title}}</div>
    <div class="info-bottom">
      <div class="info-bottom-left">
        <text class="discount-price">¥{{sellprice}}</text>
        <text class="original-price">￥{{marketprice}}</text>
      </div>
    </div>
    <div class="sale-bar">
      <div class="saled" :style="'width:'+100*sales/(stock+sales)+'%'">
        已售{{sales}}
      </div>
      <span class="level">
            还剩{{stock}}份
              </span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      img: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      sellprice: {
        type: String,
        default: ''
      },
      marketprice: {
        type: String,
        default: ''
      },
      sales: {
        type: Number,
        default: 100
      },
      stock: {
        type: Number,
        default: 50
      },
      clickFn: {
        default: () => { }
      }
    },
    data () {
      return {

      }
    },
    methods: {
      preImage () {
        wx.previewImage({
          urls: [this.rightImage]
        })
      }

    }
  }
</script>
<style lang="less" scoped>

  .info-bottom{
    margin-top: 20rpx;
    padding: 0 10rpx;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .info-bottom-left{
      display: flex;
      align-items: flex-end;
      .discount-price{
        font-size: 32rpx;
        color: #f34747;
        line-height: 32rpx;
      }
      .original-price{
        font-size: 22rpx;
        color: #999999;
        line-height: 22rpx;
        margin-left: 18rpx;
        text-decoration: line-through;
      }
      .pro-number{
        height: 20rpx;
        padding: 0 10rpx;
        border-radius: 0 10rpx 10rpx 0;
        position: relative;
        font-size: 18rpx;
        line-height: 20rpx;
        color: #ffffff;
        background: #ab9985;
        margin-left: 25rpx;
        &::before{
          content: '';
          width: 0;
          height: 0;
          left: -20rpx;
          top: 0;
          position: absolute;
          border-style: solid;
          border-width: 10rpx;
          border-color: transparent #ab9985 transparent transparent;
        }
      }
    }
    .sales-volume{
      font-size: 24rpx;
      color: #999999;
    }
  }
  .sale-bar{
    width: 300rpx;
    height: 28rpx;
    border-radius: 14rpx;
    background-color: rgba(252,197,48,.2);
    margin-top: 15rpx;
    position: relative;
    font-size: 20rpx;
    line-height: 28rpx;
    text-align: right;
    padding-right: 10rpx;
    margin-left: 10rpx;
    color: #666;
    .saled{
      position: absolute;
      white-space: nowrap;
      left: 0;
      top:0;
      border-radius: 14rpx;
      height: 28rpx;
      background-color: #FCC530;
      font-size: 20rpx;
      color: #666;
      text-align: left;
      line-height: 28rpx;
      padding-left: 10rpx;
    }
    .level{
      position: relative;
      z-index: 2;
    }
  }
  .goods-card{
    background-color: #fff;
    width: 344rpx;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-radius: 16rpx;
    .cover{
      width: 344rpx;
      height: 276rpx;
      display: block;
      border-top-left-radius: 16rpx;
      border-top-right-radius: 16rpx;
    }
    .title{
      height:72rpx;
      font-size:28rpx;
      line-height: 40rpx;
      color: #111;
      overflow: hidden;
      font-weight: bold;
      padding: 10rpx;
    }
  }

</style>
