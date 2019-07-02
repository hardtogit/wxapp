<template>
  <div class="container" v-if="orderInfo">
  <div class="top">
    <div class="header">
      <div class="status"><i class="fa fa-history"></i>{{status[orderInfo.sendstatus]}}</div>
    </div>
    <div class="address">
      <div class="left">
        <div class="person"><span class="name">{{orderInfo.consignee}}</span><span class="phone">{{orderInfo.mobile}}</span></div>
        <div class="detail"><div class="icon"></div><div class="text">{{orderInfo.detail}}</div></div>
      </div>
    </div>
    <div class="order" >
      <div class="inner">
        <div class="left" @click="push(`../goods/main?gid=${orderInfo.order_detail[0].gid}`)">
          <image class="img" :src="orderInfo.attach[orderInfo.order_detail[0].coverid]" alt=""/>
        </div>
        <div class="center" @click="push(`../goods/main?gid=${orderInfo.order_detail[0].gid}`)">
          <div class="title">
            {{orderInfo.order_detail[0].goodsname}}
          </div>
          <div class="subTitle">

          </div>
        </div>
        <div class="right">
          <div class="price">¥{{orderInfo.order_detail[0].prices}}</div>
          <div class="num">x{{orderInfo.order_detail[0].numbers}}</div>
        </div>
      </div>
      <div class="bottom">
        <div class="flex">
          <div class="left">
            运费
          </div>
          <div class="right">
            {{orderInfo.carriage}}
          </div>
        </div>
        <div class="flex">
          <div class="left">
            优惠
          </div>
          <div class="right">
            {{orderInfo.couponcash}}
          </div>
        </div>
        <div class="total">
            实付 <span class="mount"><span class="unit">¥</span>{{orderInfo.prices}}</span>
        </div>
      </div>
    </div>
  </div>
    <div class="card" v-if="orderInfo.sendstatus>4">
      <div class="title">物流信息</div>
      <div class="body">
        <div class="item">
          <div class="label">快递公司</div>
          <div class="value">{{orderInfo.sendexpress}}</div>
        </div>
        <div class="item">
          <div class="label">快递单号</div>
          <div class="value">{{orderInfo.trackingnumber}}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="title">订单信息</div>
      <div class="body">
        <div class="item">
          <div class="label">订单编号</div>
          <div class="value">{{orderInfo.id}}</div>
        </div>
        <div class="item">
          <div class="label">下单时间</div>
          <div class="value">{{orderInfo.buytime}}</div>
        </div>
        <div class="item">
          <div class="label">付款方式</div>
          <div class="value">{{orderInfo.paytype==='wxpay'?'微信支付':orderInfo.paytype}}</div>
        </div>
      </div>
    </div>
    <div class="connect">
      <div class="btn" @click="Call(orderInfo.storeinfo.storephone)">
        联系卖家
      </div>
      <div class="btn btn-coffee" v-if="orderInfo.rateid === 0 && orderInfo.sendstatus == 7" @click="ToComment">我要评论</div>
      <div class="btn" v-if="orderInfo.sendstatus===5" @click="sureReceive(orderInfo.id)">
        确认收货
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        orderInfo: undefined,
        status: {1: '待支付', 2: '已过期', 3: '已取消', 4: '待发货', 5: '待收货', 7: '已完成'},
        queryObj: {}
      }
    },
    methods: {
      getOrderDetail (id) {
        const _this = this
        wx.showLoading({
          title: '数据加载中'
        })
        _this.$store.dispatch({
          type: 'GetOrderDetail',
          data: {
            id: id,
            getstore: 1
          }
        }).then(res => {
          _this.orderInfo = res.data
          wx.hideLoading()
        }).catch(() => {
          wx.hideLoading()
        })
      },
      Call (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        })
      },
      // 去评论
      ToComment () {
        const url = '../createComment/main?orderid=' + this.orderInfo.id
        wx.navigateTo({ url })
      },
      sureReceive (id) {
        const $this = this
        wx.showModal({
          title: '温馨提示',
          content: '是否确认收货？',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading()
              $this.$store.dispatch({
                type: 'SureReceive',
                data: {
                  id
                }
              }).then((data) => {
                wx.hideLoading()
                $this.getOrderDetail($this.queryObj.orderid)
                wx.showToast({
                  title: '操作成功',
                  icon: 'none'
                })
              }).catch((data) => {
                console.log(data)
                wx.showToast({icon: 'none', title: '操作失败'})
                wx.hideLoading()
              })
            }
          }
        })
      },
      push (url) {
        wx.navigateTo({url})
      }
    },
    onLoad (options) {
      this.queryObj = options
    },
    onShow () {
      this.getOrderDetail(this.queryObj.orderid)
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../static/style/reset';
  .container{
    padding-bottom: 60px;
  }
  .top{
    background-color: #fff;
    padding-bottom: 20px;
    width: 100%;
  }
  .header{
    height: 80px;
    position: relative;
    background:linear-gradient(-30deg,rgba(255,74,74,1) 0%,rgba(255,63,63,1) 100%);
    color: #fff;
    .status{
        font-size: 12px;
      padding: 12px 10px;
        .fa{
          font-size: 16px;
          float: left;
          margin-right: 4px;
          position: relative;
          top:-3px
      }
    }
    }
  .address{
    width:355px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 10px 15px;
    box-shadow: 0 2px 2px #ededed;
    position: relative;
    top:-45px;
    .left{
      text-align: left;
      .person{
        font-size: 14px;
        color: #333;
        .name{
          margin-right: 8px;
        }
      }
      .detail{
        .icon{
          width: 13px;
          height: 13px;
          display: inline-block;
          background: url("../../../static/image/iconadress.png");
          background-size: 100% 100%;
          float: left;
          margin-right: 4px;
        }
        .text{
          line-height: 18px!important;
        }
        font-size: 12px;
        color: #666;
        margin-top: 10px;
      }
    }

  }
  .order{
    padding: 0 10px;
    background-color: #fff;
    margin-bottom: 8px;
    margin-top: -40px;
    .inner{
      display: flex;
      /*border-bottom: 0.5px solid #eee;*/
      padding: 15px 0;
      .left{
        width: 105px;
        .img{
          width: 100%;
          height: 84px;
        }
      }
      .center{
        flex: 1;
        padding: 0 6px;
        .title{
          font-size: 14px;
          color: #333;
        }
      }
      .right{
        .price{
          font-size: 14px;
        }
        .num{
          font-size: 12px;
          color: #999;
          text-align: right;
        }
      }
    }
    .bottom{
      font-size: 14px;
      color: #666;
      .flex{
        display: flex;
        margin-bottom: 10px;
        .left{
          flex: 1;
          text-align: left;
        }
        .right{
          flex: 1;
          text-align: right;
        }
      }
    }
    .total{
      text-align: right;
      .mount{
        .unit{
          font-size: 14px;
        }
        color: #333;
        font-size: 18px;
      }
    }

  }
  .card{
    background-color: #fff;
    margin-top: 10px;
    width: 100%;
    .title{
        padding: 12px 10px;
      font-size: 14px;
      border-bottom: 0.5px solid #eee;
    }
    .body{
      padding: 8px 0;
      .item{
        font-size: 14px;
        color: #666;
        display: flex;
        padding: 6px 10px;
        .label{
          width: 65px;
        }
        .value{
          color: #333;
          flex: 1;
        }
      }
    }
  }
  .connect{
    position: fixed;
    width: 100%;
    height: 49px;
    background-color: #fff;
    box-shadow: 2px -2px 2px #ededed;
    left: 0;
    bottom: 0;
    text-align: right;
    .btn{
      display: inline-block;
      width: 80px;
      height: 32px;
      border: 0.5px solid #ddd;
      border-radius: 16px;
      text-align: center;
      font-size: 14px;
      color: #333;
      line-height: 32px;
      margin: 8px 10px;
      &.btn-coffee{
        background: #ab9985;
        color:#fff
      }
    }
  }
</style>

