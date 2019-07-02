<template>
  <div>
  <div v-if="UserInfo">
  <div class="header">
    <div class="left">
      <image class="headimgurl" :src="UserInfo.headimgurl"></image>
    </div>
    <div class="center">
      <div class="title">{{UserInfo.nickname}}</div>
      <div class="idNum">ID:{{UserInfo.wid}}</div>
    </div>
    <div class="right">
        <div class="goStore" @click="ToBusinessCenter"><div class="icon"></div>商户版</div>
    </div>
  </div>
    <div class="card" @click="push('../property/main')">
      <div class="flex">
        <div class="left">
          <div class="text">
            钱包(元)
          </div>
          <div class="num">
            {{UserInfo.balance}}
          </div>
        </div>
        <div class="right">
          <div :class="['withdraw',UserInfo.balance < 1&&'disabled']" @click.stop="withdraw">提现</div>
        </div>
      </div>
      <div class="bottom">
        <div class="iincome" >推荐收入 {{UserInfo.stats.spreaderrebate}}</div>
        <div class="tincome" >累计收入{{UserInfo.stats.grandtotal}}</div>
      </div>
    </div>
    <div class="nav">
      <div class="item" @click="push('../orderList/main')">
        <div src="" alt="" class="img one"></div>
        <div class="text">我的订单</div>
      </div>
      <div class="item">
        <div src="" alt="" class="img two" @click="push('../saleStatistics/main')"></div>
        <div class="text">推荐订单</div>
      </div>
      <div class="item" @click="push('../evaluateManage/main')">
        <div src="" alt="" class="img three"></div>
        <div class="text">评价管理</div>
      </div>
      <div class="item" @click="popShowFunc('becomeBusinessPop')">
        <div src="" alt="" class="img four"></div>
        <div class="text">推荐商户</div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="list">
      <cell-item leftText="资料修改" arrow border-bottom :handleClick="()=>push('../changeInfo/main')"></cell-item>
      <cell-item leftText="系统帮助" arrow border-bottom :handleClick="()=>popShowFunc('helpView')"></cell-item>
    </div>

  </div>
  <!--责任申明弹出层 start-->
  <help-view ref="helpView" :content="UserInfo&&UserInfo.personalhelp"></help-view>
  <!--责任申明弹出层 end-->
  <!--推荐商家弹出层 start-->
  <become-business-pop ref="becomeBusinessPop"></become-business-pop>
  <!--推荐商家弹出层 end-->
  <!--授权登陆弹框 start-->
  <authorization-pop ref="authorizationPop" @successFunc="AuthorizeSuccess"></authorization-pop>
  <!--授权登陆弹框 end-->
  <tip-pop ref="tipPop" title="小提示" content="提现成功！可提现收入已转入您的微信账户余额。"></tip-pop>
  </div>
</template>
<script>
  import helpView from '@/components/help-view'
  import becomeBusinessPop from '@/components/become-business-pop'
  import authorizationPop from '@/components/authorization-pop'
  import cellItem from '@/components/cell-item'
  import tipPop from '@/components/tip-pop'
  import SN from '@/config/localstorage.name'
  import * as utils from '@/utils/utils'
  export default {
    data () {
      return {
        // UserInfo: null,
        queryObj: null,
        optionObj: null
      }
    },
    computed: {
      regtime () {
        let time = '0000-00-00'
        if (this.UserInfo && this.UserInfo.regtime) {
          time = this.UserInfo.regtime.slice(0, 10)
        }
        return time
      },
      UserInfo () {
        return this.$store.state.app.UserInfo
      }
    },
    components: {
      helpView,
      becomeBusinessPop,
      authorizationPop,
      cellItem,
      tipPop,
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
          case 'becomeBusinessPop':
            this.$refs.becomeBusinessPop.showFunc()
            break
        }
      },
      push (url) {
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
        this.$store.dispatch({
          type: 'GetUserInfo'
        })
        // const _this = this
        // _this.$store.dispatch({
        //   type: 'GetUserInfo'
        // }).then(res => {
        //   _this.UserInfo = res.data
        //
        // })
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
        }).catch((data) => {
          wx.hideLoading()
          wx.showToast({
            title: '绑定失败',
            icon: 'none'
          })
        })
      },
      // 用户提现（目前是全额提现）
      withdraw () {
        if (this.UserInfo.balance < 1) {
          wx.showToast({
            title: '最低提款金额为1元',
            icon: 'none'
          })
          return
        }
        const _this = this
        wx.showLoading({
          title: '提现发起中'
        })
        this.$store.dispatch({
          type: 'Withdraw',
          data: {
            amount: this.UserInfo.balance
          }
        }).then(() => {
          wx.hideLoading()
          _this.$refs.tipPop.showFunc()
          _this.GetUserInfo()
        }).catch((data) => {
          wx.hideLoading()
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        })
      },
      viewEvaluate () {
        const url = '../orderList/main?entryType=completed'
        wx.navigateTo({ url })
      }
    },
    onLoad (option) {
      const _this = this
      console.log(this.$store)
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
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../static/style/reset';
  .header{
    display: flex;
    padding:  15px;
    align-items: center;
    .left{
      width: 38px;
      height: 38px;
      .headimgurl{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .center{
      flex: 1;
      padding-left: 15px;
      .title{
        font-size: 19px;
        color: #333;
      }
      .idNum{
        margin-top: 2px;
        font-size: 14px;
        color: #5C5C5C;
      }
    }
    .right{
      width: 70px;
      .goStore{
        height: 24px;
        border-radius: 12px;
        box-shadow: 0 2px 2px #ededed;
        font-size: 12px;
        color: #606060;
        text-align: center;
        line-height: 24px;
        .icon{
          width: 16px;
          height: 16px;
          display: inline-block;
          background: url("../../../static/image/navStore.png");
          background-size: 100% 100%;
          position: relative;
          top:4px;
          margin-right: 2px;
        }
      }
    }
  }
  .card{
    width: 345px;
    height: 125px;
    margin: 0 auto;
    background-image: url("https://cdn.618000.com/static/images/topbg.png");
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 15px;
    .flex{
      display: flex;
      align-items: center;
      color: #fff;
      .left{
        flex: 1;
        .text{
          font-size: 12px;
        }
        .num{
          font-size: 32px;
          margin-top: 10px;
        }
      }
      .right{
        flex: 1;
        text-align: right;
        .withdraw{
          display: inline-block;
          width: 70px;
          height: 27px;
          background:linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0.8) 100%);
          border-radius: 13.5px;
          font-size: 13px;
          text-align: center;
          line-height: 27px;
          color:#F65C4A;
          &.disabled{
            background:linear-gradient(90deg,rgba(255,255,255,.6) 0%,rgba(255,255,255,0.48) 100%);
          }
        }
      }
    }
    .bottom{
      margin-top: 25px;
      font-size: 12px;
      color: #fff;
      display: flex;
      .iincome{
        margin-right: 10px;
      }
    }
  }
  .nav{
    display: flex;
    padding: 15px;
    .item{
      flex: 1;
      align-items: center;
      justify-content: center;
      text-align: center;
      .img{
        width: 30px;
        height: 30px;
        margin: 0 auto;
        &.one{
          background: url('../../../static/image/navOne.png') no-repeat;
          background-size: 100% 100%;
        }
        &.two{
          background: url("../../../static/image/nav2.png") no-repeat;
          background-size: 100% 100%;
        }
        &.three{
          background: url("../../../static/image/nav3.png") no-repeat;
          background-size: 100% 100%;
        }
        &.four{
          background: url("../../../static/image/nav4.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .text{
        color: #333;
        font-size: 11px;
        margin-top: 4px;
      }

    }
  }
  .hr{
    background-color: #fafafa;
    height: 10px;
  }
  .list{
    padding: 0 15px;
  }
</style>
<style>
  page{
    background-color: #fff;
  }
</style>
