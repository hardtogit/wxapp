<template>
  <div :class="{'cell':true,'borderTop':borderTop,'borderBottom':borderBottom}" @click="handleClick">
    <div class="left">
      <div v-if="iconClass" :class="iconClass" class="icon"></div><div class="leftText">{{leftText}}</div>
    </div>
    <div class="right">
       <div class="rightText"><div v-if="!rightImage">{{rightText}}</div>
         <image class="right-image" v-if="rightImage" :src="rightImage" @click.stop="preImage"></image></div>
      <img v-if="arrow" src="../../static/image/arrow-select.png" class="icon"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    iconClass: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    rightImage: {
      type: String,
      default: ''
    },
    arrow: {
      type: Boolean,
      default: false
    },
    borderTop: {
      type: Boolean,
      default: false
    },
    borderBottom: {
      type: Boolean,
      default: false
    },
    handleClick: {
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
  .cell{
    display: flex;
    align-items: center;
    padding: 10px 0;
    font-size: 14px;
    &.borderTop{
      border-top: 1rpx solid #ddd;
    }
    &.borderBottom{
      border-bottom: 1rpx solid #ddd;
    }
    .icon{
      font-size: 28px;
      flex: 0 52px;
      text-align: center;
      color:#ab9985
    }
    .left{
      flex: 1;
      display: flex;
      align-items: center;
      .leftText{
        color: #333;
      }
    }
    .right{
      flex: 1;
      .rightText{
        color: #999;
        text-align: right;
      }
      .right-image{
        width: 42px;
        height: 42px;
      }
      .icon{
        width: 24px;
        height: 24px;
        float: right;
        padding-right: 12px;
      }
    }

  }

</style>
