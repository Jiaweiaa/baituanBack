<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-12 16:57:30
 * @LastEditTime: 2019-10-12 16:57:30
 * @LastEditors: your name
 -->
<template>
  <div class="labberConcessionsBox" v-loading="loading">
    <div class="title">订单号: {{pageData.orderVo.code}}</div>
    <!-- 订单信息 -->
    <el-card class="box-card" style="float: left;">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <div class="text item">
        <p>昵称:</p>
        {{pageData.memberDto ? pageData.memberDto.nickname : ''}}
      </div>
      <div class="text item">
        <p>订单号:</p>
        {{pageData.orderVo.code}}
      </div>
      <div class="text item">
        <p>创建时间:</p>
        {{pageData.orderVo.createTime}}
      </div>
      <div class="text item">
        <p>付款时间:</p>
        {{pageData.orderVo.paymentCompleteTime}}
      </div>
      <div class="text item">
        <p>发货时间:</p>
        {{pageData.orderVo.logistics ? pageData.orderVo.logistics.createTime : ''}}
      </div>
      <div class="text item">
        <p>订单来源:</p>
        {{pageData.orderVo.source == 3 ? '微信' : pageData.orderVo.source == 2 ? '手机' : '电脑' }}
      </div>
      <div class="text item">
        <p>付款方式:</p>
        {{pageData.orderVo.paymentType == 4 ? '微信支付':pageData.orderVo.paymentType == '12' ?'补贴金支付':pageData.orderVo.paymentType == 13 ?'微信加补贴金支付' : '购物豆支付' }}
      </div>
      <div class="text item">
        <p>会员账号:</p>
        {{pageData.memberDto ? pageData.memberDto.loginName : ''}}
      </div>
    </el-card>
    <!-- 收获人信息 -->
    <el-card class="box-card" style="float: right;">
      <div slot="header" class="clearfix">
        <span>收货人信息</span>
      </div>
      <div class="text item">
        <p>收货人:</p>
        {{pageData.orderVo.shippingAddress.firstName }}
      </div>
      <div class="text item">
        <p>提货方式:</p>
        {{pageData.orderVo.shippingAddress.deliveryType == 1 ? '自提' : '送货上门' }}
      </div>
      <div class="text item">
        <p>邮箱地址:</p>
        {{pageData.orderVo.shippingAddress.email }}
      </div>
      <div class="text item">
        <p>手机号码:</p>
        {{pageData.orderVo.shippingAddress.mobile }}
      </div>
      <div class="text item">
        <p>固定电话:</p>
        {{pageData.orderVo.shippingAddress.phone }}
      </div>
      <div class="text item">
        <p>地区:</p>
        {{pageData.orderVo.shippingAddress.province }}-{{pageData.orderVo.shippingAddress.city }}-{{pageData.orderVo.shippingAddress.district }}
      </div>
      <div class="text item">
        <p>地址:</p>
        {{pageData.orderVo.shippingAddress.address }}
      </div>
    </el-card>
    <!-- 商品清单 -->
    <el-card class="box-card" style="width: 100%;">
      <div slot="header" class="clearfix">
        <span>商品清单</span>
      </div>
      <el-table :data="pageData.orderVo.orderLines" style="width: 100%">
        <el-table-column align="center" width="820" label="商品">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px; margin-left: 20px;"
              :src="`http://qn.gaoshanmall.cn/${scope.row.itemImg}`"
              fit="fit"
            ></el-image>
            <span style="margin-left: 10px">{{ scope.row.itemName }}</span>
            <span style="margin-left: 10px">{{ scope.row.propertiesValue }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="salePrice" label="单价（元）"></el-table-column>
        <el-table-column align="center" prop="quantity" label="数量"></el-table-column>
        <el-table-column align="center" prop="salePrice" label="交易状态">
          <template slot-scope="scope">{{orderType}}</template>
        </el-table-column>
        <el-table-column align="center" prop="subTotal" label="商品总价（元）"></el-table-column>
      </el-table>
      <div class="text item" style="text-align: right;margin-top: 40px;">
        实付款:
        <span
          style="font-size: 30px; color: red; margin: 0 10px;"
        >¥ {{pageData.orderVo.totalActure}}</span>
        （含运费{{pageData.orderVo.actualFreight}}元）
      </div>
    </el-card>
    <!-- 整单优惠 -->
    <el-card class="box-card" style="float: left; width: 32%; height: 350px;">
      <div slot="header" class="clearfix">
        <span>整单优惠</span>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane
          :key="index"
          v-for="(item, index) in pageData.orderVo.offerCouponVo"
          :label="(index + 1) + ''"
          :name="index + ''"
        >
          <div class="text item">
            <p>优惠名称 :</p>
            {{item.name ? item.name : '-'}}
          </div>
          <div class="text item">
            <p>编码:</p>
            {{item.couponCodes? item.couponCodes : '-'}}
          </div>
          <div class="text item">
            <p>优惠金额 :</p>
            {{item.ruleAmount ? item.ruleAmount : '-'}}
          </div>
          <div class="text item">
            <p>描述:</p>
            {{item.description ? item.description : '-'}}
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 发票信息 -->
    <el-card class="box-card" style="float: left; width: 32%; margin-left: 1%; height: 180px;">
      <div slot="header" class="clearfix">
        <span>发票信息</span>
      </div>
      <div class="text item">
        <p>是否需要发票:</p>
        {{pageData.orderVo.invoice ? pageData.orderVo.invoice.isNeedInvoice == 1 ? '需要' : '不需要' : '-'}}
      </div>
      <div class="text item">
        <p>发票抬头:</p>
        {{pageData.orderVo.invoice ? pageData.orderVo.invoice.invoiceTitle : '-'}}
      </div>
    </el-card>

    <!-- 历史记录 -->
    <el-card class="box-card" style="float: right; width: 32%; margin-left: 1%; height: 600px;">
      <div slot="header" class="clearfix">
        <span>历史记录</span>
      </div>
    </el-card>
    <!-- 物流信息 -->
    <el-card
      class="box-card"
      style="float: right; width: 32%; margin-right: 1%; overflow-y: scroll;"
    >
      <div slot="header" class="clearfix">
        <span>物流信息</span>
      </div>
      <div class="text item">
        <p>物流公司 :</p>
        {{pageData.orderVo.logistics ? pageData.orderVo.logistics.logisticsProviderName : '暂无'}}
      </div>
      <div class="text item">
        <p>运单号码 :</p>
        {{pageData.orderVo.logistics ? pageData.orderVo.logistics.transCode : '暂无' }}
      </div>
      <el-timeline style="margin-top: 10px;">
        <el-timeline-item
          v-for="(item, index) in pageData.orderVo.logisticsDetail"
          :key="index"
          :timestamp="item.trackingDate"
        >{{item.trackingDescription}}</el-timeline-item>
      </el-timeline>
    </el-card>
    <!-- 支付详细 -->
    <el-card class="box-card" style=" width: 32%; float: left; height: 320px;">
      <div slot="header" class="clearfix">
        <span>支付详细</span>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in pageData.orderVo.paymentInfos"
          :label="(index + 1) + ''"
          :key="index"
          :name="index + ''"
        >
          <div class="text item">
            <p>支付金额 :</p>
            {{item.payAmount ? item.payAmount : '-'}}
          </div>
          <div class="text item">
            <p>支付类型 :</p>
            {{item.paymentType == 4 ? '微信支付' : item.paymentType == 12 ?'联盟卷支付':'-'}}
          </div>
          <div class="text item">
            <p>商城支付流水:</p>
            {{item.payAmount ? item.payAmount : '-'}}
          </div>
          <div class="text item">
            <p>第三方支付流水:</p>
            {{item.thirdPayNo ? item.thirdPayNo : '-'}}
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-button
      type="primary"
      size="small"
      style="position: absolute; bottom: 10px; right: 20px;"
      @click="gobackPage"
      plain
    >返回</el-button>
  </div>
</template>

<script>
import { orderDetail } from "@/api/transaction/order";

export default {
  name: "name",
  data() {
    return {
      loading: false,
      pageData: {
        orderVo: {
          shippingAddress: {},
          logistics: {},
          offerCouponVo: {},
          Invoice: {},
          paymentInfos: {}
        }
      },
      orderType: "",
      activeName: 0
    };
  },
  created() {
    let params = {
      id: this.$route.query.id,
      memberId: this.$route.query.memberId
    };
    this.loading = true;
    orderDetail(params)
      .then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.pageData = res.result;
          console.log(this.pageData);
          if (this.pageData.orderVo.offerCouponVo.length == 0) {
            this.pageData.orderVo.offerCouponVo = [{}];
          }
          if (this.pageData.orderVo.logisticsStatus == 6) {
            this.orderType = "商家已发货";
          } else if (this.pageData.orderVo.logisticsStatus == 15) {
            this.orderType = "交易成功";
          } else if (
            this.pageData.orderVo.logisticsStatus == 9 &&
            this.pageData.orderVo.financialStatus == 3
          ) {
            this.orderType = "待退款";
          } else if (
            this.pageData.orderVo.logisticsStatus == 9 &&
            this.pageData.orderVo.financialStatus == 1
          ) {
            this.orderType = "交易取消";
          } else if (this.pageData.orderVo.logisticsStatus == 11) {
            this.orderType = "退款成功";
          } else if (
            this.pageData.orderVo.financialStatus == 1 &&
            this.pageData.orderVo.paymentType != 1 &&
            this.pageData.orderVo.logisticsStatus == 1
          ) {
            this.orderType = "待支付";
          } else if (
            (this.pageData.orderVo.financialStatus != 1 &&
              this.pageData.orderVo.logisticsStatus == 1) ||
            this.pageData.orderVo.logisticsStatus == 3 ||
            this.pageData.orderVo.logisticsStatus == 4 ||
            this.pageData.orderVo.logisticsStatus == 5
          ) {
            this.orderType = "等待商家发货";
          } else if (
            this.pageData.orderVo.logisticsStatus == 10 &&
            this.pageData.orderVo.financialStatus == 1
          ) {
            this.orderType = "自动取消";
          }
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
  },
  methods: {
    gobackPage() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
		.title
			font-size: 19px
			margin-bottom: 20px
		.box-card
			width: 49%
			overflow: hidden
			margin-bottom: 2%
		.text
			height: 35px
			line-height: 35px
			font-size: 14px
			overflow: hidden
			p
				padding: 0
				width: 120px
				text-align: right
				float: left
				margin: 0 10px 0 0
</style>
