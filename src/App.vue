<script>
export default {
  created () {}
}
</script>

<style lang="less">
  @import "./style/app";
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
  background: #f5f5f5;
}
/* this rule will be remove */
page{
  background: #f5f5f5;
}
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
