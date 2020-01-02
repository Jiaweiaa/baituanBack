 <!-- 添加图片 -->
<template>
  <div>
    <!-- 图片库组件 -->
    <imageLibrary
      @sendImageList="getSelectImage"
      :closeDialog="closeMyDialog"
      :isOpen="imageLibraryDialog"
    ></imageLibrary>
    <el-form
      :model="value.item"
      ref="productImgForm"
      label-width="130px"
      style="width: 1220px;margin:0 auto;"
      size="small"
    >
      <el-form-item label="为商品增加图片：">
        <el-button
          type="success"
          round
          size="medium"
          class="el-icon-upload"
          @click="openImageLibrary"
        >上传图片</el-button>
      </el-form-item>
      <el-form-item>
        <vuedraggable class="wrapper" v-model="value.item.itemImages">
          <el-table ref="dragTable" :data="value.item.itemImages" style="width: 100%">
            <el-table-column label="图片" width="180">
              <template slot-scope="scope">
                <img
                  style="width:100px;height:100px;"
                  :src="`http://static.ibaituan.cn/${scope.row.picUrl}`"
                />
              </template>
            </el-table-column>
            <el-table-column label="位置" width="180">
              <template slot-scope="scope">
                <i class="el-icon-rank"></i>
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="封面" width="180">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isCover" @change="chooseFm(scope.row.id)">是否为封面</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="是否可见" width="180">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.visiable">是否可见</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="deleteImg(scope.row.id)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </vuedraggable>
      </el-form-item>
      <!-- <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写功能属性</el-button>
        <el-button type="primary" size="medium" @click="createProduct('productForm')">完成</el-button>
      </el-form-item> -->
    </el-form>
    <!-- <div>aaa:{{oldList}}</div>
    <div>bbb:{{newList}}</div>-->
  </div>
</template>

<script>
import ImageLibrary from "@/components/ImageLibrary";
import Sortable from "sortablejs";
import { createOrUpdateItem } from "@/api/mall/newProduct";
import vuedraggable from "vuedraggable";
export default {
  name: "",
  data() {
    return {
      imageLibraryDialog: false,
      oldList: [],
      newList: [],
      sortable: null
    };
  },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  components: { ImageLibrary, vuedraggable },
  updated() {
    console.log(this.value.item.itemImages);
  },
  methods: {
    /**
     * @商品图片排序
     */
    // imageSort() {
    //   if (
    //     document.querySelectorAll(".el-table__body-wrapper > table > tbody")[1]
    //   ) {
    //     const el = document.querySelectorAll(
    //       ".el-table__body-wrapper > table > tbody"
    //     )[1];
    //     this.sortable = Sortable.create(el, {
    //       ghostClass: "sortable-ghost", // Class name for the drop placeholder,
    //       setData: function(dataTransfer) {
    //         dataTransfer.setData("Text", "");
    //         // to avoid Firefox bug
    //         // Detail see : https://github.com/RubaXa/Sortable/issues/1012
    //       },

    //       onEnd: evt => {
    //         console.log(evt, "888");
    //         const targetRow = this.value.item.itemImages.splice(
    //           evt.oldIndex,
    //           1
    //         )[0];
    //         this.value.item.itemImages.splice(evt.newIndex, 0, targetRow);
    //         // for show the changes, you can delete in you code
    //         const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
    //         this.newList.splice(evt.newIndex, 0, tempIndex);

    //         // let finalList = [];
    //         // this.newList.map(v => {
    //         //   this.value.item.itemImages.map(vv => {
    //         //     if (v == vv.id) {
    //         //       finalList.push(vv);
    //         //     }
    //         //   });
    //         // });

    //         // this.value.item.itemImages = finalList;
    //         // console.log(finalList);
    //         this.value.item.itemImages.map((v, index) => {
    //           if (index == 0) {
    //             v.isCover = true;
    //             // v.isCover = true;
    //           } else {
    //             // v.isCover = false;
    //             v.isCover = false;
    //           }
    //           // console.log(v);
    //         });
    //       }
    //     });
    //   }
    // },
    //提交创建商品
    // createProduct(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (this.value.item.itemImages.length <= 0) {
    //       this.$message("请选择至少一张图片");
    //     } else {
    //       const loading = this.$loading({
    //         lock: true,
    //         text: "等待服务器响应",
    //         spinner: "el-icon-loading",
    //         background: "rgba(0, 0, 0, 0.7)"
    //       });
    //       let selectObj = {};
    //       this.value.item.itemImages.map(v => {
    //         if (v.isCover) {
    //           selectObj = Object.assign({}, v);
    //         }
    //       });
    //       this.value.item.itemImages.splice(
    //         this.value.item.itemImages.findIndex(
    //           item => item.id === selectObj.id
    //         ),
    //         1
    //       );
    //       this.value.item.itemImages = [
    //         selectObj,
    //         ...this.value.item.itemImages
    //       ];
    //       this.value.item.itemImages.map((image, index) => {
    //         image.position = index + 1;
    //       });
    //       createOrUpdateItem(this.value)
    //         .then(res => {
    //           loading.close();
    //           this.$message(res.message);
    //           // console.log(res);
    //           if (res.code == "200") {
    //             // console.log(this.value.item.ivType);
    //             if (this.value.item.id == "") {
    //               this.$router.push({
    //                 path: "/mall/newProduct"
    //               });
    //             } else {
    //               this.$router.push({
    //                 path: "/mall/warehouseProduct"
    //               });
    //             }
    //           }
    //         })
    //         .catch(err => {
    //           loading.close();
    //         });
    //     }
    //   });
    // },
    closeMyDialog() {
      this.imageLibraryDialog = false;
    },
    //打开图片库组件
    openImageLibrary() {
      this.imageLibraryDialog = true;
      // console.log(this.imageLibraryDialog);
    },
    //获取图片库选择的图片
    getSelectImage(image) {
      image.map(v => {
        this.value.item.itemImages.push(v);
      });
      this.value.item.itemImages.map((v, index) => {
        this.$set(v, "picUrl", v.imgUrl); //图片地址
        this.$set(v, "position", index + 1); //排序号
        this.$set(v, "isCover", false); //是否封面
        this.$set(v, "visiable", true); //是否可见
        if (index == 0) {
          v.isCover = true;
        }
      });
      this.value.item.itemImages = Array.from(
        new Set(this.value.item.itemImages)
      ); //数组去重
      this.oldList = this.value.item.itemImages.map(v => v.id);
      this.newList = this.oldList.slice();
      // this.$nextTick(() => {
      //   this.imageSort();
      // });
    },
    chooseFm(id) {
      // console.log(id);
      let selectObj = {};
      this.value.item.itemImages.map(v => {
        if (v.id == id) {
          v.isCover = true;
          selectObj = Object.assign({}, v);
        } else {
          v.isCover = false;
        }
      });
      this.value.item.itemImages.splice(
        this.value.item.itemImages.findIndex(item => item.id === selectObj.id),
        1
      );
      this.value.item.itemImages = [selectObj, ...this.value.item.itemImages];
      this.value.item.itemImages.map((image, index) => {
        image.position = index + 1;
      });
    },
    deleteImg(id) {
      this.value.item.itemImages.splice(
        this.value.item.itemImages.findIndex(item => item.id === id),
        1
      );
    },
    //上一步
    handlePrev() {
      this.$emit("prevStep");
    },
    
  }
};
</script>
<style lang='scss' scoped>
</style>
