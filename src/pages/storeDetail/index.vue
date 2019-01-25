<template>
  <div class="container-box">
    <div class="cover">
    <img  :src="StoreInfo.cover" alt="">
    </div>
    <div class="storeInfo">
      <div class="container">
        <div class="flex">
          <div class="left">
            <div class="name">{{StoreInfo.storename}}</div>
            <div class="time">营业时间：{{StoreInfo.officehours}}</div>
          </div>
          <div class=right}>
            <button class="share-icon" open-type="share"></button>
          </div>
        </div>
      </div>
    </div>
    <div class="shopinfo-bottom" >
      <p class="path-str" @click="popShowFunc"><img class="certificate" src="../../../static/image/certificate.png" alt="">营业执照
        <span class="fa fa-angle-right"></span>
      </p>
    </div>

    <div class="storeInfo location">
      <div class="container">
        <div class="flex">
          <div class="left" @click="navigationFunc(StoreInfo)">
            <div class="name" ><span class="fa fa-map-marker"></span>{{StoreInfo.storename}}</div>
          </div>
          <div class=right}>
            <a  @click="()=>callPhone(StoreInfo.storephone)"><img src="../../../static/image/phone.png" alt=""/></a>
          </div>
        </div>
      </div>
    </div>
    <div class="stores" v-if="StoreInfo.store_spread&&StoreInfo.store_spread.length>0">
      <div class="title">其他门店</div>
      <div class="storeInfo" v-for="(value, index) in StoreInfo.store_spread">
        <div class="container store" v-if="index<2||show">
          <div class="flex">
            <div class="left">
              <div class="name">{{value.storename}}</div>
              <div class="time" @click="navigationFunc(value)"><span class="fa fa-map-marker"></span> {{value.address}}</div>
            </div>
            <div class=right}>
              <a  @click="()=>callPhone(value.phone)"><img class="phone" src="../../../static/image/phone.png" alt=""/></a>
            </div>
          </div>
        </div>
      </div>
      <div class="more" @click="ToggleShow()">{{!show&&'查看剩下几家店'||'收起'}}
        <i class="fa" :class="{'fa-angle-double-down':!show,'fa-angle-double-up':show}" aria-hidden="true"></i></div>
    </div>
    <div class="tabs">
      <div class="tab" :class="{'active':!tabSelected}" @click="handleTabChange('')">全部商品</div>

      <div  v-for="value in StoreGoods.cate">
        <div class="tab" :class="{'active':tabSelected ===value.cateid}" @click="handleTabChange(value.cateid)">
          {{value.catename}}
        </div>
      </div>
    </div>
    <div class="goods-container">
      <div class="goods-item" v-for="value in StoreGoods.data">
        <goods-card
          :img="value.cover"
          :title="value.goodsname"
          :sellprice="value.sellprice"
          :marketprice="value.marketprice"
          :sales="value.sales"
          :stock="value.stock"
          :clickFn="()=>ToOtherPage(`../goods/main?gid=${value.id}`)"
        ></goods-card>
      </div>
      <!--<goods-card ></goods-card>-->
      <!--<goods-card ></goods-card>-->
    </div>
    <div class="ten">
      <div class="icon" @click="tePopShowFunc"></div>
      <div class="text">技术支持</div>
    </div>
    <shopinfo-pop ref="shopinfoPop" :dataInfo="StoreInfo"></shopinfo-pop>
    <!--技术支持弹出层 start-->
    <technical-support-pop ref="technicalSupportPop"></technical-support-pop>
    <!--技术支持弹出层 end-->
  </div>
</template>
<script>
import goodsCard from '@/components/goods-card'
import goodsPanel from '@/components/goods-panel'
import shopinfoPop from '@/components/shopinfo-pop'
import technicalSupportPop from '@/components/technical-support-pop'
import SN from '@/config/localstorage.name'
export default {
  data () {
    return {
      UserInfo: null,
      StoreInfo: {},
      StoreGoods: {},
      queryObj: {},
      tabSelected: '',
      show: false
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
    GetStoreInfo () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetStoreInfoById',
        data: {storeid: _this.queryObj.storeid}
      }).then(res => {
        _this.StoreInfo = res.data
      })
    },
    GetStoreGoods () {
      const _this = this
      _this.$store.dispatch({
        type: 'GetStoreGoodsList',
        data: {storeid: _this.queryObj.storeid}
      }).then(res => {
        _this.StoreGoods = res.data
      })
    },
    ToOtherPage (url) {
      wx.navigateTo({ url })
    },
    ToggleShow () {
      this.show = !this.show
    },
    // 弹框弹出隐藏事件
    popShowFunc () {
      this.$refs.shopinfoPop.showFunc()
    },
    tePopShowFunc () {
      this.$refs.technicalSupportPop.showFunc()
    },
    // 打开地图
    navigationFunc (store) {
      wx.openLocation({
        name: store.storename,
        address: store.address,
        latitude: parseFloat(store.lat),
        longitude: parseFloat(store.lng),
        scale: 18
      })
    },
    handleTabChange (cateid) {
      console.log(cateid)
      this.tabSelected = cateid
      const _this = this
      _this.$store.dispatch({
        type: 'GetStoreGoodsList',
        data: {storeid: _this.queryObj.storeid, cateid}
      }).then(res => {
        _this.StoreGoods = res.data
      })
    },
    callPhone (phone) {
      wx.makePhoneCall({
        phoneNumber: phone // 仅为示例，并非真实的电话号码
      })
    }
  },
  // 分享事件
  onShareAppMessage (res) {
    const _this = this
    return {
      title: _this.StoreInfo.storename,
      path: '/pages/storeDetail/main?storeid=' + _this.queryObj.storeid + '&fromwid=' + wx.getStorageSync(SN.UserInfo).wid,
      imageUrl: _this.StoreInfo.cover,
      success: (res) => {
        console.log('分享成功')
      },
      fail: (res) => {
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
  onLoad (option) {
    this.queryObj = option
  },
  onShow () {
    this.GetUserInfo()
    this.GetStoreInfo()
    this.GetStoreGoods()
  },
  components: {
    goodsCard,
    goodsPanel,
    shopinfoPop,
    technicalSupportPop
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
@import "./index";

</style>

