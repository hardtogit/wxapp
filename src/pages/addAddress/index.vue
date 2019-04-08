<template>
  <div class="container-box">
    <div class="cell">
      <div class="left">
          联系人
      </div>
      <div class="center">
        <input type="text" placeholder="姓名">
      </div>
    </div>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import bindMobile from '@/components/bind-mobile'
export default {
  data () {
    return {
      UserInfo: null
    }
  },
  methods: {
  },
  onShow () {

  },
  components: {
    cellItem,
    bindMobile
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #f5f5f5;
  .cell{
    display: flex;

  }
}
.bottom{
  position: fixed;
  display: flex;
  align-items: center;
  bottom:0;
  height: 49px;
  width: 100%;
  .left{
    flex: 1;
    .btn{
      width: 140px;
      height: 40px;
      border-radius: 20px;
      font-size: 14px;
      color: #fff;
      line-height: 40px;
      background-color: #4DBF67;
      text-align: center;
      margin: 0 auto;
    }

  }
  .right{
    flex: 1;
    .btn{
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      border-radius: 20px;
      margin: 0 auto;
      background:linear-gradient(90deg,rgba(233,52,62,1) 0%,rgba(233,107,52,1) 100%);
    }
  }
}

</style>

