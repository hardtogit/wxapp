<template>
  <div class="wdq-pop-container" :class="{'wdq-container-show': popShow, 'wdq-transition-one': !popShow}" @touchmove="myCatchTouch">
    <div class="wdq-pop-inside-box">
      <div class="wdq-cover-box" v-if="showMask" :class="{'wdq-cover-box-black': popShow}"></div>
      <div class="wdq-animate-box" :class="{'wdq-animate-main-show': popShow}">
        <div class="wdq-animate-inside-main">
          <div class="wdq-tm-cover" @click="showFunc"></div>
          <!--弹框内容 start-->
          <div class="buy-pop-box">
            <div class="pop-main">
              <div class="form-main">
                <div class="product-info">
                  <image class="product-pic" mode="aspectFill" :src="selectedGoods.cover"/>
                  <p class="name">{{selectedGoods.goodsname}}</p>
                  <p class="pro-num">剩{{selectedGoods.stock}}份</p>
                  <div class="price-info">
                    <p class="discount-price">¥{{selectedGoods.sellprice}}</p>
                    <p class="original-price">￥{{selectedGoods.marketprice}}</p>
                  </div>
                  <div class="close-btn" @click="showFunc"></div>
                </div>
                <div class="yxz-box" v-if="goodsInfo.attribute > 1">
                  <p class="yxz-title">已选择: </p>
                  <div class="choose-list">
                    <p v-for="(item, index) in selectArr" :key="index" v-if="item !== ''">"{{item}}"</p>
                  </div>
                </div>
                <div class="mode-box" v-if="goodsInfo.attribute > 1">
                  <div class="mode-choose-box" v-for='(ProductItem, n) in goodsInfo.attrid' :key="n">
                    <p class="mode-title">{{ProductItem.name}}</p>
                    <div class="mode-list">
                      <div class="item-default"
                        v-for='(oItem, index) in ProductItem.item'
                        :key="index"
                        @click='specificationBtn(oItem.name,n,$event,index)'
                        :class="[oItem.isShow?'':'none-active',subIndex[n] == index?'selected':'']">
                        {{oItem.name}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="commom-li">
                  <p class="title-name">购买数量</p>
                  <div class="number-input-box">
                    <div class="subtract-btn" @click="SubtractBuyNumber" :class="{'disabled': buyNum <= 0}">-</div>
                    <input type="number" class="number-input" v-model="buyNum" disabled>
                    <div class="add-btn" @click="AddBuyNumber" :class="{'disabled': buyNum >= selectedGoods.stock || buyNum >= maxBuyNum || (goodsInfo.limitedly !== 0 && buyNum >= goodsInfo.limitedly) }">+</div>
                  </div>
                </div>
                <div class="commom-li" v-if="userInfo.uid === 0">
                  <p class="title-name">手机号</p>
                  <div class="bdsjh-box" v-if="userInfo.uid !== 0">{{userInfo.phone}}</div>
                  <button class="bdsjh-box" v-if="userInfo.uid === 0" :plain="true" open-type="getPhoneNumber" @getphonenumber="Bindmobilebyauth">点击获取微信绑定手机号</button>
                  <!-- <button class="bdsjh-box" v-if="userInfo.uid === 0" :plain="true" @click="BindmobileFunc">点击获取微信绑定手机号</button> -->
                </div>
                <!-- <div class="commom-li">
                  <p class="title-name">商品使用有效期</p>
                  <div class="yxq-box"><span>2018.8.19 15:30</span>至<span>2018.12.9 15:30</span></div>
                </div> -->
                <div class="commom-li">
                  <div class="title-name yhq-left">优惠券</div>
                  <div class="yhq-right">
                    <p v-if="!coupon">暂无优惠券</p>
                    <p v-if="coupon">{{coupon.denomination}}元抵扣券</p>
                  </div>
                </div>
                <!-- <div class="commom-li">
                  <div class="ye-left">
                    <p class="title-name">使用钱包余额抵扣</p>
                    <p class="yesy-price">¥ {{accessBalance}}</p>
                  </div>
                  <switch :checked="isUseBalance" @change="UseBalanceSwitch"/>
                </div> -->
                <div class="commom-li">
                  <div class="totle-price">小计: <span>¥ {{totlePrice}}</span></div>
                </div>
              </div>
              <div class="mzxy-box" @click="showOtherPop('dutyDeclarPop')">
                <div class="box-left">
                  <radio value="1" :checked="true" color="#ff3333"/>
                  <p>我已阅读并同意网站条款!</p>
                </div>
              </div>
              <div class="bottom-box">
                <div class="totle-price">
                  <p class="word-str">合计实际支付金额</p>
                  <p class="price-num">￥{{totlePrice}}</p>
                </div>
                <div class="pay-now-btn" @click="PayNow">立即支付</div>
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
import SN from '@/config/localstorage.name'
export default {
  props: {
    goodsInfo: {
      type: Object
    },
    queryObj: {
      type: Object
    }
  },
  data () {
    return {
      // 弹框基本配置 start
      popShow: false,
      showMask: true,
      // 弹框基本配置 end
      hasInitial: false, // 数据是否已经初始化
      selectArr: [], // 存放被选中的值
      shopItemInfo: {}, // 存放要和选中的值进行匹配的数据
      subIndex: [], // 是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
      buyNum: 0, // 购买数量
      selectedGoods: {}, // 选中的规格商品
      totlePrice: 0, // 总价
      balance: wx.getStorageSync(SN.UserInfo).balance, // 用户余额
      // balance: 0.02,
      accessBalance: 0, // 可以抵扣的余额
      isUseBalance: false, // 是否使用余额
      coupon: null, // 优惠券
      defaultBuyNum: 1, // 默认购买数量
      maxBuyNum: 10, // 最大购买数量
      userInfo: wx.getStorageSync(SN.UserInfo)
    }
  },
  methods: {
    // 初始化数据
    InitialData () {
      this.popShow = false
      this.showMask = true
      // 弹框基本配置 end
      this.hasInitial = false // 数据是否已经初始化
      this.selectArr = [] // 存放被选中的值
      this.shopItemInfo = {} // 存放要和选中的值进行匹配的数据
      this.subIndex = [] // 是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
      this.buyNum = 0 // 购买数量
      this.selectedGoods = {} // 选中的规格商品
      this.totlePrice = 0 // 总价
      this.balance = wx.getStorageSync(SN.UserInfo).balance // 用户余额
      // this.balance = 0.02
      this.accessBalance = 0 // 可以抵扣的余额
      this.isUseBalance = false // 是否使用余额
      this.coupon = null // 优惠券
      this.userInfo = wx.getStorageSync(SN.UserInfo)
    },
    // 触发手动绑定手机弹框出现
    BindmobileFunc () {
      const _this = this
      _this.$emit('bindMobile')
    },
    // 点击绑定手机事件
    Bindmobilebyauth (e) {
      console.log(e)
      const _this = this
      let eDetail = e.mp.detail
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
          _this.BindmobileSuccess(res.data.uid, res.data.phone)
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
        _this.BindmobileFunc()
      }
    },
    // 手机号码绑定成功后触发事件
    BindmobileSuccess (uid, phone) {
      const _this = this
      _this.userInfo.uid = uid
      _this.userInfo.phone = phone
      wx.setStorageSync(SN.UserInfo, _this.userInfo)
    },
    // 是否使用余额抵扣切换按钮点击事件
    UseBalanceSwitch (e) {
      this.isUseBalance = e.target.value
    },
    // 减少购买数量
    SubtractBuyNumber () {
      if (this.buyNum > 0) {
        this.buyNum -= 1
      }
    },
    // 增加购买数量
    AddBuyNumber () {
      if (this.buyNum < (this.goodsInfo.limitedly !== 0 ? this.goodsInfo.limitedly : this.selectedGoods.stock) && this.buyNum < this.maxBuyNum) {
        this.buyNum += 1
      }
    },
    // 弹框弹起和隐藏方法
    showFunc () {
      this.popShow = !this.popShow
    },
    // 打开其他弹窗
    showOtherPop (type) {
      this.$emit('popShow', type)
    },
    myCatchTouch () {
      // console.log('')
    },
    PaySuccess (id) {
      const url = '../paySuccess/main?orderid=' + id
      wx.navigateTo({ url })
    },
    // 购买事件
    PayNow () {
      const _this = this
      for (let i = 0; i < _this.goodsInfo.attribute - 1; i++) {
        if (_this.selectArr[i] === '' || !_this.selectArr[i]) {
          return wx.showToast({
            title: '请选择完整规格参数',
            icon: 'none'
          })
        }
      }
      if (_this.buyNum <= 0) {
        return wx.showToast({
          title: '商品数量不能为0',
          icon: 'none'
        })
      }
      wx.showLoading({
        title: '订单生成中'
      })
      let formData = {
        gid: _this.goodsInfo.id,
        specid: _this.selectedGoods.id,
        number: _this.buyNum,
        remark: '',
        couponid: _this.coupon && _this.coupon.id ? _this.coupon.id : 0
        // lat: ,
        // lng: ,
        // fromwid:
      }
      if (_this.queryObj && _this.queryObj.fromwid) {
        formData.fromwid = _this.queryObj.fromwid
      }
      // console.log(formData)
      _this.$store.dispatch({
        type: 'SubmitCommonOrder',
        data: formData
      }).then(res => {
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: obj => {
            // console.log(obj)
            if (obj.errMsg === 'requestPayment:ok') { // 调用支付成功
              wx.showToast({
                title: '购买成功',
                icon: 'success'
              })
              _this.PaySuccess(res.data.orderid)
            }
          },
          fail: res => {
            wx.showToast({
              title: '购买失败',
              icon: 'none'
            })
          }
        })
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '订单生成失败',
          icon: 'none'
        })
      })
    },
    // 点击选择规格
    specificationBtn: function (item, n, event, index) {
      var self = this
      if (self.selectArr[n] !== item) {
        self.selectArr[n] = item
        self.subIndex[n] = index
      } else {
        self.selectArr[n] = ''
        self.subIndex[n] = -1 // 去掉选中的颜色
      }
      self.checkItem()
      self.checkGoods()
      self.buyNum = self.defaultBuyNum
    },
    checkItem: function () {
      var self = this
      var option = self.goodsInfo.attrid
      var result = [] // 定义数组存储被选中的值
      for (let i in option) {
        result[i] = self.selectArr[i] ? self.selectArr[i] : ''
      }
      for (let i in option) {
        var last = result[i] // 把选中的值存放到字符串last去
        for (let k in option[i].item) {
          result[i] = option[i].item[k].name // 赋值，存在直接覆盖，不存在往里面添加name值
          option[i].item[k].isShow = self.isMay(result) // 在数据里面添加字段isShow来判断是否可以选择
        }
        result[i] = last // 还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
      }
      self.$forceUpdate() // 重绘
    },
    isMay: function (result) {
      for (var i in result) {
        if (result[i] === '') {
          return true // 如果数组里有为空的值，那直接返回true
        }
      }
      return this.shopItemInfo[result] && Number(this.shopItemInfo[result].stock) !== 0 // 匹配选中的数据的库存，若不为空返回true反之返回false
    },
    checkGoods () {
      const _this = this
      let hasGoods = true
      for (let i = 0; i < _this.goodsInfo.attribute - 1; i++) {
        if (_this.selectArr[i] === '' || !_this.selectArr[i]) {
          hasGoods = false
          break
        }
      }
      if (hasGoods) {
        let selectArrStr = _this.selectArr.join(',')
        let selectGoods = _this.shopItemInfo[selectArrStr]
        _this.selectedGoods.id = selectGoods.id
        _this.selectedGoods.stock = selectGoods.stock
        _this.selectedGoods.sellprice = selectGoods.saleprice
        _this.selectedGoods.marketprice = selectGoods.marketprice
      } else {
        _this.selectedGoods.stock = _this.goodsInfo.stock
        _this.selectedGoods.sellprice = _this.goodsInfo.sellprice
        _this.selectedGoods.marketprice = _this.goodsInfo.marketprice
      }
      // _this.totlePrice = _this.selectedGoods.sellprice * _this.buyNum
      _this.calculationTotlePrice()
    },
    // 获取优惠券
    GetCouponList () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetCouponList',
        data: {
          storeid: _this.goodsInfo.storeInfo.id,
          gid: _this.goodsInfo.id,
          page: 1,
          status: 0 // 未使用的
        }
      }).then(res => {
        // 选取第一张为默认优惠券
        if (res.data.data.length > 0) {
          _this.coupon = res.data.data[0]
        }
        _this.calculationTotlePrice()
      })
    },
    // 计算总价方法
    calculationTotlePrice () {
      let totlePrice = Math.round(this.selectedGoods.sellprice * this.buyNum * 100) / 100
      // 优惠券计算
      if (this.coupon) {
        if (Number(this.coupon.denomination) >= totlePrice) {
          totlePrice = 0
        } else {
          totlePrice = Math.round((totlePrice - Number(this.coupon.denomination)) * 100) / 100
        }
      }
      // 余额抵扣计算
      if (this.isUseBalance) {
        if (this.balance >= totlePrice) {
          this.accessBalance = totlePrice
        } else {
          this.accessBalance = this.balance
        }
        totlePrice = Math.round((totlePrice - this.accessBalance) * 100) / 100
      }
      this.totlePrice = totlePrice
    },
    // 初始化
    Initial () {
      var _this = this
      // if (!_this.hasInitial) {
      _this.InitialData()
      _this.buyNum = _this.defaultBuyNum
      if (!_this.hasInitial) {
        for (var i in _this.goodsInfo.specification) {
          if (_this.goodsInfo.specification[i].status === 1) {
            _this.shopItemInfo[_this.goodsInfo.specification[i].difference] = _this.goodsInfo.specification[i] // 修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
          }
        }
        _this.checkItem()
        if (this.goodsInfo.attribute > 1) {
          _this.selectedGoods = {
            cover: this.goodsInfo.cover,
            goodsname: this.goodsInfo.goodsname,
            stock: this.goodsInfo.stock,
            sellprice: this.goodsInfo.sellprice,
            marketprice: this.goodsInfo.marketprice
          }
        } else {
          _this.selectedGoods = {
            id: this.goodsInfo.specification[0].id,
            cover: this.goodsInfo.cover,
            goodsname: this.goodsInfo.goodsname,
            stock: this.goodsInfo.specification[0].stock,
            sellprice: this.goodsInfo.specification[0].saleprice,
            marketprice: this.goodsInfo.specification[0].marketprice
          }
        }
        _this.GetCouponList()
        _this.hasInitial = true
      }
    }
  },
  onLoad () {},
  watch: {
    // 监听购买数量
    buyNum: function (val) {
      this.calculationTotlePrice()
      // let totlePrice = Math.round(this.selectedGoods.sellprice * val * 100) / 100
      // // 优惠券计算
      // if (this.coupon) {
      //   if (Number(this.coupon.denomination) >= totlePrice) {
      //     totlePrice = 0
      //   } else {
      //     totlePrice = Math.round((totlePrice - Number(this.coupon.denomination)) * 100) / 100
      //   }
      // }
      // // 余额抵扣计算
      // if (this.balance >= totlePrice) {
      //   this.accessBalance = totlePrice
      // } else {
      //   this.accessBalance = this.balance
      // }
      // if (this.isUseBalance) {
      //   totlePrice = Math.round((totlePrice - this.accessBalance) * 100) / 100
      // }
      // this.totlePrice = totlePrice
    },
    // 监听是否使用余额抵扣
    isUseBalance: function (val) {
      this.calculationTotlePrice()
      // let totlePrice = Math.round(this.selectedGoods.sellprice * this.buyNum * 100) / 100
      // // 优惠券计算
      // if (this.coupon) {
      //   if (Number(this.coupon.denomination) >= totlePrice) {
      //     totlePrice = 0
      //   } else {
      //     totlePrice = Math.round((totlePrice - Number(this.coupon.denomination)) * 100) / 100
      //   }
      // }
      // // 余额抵扣计算
      // if (val) {
      //   if (this.balance >= totlePrice) {
      //     this.accessBalance = totlePrice
      //   } else {
      //     this.accessBalance = this.balance
      //   }
      //   totlePrice = Math.round((totlePrice - this.accessBalance) * 100) / 100
      // }
      // this.totlePrice = totlePrice
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
@import '../../static/style/reset';
.buy-pop-box{
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 14rpx 14rpx 0 0;
  .pop-main{
    position: relative;
    width: 100%;
    background: #f5f5f5;
    border-radius: 14rpx 14rpx 0 0;
    display: flex;
    flex-direction: column;
    .form-main{
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 30rpx;
      background: #ffffff;
      border-radius: 14rpx 14rpx 0 0;
      .product-info{
        display: flex;
        flex-direction: column;
        height: 180rpx;
        padding: 20rpx 0 20rpx 200rpx;
        position: relative;
        .product-pic{
          position: absolute;
          left: 0;
          bottom: 20rpx;
          width: 180rpx;
          height: 180rpx;
          border-radius: 10rpx;
          overflow: hidden;
        }
        .name{
          width: 350rpx;
          height: 75rpx;
          overflow: hidden;
          font-size: 26rpx;
          line-height: 36rpx;
          color: #333333;
        }
        .pro-num{
          font-size: 22rpx;
          color: #ab9985;
          margin-top: 10rpx;
        }
        .price-info{
          display: flex;
          align-items: flex-end;
          margin-top: 16rpx;
          .discount-price{
            font-size: 34rpx;
            color: #ff3333;
          }
          .original-price{
            margin-left: 14rpx;
            font-size: 22rpx;
            color: #999999;
            text-decoration: line-through;
          }
        }
        .close-btn{
          width: 36rpx;
          height: 36rpx;
          background: url('../../static/image/close_icon.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 20rpx;
          right: 0rpx;
        }
      }
      .yxz-box{
        padding: 22rpx 0;
        display: flex;
        justify-content: space-between;
        border-top: 1rpx solid #ebebeb;
        .yxz-title{
          font-size: 24rpx;
          color: #333333;
        }
        .choose-list{
          flex: 0 0 600rpx;
          display: flex;
          flex-wrap: wrap;
          p{
            font-size: 24rpx;
            color: #ff3333;
            margin-right: 20rpx;
          }
        }
      }
      .mode-box{
        padding: 20rpx 0;
        border-top: 1rpx solid #ebebeb;
        display: flex;
        flex-direction: column;
        .mode-choose-box{
          display: flex;
          flex-direction: column;
          margin-top: 20rpx;
          &:first-child{
            margin-top: 0;
          }
          .mode-title{
            font-size: 24rpx;
            color: #333333;
          }
          .mode-list{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .item-default{
              margin-left: 20rpx;
              height: 45rpx;
              padding: 0 34rpx;
              line-height: 43rpx;
              border-radius: 10rpx;
              border: 1rpx solid #999999;
              background: #ffffff;
              font-size: 20rpx;
              color: #999999;
              margin-top: 20rpx;
              &:first-child{
                margin-left: 0;
              }
              &.selected{
                border: 1rpx solid #ff3333;
                background: #ff3333;
                color: #ffffff;
              }
              &.none-active{
                background: #ccc;
                color: #ffffff;
                border: none;
                pointer-events: none;
              }
            }
          }
        }
      }
      .commom-li{
        border-top: 1rpx solid #ebebeb;
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-name{
          font-size: 24rpx;
          color: #333333;
        }
        .number-input-box{
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #ebebeb;
          border-radius: 4rpx;
          width: 170rpx;
          .number-input{
            padding: 0;
            flex: 0 0 60rpx;
            line-height: 46rpx;
            background: #ffffff;
            border-width: 0 1rpx;
            border-style: solid;
            border-color: #ebebeb;
            font-size: 32rpx;
            color: #333333;
            text-align: center;
          }
          .subtract-btn, .add-btn{
            flex: 1;
            text-align: center;
            line-height: 48rpx;
            // color: #ebebeb;
            color: #333333;
            &.disabled{
              color: #ebebeb;
            }
          }
        }
        .bdsjh-box{
          border: none;
          text-align: left;
          height: 30rpx;
          line-height: 30rpx;
          font-size: 24rpx;
          color: #ab9985;
          flex: 0 0 500rpx;
        }
        .yxq-box{
          font-size: 24rpx;
          color: #333333;
          flex: 0 0 500rpx;
          span{
            color: #ff3333;
          }
        }
        .yhq-left{
          display: flex;
          align-items: center;
          &::before{
            content: '';
            width: 28rpx;
            height: 24rpx;
            background: url('../../static/image/yhq_icon.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 10rpx;
          }
        }
        .yhq-right{
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #999999;
          &::after{
            content: '';
            width: 17rpx;
            height: 29rpx;
            background: url('../../static/image/more_icon.png') no-repeat;
            background-size: 100% 100%;
            margin-left: 10rpx;
          }
        }
        .ye-left{
          display: flex;
          align-items: center;
          .yesy-price{
            font-size: 24rpx;
            color: #e64340;
            margin-left: 10rpx;
          }
        }
        .totle-price{
          flex: 1;
          font-size: 28rpx;
          color: #333333;
          text-align: right;
          span{
            color: #ff3333;
          }
        }
      }
    }
    .mzxy-box{
      margin-top: 20rpx;
      background: #ffffff;
      padding: 20rpx 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .box-left{
        display: flex;
        align-items: center;
        p{
          font-size: 24rpx;
          color: #333333;
        }
      }
      &::after{
        content: '';
        width: 17rpx;
        height: 29rpx;
        background: url('../../static/image/more_icon.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .bottom-box{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .totle-price{
        flex: 0 0 290rpx;
        height: 98rpx;
        background: #ffffff;
        border-top: 1px solid #eeeeee;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 30rpx;
        box-sizing: border-box;
        .word-str{
          font-size: 22rpx;
          color: #333333;
        }
        .price-num{
          font-size: 32rpx;
          color: #ff3333;
          margin-top: 13rpx;
        }
      }
      .pay-now-btn{
        flex: 1;
        height: 98rpx;
        background: linear-gradient(225deg,	#f4042b 0%,	#fa5353 100%);
        font-size: 28rpx;
        line-height: 98rpx;
        color: #ffffff;
        text-align: center;
      }
    }
  }
}
</style>
