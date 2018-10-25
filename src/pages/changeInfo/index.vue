<template>
  <div class="container-box">
    <cell-item :borderBottom="true" rigthText="未上传" :arrow="true"></cell-item>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      UserInfo: null
    }
  },
  methods: {
    // 获取用户基本信息
    GetUserInfo () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetUserInfo'
      }).then(res => {
        _this.UserInfo = res.data
        wx.setStorageSync(SN.UserInfo, res.data)
      })
    }
  },
  onLoad () {
    this.GetUserInfo()
  },
  components: {
    cellItem
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

}
</style>

