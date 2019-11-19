<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value.item"
      :rules="value.rules"
      ref="productForm"
      label-width="120px"
      style="width: 1220px;margin:0 auto;"
      size="small"
    >
      <el-form-item label="Meta title：">
        <el-input v-model="value.item.seoTitle"></el-input>
      </el-form-item>
      <el-form-item label=" Meta keywords：">
        <el-input v-model="value.item.seoKeywords"></el-input>
      </el-form-item>
      <el-form-item label="Meta description：">
        <el-input v-model="value.item.seoDescription"></el-input>
      </el-form-item>
      <el-form-item label=" Friendly URL：">
        <el-input v-model="value.item.customUrl"></el-input>
      </el-form-item>
     
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";

export default {
  name: "ProductInfoDetail",
  components: { Tinymce },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasEditCreated: false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [
        { value: "1", label: "标准商品" },
        {
          value: "2",
          label: "赠品"
        }
      ],
      statusOptions: [
        {
          value: "1",
          label: "赠品"
        }
      ],
      //商品富文本详情激活类型
      activeHtmlName: "pc",
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur"
          }
        ],
        subTitle: [
          { required: true, message: "请输入商品副标题", trigger: "blur" }
        ],
        productCategoryId: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        brandId: [
          { required: true, message: "请选择商品品牌", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入商品介绍", trigger: "blur" }
        ],
        requiredProp: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ]
      }
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
      if (this.value.item.keywords != "") {
        this.value.item.keywords = this.value.item.keywords.split(",");
      }

      this.$emit("prevStep");
    },
    //下一步
    handleNext() {
      this.$emit("nextStep");
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
