<template>
  <div class="container">
    <div class="tabs">
      <div class="tab">
        <div :class="['text',orderstatus==='waitdeliver'&&'active']" @click="swithTab('waitdeliver')">
          <span>待发货{{orderstatus==='waitdeliver'&&'('+total+')'||''}}</span>
        </div>
      </div>
      <div  class="tab" @click="swithTab('waittake')">
        <div :class="['text',orderstatus==='waittake'&&'active']" >
          已发货{{orderstatus==='waittake'&&'('+total+')'||''}}
        </div>
      </div>
    </div>
   <div class="item" v-for="(order ,i) in orders">
     <div class="flex">
       <div class="left">
         订单编号：{{order.orderid}}
       </div>
       <div class="right">
         {{orderstatus==='waitdeliver'&&'待发货'||''}}
         {{orderstatus==='waittake'&&'已发货'||''}}
       </div>
     </div>
     <div class="inner" @click="target(i)">
       <div class="left">
         <image class="img" :src="order.cover" alt=""/>
       </div>
       <div class="center">
         <div class="title">
           {{order.order.orders_detail[0].goodsname}}
           <div class="right">
             <div class="price">¥{{order.order.orders_detail[0].prices}}</div>
             <div class="num">x{{order.order.orders_detail[0].numbers}}</div>
           </div>
         </div>
         <div class="subTitle">
            {{order.order.remark}}
         </div>
         <div class="time">
           {{order.order.buytime}} <div v-if="order.order.take==='N'" class="icon" ><i :class="['fa', order.show?'fa-angle-double-up':'fa-angle-double-down']"></i></div>
         </div>
         <div class="address" v-if="order.show">
              <div>{{order.order.consignee}}&nbsp&nbsp&nbsp{{order.order.mobile}}</div>
              <div>地址：{{order.order.detail}}</div>
         </div>
       </div>

     </div>
    <div class="bottom">
        <div class="btn" @click="Call(order.order.mobile)">联系买家</div>
      <div v-if="orderstatus==='waitdeliver'" class="btn send" @click="push(`../sendFar/main?id=${order.orderid}`)">发货</div>
    </div>
   </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        orders: [],
        page: 1,
        orderstatus: 'waitdeliver',
        total: null,
        more: true
      }
    },
    methods: {
      target (i) {
        if (this.orders[i].order.take === 'N') {
          this.orders[i].show = !this.orders[i].show
        }
      },
      swithTab (orderstatus) {
        this.orderstatus = orderstatus
        this.ShopOrderList('down')
      },
      ShopOrderList (type) {
        if (type === 'down') {
          this.page = 1
        }
        wx.showLoading({
          title: '加载中...'
        })
        this.$store.dispatch({
          type: 'GetShopOrderList',
          data: {
            orderstatus: this.orderstatus,
            page: this.page
          }
        }).then((data) => {
          wx.hideLoading()
          if (type === 'down') {
            this.orders = data.data.data.reduce((total, item) => { return [...total, {...item, show: false}] }, [])
          } else {
            this.orders = [...this.orders, ...data.data.data.reduce((total, item) => { return [...total, {...item, show: false}] }, [])]
          }

          this.total = data.data.total
        }).catch(() => {
          wx.hideLoading()
        })
      },
      Call (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        })
      },
      push (url) {
        wx.navigateTo({url})
      },
      Show () {
        this.ShopOrderList()
      }

    },
    onShow () {
      this.ShopOrderList('down')
    },
    onReachBottom () {
      this.page = this.page + 1
      this.ShopOrderList('up')
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../static/style/reset';
  .container{
    padding-top: 44px;
  }
  .tabs{
    height: 44px;
    display: flex;
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    background-color: #fafafa;
    border-bottom: 0.5px solid #eee;
    .tab{
      flex: 1;
      text-align: center;
      .text{
        height: 44px;
        line-height: 44px;
        color: #666;
        font-size: 16px;
        display: inline-block;
        margin: 0 auto;
        &.active{
          color: #333;
          border-bottom: 3px solid #2D8CF0;
        }
      }
    }
  }
  .item{
    padding: 0 10px;
    background-color: #fff;
    margin-bottom: 8px;
    width: 100%;
    .flex{
        font-size: 12px;
      padding: 10px;
      display: flex;
      .left{
        color: #666;
        flex: 1;
      }
      .right{
        flex: 1;
        color:#FF7007;
        text-align: right;
      }
    }
    .inner{
      display: flex;
      border-bottom: 0.5px solid #eee;
      padding: 15px 0;
      .left{
        width: 80px;
        .img{
          width: 80px;
          height: 80px;
        }
      }
      .center{
        flex: 1;
        padding: 0 6px;
        .title{
          font-size: 14px;
          color: #333;
          .right{
            float: right;
          }
        }
        .time{
          font-size: 12px;
          color: #999;
          margin-top: 15px;
          .icon{
            float: right;
          }
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
      height: 49px;
      text-align: right;
      .btn{
        height: 32px;
        line-height: 32px;
        display: inline-block;
        padding: 0 10px;
        border: 1px solid rgba(102,102,102,1);
        font-size: 14px;
        color: #333;
        border-radius: 16px;
        margin-top: 8px;
        margin-left: 10px;
        &.send{
          border:1px solid rgba(81,150,254,1);
          color: #2666E1;
          background:rgba(81,150,254,0.1);
        }
      }
    }
    .address{
      font-size: 12px;
      color: #999;
      margin-top: 8px;
      div{
        line-height: 18px;
      }
    }

  }


</style>
