<template>
  <div class="container-box" v-if="GoodsInfo">
    <scroll-view
      :scroll-y="isScroll"
      :upper-threshold="-30"
      :lower-threshold="50"
      @scrolltolower="scrolltolower"
      class='scroller-box'
     >
      <!-- 图片轮播 start -->
      <swiper class="swiper-box" :indicator-dots="indicatorDots"
        :autoplay="autoplay" :interval="interval" :duration="duration">
        <block v-for="(item, index) in BannerPics" :key="index">
          <swiper-item>
            <image :src="item" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
      <!-- 图片轮播 end -->
      <!-- 生成海报 start -->
       <div class="creatPost" @click="BuildPoster()">
          生成海报
       </div>
      <!-- 生成海报 end -->
      <!-- 商品信息 start -->
      <div class="product-info-card">
        <div class="basic-info">
          <div class="info-top">
            <div class="pro-name">{{GoodsInfo.goodsname}}</div>
            <!--<div class="share-icon" @click="popShowFunc('sharePopView')"></div>-->
          </div>
          <div class="info-bottom">
            <div class="info-bottom-left">
              <text class="discount-price">¥{{GoodsInfo.sellprice}}</text>
              <text class="original-price">￥{{GoodsInfo.marketprice}}</text>
            </div>
            <div class="info-bottom-right">
              <div class="sale-bar" v-if="GoodsInfo.showsales===1">
                <div class="saled" :style="'width:'+100*GoodsInfo.sales/(GoodsInfo.stock+GoodsInfo.sales)+'%'">
                  已售{{GoodsInfo.sales}}
                </div>
                <span class="level">
            还剩{{GoodsInfo.stock}}份
              </span>
              </div>
            </div>
          </div>

        </div>
        <div class="use-info" v-if="GoodsInfo.take==='V'">
          <div class="list-item">
            <!-- <p>使用时间：2018年8月14日至2019年9月20日</p> -->
            <p>使用时间：{{GoodsInfo.expire}}</p>
          </div>
          <div class="list-item">
            <p>使用流程：</p><div class="process-img"></div>
          </div>

        </div>
      </div>
      <!-- 商品信息 end -->
      <!-- 商铺信息 start -->
      <div class="shop-authentication-card">
        <div class="card-left">
          <p>该企业已通过认证</p><div class="icon" @click="popShowFunc('shopinfoPop')"></div>
        </div>
        <div class="rz-icon" >
          <p class="icon_one"></p>
          <p class="icon_two"></p>
        </div>
      </div>
      <div class="shop-info-card">
        <div class="shopinfo-top">
          <div class="top-left" @click="ToOtherPage(`../storeDetail/main?storeid=${GoodsInfo.storeid}`)">
            <image :src="GoodsInfo.storeInfo.shopiconurl" class="shop-pic" mode="aspectFill"/>
            <div class="shop-base-info">
              <p class="shop-name" >{{GoodsInfo.storeInfo.storename}}</p>
              <div class="shop-level">
                <stars-level :score="3"></stars-level>
                <p class="comment-number">{{GoodsInfo.ratenum}}人评价</p>
              </div>
            </div>
          </div>
          <div class="top-right">
            <!--<div class="map-icon" @click="navigationFunc()"></div>-->
            <!-- <div class="phone-icon" @click="callPhone(GoodsInfo.storeInfo.storephone)"></div> -->
            <div class="phone-icon" @click="Call(GoodsInfo.storeInfo.storephone)"></div>
          </div>
        </div>
        <div class="shopinfo-bottom" @click="navigationFunc()">
          <p class="path-str"><span class="fa fa-map-marker"></span>地址：{{GoodsInfo.storeInfo.detailAddress}}
            <span class="fa fa-angle-right"></span>
          </p>
        </div>
      </div>
      <!-- 商铺信息 end -->
      <!-- 分享者二维码 start -->
       <!--<div class="shireContainer">-->
         <!--<img class="shireCode" :src="GoodsInfo.qrcode"  alt="">-->
       <!--</div>-->
      <!-- 分享者二维码 end -->
      <!-- 商品详情 start -->
      <div class="common-card">
        <div class="card-header">
          <p class="title">商品详情</p>
        </div>
        <div class="card-content">
          <div class="wx-parse-box">
            <wxParse :content="GoodsInfo.content" @preview="preview" @navigate="navigate"/>
          </div>
        </div>
      </div>
      <div class="goods-container" v-if="StoreGoods.data&&StoreGoods.data.length">
        <div class="title">
          <div class="inner">
            <div class="left">推荐商品</div>
            <div class="right" @click="ToOtherPage(`../storeDetail/main?storeid=${GoodsInfo.storeid}`)">查看全部</div>
          </div>
        </div>
        <div class="goods-item" v-for="(value ,index) in StoreGoods.data" wx:key="index">
          <goods-card
            v-if="index<2"
            :img="value.cover"
            :title="value.goodsname"
            :sellprice="value.sellprice"
            :marketprice="value.marketprice"
            :sales="value.sales"
            :stock="value.stock"
            :showsales='GoodsInfo.showsales'
            :clickFn="()=>ToOtherPage(`../goods/main?gid=${value.id}`)"
          ></goods-card>
        </div>

        <!--<goods-card ></goods-card>-->
        <!--<goods-card ></goods-card>-->
      </div>
      <!-- 商品详情 end -->
      <!-- 商品评论 start -->
      <div class="common-card" id="pj">
        <div class="card-header">
          <p class="title">商品评价</p>
          <div class="heder-right" @click="toCommentPage">
            <p>全部评价({{CommentInfo.total}}条)</p>
          </div>
        </div>
        <div class="home-comment-list" v-if="CommentInfo.data.length > 0">
          <comment-item v-for="(item, index) in CommentInfo.data" :key="item.id" :dataInfo="item" @ShowCommentDetail="ShowCommentDetail"></comment-item>
        </div>
      </div>
      <!-- 商品评论 end -->
      <!-- 奖惩制度 start -->
      <div class="common-card">
        <div class="card-header">
          <p class="title">奖惩制度</p>
          <!-- <div class="heder-right">
            <p>查看详情</p>
          </div> -->
        </div>
        <div class="card-content">
          <div class="wx-parse-box">
            <wxParse :content="GoodsInfo.institut" @preview="preview" @navigate="navigate"/>
          </div>
        </div>
      </div>
      <!-- 奖惩制度 end -->
      <div class="technology" @click="popShowFunc('technicalSupportPop')">
        <div class="icon"></div>
        不是宝贝不推荐
      </div>
      <div class="scroll-bottom"></div>
    </scroll-view>
    <!-- 菜单导航 start -->
    <!--<div class="tab-menu-box" v-if="BottomTabShow">-->
      <!--<div class="tab-item" @click="popShowFunc('shopinfoPop')">-->
        <!--<p>商户信息</p>-->
      <!--</div>-->
      <!--<div class="tab-item" @click="popShowFunc('technicalSupportPop')">-->
        <!--<p>技术支持</p>-->
      <!--</div>-->
      <!--<div class="tab-item" @click="popShowFunc('becomeBusinessPop')">-->
        <!--<p>我也要卖</p>-->
      <!--</div>-->
      <!--<div class="tab-item tab-selected" @click="GoToMeView()">-->
        <!--<p>会员中心</p>-->
      <!--</div>-->
    <!--</div>-->
    <div class="nav" v-if="!showNav" @click="toggleNav(true)">
        导航
    </div>
    <div class="nav-tab" v-if="showNav" >
      <div class="top" @click="GoToMeView()">
        <p>会员</p>
        <p>中心</p>
      </div>
      <div class="line"></div>
      <div class="bottom" @click="popShowFunc('becomeBusinessPop')">
        <p>商务</p>
        <p>合作</p>
      </div>
    </div>
    <!-- 菜单导航 end -->

    <!-- 发货时间 start -->
    <!--<div class="send-time" v-if="GoodsInfo.take!=='V'&&GoodsInfo.presell==='Y'">-->
      <!--{{GoodsInfo.deliverytime}}号发货-->
    <!--</div>-->
    <!-- 发货时间 end -->

    <!-- 底部按钮 start -->
    <div class="bottom-box">
      <!-- <div class="kf-btn">
        <div class="kf-icon"></div>
        <p>客服</p>
      </div> -->
      <div @click="popShowFunc('sharePopView')" class="kf-btn fx-btn">
        <div class="kf-icon"></div>
        <p>分享</p>
      </div>
      <div @click="Call(GoodsInfo.storeInfo.storephone)" class="kf-btn">
        <div class="kf-icon "></div>
        <p>客服</p>
      </div>
      <div class="buy-now" @click="popShowFunc('buyNowPop')" v-if="GoodsInfo.stock > 0">
        <div class="btn">
          马上购买
        </div>
      </div>
      <div class="buy-now no-stock" v-if="GoodsInfo.stock <= 0"><div class="btn">已售空</div></div>
    </div>
    <!-- 底部按钮 end -->
    <!--立即购买弹出层 start-->
    <confirm-buy-info
      ref="buyNowPop"
      @popShow="popShowFunc"
      @bindMobile="popShowFunc('bindMobile')"
      :goodsInfo="GoodsInfo"
      :queryObj="queryObj">
    </confirm-buy-info>
    <!--立即购买弹出层 end-->
    <!--商家电话弹出层 start-->
    <phone-view ref="phoneView" :dataInfo="GoodsInfo.storeInfo.storephone"></phone-view>
    <!--商家电话弹出层 end-->
    <!--责任申明弹出层 start-->
    <duty-declar ref="dutyDeclarPop"></duty-declar>
    <!--责任申明弹出层 end-->
    <!--分享弹出层 start-->
    <share-pop-view ref="sharePopView" @BuildPoster="BuildPoster" :spreaderrebate="GoodsInfo.spreaderrebate"></share-pop-view>
    <!--分享弹出层 end-->
    <!--商户公众号弹出层 start-->
    <shop-subscription-pop ref="shopSubscriptionPop"></shop-subscription-pop>
    <!--商户公众号弹出层 end-->
    <!--商家详情弹出层 start-->
    <shopinfo-pop ref="shopinfoPop" :dataInfo="GoodsInfo.storeInfo"></shopinfo-pop>
    <!--商家详情弹出层 end-->
    <!--技术支持弹出层 start-->
    <technical-support-pop ref="technicalSupportPop"></technical-support-pop>
    <!--技术支持弹出层 end-->
    <!--我也要卖弹出层 start-->
    <become-business-pop ref="becomeBusinessPop" @popShow="popShowFunc"></become-business-pop>
    <!--我也要卖弹出层 end-->
    <!--合同细则弹出层 start-->
    <contract-pop ref="contractPop"></contract-pop>
    <!--合同细则弹出层 end-->
    <!--评论列表弹出层 start-->
    <comment-pop ref="commentPop"></comment-pop>
    <!--评论列表弹出层 end-->
    <!--评论详情弹出层 start-->
    <purchase-history-pop ref="purchaseHistoryPop" :dataInfo="commentDetailInfo"></purchase-history-pop>
    <!--评论详情弹出层 end-->
    <!--海报弹出层 start-->
    <poster-pop ref="posterPop" :posterImg="posterPic"></poster-pop>
    <!--海报弹出层 end-->
    <!--手机绑定弹出层 start-->
    <bind-mobile ref="bindMobile" @BindmobileSuccess='BindmobileSuccess'></bind-mobile>
    <!--手机绑定弹出层 end-->
    <!--领取优惠券弹出层 start-->
    <receive-coupon ref="receiveCoupon" :dataInfo="receiveCouponInfo"></receive-coupon>
    <!--领取优惠券弹出层 end-->
    <!--授权登陆弹框 start-->
    <authorization-pop ref="authorizationPop" @successFunc="AuthorizeSuccess"></authorization-pop>
    <!--授权登陆弹框 end-->
    <!--<circle-menu class="circleMenu" ref="circleMenu"-->
                 <!--type="top" :number="4"-->
                 <!--:btn="true" :circle="true"-->
                 <!--:btns="[{text:'商户',extend:'信息',fn:()=>popShowFunc('shopinfoPop')},{text:'技术',extend:'支持', fn:()=>popShowFunc('technicalSupportPop')},-->
                 <!--{text:'商户',extend:'合作',fn:()=>popShowFunc('becomeBusinessPop')},{text:'会员',extend:'中心',fn:()=>GoToMeView()}-->
                 <!--]">-->
      <!--<a slot="item_1" @click="popShowFunc('shopinfoPop')" class="fa fa-twitter fa-lg" herf="#" >商户信息</a>-->
      <!--<a slot="item_2" @click="popShowFunc('technicalSupportPop')" class="fa fa-weixin fa-lg" herf="#" >技术支持</a>-->
      <!--<a slot="item_3" @click="popShowFunc('becomeBusinessPop')" class="fa fa-weibo fa-lg" herf="#" >我也要卖</a>-->
      <!--<a slot="item_4" @click="GoToMeView()" class="fa fa-github fa-lg" herf="#" >会员中心</a>-->
    <!--</circle-menu>-->
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import receiveCoupon from '@/components/receive-coupon'
import confirmBuyInfo from '@/components/confirm-buy-info'
import dutyDeclar from '@/components/duty-declar'
import sharePopView from '@/components/share-pop-view'
import shopSubscriptionPop from '@/components/shop-subscription-pop'
import shopinfoPop from '@/components/shopinfo-pop'
import technicalSupportPop from '@/components/technical-support-pop'
import becomeBusinessPop from '@/components/become-business-pop'
import contractPop from '@/components/contract-pop'
import commentPop from '@/components/comment-pop'
import commentItem from '@/components/comment-item'
import purchaseHistoryPop from '@/components/purchase-history-pop'
import starsLevel from '@/components/stars-level'
import posterPop from '@/components/poster-pop'
import bindMobile from '@/components/bind-mobile'
import phoneView from '@/components/phone-view'
import authorizationPop from '@/components/authorization-pop'
import circleMenu from '@/components/circle-menu'
import goodsCard from '@/components/goods-card'
import SN from '@/config/localstorage.name'
import * as utils from '@/utils/utils'
export default {
  data () {
    return {
      queryObj: null,
      ScrollerHeight: 0,
      BottomTabShow: false,
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 400,
      GoodsInfo: null,
      StoreInfo: null,
      StoreGoods: {},
      CommentInfo: {
        data: []
      },
      isAuthoriza: false,
      posterPic: '',
      commentDetailInfo: null,
      receiveCouponInfo: null,
      isScroll: true,
      init: false,
      showNav: true
    }
  },
  components: {
    wxParse,
    confirmBuyInfo,
    dutyDeclar,
    sharePopView,
    shopSubscriptionPop,
    shopinfoPop,
    technicalSupportPop,
    becomeBusinessPop,
    contractPop,
    commentPop,
    commentItem,
    purchaseHistoryPop,
    starsLevel,
    posterPop,
    bindMobile,
    receiveCoupon,
    phoneView,
    authorizationPop,
    circleMenu,
    goodsCard
  },
  methods: {
    // 下拉刷新
    scrolltoupper (e) {
      const _this = this
      _this.GetGoodsInfo('refresh')
    },
    // 绑定手机成功
    BindmobileSuccess (uid, phone) {
      this.$refs.buyNowPop.BindmobileSuccess(uid, phone)
    },
    Call (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    GetDefault () {
      const $this = this
      this.$store.dispatch({
        type: 'GetDefaultAddress'
      }).then((data) => {
        console.log(data.data)
        setTimeout(() => $this.$refs.buyNowPop.SetAddress(data.data), 2000)

        // $this.$eventBus.$emit('choiceAddress', data.data)
      })
    },
    // 打开评论详情
    ShowCommentDetail (id) {
      let commentInfo = {}
      for (let i = 0; i < this.CommentInfo.data.length; i++) {
        if (this.CommentInfo.data[i].id === id) {
          commentInfo = this.CommentInfo.data[i]
          break
        }
      }
      wx.showLoading({
        title: '加载中'
      })
      this.$store.dispatch({
        type: 'GetCommentatorBoughtGoods',
        data: {
          uid: commentInfo.userid
        }
      }).then(obj => {
        commentInfo.BoughtGoods = obj.data
        wx.hideLoading()
        this.commentDetailInfo = commentInfo
        this.$refs.purchaseHistoryPop.showFunc()
      }).catch(() => {
        wx.hideLoading()
      })
    },
    // 授权提示框
    AuthorizationPrompt () {
      this.$refs.authorizationPop.showFunc()
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
      // 重新执行领取优惠券动作
      _this.ReceiveCoupon()
    },
    ToOtherPage (url) {
      wx.navigateTo({ url })
    },
    toggleNav (status) {
      this.showNav = status
    },
    // 登陆并判断是否授权
    Login () {
      const _this = this
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
              // 如果是第一次登陆, 弹出授权弹框
              _this.AuthorizationPrompt()
            } else {
              _this.isAuthoriza = true
              _this.GetUserInfo()
            }
          })
        },
        fail: () => {
          console.log('登陆失败')
        }
      })
    },
    // 生成海报
    BuildPoster () {
      const _this = this
      this.$refs.sharePopView.showFunc(true)
      if (_this.posterPic !== '') {
        this.$refs.posterPop.showFunc()
      } else {
        wx.showLoading({
          title: '海报生成中'
        })
        _this.$store.dispatch({
          type: 'BuildPoster',
          data: {
            postid: 0,
            gid: _this.GoodsInfo.id,
            storeid: _this.GoodsInfo.storeInfo.id
          }
        }).then(res => {
          _this.posterPic = res.data.url
          wx.hideLoading()
          this.$refs.posterPop.showFunc()
        }).catch(() => {
          wx.hideLoading()
          wx.showToast({
            title: '海报生成失败',
            icon: 'none'
          })
        })
      }
    },
    getPost () {
      const _this = this
      _this.$store.dispatch({
        type: 'BuildPoster',
        data: {
          postid: 0,
          gid: _this.GoodsInfo.id,
          storeid: _this.GoodsInfo.storeInfo.id
        }
      }).then(res => {
        _this.posterPic = res.data.url
      }).catch(() => {
      })
    },
    // 获取屏幕高度
    getSystemInfo () {
      const _this = this
      wx.getSystemInfo({
        success: (res) => {
          _this.ScrollerHeight = res.windowHeight - res.windowWidth / 750 * 98
        },
        fail: (e) => {
          console.log(e)
        }
      })
    },
    // 进入个人中心页面
    GoToMeView () {
      const _this = this
      if (_this.isAuthoriza) {
        const url = '../me/main'
        wx.navigateTo({ url })
      } else {
        _this.AuthorizationPrompt()
      }
    },
    // 进入评论列表页面
    toCommentPage () {
      const url = '../comment/main?gid=' + this.GoodsInfo.id + '&storeid=' + this.GoodsInfo.storeInfo.id
      wx.navigateTo({ url })
    },
    preview (src, e) {
      // do something
      console.log(src)
    },
    navigate (href, e) {
      // do something
      console.log(href)
    },
    // 弹框弹出隐藏事件
    popShowFunc (type) {
      console.log('s')
      const _this = this
      switch (type) {
        case 'buyNowPop':
          if (_this.isAuthoriza) {
            _this.$refs.buyNowPop.Initial()
            // _this.Login()
            utils.reLogin()
            _this.$refs.buyNowPop.showFunc()
          } else {
            _this.AuthorizationPrompt()
          }
          break
        default:
          this.$refs[type].showFunc()
          break
      }
    },
    // 打开地图
    navigationFunc (lat, lng) {
      const _this = this
      wx.openLocation({
        name: _this.GoodsInfo.storeInfo.storename,
        address: _this.GoodsInfo.storeInfo.detailAddress,
        latitude: Number(_this.GoodsInfo.storeInfo.lat),
        longitude: Number(_this.GoodsInfo.storeInfo.lng),
        scale: 18
      })
    },
    // 获取商品信息
    GetGoodsInfo (type) {
      const _this = this
      if (!type) {
      //   wx.startPullDownRefresh()
      // } else {
        wx.showLoading({
          title: '数据加载中'
        })
      }
      let goodsId = _this.queryObj && _this.queryObj.gid ? _this.queryObj.gid : '10'
      _this.$store.dispatch({
        type: 'GetGoodsById',
        data: {
          gid: goodsId,
          fromuid: _this.queryObj && _this.queryObj.fromwid ? _this.queryObj.fromwid : 0
        }
      }).then(obj => {
        console.log(obj.data)
        let goodsInfo = obj.data
        goodsInfo.storeInfo.detailAddress = goodsInfo.storeInfo.province + goodsInfo.storeInfo.city + goodsInfo.storeInfo.area + goodsInfo.storeInfo.town + goodsInfo.storeInfo.address
        _this.GoodsInfo = goodsInfo
        _this.$store.dispatch({
          type: 'GetStoreGoodsList',
          data: {storeid: goodsInfo.storeid}
        }).then(res => {
          _this.StoreGoods = res.data
        })
        if (!_this.init) {
          _this.getPost()
          _this.init = true
        }
        wx.setStorageSync(SN.PayGoodsInfo, goodsInfo)
        wx.setNavigationBarTitle({
          title: _this.GoodsInfo.goodsname
        })
        _this.GetCommentList()
        if (_this.GoodsInfo.firstchit && _this.GoodsInfo.firstchit !== '0') {
          _this.ReceiveCoupon()
        }
        if (type && type === 'refresh') {
          wx.stopPullDownRefresh()
        } else {
          wx.hideLoading()
        }
      }).catch(() => {
        if (type && type === 'refresh') {
          wx.stopPullDownRefresh()
        } else {
          wx.hideLoading()
        }
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        })
      })
    },
    // 获取评论列表
    GetCommentList () {
      const _this = this
      this.$store.dispatch({
        type: 'GetCommentList',
        data: {
          gid: _this.GoodsInfo.id,
          page: 1,
          storeid: _this.GoodsInfo.storeInfo.id
        }
      }).then(obj => {
        if (obj.data.data && obj.data.data.length > 0) {
          obj.data.data = obj.data.data.slice(0, 3)
        }
        _this.CommentInfo = obj.data
      })
    },
    // 获取用户基本信息
    GetUserInfo () {
      this.$store.dispatch({
        type: 'GetUserInfo'
      })
    },
    // 领取优惠券
    ReceiveCoupon () {
      const _this = this
      _this.$store.dispatch({
        type: 'ReceiveCoupon',
        data: {
          storeid: _this.GoodsInfo.storeInfo.id,
          gid: _this.GoodsInfo.id
        }
      }).then(res => {
        _this.receiveCouponInfo = res.data
        _this.$refs.receiveCoupon.showFunc()
      })
    },
    // 初始化数据
    InitalData () {
      this.queryObj = null
      this.ScrollerHeight = 0
      this.BottomTabShow = false
      this.indicatorDots = true
      this.autoplay = true
      this.interval = 5000
      this.duration = 400
      this.GoodsInfo = null
      this.StoreInfo = null
      this.CommentInfo = {
        data: []
      }
      this.isAuthoriza = false
      this.posterPic = ''
      this.commentDetailInfo = null
    }
  },
  // 分享事件
  onShareAppMessage (res) {
    const _this = this
    return {
      title: _this.GoodsInfo.goodsname,
      path: '/pages/goods/main?gid=' + _this.GoodsInfo.id + '&fromwid=' + wx.getStorageSync(SN.UserInfo).wid,
      imageUrl: _this.BannerPics[0],
      success: (res) => {
        _this.$refs.sharePopView.showFunc()
      },
      fail: (res) => {
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
  // 滚动时隐藏菜单栏
  onPageScroll: function (e) {
    this.showNav = false
    // if (this.$refs.circleMenu.open === true) {
    //   this.$refs.circleMenu.open = false
    //   this.$refs.circleMenu.toggleAnimate = false
    //   this.$refs.circleMenu.MaskToggle = false
    // }
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.GetGoodsInfo('refresh')
  },
  onLoad (option) {
    const _this = this
    _this.InitalData()
    _this.getSystemInfo()
    _this.GetDefault()
    if (option.scene) {
      let scene = decodeURIComponent(option.scene)
      _this.$store.dispatch({
        type: 'Getkeypass',
        data: {
          key: scene
        }
      }).then(res => {
        _this.queryObj = res.data.svalue
        _this.GetGoodsInfo()
      })
    } else {
      _this.queryObj = option
      _this.GetGoodsInfo()
    }
    if (!utils.isLogin()) {
      _this.Login()
    } else {
      _this.GetUserInfo()
      _this.isAuthoriza = true
    }
  },
  computed: {
    BannerPics () {
      let picList = []
      if (this.GoodsInfo) {
        for (var i in this.GoodsInfo.shuffling) {
          picList.push(this.GoodsInfo.shuffling[i])
        }
      }
      return picList
    },
    UserInfo () {
      return this.$store.state.app.UserInfo
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/style/reset';
@import './index';
</style>
<style lang="less">
  .wx-parse-box {
    image{
      width: 100%!important;
      display: block;
    }

  }

</style>
