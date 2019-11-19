<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value.item"
      :rules="rules"
      ref="productSelectForm"
      style="width: 1220px;margin:0 auto;margin-top:200px;"
    >
      <el-form-item label="选择所属分类：" prop="setID" style="text-align: center">
        <el-cascader
          style="width:400px;"
          ref="cascader"
          expand-trigger="click"
          :options="cascaderData"
          :props="cascaderSet"
          v-model="value.item.setID"
          clearable
          @change="cascaderValueChange"
        ></el-cascader>
      </el-form-item>
      <div style="height:100px;"></div>
      <!-- <el-form-item style="text-align: center" class="buttons">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品信息</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
import { getCategoryTreeData } from "@/api/mall/mallClass";
import { readyCreateItemData } from "@/api/mall/newProduct";
export default {
  name: "ProductSelect",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //级联数据源配置
      cascaderSet: {
        value: "id",
        label: "text",
        children: "children"
      },
      //级联数据源
      cascaderData: [],
      rules: {
        setID: [{ required: true, message: "请选择商品分类", trigger: "blur" }]
      }
    };
  },
  created() {
    getCategoryTreeData()
      .then(res => {
        this.cascaderData = res.result;
      })
      .catch(err => {});
  },
  mounted() {
    //  Object.assign(this.$data, this.$options.data());
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
    //根据分类ID获取label
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.id == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    //级联选择发生改变
    cascaderValueChange(val) {
      this.value.item.defaultItemCategoryId = val[val.length - 1];
      this.value.item.itemCategoryIds = [];
      this.value.item.itemCategoryIds.push(
        this.value.item.defaultItemCategoryId
      ); //商品分类ID
      let categoryNames = this.getCascaderObj(
        this.value.item.setID,
        this.cascaderData
      );
      this.value.item.categoryNames =
        categoryNames[categoryNames.length - 1].text; //商品分类名称
      this.value.item.itemCategorys = [];
      this.value.item.itemCategorys.push(
        categoryNames[categoryNames.length - 1]
      ); //商品分类集合
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
    submitForm() {
      // console.log(this.$refs);
      return this.$refs.productSelectForm.validate();
    },
    handleNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          readyCreateItemData({
            categoryId: this.value.item.defaultItemCategoryId
          })
            .then(res => {
              if (res.code == "200") {
                this.value.item.javaChannels = res.result.channelList;
                this.value.item.memberList = res.result.lvGroupList;
                let channelList = [];
                let itemChannels = [];
                this.value.item.javaChannels.map(v => {
                  this.$set(v, "channelId", v.id);
                  channelList.push(v.name);
                  itemChannels.push(v);
                });
                itemChannels.map(channel => {
                  channel.description = "";
                });
                this.$emit("checkedList", channelList, itemChannels);
              }
              if (res.result.salePropertyMap.thList.length > 0) {
                this.$emit("nextStep");
              } else {
                this.$notify.error({
                  title: "重要提示",
                  message: "该商品分类未关联属性集,请去商品分类页面关联"
                });
              }
            })
            .catch(err => {});
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
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
