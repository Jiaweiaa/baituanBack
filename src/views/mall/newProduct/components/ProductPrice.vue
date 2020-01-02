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
      ref="productPriceForm"
      label-width="120px"
      style="width: 1220px;margin:0 auto;"
      size="small"
      class="product_form"
    >
      <!-- <el-form-item label="原价：" prop="salePrice">
        <el-input v-model="value.item.salePrice" clearable>
          <template slot="prepend">￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="优惠价：" prop="listPrice">
        <el-input v-model="value.item.listPrice" clearable>
          <template slot="prepend">￥</template>
        </el-input>
      </el-form-item> -->
    
      <el-form-item label="促销ICON：">
        <el-checkbox v-model="value.item.showPromotionIcon">显示"促销"ICON在商品列表和详情页</el-checkbox>
        <div v-show="value.item.showPromotionIcon">
          <div>
            <el-button plain class="el-icon-picture" @click="imageLibraryDialog=true">上传图片</el-button>
          </div>
          <img
            style="width:100px;height:100px;margin-top:10px;"
            :src="this.GLOBAL.imgUrl+value.item.iconUrl"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImageLibrary from "@/components/ImageLibrary";
import { regPrice } from "@/utils/validate";
export default {
  name: "ProductPriceDetail",
  components: { ImageLibrary },
  props: {
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
      
      },
      imageLibraryDialog: false, //图片库组件
      hasEditCreated: false
    };
  },
  created() {},
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
    }
  },
  methods: {
    closeMyDialog() {
      this.imageLibraryDialog = false;
    },
    getSelectImage(image) {
      this.value.item.iconUrl = image[0].imgUrl;
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
