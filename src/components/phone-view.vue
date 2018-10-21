<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <div class="wdq-tm-cover" @click="showFunc"></div>
          <!--弹框内容 start-->
            <div class="pop-out-box">
              <div class="pop-main">
                <div class="card-container" v-if="phoneList && phoneList.length > 0">
                  <div class="list-item" v-for="(item, index) in phoneList" :key="index" @click="callPhone(item)">
                    <p>{{item}}</p>
                  </div>
                  <div class="list-item" @click="showFunc">
                    <p>取消</p>
                  </div>
                </div>
              </div>
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
    dataInfo: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true
      // 弹框基本配置 end
    }
  },
  methods: {
    // 弹框基本配置 start
    showFunc () {
      this.popShow = !this.popShow
    },
    // 打电话
    callPhone (phoneNum) {
      wx.makePhoneCall({
        phoneNumber: phoneNum
      })
    }
  },
  computed: {
    phoneList () {
      let list = this.dataInfo.split(' ')
      return list
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../static/style/reset';
.pop-out-box{
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  .pop-main{
    position: relative;
    width: 100%;
    background: #ffffff;
    .card-container{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .close-btn{
        width: 36rpx;
        height: 36rpx;
        background: url('../../static/image/close_icon.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 20rpx;
        top: 20rpx;
      }
      .list-item{
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1rpx solid #ebebeb;
        &:last-of-type{
          border-bottom: none;
        }
        p{
          font-size: 32rpx;
          color: #333333;
        }
      }
    }
  }
}
</style>