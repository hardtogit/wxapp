<template>
  <div class="container-box">
    <div class="box">
    <cell-item :borderBottom="true" leftText="推荐二维码"
               rightText="未上传" ></cell-item>
      <cell-item  leftText="绑定手机号"
                 rightText="未绑定" :handleClick="handleBindMobile" ></cell-item>
    </div>
    <bind-mobile ref="bindMobile"></bind-mobile>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import bindMobile from '@/components/bind-mobile'
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
    },
    handleBindMobile () {
      console.log('s')
      this.$refs.bindMobile.showFunc()
    }
  },
  onLoad () {
    this.GetUserInfo()
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
  background: #f5f5f5;
  .box{
    margin-top: 15px;
    background-color: #fff;
    padding: 0 12px;
  }
}

</style>

