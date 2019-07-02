<template>
  <div>
  <div class="container-box">
    <div class="item" v-for="(item, i) in addressList" wx:key="i">
      <div class="address" :style="'transform: translateX('+addressList[i].styles+'px)'" @touchstart="(e)=>touchS(e,i)" @touchmove="(e)=>touchM(e,i)" @touchend="(e)=>touchE(e,i)">
      <div class="left" >
        <div class="top">
          <span class="name">{{item.consignee}}</span><span class="phone">{{item.mobile}}</span>
          <span class="tag" v-if="item.isdefault===1">默认</span>
          <span class="tag" v-if="item.tags===1">家</span>
          <span class="tag" v-if="item.tags===2">学校</span>
          <span class="tag" v-if="item.tags===3">公司</span>
        </div>
        <!--<div class="name">{{item.label}}</div>-->
        <div class="detail" v-if="item.label">
          <i class="fa fa-map-marker"></i>
          {{item.label+'&nbsp&nbsp'+item.detail+item.remark}}
        </div>
        <div class="detail" v-if="!item.label">
          <i class="fa fa-map-marker"></i>
          {{item.detail+item.remark}}
        </div>
      </div>
      <div class="right" @click="goEdit(item)">
        <i class="fa fa-edit"></i>
      </div>
        <div class="right delete" @click="deleteAddress(item)">
          <i class="fa fa-trash-o"></i>
        </div>
      </div>

    </div>
  </div>
  <div class="bottom">
    <div class="left">
      <div class="btn" @click="addWxAddress()">
        添加微信地址
      </div>
    </div>
    <div class="right">
      <div class="btn" @click="goAdd">
        新增地址
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import cellItem from '@/components/cell-item'
import bindMobile from '@/components/bind-mobile'
export default {
  data () {
    return {
      UserInfo: null,
      addressList: [],
      startX: 0
    }
  },
  methods: {
    goAdd () {
      wx.navigateTo({url: `../addAddress/main`})
    },
    goEdit (address) {
      wx.setStorageSync('addressObj', address)
      wx.navigateTo({url: `../addAddress/main?type=edit`})
    },
    touchS: function (e) {
      this.startX = e.clientX
    },
    touchM: function (e, i) {
      console.log(e.clientX)
      const distance = e.clientX - this.startX
      const open = this.addressList[i].open
      if (distance > -80 && distance < 0 && distance < 0 && !open) {
        this.addressList[i].styles = distance
      } else if (open && distance <= 80 && distance > 0) {
        console.log('s')
        this.addressList[i].styles = distance - 80
      }
    },
    touchE: function (e, i) {
      const distance = e.mp.changedTouches[0].clientX - this.startX
      const open = this.addressList[i].open
      if (open) {
        if (distance > 40) {
          this.addressList[i].open = false
          this.addressList[i].styles = 0
        } else {
          this.addressList[i].styles = -80
        }
      } else {
        if (distance < -40) {
          this.addressList[i].open = true
          this.addressList[i].styles = -80
        } else {
          this.addressList[i].styles = 0
        }
      }
    },
    addWxAddress () {
      const $this = this
      if (wx.chooseAddress) {
        wx.chooseAddress({
          success: function (res) {
            console.log(res)
            let params = {}
            params.consignee = res.userName
            // params.mobile = 15528059582
            params.mobile = res.telNumber
            params.province = res.provinceName
            params.city = res.cityName
            params.country = res.countyName
            params.isdefault = 0
            params.detail = res.provinceName + res.cityName + res.detailInfo
            $this.$store.dispatch({
              type: 'AddAddress',
              data: params
            }).then((data) => {
              wx.showToast({
                title: '添加成功',
                icon: 'none'
              })
              $this.getData()
              console.log(data)
            }).catch((data) => {
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            })
          },
          fail: function (err) {
            console.log(JSON.stringify(err))
          }
        })
      } else {
        console.log('当前微信版本不支持chooseAddress')
      }
    },
    deleteAddress: function (item) {
      const $this = this
      wx.showModal({
        title: '温馨提示',
        content: '确定删除该地址？',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading()
            $this.$store.dispatch({
              type: 'DeleteAddress',
              data: {id: item.id}
            }).then(() => {
              wx.hideLoading()
              wx.showToast({title: '删除成功！', icon: 'none'})
              $this.getData()
            }).catch(() => {
              wx.hideLoading()
              wx.showToast({title: '删除失败！', icon: 'none'})
            })
          }
        }
      })
    },
    getData: function () {
      const $this = this
      this.$store.dispatch({
        type: 'GetAddressList'
      }).then((data) => {
        const result = data.data.reduce((total, item) => { return [...total, {...item, styles: 0, open: false}] }, [])
        $this.addressList = result
      })
    }

  },

  onShow () {
    this.getData()
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
  padding: 10px;
  background: #f5f5f5;
  .name{
    font-size: 14px;
    color: #333;
    margin: 8px 0 4px 0;
  }
  .item{
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 2px 2px #ededed;
    margin-bottom: 10px;
    .address {
      display: flex;
      align-items: center;
      position: relative;
      width: 435px;
      .left {
        width: 295px;
        padding: 10px 0 10px 10px;
        .top {
          .name {
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
          }
          .phone {
            font-size: 14px;
            font-weight: bold;
          }
          .tag {
            font-size: 10px;
            color: #3F7BEE;
            border: 1px solid #3F7BEE;
            padding: 0 2px;
            border-radius: 2px;
            margin-left: 4px;
          }
        }
        .detail {
          margin-top: 10px;
          font-size: 12px;
          color: #999;
          line-height: 1.6;
          .fa {
            display: inline-block;
            font-size: 12px;
          }
        }
      }
      .right {
        width: 60px;
        text-align: center;
        .fa {
          color: #666;
        }
        &.delete{
          height: 100%;
          width: 80px;
          position: absolute;
          right: 0;
          top:0;
          background-color: #d03c3c;
          display: flex;
          align-items: center;
          .fa{
            flex: 1;
            color: #fff;
          }
        }
      }
    }
  }
}
.bottom{
  position: fixed;
  display: flex;
  align-items: center;
  bottom:0;
  height: 49px;
  width: 100%;
  .left{
    flex: 1;
    .btn{
      width: 140px;
      height: 40px;
      border-radius: 20px;
      font-size: 14px;
      color: #fff;
      line-height: 40px;
      background-color: #4DBF67;
      text-align: center;
      margin: 0 auto;
    }

  }
  .right{
    flex: 1;
    .btn{
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      border-radius: 20px;
      margin: 0 auto;
      background:linear-gradient(90deg,rgba(233,52,62,1) 0%,rgba(233,107,52,1) 100%);
    }
  }
}

</style>

