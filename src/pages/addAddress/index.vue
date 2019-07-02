<template>
  <div class="container-box">
    <div class="cell">
      <div class="left">
          联系人
      </div>
      <div class="center">
        <input type="text" v-model="consignee" placeholder="姓名">
      </div>
    </div>
    <div class="cell">
      <div class="left">
        手机号
      </div>
      <div class="center">
        <input type="number" v-model="mobile" placeholder="请输入手机号码">
      </div>
    </div>
    <!--<div class="cell">-->
      <!--<div class="left">-->
        <!--收货地址-->
      <!--</div>-->
      <!--<div class="center">-->
        <!--<picker-->
          <!--mode="region"-->
          <!--@change="bindRegionChange"-->
          <!--:value="region"-->
        <!--&gt;-->
          <!--<view :class="['picker',region.length===0&&'default']">-->
            <!--{{region.length?region[0]+region[1]+region[2]:'省/市/区'}}-->
          <!--</view>-->
        <!--</picker>-->
      <!--</div>-->
    <!--</div>-->
    <div class="cell map" @click="goAddress">
      <div class="left">
        收货地址
      </div>
      <div class="center">
        <input type="text" v-if="!address" v-model="address" disabled placeholder="请选择收货地址">
        <div v-if="address">
          <div class="name" v-if="label">{{label}}</div>
          <div class="address">{{address}}</div>
        </div>
      </div>
      <div class="right" >
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
    <div class="cell none">
      <div class="left">
        补充说明
      </div>
      <div class="center">
        <input type="text" v-model="remark" placeholder="详细地址（如门牌号等）">
      </div>
    </div>
    <div class="labels">
      <div :class="['label',tags===1&&'active']" @click="choiceLabel(1)">家</div>
      <div :class="['label',tags===2&&'active']" @click="choiceLabel(2)">学校</div>
      <div :class="['label',tags===3&&'active']" @click="choiceLabel(3)">公司</div>
    </div>
    <div class="switch">
      <div class="left">设为默认 </div>
      <div class="right">
        <switch :disabled="false" :checked="isdefault" color="#4cd964"  @change="switchChange"/>
      </div>
    </div>
    <button class="btn" @click="save">
      保存
    </button>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import bindMobile from '@/components/bind-mobile'

let type = 'add'
let addressId
export default {
  data () {
    return {
      UserInfo: null,
      tags: '',
      consignee: '',
      mobile: '',
      address: '',
      remark: '',
      region: [],
      isdefault: true,
      label: '',
      value: [0, 0, 0],
      location: {},
      province: '',
      city: '',
      district: ''

    }
  },
  methods: {
    goAddress () {
      const $this = this
      wx.chooseLocation({
        success: (res) => {
          $this.label = res.name
          $this.address = res.address
          $this.location = {lat: res.latitude, lng: res.longitude}
          $this.$qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (data) { // 成功后的回调
              $this.province = data.result.address_component.province
              $this.city = data.result.address_component.city
              $this.district = data.result.address_component.district
            }
          })
        }
      })
    },
    bindRegionChange (e) {
      this.region = e.target.value
    },
    switchChange (e) {
      this.isdefault = e.target.value ? 1 : 0
    },
    choiceLabel (tags) {
      this.tags = tags
    },
    save () {
      let params = {}
      params.consignee = this.consignee
      params.mobile = this.mobile

      params.province = this.province
      params.city = this.city
      params.country = this.district
      params.detail = this.address
      params.tags = this.tags
      params.label = this.label
      params.lat = this.location.lat
      params.lng = this.location.lng
      params.isdefault = this.isdefault ? 1 : 0
      params.remark = this.remark
      if (type === 'add') {
        this.$store.dispatch({
          type: 'AddAddress',
          data: params
        }).then((data) => {
          if (data.code === 1) {
            wx.showToast({title: '新增成功'})
            wx.navigateBack()
          }
        }).catch((data) => {
          wx.showToast({icon: 'warn', title: data.msg})
        })
      } else {
        this.$store.dispatch({
          type: 'EditAddress',
          data: {...params, id: addressId}
        }).then((data) => {
          if (data.code === 1) {
            wx.showToast({title: '新增成功'})
            wx.navigateBack()
          }
        }).catch((data) => {
          wx.showToast({icon: 'none', title: data.msg})
        })
      }
    }
  },
  onLoad (option) {
    var $this = this
    wx.authorize({
      scope: 'scope.userLocation'
    })
    this.$eventBus.$on('setAddress', function (value) {
      console.log(value)
      $this.address = value.address + value.title
      $this.location = value.location
      $this.province = value.province
      $this.city = value.city
      $this.district = value.district
    })
    if (option.type === 'edit') {
      const addressObj = wx.getStorageSync('addressObj')
      // this.region = [addressObj.province, addressObj.city, addressObj.country]
      this.province = addressObj.province
      this.city = addressObj.city
      this.district = addressObj.country
      this.consignee = addressObj.consignee
      this.mobile = addressObj.mobile
      this.address = addressObj.detail
      this.remark = addressObj.remark
      this.isdefault = !!addressObj.isdefault
      this.location = {lat: addressObj.lat, lng: addressObj.lng}
      this.tags = addressObj.tags
      this.label = addressObj.label
      type = 'edit'
      addressId = addressObj.id
    } else {
      type = 'add'
      this.province = ''
      this.city = ''
      this.district = ''
      this.consignee = ''
      this.mobile = ''
      this.region = []
      this.address = ''
      this.remark = ''
      this.isdefault = true
      this.location = {}
      this.tags = ''
      this.label = ''
    }
  },
  components: {
    cellItem,
    bindMobile
  }
}
</script>
<style lang="less" scoped>
@import '../../../static/style/reset';
.container-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  .cell{
    display: flex;
    align-items: center;
    font-size:14px;
    height: 55px;
    border-bottom: 1px solid #eee;
    &.none{
      border-bottom: none;
    }
    &.map{
      height: auto;
      padding: 10px 0;
    }
    .left{
      width: 80px;
      padding: 10px;
      color: #333;
  }
    .center{
      flex: 1;
      .default{
        color: #777;
      }
      .name{
        font-size: 14px;
        margin-bottom: 8px;
      }
      .address{
        font-size: 12px;
        color: #999;
        line-height: 1.4;
      }
    }
    .right{
      width: 40px;
      text-align: center;
      .fa{
        /*color: #3f7bee;*/
        color: #666;
        font-size: 24px;
        /*font-weight: bold;*/
      }
    }
  }
}
.labels{
  padding-left: 80px;
  .label{
    float: left;
    margin-right: 10px;
    width: 45px;
    height: 20px;
    color: #999;
    border: 1px solid #ddd;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    &.active{
      border:1px solid #3F7BED;
      color: #3F7BED;
    }
  }
}
.switch{
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 8px 12px;
  border-top:1px solid #eee; ;
  margin-top: 10px;
  .left{
    flex: 1;
    font-size: 14px;
    color: #333;
  }
  .right{
    text-align: right;
    flex: 1;
  }
}
  .btn{
    width: 300px;
    height: 40px;
    line-height: 40px;
    margin: 60px auto 0 auto;
    color: #fff;
    text-align: center;
    border-radius: 20px;
    background:linear-gradient(90deg,rgba(233,52,62,1) 0%,rgba(233,107,52,1) 100%);
  }

</style>
<style>
  page{
    background-color: #fff!important;
  }
</style>
