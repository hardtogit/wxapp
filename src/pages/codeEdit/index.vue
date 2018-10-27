<template>
  <div class="container-box">
    <div class="switch">
      <div class="left">使用官方群二维码 </div>
      <div class="right">
        <switch :disabled="!UserInfo.cansetqrcode" :checked="!useMyCode" color="#ab9985"  @change="switchChange"/>
      </div>
    </div>
    <p class="my-tip">成功分销三个订单即可成为分享达人,系统自动开放群管理功能,自动推荐附近的人加群,主动分享的用户同时显示该群码</p>
    <div class="box" v-if="useMyCode">
      <div class="title">
        上传我的群二维码
      </div>
      <div class="cell">
        <div class="left">设置群二维码有效期</div>
        <div class="right">
          <picker mode="date" :start="start" :end="end"  @change="dateChange">
          <view class="picker" >
            {{timeout||'请选择'}}
          </view>
        </picker>
        </div>
      </div>
      <div class="code">
           <div class="code-box" @click="ChooseImg">
             <image v-if="picUrl" :src="picUrl"  class="img-style"/>
             <div v-if="!picUrl">
             <div class="fa fa-qrcode"></div>
             点击上传
             </div>
           </div>
      </div>
    </div>
    <div class="btn-box">
    <button class="submit-btn" @click="SubmitFunc">确认提交</button>
    </div>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import dayjs from 'dayjs'
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      UserInfo: {},
      useMyCode: false,
      timeout: '',
      picPath: '',
      picUrl: '',
      aid: 0,
      start: '',
      end: ''
    }
  },
  methods: {
    // 获取用户基本信息
    getUserInfo () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetUserInfo'
      }).then(res => {
        _this.UserInfo = res.data
        if (res.data.qid) {
          _this.useMyCode = true
        }
        _this.aid = res.data.qid
        _this.picUrl = res.data.qrcode
        _this.timeout = res.data.qtimeout
        wx.setStorageSync(SN.UserInfo, res.data)
      })
    },
    getTimeScope () {
      console.log(dayjs().add(7, 'd').format('YYYY-MM-DD'))
      this.start = dayjs().format('YYYY-MM-DD')
      this.end = dayjs().add(7, 'd').format('YYYY-MM-DD')
    },
    switchChange (e) {
      if (!e.target.value) {
        if (this.UserInfo.qid !== 0) {
          this.getUserInfo()
        } else {
          this.aid = 0
          this.timeout = ''
          this.picUrl = ''
        }
      } else {
        this.aid = 0
        this.timeout = ''
        this.picUrl = ''
      }
      this.useMyCode = !this.useMyCode
    },
    dateChange (e) {
      this.timeout = e.target.value
    },
    // 上传图片
    uploadImg () {
      const _this = this
      wx.showLoading({title: '图片上传中'})
      wx.uploadFile({
        url: 'https://api.new.618000.com/miniapp/discuss/attach',
        filePath: _this.picPath,
        name: 'file',
        header: {
          'AuthToken': wx.getStorageSync(SN.Auth).session_token,
          'AppId': 1
        },
        formData: {},
        success: function (res) {
          wx.hideLoading()
          let resObj = JSON.parse(res.data)
          if (resObj && resObj.code === 1) {
            _this.aid = resObj.data.id
            _this.picUrl = resObj.data.path
          } else {
            return wx.showModal({
              title: '提示',
              content: '图片上传失败',
              showCancel: false,
              confirmText: '知道了'
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          return wx.showModal({
            title: '提示',
            content: '图片上传失败',
            showCancel: false,
            confirmText: '知道了'
          })
        }
      })
    },
    // 图片选择
    ChooseImg () {
      const _this = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          _this.picPath = res.tempFilePaths[0]
          console.log(res)
          _this.uploadImg()
        },
        fail: function () {
        }
      })
    },
    // 提交表单
    SubmitFunc () {
      if (this.useMyCode) {
        if (!this.timeout) {
          wx.showToast({title: '有效期必须选择', icon: 'none'})
          return
        }
        if (!this.picUrl) {
          wx.showToast({title: '二维码必须上传', icon: 'none'})
          return
        }
      }
      if (!this.UserInfo.cansetqrcode) {
        return
      }
      wx.showLoading({title: '处理中'})
      this.$store.dispatch({
        type: 'UpLoadPqcode',
        data: {aid: this.aid, timeout: this.timeout}
      }
      ).then(() => {
        wx.hideLoading({complete: () => {
          wx.showToast({
            title: '设置成功',
            duration: 2000,
            complete: () => {
              wx.navigateBack()
            }
          })
        }})
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '设置失败',
          duration: 2000
        })
      })
    }
  },
  onLoad () {
    this.getUserInfo()
    this.getTimeScope()
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
  .switch{
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-top: 15px;
    padding: 8px 12px;
    .left{
      flex: 1;
      font-size: 16px;
      color: #333;
    }
    .right{
      text-align: right;
      flex: 1;
    }
  }
  .my-tip{
    font-size:12px;
    color: #bbbbbb;
    padding: 0 12px;
    text-align: left;
    margin-top: 10px;
    line-height: 1.4;
  }
  .box{
    background-color: #fff;
    margin-top: 15px;
    font-size: 16px;
    padding: 0 12px;
    .title{
      padding:16px 0 ;
      border-bottom: 1rpx solid #ddd;
    }
    .cell{
      padding: 16px 0;
      display: flex;
      /*border-bottom: 1rpx solid #ddd;*/
      .left{
        flex: 1;
        color: #333;
      }
      .right{
        flex: 1;
        text-align: right;
        color: #999;
      }
    }
    .code{
      .code-box{
        margin: 20px auto 40px auto;
        width: 164px;
        height: 164px;
        text-align: center;
        color: #ab9985;
        font-size: 14px;
        background-color: #f6f6f6;
        border-radius: 4px;
        border:1rpx dashed #ddd;
        .fa-qrcode{
          margin-top: 40px;
          margin-bottom:4px ;
          font-size: 64px;
          color: #ab9985;
        }
        .img-style{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .btn-box{
    padding: 12px;
    box-sizing: border-box;
    .submit-btn{
      margin-top: 37rpx;
      width: 100%;
      height: 86rpx;
      background: #ab9985;
      border-radius: 5rpx;
      font-size: 28rpx;
      line-height: 86rpx;
      color: #ffffff;
    }
  }
}
</style>

