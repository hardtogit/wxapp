<template>
  <div>
  <div class="header">
      <div class="left">
        <image class="img" src="https://img.alicdn.com/imgextra/i2/2204982309/TB2Uhk0q4SYBuNjSsphXXbGvVXa_!!2204982309.jpg_430x430q90.jpg"></image>
      </div>
    <div class="right">
        <div class="title">鲜果家族</div>
        <div class="time">配送约40分钟</div>
        <div class="discounts">优惠 <span class="item">满30减10</span></div>
      <div class="attention">关注</div>
    </div>
  </div>
    <div class="nav">
      <div class="left">
        <div :class="['item', tabIndex===0&&'active']" @click="switchTab(0)">
          <div class="text">商品</div>
        </div>
        <div :class="['item', tabIndex===1&&'active']" @click="switchTab(1)">
          <div class="text">评论</div>
        </div>
        <div :class="['item', tabIndex===2&&'active']" @click="switchTab(2)">
          <div class="text">商家</div>
        </div>
      </div>
      <div class="right">
        <div class="search">
          <input :class="['input',inputting&&'active']" type="text" @focus="handleFocus" @blur="handleBlur"  placeholder="搜索"
                 confirm-type="搜索" @confirm="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default{
  data () {
    return {
      tabIndex: 0,
      inputting: false
    }
  },
  methods: {
    switchTab (tabIndex) {
      this.tabIndex = tabIndex
    },
    handleFocus () {
      this.inputting = true
    },
    handleBlur () {
      this.inputting = false
    }
  }
}
</script>
<style lang="less" scoped>
  .header{
    padding: 22px 10px;
    display: flex;
    background:linear-gradient(-30deg,rgba(34,34,34,1) 0%,rgba(51,51,51,1) 100%);
    color: #fff;
    .left{
      width: 60px;
      height: 60px;
      .img{
        width: 100%;
        height: 100%;
      }
    }
    .right{
      flex: 1;
      padding-left: 8px;
      position: relative;
      .title{
        font-size: 17px;
        font-weight: bold;
      }
      .time{
        font-size: 12px;
        margin: 1px 0 3px 0;
      }
      .discounts{
        font-size: 11px;
        .item{
          background-color: #FF4A4A;
          color: #fff;
          padding: 0 2px;
        }
      }
      .attention{
        position: absolute;
        font-size: 12px;
        background:linear-gradient(-30deg,rgba(255,191,22,1) 0%,rgba(249,202,96,1) 100%);
        color: #000;
        padding: 2px 8px;
        right:0;
        top:10px
      }
    }
  }
  .nav{
    height: 49px;
    display: flex;
    box-sizing: border-box;
    background-color: #fff;
    align-items: center;
    .left{
      flex: 1;
      display: flex;
      .item{
        flex: 1;
        text-align: center;
        height: 100%;
        .text{
          font-size: 16px;
          height: 49px;
          line-height: 49px;
          color:rgba(54,54,54,.8);
          box-sizing: border-box;
        }
        &.active{
          .text{
            display: inline-block;
            font-size: 17px;
            color:rgba(54,54,54,1);
            border-bottom:3px solid #EB3D3E;
          }
        }
      }
    }
    .right{
      width:163px;
      text-align: right;
      .search{
        height: 32px;
        .input{
          width: 70px;
          height: 32px;
          text-align: left;
          border-radius: 16px;
          background-color: #E8E8E8;
          display: inline-block;
          margin-right: 10px;
          transition: all .3s;
          font-size: 14px;
          padding-left: 30px;
          box-sizing: border-box;
          &.active{
            width: 143px;
          }
        }

      }
    }
  }

</style>
