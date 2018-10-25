<template>
  <div class="container-box" v-if="orderInfo">
    <div class="order-info-box">
      <div class="top-box">
        <div class="product-main">
          <div class="pic-box" @click="ToCoodsDetail">
            <image :src="orderInfo.attach[orderInfo.order_detail[0].coverid]" class="pic-img" mode="aspectFill"/>
          </div>
          <div class="product-info">
            <div class="pro-name" @click="ToCoodsDetail">{{orderInfo.order_detail[0].goodsname}}</div>
            <div class="detail-bottom">
              <div class="bottom-left">
                <p class="pro-price">¥ {{orderInfo.order_detail[0].unitprice}}</p>
                <p class="num">X {{orderInfo.order_detail[0].numbers}}</p>
              </div>
              <div class="all-price">合计: ¥ {{orderInfo.order_detail[0].prices}}</div>
            </div>
          </div>
        </div>
        <div class="about-shop">
          <div class="shop-name">
            <p>{{orderInfo.storeinfo.storename}}</p>
          </div>
        </div>
      </div>
      <div class="order-detail">
        <p>订单编号: {{orderInfo.id}}</p>
        <p>下单时间: {{orderInfo.buytime}}</p>
      </div>
    </div>
    <div class="code-box">
      <div class="box-title">
        <p>核销码</p>
      </div>
      <div class="code-tab-menu">
        <div class="tab-item" :class="{'tab-selected':tabSelected === 1}" @click="tabSwitch(1)">待核销</div>
        <div class="tab-item" :class="{'tab-selected':tabSelected === 2}" @click="tabSwitch(2)">已核销/失效</div>
      </div>
      <!--等待核销 star-->
      <div class="tab-content-box" v-if="tabSelected === 1">
        <div class="code-list" v-if="orderCodes && orderCodes.notUsedList.length > 0">
          <div class="list-item" v-for="(item, index) in orderCodes.notUsedList" :key="item.verifycode" @click="verifyCodeCheck(item.verifycode)">
            <p class="code-number">{{item.verifycode}}</p>
            <div class="check-default" :class="{'checked': item.isSelected}"></div>
          </div>
        </div>
        <button class="qr-build-btn" @click="CreateQR" v-if="orderCodes && orderCodes.notUsedList.length > 0 && showCreateQRBtn">生成核销码</button>
        <div class="qr-pic-box" v-if='serverQRcode'>
          <cover-view class="qr-cover" v-if="showQRCover">
            <cover-view class="p-one">已失效</cover-view>
            <cover-view class="p-two">请重新生成~</cover-view>
          </cover-view>
          <canvas style="width: 360rpx; height: 360rpx;" canvas-id="myQrcode"></canvas>
        </div>
        <p class="count-down" v-if="showDownTime">{{downTime}}秒后失效,失效后请重新生成~</p>
      </div>
      <!--等待核销 end-->
      <!--已经核销 star-->
      <div class="tab-content-box" v-if="tabSelected === 2">
        <div class="code-list" v-if="orderCodes && orderCodes.hasUsedList.length > 0">
          <div class="list-item" v-for="(item, index) in orderCodes.hasUsedList" :key="item.verifycode">
            <p class="code-number novalid">{{item.verifycode}}</p>
            <p class="gray-word">核销日期: {{item.usetime}}</p>
          </div>
        </div>
      </div>
      <!--已经核销 end-->
    </div>
    <div class="bottom-btn-list">
      <div class="btn-default btn-coffee" v-if="orderInfo.cancel === 1">我要退款</div>
      <div class="btn-default btn-coffee" v-if="orderInfo.rateid === 0 && orderInfo.takestatus > 1" @click="ToComment">我要评论</div>
    </div>
  </div>
</template>
<script>
import drawQrcode from 'weapp-qrcode'
export default {
  data () {
    return {
      tabSelected: 1,
      queryObj: null,
      orderInfo: null,
      orderCodes: null,
      serverQRcode: null,
      windowWidth: 0,
      showCreateQRBtn: true,
      downTime: 70,
      showDownTime: false,
      showQRCover: false,
      timeInterval: null
    }
  },
  methods: {
    InitialData () {
      this.tabSelected = 1
      this.queryObj = null
      this.orderInfo = null
      this.orderCodes = null
      this.serverQRcode = null
      this.windowWidth = 0
      this.showCreateQRBtn = true
      this.downTime = 70
      this.showDownTime = false
      this.showQRCover = false
      this.timeInterval = null
    },
    ToCoodsDetail () {
      const url = '../goods/main?gid=' + this.orderInfo.order_detail[0].gid
      wx.navigateTo({ url })
    },
    // 去评论
    ToComment () {
      const url = '../createComment/main?orderid=' + this.orderInfo.id
      wx.navigateTo({ url })
    },
    verifyCodeCheck (code) {
      for (var i = 0; i < this.orderCodes.notUsedList.length; i++) {
        if (code === this.orderCodes.notUsedList[i].verifycode) {
          this.orderCodes.notUsedList[i].isSelected = !this.orderCodes.notUsedList[i].isSelected
          break
        }
      }
    },
    CreateQR () {
      let checkedList = []
      for (var i = 0; i < this.orderCodes.notUsedList.length; i++) {
        if (this.orderCodes.notUsedList[i].isSelected) {
          checkedList.push(this.orderCodes.notUsedList[i].verifycode)
        }
      }
      if (checkedList.length <= 0) {
        return wx.showToast({
          title: '请选择核销码',
          icon: 'none'
        })
      }
      let codeStr = checkedList.join()
      wx.showLoading({
        title: '核销码生成中'
      })
      this.$store.dispatch({
        type: 'CreateEncryptCode',
        data: {
          orderid: this.orderInfo.id,
          code: codeStr
        }
      }).then(res => {
        this.serverQRcode = res.data
        drawQrcode({
          width: this.windowWidth / 750 * 360,
          height: this.windowWidth / 750 * 360,
          canvasId: 'myQrcode',
          text: this.serverQRcode
        })
        this.showCreateQRBtn = false
        this.showDownTime = true
        this.showQRCover = false
        const _this = this
        this.timeInterval = setInterval(function () {
          if (_this.downTime > 1) {
            _this.downTime--
          } else {
            _this.downTime = 70
            _this.showCreateQRBtn = true
            _this.showDownTime = false
            _this.showQRCover = true
            clearInterval(_this.timeInterval)
            _this.timeInterval = null
          }
        }, 1000)
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '核销码生成失败',
          icon: 'none'
        })
      })
    },
    tabSwitch (num) {
      this.tabSelected = num
      this.$nextTick(function () {
        if (num === 1 && this.serverQRcode) {
          setTimeout(() => {
            drawQrcode({
              width: this.windowWidth / 750 * 360,
              height: this.windowWidth / 750 * 360,
              canvasId: 'myQrcode',
              text: this.serverQRcode
            })
          }, 50)
        }
      })
    },
    GetOrderDetail () {
      const _this = this
      wx.showLoading({
        title: '数据加载中'
      })
      _this.$store.dispatch({
        type: 'GetOrderDetail',
        data: {
          id: _this.queryObj.orderid,
          getstore: 1
        }
      }).then(res => {
        _this.orderInfo = res.data
        return _this.$store.dispatch({
          type: 'GetOrderCodeList',
          data: {
            orderid: _this.orderInfo.id
          }
        })
      }).then(obj => {
        let codeList = obj.data
        let orderCodes = {
          notUsedList: [],
          hasUsedList: []
        }
        for (let i = 0; i < codeList.length; i++) {
          if (codeList[i].status === 0) {
            codeList[i].isSelected = true
            orderCodes.notUsedList.push(codeList[i])
          } else {
            orderCodes.hasUsedList.push(codeList[i])
          }
        }
        if (orderCodes.notUsedList.length > 0) {
          _this.getCodeList()
        }
        _this.orderCodes = orderCodes
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
      })
    },
    getCodeList () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetOrderCodeList',
        data: {
          orderid: _this.orderInfo.id
        }
      }).then(obj => {
        let codeList = obj.data
        let orderCodes = {
          notUsedList: [],
          hasUsedList: []
        }
        for (let i = 0; i < codeList.length; i++) {
          if (codeList[i].status === 0) {
            codeList[i].isSelected = true
            orderCodes.notUsedList.push(codeList[i])
          } else {
            orderCodes.hasUsedList.push(codeList[i])
          }
        }
        if (orderCodes.notUsedList.length > 0) {
          setTimeout(() => {
            _this.getCodeList()
          }, 1000)
        } else {
          wx.showToast({
            title: '已核销'
          })
          _this.tabSelected = 2
          _this.orderCodes = orderCodes
        }
      }).catch(() => {
      })
    },
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.windowWidth = res.windowWidth
        },
        fail: (e) => {
          console.log(e)
        }
      })
    }
  },
  onLoad (option) {
    this.InitialData()
    this.queryObj = option
    if (this.queryObj && this.queryObj.entryType && this.queryObj.entryType === 'completed') {
      this.tabSelected = 2
    }
    this.GetOrderDetail()
    this.getSystemInfo()
  },
  onUnload () {
    clearInterval(this.timeInterval)
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  height: 100%;
  padding-bottom: 200rpx;
  .order-info-box{
    width: 100%;
    padding: 0 30rpx;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    .top-box{
      width: 100%;
      padding: 30rpx 0;
      display: flex;
      flex-direction: column;
      .product-main{
        width: 100%;
        height: 160rpx;
        display: flex;
        align-items: center;
        .pic-box{
          flex: 0 0 160rpx;
          width: 160rpx;
          height: 160rpx;
          border-radius: 5rpx;
          overflow: hidden;
          .pic-img{
            width: 160rpx;
            height: 160rpx;
          }
        }
        .product-info{
          flex: 1;
          height: 160rpx;
          padding-left: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .pro-name{
            font-size: 28rpx;
            color: #333333;
            line-height: 40rpx;
          }
          .detail-bottom{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .bottom-left{
              display: flex;
              align-items: flex-end;
              .pro-price{
                font-size: 24rpx;
                color: #ff3333;
              }
              .num{
                font-size: 24rpx;
                color: #333333;
                margin-left: 24rpx;
              }
            }
            .all-price{
              font-size: 24rpx;
              color: #333333;
            }
          }
        }
      }
      .about-shop{
        width: 100%;
        margin-top: 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &::after{
          content: '';
          display: block;
          width: 17rpx;
          height: 29rpx;
          background: url('../../../static/image/more_icon.png') no-repeat;
          background-size: 100% 100%;
        }
        .shop-name{
          display: flex;
          align-items: center;
          &::before{
            content: '';
            display: block;
            width: 32rpx;
            height: 32rpx;
            background: url('../../../static/image/order_store_icon.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 16rpx;
          }
          p{
            font-size: 24rpx;
            color: #333333;
          }
        }
      }
    }
    .order-detail{
      width: 100%;
      height: 70rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1rpx solid #ebebeb;
      p{
        font-size: 20rpx;
        color: #333333;
      }
    }
  }
  .code-box{
    width: 100%;
    margin-top: 20rpx;
    background: #ffffff;
    padding: 40rpx 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .box-title{
      display: flex;
      align-items: center;
      &::before{
        content: '';
        width: 32rpx;
        height: 32rpx;
        background: url('../../../static/image/order_code_icon.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 14rpx;
      }
      p{
        font-size: 24rpx;
        color: #ab9985;
      }
    }
    .code-tab-menu{
      width: 100%;
      height: 67rpx;
      margin-top: 38rpx;
      display: flex;
      align-items: center;
      border: 1rpx solid #cccccc;
      .tab-item{
        flex: 1;
        height: 65rpx;
        border-left: 1rpx solid #cccccc;
        line-height: 65rpx;
        text-align: center;
        font-size: 24rpx;
        color: #000000;
        &:first-child{
          border-left: none;
        }
        &.tab-selected{
          background: #eaeaea;
        }
      }
    }
    .tab-content-box{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .code-list{
        width: 100%;
        .list-item{
          width: 100%;
          height: 70rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30rpx;
          border-bottom: 1rpx solid #ebebeb;
          .code-number{
            font-size: 24rpx;
            color: #333333;
            &.novalid{
              text-decoration: line-through;
            }
          }
          .check-default{
            width: 36rpx;
            height: 36rpx;
            background: url('../../../static/image/psfs_btn_xuanze_default.png') no-repeat;
            background-size: 100% 100%;
            &.checked{
              width: 36rpx;
              height: 36rpx;
              background: url('../../../static/image/psfs_btn_xuanze_selected.png') no-repeat;
              background-size: 100% 100%;
            }
          }
          .gray-word{
            font-size: 22rpx;
            color: #999999;
          }
          .red-word{
            font-size: 22rpx;
            color: #ff3333;
          }
        }
      }
      .qr-build-btn{
        width: 400rpx;
        height: 60rpx;
	      background: #ab9985;
        border-radius: 5rpx;
        margin-top: 25rpx;
        border: none;
        font-size: 24rpx;
        color: #ffffff;
      }
      .qr-pic-box{
        margin-top: 30rpx;
        width: 360rpx;
        height: 360rpx;
        overflow: hidden;
        position: relative;
        .qr-cover{
          width: 360rpx;
          height: 360rpx;
          position: absolute;
          left: 0;
          top: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
          .p-one{
            font-size: 36rpx;
            font-weight: bold;
            color: #333333;
          }
          .p-two{
            font-size: 32rpx;
            color: #333333;
            margin-top: 16rpx;
          }
        }
        .qr-img{
          width: 360rpx;
          height: 360rpx;
        }
      }
      .count-down{
        font-size: 24rpx;
        margin-top: 20rpx;
        color: #333333;
      }
    }
  }
  .bottom-btn-list{
    width: 100%;
    // height: 110rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 30rpx;
    background: #ffffff;
    position: fixed;
    left: 0;
    bottom: 0;
    box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.05);
    .btn-default{
      width: 160rpx;
      height: 60rpx;
      margin: 25rpx 0 25rpx 10rpx;
      text-align: center;
      line-height: 60rpx;
      background: #cccccc;
      border-radius: 5px;
      font-size: 24rpx;
      color: #ffffff;
      border: none;
      // margin-left: 10rpx;
      &.btn-coffee{
        background: #ab9985;
      }
    }
  }
}
</style>



