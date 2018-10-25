<template>
  <div :class="{'cell':true,'borderTop':borderTop,'borderBottom':borderBottom}">
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
    padding: 12px 0;
    &.borderTop{
      border-top: 1px solid #ddd;
    }
    &.borderBottom{
      border-bottom: 1px solid #ddd;
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
