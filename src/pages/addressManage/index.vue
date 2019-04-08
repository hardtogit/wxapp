<template>
  <div>
  <div class="container-box">
    <div class="address">
      <div class="left">
        <div class="top">
          <span class="name">拾玖</span><span class="phone">18381440137</span> <span class="tag">默认</span>
        </div>
        <div class="detail">
          <i class="fa fa-map-marker"></i>
          四川省成都市高薪区天府大道中段1999号环球中学大苏打
        </div>
      </div>
      <div class="right">
        <i class="fa fa-edit"></i>
      </div>
    </div>
    <div class="address">
      <div class="left">
        <div class="top">
          <span class="name">拾玖</span><span class="phone">18381440137</span> <span class="tag">默认</span>
        </div>
        <div class="detail">
          <i class="fa fa-map-marker"></i>
          四川省成都市高薪区天府大道中段1999号环球中学大苏打
        </div>
      </div>
      <div class="right">
        <i class="fa fa-edit"></i>
      </div>
    </div>
    <div class="address">
      <div class="left">
        <div class="top">
          <span class="name">拾玖</span><span class="phone">18381440137</span> <span class="tag">默认</span>
        </div>
        <div class="detail">
          <i class="fa fa-map-marker"></i>
          四川省成都市高薪区天府大道中段1999号环球中学大苏打
        </div>
      </div>
      <div class="right">
        <i class="fa fa-edit"></i>
      </div>
    </div>
  </div>
  <div class="bottom">
    <div class="left">
      <div class="btn">
        使用微信地址
      </div>
    </div>
    <div class="right">
      <div class="btn">
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
      UserInfo: null
    }
  },
  methods: {
  },
  onShow () {

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
  .address{
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 2px 2px #ededed;
    margin-bottom: 10px;
    .left{
      flex: 1;
      .top{
        .name{
          font-size: 14px;
          font-weight: bold;
          margin-right: 10px;
        }
        .phone{
          font-size: 14px;
          font-weight: bold;
        }
        .tag{
          font-size: 10px;
          color:#3F7BEE ;
          border:1px solid #3F7BEE;
          padding: 0 2px;
          border-radius: 2px;
          margin-left: 4px;
        }
      }
      .detail{
        margin-top: 10px;
        font-size: 12px ;
        color: #999;
        line-height: 1.6;
        .fa{
          display: inline-block;
          font-size: 12px;
        }
      }
    }
    .right{
      width: 30px;
      text-align: right;
      .fa{
        color: #666;
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

