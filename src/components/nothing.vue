<template>
  <div class="nothing-box">
    <p class="title">{{title}}</p>
    <p class="summary">{{summary}}</p>
    <button @click="Refresh" v-if="hasButton" class="btn-style" :plain="true">刷新</button>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无数据'
    },
    summary: {
      type: String,
      default: '点击刷新试试~~'
    },
    hasButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    Refresh () {
      this.$emit('on-refresh')
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../static/style/reset';
.nothing-box{
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
  }
  .summary {
    font-size: 24rpx;
    color: #999;
    font-weight: 400;
    margin-top: 18rpx;
  }
  .btn-style{
    margin-top: 20rpx;
    border: none;
    background-image: linear-gradient(45deg, #7de359 0%,#42bd56 100%);
    height: 54rpx;
    line-height: 54rpx;
    width: 150rpx;
    font-size: 24rpx;
    color: #ffffff;
    border-radius: 8rpx;
  }
}
</style>


