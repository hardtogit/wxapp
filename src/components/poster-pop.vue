<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <!--弹框内容 start-->
          <div class="poster-container">
            <image :src="posterImg" class="poster-pic" mode="widthFix" @touchstart='timeStartFunc' @touchend='timeEndFunc' @tap='saveImg'/>
            <div class="save-ts">
              <p>长按图片保存海报</p>
            </div>
            <div class="close-btn" @click="showFunc"></div>
          </div>
          <!--弹框内容 end-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    posterImg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true,
      // 弹框基本配置 end
      timeStart: null,
      timeEnd: null
    }
  },
  methods: {
    timeStartFunc (e) {
      console.log(e)
      this.timeStart = e.timeStamp
    },
    timeEndFunc (e) {
      this.timeEnd = e.timeStamp
    },
    saveImg () {
      const _this = this
      let times = _this.timeEnd - _this.timeStart
      if (times > 300) {
        wx.getSetting({
          success: function (res) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function (res) {
                wx.showLoading({
                  title: '海报下载中'
                })
                wx.downloadFile({ // 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                  url: _this.posterImg,
                  success: function (res) {
                    // 下载成功后再保存到本地
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath, // 返回的临时文件路径，下载后的文件会存储到一个临时文件
                      success: function (res) {
                        wx.hideLoading()
                        wx.showToast({
                          title: '已保存至相册',
                          icon: 'success'
                        })
                      },
                      fail: function () {
                        wx.hideLoading()
                        wx.showToast({
                          title: '海报保存失败',
                          icon: 'none'
                        })
                      }
                    })
                  },
                  fail: function () {
                    wx.hideLoading()
                    wx.showToast({
                      title: '海报保存失败',
                      icon: 'none'
                    })
                  }
                })
              }
            })
          }
        })
      }
    },
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    }
    // 弹框基本配置 end
  }
}
</script>

<style lang="less" scoped>
@import '../../static/style/reset';
.poster-container{
  width: 550rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.poster-pic{
  width: 550rpx;
  height: auto;
}
.save-ts{
  background: #e7e5e5;
  height: 80rpx;
  width: 550rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  p{
    font-size: 28rpx;
    color: #333333;
  }
}
.close-btn{
  margin-top: 35rpx;
  width: 48rpx;
  height: 48rpx;
  background: url('../../static/image/hb_icon_guanbi.png') no-repeat;
  background-size: 100% 100%;
}
</style>
