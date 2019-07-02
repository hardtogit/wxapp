<template>
  <div class="container-box">
    <view class="searchBox" v-if="search">
    <view class="search-box" v-if="search">
      <image class="search-icon"  src="https://cdn.618000.com/static/images/search.png"></image>
      <input :focus="focus" @focus="handleFocus" @blur="handleBlur" type="text" @input="searchAddress"  class="input"  :value="searchInput"  placeholder-style="font-size：16px;color:#A1A7B3"   placeholder="输入街道/乡镇/小区/楼牌号等">
      <view v-if="searchInput" class="close-icon" @click="cleanInput"  src="https://cdn.618000.com/static/images/close.png"></view>
      <view class="cancel" @click="back">取消</view>
    </view>
      <scroll-view class="content" :style="'height:'+(height-60)+'px'" scroll-y >
        <view class="item" v-for="item in recommendList" @click="sureAddress(item)">
          <view class="title">{{item.title}}</view>
          <view class="describe">{{item.address}}</view>
        </view>
      </scroll-view>
    </view>
    <!--<div v-show="!search">-->
    <!--<map-->
      <!--id="map"-->
      <!--scale="14"-->
      <!--:latitude='!init&&latitude'-->
      <!--:longitude= '!init&&longitude'-->
      <!--@regionchange="handleRegionChange"-->
      <!--@end="handleRegionChange"-->
      <!--show-location-->
      <!--:style="'width: 100%; height:'+height+'px'"-->
    <!--&gt;-->
      <!--<cover-view class="search-box">-->
        <!--<cover-image class="search-icon" mode="scaleToFill" src="https://cdn.618000.com/static/images/search.png"></cover-image>-->
        <!--<cover-view   class="input" @click="goSearch">-->
          <!--输入街道/乡镇/小区/楼牌号等-->
        <!--</cover-view>-->
        <!--&lt;!&ndash;<cover-image class="close-icon" bindtap="cleanInput" mode="scaleToFill" src="https://cdn.618000.com/static/images/close.png"></cover-image>&ndash;&gt;-->
         <!--<cover-view class="cancel" @click="back">取消</cover-view>-->
      <!--</cover-view>-->
      <!--<cover-view class="locationImg">-->
      <!--<cover-image class="location" src="https://cdn.618000.com/static/images/location.png"></cover-image>-->
      <!--</cover-view>-->
      <!--<cover-image @click="goCenter" class="aim" src="https://cdn.618000.com/static/images/aim.png"></cover-image>-->
      <!--<cover-view class="address">-->
        <!--<cover-view class="inner">-->
          <!--<cover-view class="area">{{area}}</cover-view>-->
          <!--<cover-view class="addressDetail">{{address}}</cover-view>-->
        <!--</cover-view>-->
        <!--<cover-view class="btn" @tap="sureAddress({title:area,address:address,location:location})">-->
          <!--确认收货地址-->
        <!--</cover-view>-->
      <!--</cover-view>-->
    <!--</map>-->
    <!--</div>-->
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import bindMobile from '@/components/bind-mobile'
var timer = 0
export default {
  data () {
    this.latitude = '30.572893'
    this.longitude = '104.066794'
    return {
      init: false,
      UserInfo: null,
      height: 300,
      ctx: undefined,
      latitude: '30.572893',
      longitude: '104.066794',
      address: undefined,
      area: undefined,
      searchInput: undefined,
      search: true,
      focus: false,
      recommendList: [],
      location: {},
      cityName: undefined
    }
  },
  // computed: {
  //
  // },
  methods: {
    handleRegionChange (e) {
      this.init = true
      if (e.type === 'end') {
        this.setCenter()
      }
      console.log(e)
    },
    setCenter () {
      const $this = this
      this.ctx.getCenterLocation({
        complete: function (location) {
          $this.latitude = location.latitude
          $this.longitude = location.longitude
          $this.$qqmapsdk.reverseGeocoder({
            location: {
              latitude: location.latitude,
              longitude: location.longitude
            },
            get_poi: 1,
            poi_options: 'policy=2;page_size=20;page_index=1',
            success: function (res) { // 成功后的回调
              $this.address = res.result.address
              $this.location = res.result.location
              $this.area = res.result.formatted_addresses.recommend
              $this.recommendList = res.result.pois
            }
          })
        }
      })
    },
    goSearch () {
      this.search = true
      this.focus = true
    },
    handleFocus () {
      this.focus = true
    },
    handleBlur () {
      this.focus = false
    },
    searchFn (keyword) {
      let $this = this
      $this.$qqmapsdk.getSuggestion({
        keyword: keyword,
        region: $this.cityName,
        policy: 1,
        success: function (res) {
        },
        fail: function (res) {
          $this.recommendList = []
        },
        complete: function (res) {
          $this.recommendList = [...res.data]
        }
      })
    },
    searchAddress (e) {
      const keyword = e.target.value
      this.searchInput = e.target.value
      if (!keyword) {
        return
      }
      clearInterval(timer)
      timer = setTimeout(() => {
        this.searchFn(keyword)
      }, 500)
    },
    goCenter () {
      this.ctx.moveToLocation()
    },
    cancelSearch () {
      this.search = false
      this.focus = false
    },
    sureAddress (address) {
      this.$eventBus.$emit('setAddress', address)
      wx.navigateBack()
    },
    back () {
      wx.navigateBack()
    },
    cleanInput () {
      this.searchInput = ''
    }
  },
  onLoad (option) {
    console.log(option)
    const $this = this
    this.latitude = option.lat || '30.572893'
    this.longitude = option.lng || '104.066794'
    this.init = false
    wx.getLocation({
      success: function (data) {
        console.log(data)
        $this.$qqmapsdk.reverseGeocoder({
          location: {
            latitude: data.latitude || '30.572893',
            longitude: data.longitude || '104.066794'
          },
          get_poi: 1,
          poi_options: 'policy=2;page_size=20;page_index=1',
          success: function (res) { // 成功后的回调
            $this.address = res.result.address
            $this.location = res.result.location
            $this.province = res.result.ad_info.province
            $this.city = res.result.ad_info.city
            $this.district = res.result.ad_info.district
            $this.area = res.result.formatted_addresses.recommend
            $this.recommendList = res.result.pois
            $this.cityName = res.result.address_component.city
          }
        })
      }
    })
  },
  onShow () {
    console.log(this.latitude)
    const $this = this
    // this.search = false
    wx.getSystemInfo({
      success (res) {
        $this.height = res.windowHeight
      }
    })
    this.ctx = wx.createMapContext('map', this)
    // setTimeout(() => {
    //   this.ctx.moveToLocation()
    // }, 3000)
  },
  components: {
    cellItem,
    bindMobile
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box {
  .content{
    width: 355px;
    margin: 10px auto 0 10px;
    background-color: #fff;
    .item{
      /*height: 56px;*/
      padding: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ededed;
      .title{
        color: #666;
        font-size: 14px;
      }
      .describe{
        margin-top: 6px;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .search-box{
    height: 40px;
    padding: 0px 10px;
    top:0;
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
    box-shadow: 0 2px 2px #ededed;
    .search-icon{
      position: absolute;
      left: 25px;
      top:12px;
      z-index: 10;
      width: 15px;
      height: 15px;
    }
    .input{
      width: 260px;
      height: 40px;
      left: 40px;
      position: absolute;
      top:0;
      font-size: 14px;
      line-height: 40px;
      color: #A1A7B3;
      box-sizing: border-box;
      background-color:#fff;
      border-radius: 3px;
      padding-left: 10px;
    }
    .close-icon{
      position: absolute;
      z-index: 2;
      right: 60px;
      top:12px;
      width: 15px;
      height: 15px;
    }
    .cancel{
      position: absolute;
      right: 0;
      font-size: 14px;
      text-align: center;
      color: #666;
      height: 40px;
      line-height: 40px;
      width: 60px;
      top: 0;
      z-index: 3;
    }
  }
  .locationImg{
    position: fixed;
    left: 50%;
    top:50%;
    width:24px;
    height: 24px;
    transform: translate3d(-50%, -100%, 0);
    .location{
      width: 100%;
      height: 100%;
    }
  }
  .aim{
    position: fixed;
    left:10px;
    bottom:140px;
    width: 24px;
    height: 24px;
  }
  .address{
    position: fixed;
    height: 100px;
    width: 375px;
    bottom: 10px;
    .btn{
      width: 355px;
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      color: #fff;
      background-color: #333;
      margin: 0 auto;
      text-align: center;
    }
    .inner{
      box-sizing: border-box;
      width: 355px;
      height: 56px;
      padding: 10px;
      margin: 0 auto;
      background-color: #fff;
      box-shadow: 0 2px 2px #ededed;
      .area{
        color: #666;
        font-size: 14px;
      }
      .addressDetail{
        margin-top: 4px;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

</style>
