<template>
  <div :class="{'cell':true,'borderTop':borderTop,'borderBottom':borderBottom}" @click="handleClick">
    <div class="left">
      <div class="leftText">{{leftText}}</div>
    </div>
    <div class="right">
       <div class="rightText">{{rightText}}</div>   <img v-if="arrow" src="../../static/image/arrow-select.png" class="icon"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
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
  }
}
</script>
<style lang="less" scoped>
  .cell{
    display: flex;
    align-items: center;
    padding: 16px 0;
    font-size: 14px;
    &.borderTop{
      border-top: 1rpx solid #ddd;
    }
    &.borderBottom{
      border-bottom: 1rpx solid #ddd;
    }
    .left{
      flex: 1;
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
      .icon{
        width: 24px;
        height: 24px;
        float: right;
        padding-right: 12px;
      }
    }

  }

</style>
