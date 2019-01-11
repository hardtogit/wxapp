<template>
  <div class="container-box">
    <div class="box">
    <cell-item :borderBottom="true" leftText="推荐二维码" iconClass="fa fa-qrcode"
               :handleClick="()=>ToOtherPage('../codeEdit/main')"
               rightText="未上传" :rightImage="(UserInfo&&UserInfo.qid)&&UserInfo.qrcode"></cell-item>
      <cell-item  leftText="绑定手机号" iconClass="fa fa-mobile"
                 :rightText="UserInfo&&UserInfo.phone||'未绑定'" ></cell-item>
      <button v-if="UserInfo&&!UserInfo.phone" class="bindBtn" open-type="getPhoneNumber" @getphonenumber="Bindmobilebyauth">绑定手机号</button>
    </div>
    <bind-mobile ref="bindMobile" :callBack="GetUserInfo"></bind-mobile>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import bindMobile from '@/components/bind-mobile'
import {reLogin} from '@/utils/utils'
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
    Bindmobilebyauth (e) {
      const _this = this
      let eDetail = e.mp.detail
      reLogin().then(() => {
        if (eDetail.encryptedData && eDetail.iv) {
          wx.showLoading({
            title: '手机绑定中'
          })
          _this.$store.dispatch({
            type: 'Bindmobilebyauth',
            data: {
              session_key: wx.getStorageSync(SN.Auth).session_key,
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            }
          }).then(res => {
            _this.GetUserInfo()
            wx.hideLoading()
            wx.showToast({
              title: '手机绑定成功',
              icon: 'success'
            })
          }).catch(() => {
            wx.hideLoading()
            wx.showToast({
              title: '手机绑定失败',
              icon: 'none'
            })
          })
        } else {
          _this.handleBindMobile()
        }
      })
    },
    handleBindMobile () {
      if (this.UserInfo.phone) {
        return
      }
      this.$refs.bindMobile.showFunc()
    },
    ToOtherPage (url) {
      wx.navigateTo({ url })
    }
  },
  onShow () {
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
    position: relative;
    .bindBtn{
      position: absolute;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
  }
}

</style>

