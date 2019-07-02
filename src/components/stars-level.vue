<template>
  <div class="star-list">
    <div class="star-icon star-one" v-for="(item, index) in fullStarsNum" :key="index"></div>
    <div class="star-icon star-one" v-for="(item, index) in halfStarsNum" :key="index"></div>
    <div class="star-icon star-two" v-for="(item, index) in emptyStarsNum" :key="index"></div>
  </div>
</template>
<script>
export default {
  props: {
    score: {
      type: Number,
      default: 0
    }
  },
  computed: {
    fullStarsNum: function () {
      let Num = 0
      if (this.score >= 0 && this.score <= 5) {
        Num = Math.floor(this.score)
      } else if (this.score < 0) {
        Num = 0
      } else {
        Num = 5
      }
      return Num
    },
    emptyStarsNum: function () {
      let Num = 0
      if (this.score >= 0 && this.score <= 5) {
        Num = 5 - Math.ceil(this.score)
      } else if (this.score < 0) {
        Num = 5
      } else {
        Num = 0
      }
      return Num
    },
    halfStarsNum: function () {
      let Num = 5 - this.fullStarsNum - this.emptyStarsNum
      return Num
    }
  }
}
</script>
<style lang="less" scoped>
.star-list{
  display: flex;
  align-items: center;
  .star-icon{
    margin-right: 4rpx;
  }
  .star-one{
    width: 10px;
    height: 10px;
    background: url('../../static/image/star_on.png') no-repeat;
    background-size: 100% 100%;
  }
  .star-two{
    width: 10px;
    height: 10px;
    /*background: url('../../static/image/star_gray_icon.png') no-repeat;*/
    background-size: 100% 100%;
  }
}
</style>


