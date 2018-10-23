<template>
  <div class="container-box">
    <div class="container-main-box" v-if="UserInfo">
      <div class="header-box">
        <div class="to-shop-admin" @click="ToBusinessCenter">
          <p>切换到商户版</p>
        </div>
        <!-- <div class="to-backstage" @click="ScanCodeFunc">
          <p>商户扫码绑定</p>
        </div> -->
        <image :src="UserInfo.headimgurl" class="user-pic" mode="aspectFill"/>
        <p class="username">{{UserInfo.nickname}}</p>
        <div class="baseinfo-list">
          <div class="list-item">ID: {{UserInfo.wid}}</div>
          <div class="list-item">注册时间：{{regtime}}</div>
        </div>
      </div>
      <div class="basic-data-box">
        <div class="data-main">
          <!-- <div class="data-item" @click="ToOtherPage('../reward/main')"> -->
          <div class="data-item" @click="ToOtherPage('../saleStatistics/main')">
            <p class="item-price"><span>¥</span>{{UserInfo.stats.spreaderrebate}}</p>
            <p class="item-name">个人奖励</p>
          </div>
          <div class="data-item">
            <p class="item-price"><span>¥</span>{{UserInfo.stats.teamrebate}}</p>
            <p class="item-name">团队奖励</p>
          </div>
          <div class="data-item" @click="ToOtherPage('../accountBalance/main')">
            <p class="item-price"><span>¥</span>{{UserInfo.balance}}</p>
            <p class="item-name">账户余额</p>
          </div>
        </div>
        <div class="ts-str"><p>点击可查看详细信息，账户余额可用于支付抵扣和提现</p></div>
      </div>
      <div class="menu-box">
        <div class="menu-list">
          <div class="menu-item" @click="ToOtherPage('../orderList/main')">
            <div class="icon-box wddd-btn"></div>
            <p>我的订单</p>
          </div>
          <!--<div class="menu-item">-->
            <!--<div class="icon-box shdz-btn"></div>-->
            <!--<p>收货地址</p>-->
          <!--</div>-->
          <!--<div class="menu-item">-->
            <!--<div class="icon-box grzl-btn"></div>-->
            <!--<p>个人资料</p>-->
          <!--</div>-->
          <div class="menu-item" @click="ToOtherPage('../saleStatistics/main')">
            <div class="icon-box zjxs-btn"></div>
            <p>直接销售</p>
          </div>
          <!--<div class="menu-item" @click="ToOtherPage('../myTeam/main')">-->
            <!--<div class="icon-box tdyh-btn"></div>-->
            <!--<p>团队用户</p>-->
          <!--</div>-->
          <div class="menu-item">
            <div class="icon-box pjgl-btn"></div>
            <p>评价管理</p>
          </div>
          <div class="menu-item">
            <div class="icon-box sjdl-btn" @click="ToOtherPage('../changeInfo/main')"></div>
            <p>资料修改</p>
          </div>
          <div class="menu-item" @click="popShowFunc('helpView')">
            <div class="icon-box xtbz-btn"></div>
            <p>系统帮助</p>
          </div>
          <div class="menu-item" @click="popShowFunc('recommendPop')">
            <div class="icon-box tjsh-btn"></div>
            <p>推荐商户</p>
          </div>
        </div>
      </div>
    </div>
    <!--责任申明弹出层 start-->
    <help-view ref="helpView"></help-view>
    <!--责任申明弹出层 end-->
    <!--推荐商家弹出层 start-->
    <recommend-pop ref="recommendPop"></recommend-pop>
    <!--推荐商家弹出层 end-->
    <!--授权登陆弹框 start-->
    <authorization-pop ref="authorizationPop" @successFunc="AuthorizeSuccess"></authorization-pop>
    <!--授权登陆弹框 end-->
  </div>
</template>

<script>
import helpView from '@/components/help-view'
import recommendPop from '@/components/recommend-pop'
import authorizationPop from '@/components/authorization-pop'
import SN from '@/config/localstorage.name'
import * as utils from '@/utils/utils'
export default {
  data () {
    return {
      UserInfo: null,
      queryObj: null,
      optionObj: null
    }
  },
  components: {
    helpView,
    recommendPop,
    authorizationPop,
    isAuthoriza: false
  },
  methods: {
    ToBusinessCenter () {
      if (wx.getStorageSync(SN.StoreAuthToken)) {
        wx.redirectTo({
          url: '../businessManage/main'
        })
      } else {
        wx.redirectTo({
          url: '../businessLogin/main'
        })
      }
    },
    popShowFunc (type) {
      switch (type) {
        case 'helpView':
          this.$refs.helpView.showFunc()
          break
        case 'dutyDeclarPop':
          this.$refs.dutyDeclarPop.showFunc()
          break
        case 'recommendPop':
          this.$refs.recommendPop.showFunc()
          break
      }
    },
    ToOtherPage (url) {
      wx.navigateTo({ url })
    },
    // 授权成功执行函数
    AuthorizeSuccess () {
      const _this = this
      // 关闭授权弹窗
      _this.$refs.authorizationPop.showFunc()
      // 改变本地中存储中Auth的是否是第一次登陆状态为false
      let AuthObj = wx.getStorageSync(SN.Auth)
      AuthObj.first = false
      wx.setStorageSync(AuthObj)
      // 是否已经授权改为true
      _this.isAuthoriza = true
      _this.GetUserInfo()
      // 如果是通过小程序码要绑定管理员
      if (_this.queryObj && _this.queryObj.svalue && _this.queryObj.svalue.router && _this.queryObj.svalue.router === 'bindstroe') {
        _this.LoginAdmin(_this.optionObj.scene)
      }
    },
    // 登陆并判断是否授权
    Login (type) {
      const _this = this
      wx.showLoading({
        title: '登陆中'
      })
      wx.login({
        success: res => {
          wx.setStorageSync(SN.wxCode, res.code)
          _this.$store.dispatch({
            type: 'Login',
            data: {
              code: res.code
            }
          }).then(obj => {
            wx.setStorageSync(SN.Auth, obj.data)
            if (obj.data.first) {
              wx.hideLoading()
              // 如果是第一次登陆, 弹出授权弹框
              _this.AuthorizationPrompt()
            } else {
              wx.hideLoading()
              _this.isAuthoriza = true
              _this.GetUserInfo()
              if (type && type === 'bindstroe') {
                _this.LoginAdmin(_this.optionObj.scene)
              }
            }
          }).catch(() => {
            wx.hideLoading()
          })
        },
        fail: () => {
          console.log('登陆失败')
        }
      })
    },
    // 授权提示框
    AuthorizationPrompt () {
      this.$refs.authorizationPop.showFunc()
    },
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
    // 商家扫码绑定后台
    ScanCodeFunc () {
      const _this = this
      wx.scanCode({
        scanType: 'qrCode',
        success: function (res) {
          _this.LoginAdmin(res.result)
        },
        fail () {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          })
        }
      })
    },
    // 商户管理员绑定
    LoginAdmin (code) {
      wx.showLoading({
        title: '绑定中'
      })
      this.$store.dispatch({
        type: 'AdminLoginBind',
        data: {
          bindtoken: code
        }
      }).then(res => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '绑定成功',
          cancelText: '关闭',
          confirmText: '进入后台',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../businessLogin/main'
              })
            }
          }
        })
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '绑定失败',
          icon: 'none'
        })
      })
    }
  },
  onLoad (option) {
    const _this = this
    _this.optionObj = option
    if (option && option.scene) {
      let scene = decodeURIComponent(option.scene)
      _this.optionObj.scene = scene
      _this.$store.dispatch({
        type: 'Getkeypass',
        data: {
          key: scene
        }
      }).then(res => {
        _this.queryObj = res.data
        if (res.data.svalue && res.data.svalue.router) {
          if (res.data.svalue.router === 'goods') {
            let url = '../goods/main?gid=' + res.data.svalue.gid
            if (res.data.svalue.fromwid) {
              url += '&fromwid=' + res.data.svalue.fromwid
            }
            return wx.redirectTo({ url })
          }
          if (res.data.svalue.router === 'bindstroe') {
            if (!utils.isLogin()) {
              _this.Login('bindstroe')
            } else {
              _this.UserInfo = wx.getStorageSync(SN.UserInfo)
              _this.isAuthoriza = true
              _this.LoginAdmin(_this.optionObj.scene)
            }
          }
        }
      })
    } else {
      if (!utils.isLogin()) {
        _this.Login()
      } else {
        _this.GetUserInfo()
        _this.isAuthoriza = true
      }
    }
  },
  computed: {
    regtime () {
      let time = '0000-00-00'
      if (this.UserInfo && this.UserInfo.regtime) {
        time = this.UserInfo.regtime.slice(0, 10)
      }
      return time
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  background: #ffffff;
  .container-main-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
  }
  .header-box{
    width: 100%;
    height: 330rpx;
    background-size: 750rpx 330rpx;
    // background: #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: url('https://cdn.618000.com/wemini/images/20180906105847.jpg') no-repeat;
    background-size: 100% 100%;
    .to-shop-admin{
      position: absolute;
      left: 30rpx;
      top: 30rpx;
      display: flex;
      align-items: center;
      &::before{
        content: '';
        width: 24rpx;
        height: 24rpx;
        background: url('../../../static/image/shopicon.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 8rpx;
      }
      p{
        font-size: 24rpx;
        color: #333333;
      }
    }
    .to-backstage{
      position: absolute;
      right: 30rpx;
      top: 30rpx;
      display: flex;
      align-items: center;
      p{
        font-size: 24rpx;
        color: #333333;
      }
    }
    .user-pic{
      width: 160rpx;
      height: 160rpx;
      background: #ffffff;
      border-radius: 80rpx;
    }
    .username{
      margin-top: 35rpx;
      font-size: 28rpx;
      color: #333333;
    }
    .baseinfo-list{
      position: absolute;
      right: 20rpx;
      top: 150rpx;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .list-item{
        height: 56rpx;
        line-height: 55rpx;
        color: #999999;
        font-size: 22rpx;
        border-bottom: 1px solid #ffffff;
      }
    }
  }
  .basic-data-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx 0;
    .data-main{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .data-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        .item-price{
          font-size: 32rpx;
          color: #333333;
          span{
            font-size: 22rpx;
          }
        }
        .item-name{
          font-size: 24rpx;
          color: #888888;
          margin-top: 24rpx;
        }
      }
    }
    .ts-str{
      margin-top: 35rpx;
      font-size: 20rpx;
      color: #bbbbbb;
      display: flex;
      align-items: center;
      &::before{
        content: '';
        width: 18rpx;
        height: 18rpx;
        background: url('../../../static/image/meb_notice_icon.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 10rpx;
      }
    }
  }
  .menu-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-top: 50rpx;
    .menu-list{
      display: flex;
      flex-wrap: wrap;
      .menu-item{
        flex: 0 0 250rpx;
        height: 220rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #dddddd;
        &:nth-child(3n){
          border-right: none;
        }
        &:nth-child(n+4 ){
          border-top: 1px solid #dddddd;
        }
        .icon-box{
          width: 50rpx;
          height: 50rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          &.wddd-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_myorder_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.shdz-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_myaddr_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.grzl-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_mydate_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.zjxs-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_mysales_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.tdyh-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_myteam_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.pjgl-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_myassess_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.sjdl-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_myagent_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.xtbz-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_myhelp_icon.png') no-repeat;
            background-size: 100% 100%;
          }
          &.tjsh-btn{
            width: 66rpx;
            height: 66rpx;
            background: url('../../../static/image/meb_mystore_icon.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        p{
          margin-top: 40rpx;
          font-size: 28rpx;
          color: #333333;
        }
      }
    }
  }
}
</style>
