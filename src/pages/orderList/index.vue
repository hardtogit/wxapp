<template>
  <div class="container-box">
     <div class="classify-tab-menu">
      <div :class="['tab-item',selectedTab===1&&'selected']" @click="switchTab(1)">
        <p class="tab-name">核销</p>
      </div>
      <div :class="['tab-item',selectedTab===2&&'selected']" @click="switchTab(2)">
        <p class="tab-name">发货</p>
      </div>
    </div>
    <div :style="'height:'+height+'px' ">
      <Virtual v-if="selectedTab===1" ></Virtual>
      <Entity v-if="selectedTab===2" ></Entity>
    </div>
  </div>
</template>
<script>
import Virtual from './virtual'
import Entity from './entity'

export default {
  data () {
    return {
      selectedTab: 1,
      height: 200
    }
  },
  methods: {
    switchTab (index) {
      this.selectedTab = index
    }
  },
  onLoad (option) {
    const $this = this
    wx.getSystemInfo({
      complete: (res) => {
        $this.height = res.windowHeight - 43
      }
    })
  },
  components: {
    Virtual,
    Entity
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.classify-tab-menu{
  height: 43px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  font-size: 16px;
  color: #666;
  background-color: #fff;
  border-bottom:1rpx solid #ededed;
  .tab-item{
    flex: 1;
    text-align: center;
    height: 100%;
    .tab-name{
      height: 100%;
      line-height: 40px;
      display: inline-block;
      padding: 0 10px;
    }
    &.selected{
      .tab-name{
        color: #333;
        border-bottom: 3px solid #E9353E;
      }
    }
  }
}
</style>

