<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-18 17:04:46
 * @LastEditTime: 2019-12-20 15:01:32
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div v-if="isShow">
    <el-card class="form-container" shadow="never">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step v-if="!isEdit" title="选择商品分类"></el-step>
        <el-step title="填写商品信息"></el-step>
      </el-steps>
      <product-select
        v-if="!isEdit?showStatus[0]:false"
        ref="product_select"
        v-model="productParam"
        :is-edit="isEdit"
        @checkedList="chengCheckedList"
        @nextStep="nextStep()"
      ></product-select>
      <product-info
        v-if="!isEdit?showStatus[1]:true"
        v-model="productParam"
        ref="product_info"
        :is-edit="isEdit"
      ></product-info>

      <product-price
        v-if="!isEdit?showStatus[1]:true"
        ref="product_price"
        v-model="productParam"
        :is-edit="isEdit"
      ></product-price>
      <product-sale-unit
        @emitSkuTableData="getSkuTableList"
        ref="product_saleUnit"
        v-if="!isEdit?showStatus[1]:true"
        v-model="productParam"
        :is-edit="isEdit"
        :table-data="skuTableList"
        @nextStep="nextStep"
        @prevStep="prevStep"
      ></product-sale-unit>
      <product-img
        ref="product_img"
        v-if="!isEdit?showStatus[1]:true"
        v-model="productParam"
        :is-edit="isEdit"
      ></product-img>
      <div class="handle" v-if="!isEdit?showStatus[0]:false">
        <el-button type="primary" size="medium" @click="handleNext('product_select')">下一步，填写商品信息</el-button>
      </div>
      <div class="handle" v-if="!isEdit?showStatus[1]:true">
        <el-button plain size="medium" v-if="!isEdit" @click="handlePrev()">上一步,选择商品分类</el-button>
        <el-button
          type="primary"
          size="medium"
          style="width:200px;"
          @click="createProduct('productSelectForm')"
        >提 交 录 入</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import ProductSelect from "./ProductSelect";
import ProductInfo from "./ProductInfo";
import ProductSEO from "./ProductSEO";
import ProductPrice from "./ProductPrice";
import ProductSaleUnit from "./ProductSaleUnit";
import ProductImg from "./ProductImg";
import { editItem } from "@/api/mall/newProduct";
import { newProductRules } from "./productVariate";
import { readyCreateItemData, createOrUpdateItem } from "@/api/mall/newProduct";
import {
  getPropertySetList,
  checkItemCode,
  checkItemTitle
} from "@/api/mall/newProduct";

export default {
  name: "ProductDetail1",
  components: {
    ProductSelect,
    ProductInfo,
    ProductPrice,
    ProductSaleUnit,
    ProductImg
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    proId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isShow: true, //编辑商品时避免BUG
      fromAdd: true, //是否从新建商品页面跳转
      active: 0, //step默认值
      skuTableList: [], //编辑时获取到的sku列表信息
      productParam: {
        item: {
          id: "", //商品ID
          categoryNames: "", //分类名称
          postage:0,//邮费
          scoreBack:0, //返还补贴金
          sellType:1,
          defaultItemCategoryId: "", //所属分类ID
          itemCategoryIds: [], //分类ID 数组  其实要的是String
          propertysetName: "", //对应属性集名称
          ratio: "", //佣金比例
          title: "", //商品名称
          code: "", //商品编码
          shopBusRatio:"",//采购商家佣金比例
          shopDlRatio:"",//采购代理佣金比例
          busRatio:"",//商家佣金比例
          dlRatio:"",//代理佣金比例
          allPointPay:false,//是否可以全部积分支付
          canPeasPay:false,//是否可以全部购物豆支付
          localTitle: "", //本地商品标题  用于编辑时校验
          localCode: "", //本地商品编码 用于编辑时校验
          isCoverImageUrl: "", //商品主图
          itemCategorys: [], //商品分类集合
          itemChannels: [], //传给后台的商品渠道集合  是ID的数组
          itemChannelsGroup: [], //已选择商品渠道集合,
          checkedList: [], //本地已选择的渠道列表
          javaChannels: [], //后台传过来的商品渠道集合备选项
          memberList: [], //会员等级集合
          subTitle: "", //副标题
          style: "", //商品款式
          type: "1", //商品类型
          supplierId: "", //供应商ID
          status: "1", //商品状态  1是新建中  2是仓库中
          sketch: "", //扼要描述
          keywords: [], //创建条目
          seoTitle: "", //SEO标题
          seoKeywords: "", //SEO关键字
          seoDescription: "", //SEO描述
          customUrl: "", //渠道域名
          listPrice: "", //商品挂牌价格
          salePrice: "", //商品销售价格
          showPromotionIcon: false, //是否显示促销icon
          // allPointPay: false, //是否可以全部积分支付
          iconUrl: "",
          itemProperties: [], //商品属性集合
          itemImages: [], //商品图片集合
          skus: [], //需要保存的SKU
          skuInventoryQtyDtos: [], //SKU 库存信息等
          ivType: 0, //库存更新类型
          higherPId: "", //高级属性对应ID
          propertyset: {} //属性集
        },
        oldStatus: 1
      },
      showStatus: [true, false]
    };
  },
  created() {
    if (this.$route.query.productStatus) {
      this.productParam.item.status = this.$route.query.productStatus;
    }
    this.getEditData();
  },
  methods: {
    //上一步
    handlePrev() {
      this.prevStep();
    },
    //从选择商品分类模块点击下一步
    handleNext(formName) {
      this.$refs[formName].submitForm().then(
        valid => {
          //通过校验
          readyCreateItemData({
            categoryId: this.productParam.item.defaultItemCategoryId
          })
            .then(res => {
              if (res.code == "200") {
                if (res.result.channelList.length > 0) {
                  this.productParam.item.javaChannels = res.result.channelList;
                } else {
                  return this.$notify.error({
                    title: "重要提示",
                    message: "您的店铺未设置商品发布渠道"
                  });
                }

                this.productParam.item.memberList = res.result.lvGroupList;
                let channelList = [];
                let itemChannels = [];

                this.productParam.item.javaChannels.map(v => {
                  this.$set(v, "channelId", v.id);
                  channelList.push(v.name);
                  itemChannels.push(v);
                });

                itemChannels.map(channel => {
                  channel.description = "";
                });

                this.productParam.item.checkedList = channelList;
                this.productParam.item.itemChannels = itemChannels;

                if (res.result.salePropertyMap.thList.length > 0) {
                  this.nextStep();
                } else {
                  this.$notify.error({
                    title: "重要提示",
                    message: "该商品分类未关联属性集,请去商品分类页面关联"
                  });
                }
              }
            })
            .catch(err => {});
        },
        () => {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      );
    },
    //提交创建商品
    createProduct() {
      // 获取到组件中的form
      const productInfo = this.$refs.product_info.$refs.productInfoForm; //商品信息表单
      const productPrice = this.$refs.product_price.$refs.productPriceForm; //商品价格表单
      const productImg = this.$refs.product_img.$refs.productImgForm; //商品图片表单
      let promiseArr = [productInfo, productPrice, productImg];
      // 使用Promise.all去校验结果
      Promise.all(promiseArr.map(this.getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item);
        if (validateResult) {
          //表单都通过校验,检查SKU表格数据是否正确
          let sourceData = this.skuTableList;
          let nonVoidFlag = false;
          this.productParam.item.keywords = this.productParam.item.keywords.toString();
          this.productParam.item.skuInventoryQtyDtos = [];
          this.productParam.item.skuInventoryQtyDtos = sourceData;
          nonVoidFlag = sourceData.every(item => {
            return (
              item.extentionCode !== "" &&
              item.salePrice !== "" &&
              item.listPrice !== "" &&
              item.costPrice !== "" &&
              item.quantity !== "" &&
              item.scorePrice !== "" &&
              item.mixCashPrice !== "" &&
              item.mixScorePrice !== ""
            );
          });
          if (this.productParam.item.itemProperties.length == 0) {
            this.$message("请生成销售单元");
          } else if (!nonVoidFlag) {
            this.$message("存在未填写的字段");
          } else {
            //SKU数据通过校验走到这一步 ,开始校验图片信息是否准确
            if (this.productParam.item.itemImages.length <= 0) {
              this.$message("请选择至少一张图片");
            } else {
              const loading = this.$loading({
                lock: true,
                text: "等待服务器响应",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              let selectObj = {};
              this.productParam.item.itemImages.map(v => {
                if (v.isCover) {
                  selectObj = Object.assign({}, v);
                }
              });
              this.productParam.item.itemImages.splice(
                this.productParam.item.itemImages.findIndex(
                  item => item.id === selectObj.id
                ),
                1
              );
              this.productParam.item.itemImages = [
                selectObj,
                ...this.productParam.item.itemImages
              ];
              this.productParam.item.itemImages.map((image, index) => {
                image.position = index + 1;
              });
              //调用创建商品接口
              createOrUpdateItem(this.productParam)
                .then(res => {
                  loading.close();
                  this.$message(res.message);
                  // console.log(res);
                  if (res.code == "200") {
                    // console.log(this.value.item.ivType);
                    if (this.productParam.item.id == "") {
                      this.$router.push({
                        path: "/mall/newProduct"
                      });
                    } else {
                      this.$router.push({
                        path: "/mall/warehouseProduct"
                      });
                    }
                  }
                })
                .catch(err => {
                  loading.close();
                });
            }
          }
          console.log("表单都校验通过");
        } else {
          this.$notify.error({
            title: "错误",
            message: "数据不合法,请根据页面提示填写正确的信息"
          });
        }
      });
    },
    //表单校验公共函数
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res);
        });
      });
    },
    //自定义事件对应的事件处理函数
    chengCheckedList(val, itemVal) {
      this.productParam.item.checkedList = val;
      this.productParam.item.itemChannels = itemVal;
    },
    //从商品SKU组件获取笑声单元生成的table数据
    getSkuTableList(skuTableData, thList) {
      this.skuTableList = skuTableData;
    },
    getEditData() {
      if (this.isEdit) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.isShow = false;
        this.showStatus = [true, false, false, false, false];
        this.productParam.item.status = editItem({ itemId: this.proId })
          .then(res => {
            if (res.code == "200") {
              loading.close();
              this.productParam.item.id = res.result.itemDto.id;
              this.productParam.item.shopBusRatio = res.result.itemDto.shopBusRatio;
              this.productParam.item.shopDlRatio = res.result.itemDto.shopDlRatio;
              this.productParam.item.busRatio = res.result.itemDto.busRatio;
              this.productParam.item.dlRatio = res.result.itemDto.dlRatio;
              this.productParam.item.allPointPay = res.result.itemDto.allPointPay;
              this.productParam.item.canPeasPay = res.result.itemDto.canPeasPay;
              this.productParam.item.categoryNames =
                res.result.categories[0].name;
              this.productParam.item.defaultItemCategoryId =
                res.result.categories[0].id;
              this.productParam.item.itemCategoryIds = [];
              this.productParam.item.itemCategoryIds.push(
                res.result.categories[0].id
              );
              this.productParam.item.propertysetName =
                res.result.propertySetName;
              this.productParam.item.title = res.result.itemDto.title;
              this.productParam.item.postage = res.result.itemDto.postage;
              this.productParam.item.scoreBack = res.result.itemDto.scoreBack;
              this.productParam.item.sellType = res.result.itemDto.sellType;
              this.productParam.item.localTitle = res.result.itemDto.title;
              this.productParam.item.code = res.result.itemDto.code;
              this.productParam.item.localCode = res.result.itemDto.code;
              this.productParam.item.supplierId = Number(
                res.result.itemDto.supplierId
              );
              this.productParam.item.isCoverImageUrl =
                res.result.itemDto.isCoverImageUrl;
              this.productParam.item.itemCategorys =
                res.result.itemDto.itemCategorys;
              this.productParam.item.javaChannels =
                res.result.resultMap.channelList; //后台返回的渠道列表
              this.productParam.item.itemChannelsGroup =
                res.result.itemDto.itemChannels; //后台返回的已选择的渠道列表
              this.productParam.item.itemChannels = []; //需要传给后台的渠道ID列表
              this.productParam.item.checkedList = []; //本地已选择的渠道列表

              this.productParam.item.itemChannels =
                res.result.itemDto.itemChannels; //后台返回的已选择的渠道列表
              this.productParam.item.itemChannels.map(v => {
                this.productParam.item.javaChannels.map(vv => {
                  if (v.channelId == vv.id) {
                    this.$set(v, "name", vv.name);
                    this.productParam.item.checkedList.push(vv.name);
                  }
                });
              });
              this.productParam.item.subTitle = res.result.itemDto.subTitle;
              this.productParam.item.style = res.result.itemDto.style;
              this.productParam.item.type = res.result.itemDto.type.toString();
              this.productParam.item.status = res.result.itemDto.status.toString();
              this.productParam.item.sketch = res.result.itemDto.sketch;
              if (res.result.itemDto.keywords != "") {
                this.productParam.item.keywords = res.result.itemDto.keywords.split(
                  ","
                );
              }

              this.productParam.item.seoTitle = res.result.itemDto.seoTitle;
              this.productParam.item.seoKeywords =
                res.result.itemDto.seoKeywords;
              this.productParam.item.seoDescription =
                res.result.itemDto.seoDescription;
              this.productParam.item.customUrl = res.result.itemDto.customUrl;
              this.productParam.item.listPrice = res.result.itemDto.listPrice;
              this.productParam.item.salePrice = res.result.itemDto.salePrice;
              this.productParam.item.itemImages = res.result.itemDto.itemImages;
              this.productParam.item.showPromotionIcon =
                res.result.itemDto.showPromotionIcon;
              this.productParam.item.itemProperties = res.result.itemProperties;
              this.productParam.item.propertyset =
                res.result.itemDto.propertyset;
              this.skuTableList = res.result.resultMap.trList;

              this.skuTableList.map(v => {
                for (const key in v.skuInventoryQtyCommand) {
                  this.$set(v, key, v.skuInventoryQtyCommand[key]);
                  this.$set(v, "upcDisabled", true);
                }
                v.itemProperties = [];
                //处理编辑BUG
                v.propertyValueCommands.map(vv => {
                  if (vv.property.editType == 4) {
                    v.itemProperties.push({
                      propertyId: vv.property.id,
                      propertyValue: vv.propertyValue.value
                    });
                  } else {
                    v.itemProperties.push({
                      propertyId: vv.property.id,
                      propertyValueId: vv.propertyValue.id
                    });
                  }
                });
              });
              this.isShow = true;
            }
          })
          .catch(err => {
            loading.close();
          });
      }
    },
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        // console.log(this.active);
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    }
  }
};
</script>
<style>
.form-container {
  min-width: 800px;
  margin: 50px auto;
}
.form-container .el-form-item {
  text-align: center;
  display: flex;
  justify-content: center;
}
.form-container .el-form-item__content {
  display: flex;
  min-width: 640px;
  margin-left: 0 !important;
}

.form-container .buttons .el-form-item__content {
  display: block !important;
  width: 100%;
  margin-left: 0 !important;
}
.handle {
  display: flex;
  justify-content: center;
}
/* // 处理input type = number的上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>


