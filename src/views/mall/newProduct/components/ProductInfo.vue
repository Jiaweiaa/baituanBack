<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-18 17:04:46
 * @LastEditTime: 2019-12-20 15:05:26
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div style="margin-top: 50px">
    <imageLibrary
      @sendImageList="getSelectImage"
      :closeDialog="closeMyDialog"
      :isOpen="imageLibraryDialog"
    ></imageLibrary>
    <el-form
      :model="value.item"
      :rules="rules"
      ref="productInfoForm"
      label-position="right"
      label-width="160px"
      style="width: 1220px;margin:0 auto;"
      size="small"
      class="product_form"
    >
      <el-form-item label="商品名称：" prop="title">
        <el-input v-model.trim="value.item.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model.trim="value.item.subTitle" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品类型：">
        <el-radio-group v-model="value.item.sellType" style="display:flex;align-items:center;">
          <el-radio :label="1">普通</el-radio>
          <el-radio :label="2">采购商品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="供应商：">
        <el-select v-model="value.item.supplierId" placeholder="请选择供应商">
          <el-option
            v-for="item in supplierOptions"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购商家佣金比例：">
        <el-input v-model="value.item.shopBusRatio" clearable></el-input>
      </el-form-item>
      <el-form-item label="采购代理佣金比例：">
        <el-input v-model="value.item.shopDlRatio" clearable></el-input>
      </el-form-item>
      <el-form-item label="商家佣金比例：">
        <el-input v-model="value.item.busRatio" clearable></el-input>
      </el-form-item>
      <el-form-item label="代理佣金比例：">
        <el-input v-model="value.item.dlRatio" clearable></el-input>
      </el-form-item>

      <el-form-item label="可以全部积分支付：">
        <el-switch v-model="value.item.allPointPay" active-text="是" inactive-text="否"></el-switch>
      </el-form-item>
      <el-form-item label="可以全部购物豆支付：">
        <el-switch v-model="value.item.canPeasPay" active-text="是" inactive-text="否"></el-switch>
      </el-form-item>
      <el-form-item label="运费：" prop="postage">
        <el-input type="number" v-model="value.item.postage" clearable>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="返还补贴金：" prop="scoreBack">
        <el-input v-model="value.item.scoreBack" type="number" clearable>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="原价：" prop="salePrice">
        <el-input v-model="value.item.salePrice" clearable>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="优惠价：" prop="listPrice">
        <el-input v-model="value.item.listPrice" clearable>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <!-- <el-form-item label="是否支持全部积分购买：" prop="ratio">
        <el-radio-group v-model="value.item.allPointPay">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item label="商品编码：" prop="code">
        <el-input v-model.trim="value.item.code" clearable></el-input>
      </el-form-item>

      <el-form-item label="商品款式：">
        <el-input v-model.trim="value.item.style" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品类型：" prop="type">
        <el-select v-model="value.item.type" placeholder="请选择商品类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="value.item.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扼要描述：">
        <el-input v-model.trim="value.item.sketch" type="textarea" clearable></el-input>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-select
          v-model="value.item.keywords"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入要创建的关键字"
        >
          <div slot="empty" style="padding:10px; color:#C0C4CC;">暂无输入建议请手动输入然后点击回车</div>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可用渠道：" prop="checkedList">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="value.item.checkedList" @change="handleCheckedChange">
          <el-checkbox
            v-for="item in value.item.javaChannels"
            :label="item.name"
            :key="item.id"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详情描述：">
        <el-tabs
          v-if="value.item.itemChannels.length>0"
          :value="value.item.itemChannels[0].id"
          type="card"
        >
          <el-tab-pane
            :label="`${item.name}端详情`"
            :name="item.id"
            v-for="(item,index) in value.item.itemChannels"
            :key="index+item.id"
          >
            <tinymce
              style="margin:0 10px;"
              :id="`${item.id}Tinymce`"
              @openImageLibrary="openImageLibrary(item)"
              :imageList="selectImageList"
              :width="630"
              :height="300"
              v-model="item.description"
            ></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import ImageLibrary from "@/components/ImageLibrary";
import {
  getPropertySetList,
  checkItemCode,
  checkItemTitle
} from "@/api/mall/newProduct";
import { getCategoryTreeData } from "@/api/mall/mallClass";
import { getSupplierListWithPage } from "@/api/teamBuy";
import { regRadio, regPrice } from "@/utils/validate";
export default {
  name: "ProductInfoDetail",
  components: { Tinymce, ImageLibrary },
  props: {
    prevShow: Boolean,
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //商品标题异步校验
    let asyncProductTitle = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入商品标题"));
      } else {
        console.log(this, "666");
        if (this.isEdit && this.value.item.localTitle == value) {
          return callback();
        } else {
          let params = {
            title: this.value.item.title
          };
          checkItemTitle(params)
            .then(res => {
              if (res.result == true) {
                return callback();
              } else {
                return callback(new Error(res.message));
              }
            })
            .catch(err => {});
        }
      }
    };
    //商品code异步校验
    let asyncProductCode = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入商品编码"));
      } else {
        if (this.isEdit && this.value.item.localCode == value) {
          return callback();
        } else {
          let params = {
            code: this.value.item.code
          };
          checkItemCode(params)
            .then(res => {
              if (res.result == true) {
                return callback();
              } else {
                return callback(new Error(res.message));
              }
            })
            .catch(err => {});
        }
      }
    };
    //佣金数字校验
    let syncRatio = (rule, value, callback) => {
      if (this.value.item.ratio == "") {
        console.log("走到我拉");
        return callback();
      } else if (regRadio(this.value.item.ratio)) {
        return callback();
      } else {
        return callback(new Error("请输入0至100之间的数字"));
      }
    };
    //原价校验
    let syncSalePrice = (rule, value, callback) => {
      if (regPrice(this.value.item.salePrice)) {
        return callback();
      } else {
        return callback(new Error("请输入正确的商品价格"));
      }
    };
    //销售价校验
    let syncListPrice = (rule, value, callback) => {
      if (regPrice(this.value.item.listPrice)) {
        return callback();
      } else {
        return callback(new Error("请输入正确的商品价格"));
      }
    };
    return {
      rules: {
        title: [
          { required: true, message: "请输入商品标题", trigger: "blur" },
          { validator: asyncProductTitle, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入商品编码", trigger: "blur" },
          { validator: asyncProductCode, trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "请输入原价", trigger: "blur" },
          { validator: syncSalePrice, trigger: "blur" }
        ],
        listPrice: [
          { required: true, message: "请输入优惠价", trigger: "blur" },
          { validator: syncListPrice, trigger: "blur" }
        ],
        ratio: [{ validator: syncRatio, trigger: "blur" }],
        subTitle: [
          { required: true, message: "请输入商品副标题", trigger: "blur" }
        ],
        style: [{ required: true, message: "请输入商品款式", trigger: "blur" }],
        type: [{ required: true, message: "请选择商品类型", trigger: "blur" }],
        status: [
          { required: true, message: "请选择商品状态", trigger: "blur" }
        ],
        sketch: [
          { required: true, message: "请输入扼要描述", trigger: "blur" }
        ],
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" }
        ],
        checkedList: [
          { required: true, message: "请选择可用渠道", trigger: "blur" }
        ]
      },
      TinymceFlag: "", //富文本ID标识
      options: [],
      supplierOptions: [], //供应商备选项
      //级联数据源配置
      cascaderSet: {
        value: "id",
        label: "text",
        children: "children"
      },
      //级联数据源
      cascaderData: [],
      selectImageList: [], //本次已选择图片列表
      imageLibraryDialog: false,
      ImageList: [],
      hasEditCreated: false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      setOptions: [], //所属分类
      typeOptions: [
        { value: "1", label: "标准商品" },
        {
          value: "2",
          label: "赠品"
        }
      ],
      statusOptions: [
        {
          value: "1",
          label: "新建中"
        },
        {
          value: "2",
          label: "仓库中"
        }
      ],
      //渠道配置项
      checkAll: false,
      isIndeterminate: true,
      checkedList: [], //已选择的数组
      //商品富文本详情激活类型
      activeHtmlName: "pc"
    };
  },
  created() {
    this.getsupplier();
    getCategoryTreeData()
      .then(res => {
        this.cascaderData = res.result;
      })
      .catch(err => {});
    getPropertySetList()
      .then(res => {
        if (res.code == "200") {
          this.setOptions = res.result;
          if (this.value.setID != "") {
            this.setOptions.map(v => {
              if (v.id == this.value.setID) {
                return (this.value.propertysetName = v.name);
              }
            });
          }
        }
      })
      .catch(err => {});
    // if (this.value.item.checkedList.length > 0) {
    //   this.checkedList = [];
    //   this.value.item.checkedList.map(v => {
    //     this.checkedList.push(v);
    //   });
    // }
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    }
  },
  watch: {
    productId: function(newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.productCategoryId = newValue[1];
        this.value.productCategoryName = this.getCateNameById(
          this.value.productCategoryId
        );
      } else {
        this.value.productCategoryId = null;
        this.value.productCategoryName = null;
      }
    }
  },
  methods: {
    getsupplier() {
      getSupplierListWithPage({
        pageNum: 1,
        pageSize: 999999
      })
        .then(res => {
          if (res.code == "200") {
            this.supplierOptions = res.result.records;
          }
        })
        .catch(err => {});
    },
    //点击全选按钮
    handleCheckAllChange(val) {
      this.value.item.itemChannels = [];
      this.value.item.checkedList = [];
      if (val) {
        this.value.item.javaChannels.map(v => {
          this.$set(v, "channelId", v.id);
          this.value.item.itemChannels.push(v);
          this.value.item.checkedList.push(v.name);
        });
      }

      this.isIndeterminate = false;
    },
    //点击子项
    handleCheckedChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.value.item.javaChannels.length;
      this.isIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.value.item.itemChannelsGroup.length;
      this.value.item.itemChannels = [];
      this.value.item.javaChannels.map(v => {
        value.map(vv => {
          if (v.name == vv) {
            this.$set(v, "channelId", v.id);
            this.value.item.itemChannels.push(v);
          }
        });
      });
    },
    cascaderValueChange(val) {
      console.log(val);
    },
    //打开图片库组件
    openImageLibrary(item) {
      this.TinymceFlag = item.id;
      this.imageLibraryDialog = true;
      // console.log(this.imageLibraryDialog);
    },
    closeMyDialog() {
      this.imageLibraryDialog = false;
    },
    getSelectImage(image) {
      // this.selectImageList = image;
      image.map(v => {
        window.tinymce
          .get(`${this.TinymceFlag}Tinymce`)
          .insertContent(
            `<img class="wscnph" src="http://qn.gaoshanmall.cn/${v.imgUrl}" >`
          );
      });
    },
    setIDChange(val) {
      this.setOptions.map(v => {
        // console.log(v.id);
        // console.log(this.value.setID);
        if (v.id == this.value.setID) {
          this.value.propertysetName = v.name;
          console.log(this.value.propertysetName);
        }
      });
    },
    //处理编辑逻辑
    handleEditCreated() {
      if (this.value.productCategoryId != null) {
        this.selectProductCateValue.push(this.value.cateParentId);
        this.selectProductCateValue.push(this.value.productCategoryId);
      }
      this.hasEditCreated = true;
    },
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children
          });
        }
      });
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id
          });
        }
      });
    },
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.productCateOptions.length; i++) {
        for (let j = 0; i < this.productCateOptions[i].children.length; j++) {
          if (this.productCateOptions[i].children[j].value === id) {
            name = this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    //上一步
    handlePrev() {
      this.$emit("prevStep");
    },

    handleBrandChange(val) {
      let brandName = "";
      for (let i = 0; i < this.brandOptions.length; i++) {
        if (this.brandOptions[i].value === val) {
          brandName = this.brandOptions[i].label;
          break;
        }
      }
      this.value.brandName = brandName;
    }
  }
};
</script>

<style scoped>
.product_form .el-input {
  width: 400px;
}
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
