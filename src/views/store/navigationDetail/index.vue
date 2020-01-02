<!-- 编辑菜单 -->
<template>
  <div>
    <el-card class="box-card">
      <el-form label-width="140px" :model="editForm" ref="editForm">
        <el-form-item label="菜单名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="120px" prop="icon">
          <el-upload
            class="avatar-uploader"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :show-file-list="false"
            :on-success="handleChange"
            :before-upload="beforeUpload"
          >
            <el-image
              v-if="editForm.icon"
              :src="`http://static.ibaituan.cn/${editForm.icon}?imageMogr2/thumbnail/180x180`"
              class="avatar"
            ></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-switch v-model="editForm.status" active-text="可用" inactive-text="不可用"></el-switch>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="1">商品</el-radio>
            <el-radio :label="2">URL连接</el-radio>
            <el-radio :label="3">纯文本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Firend URL">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="MetaTitle">
          <el-input v-model="editForm.seoTitle"></el-input>
        </el-form-item>
        <el-form-item label="Meta keywords">
          <el-input v-model="editForm.seoKeywords"></el-input>
        </el-form-item>
        <el-form-item label="MetaDescription">
          <el-input v-model="editForm.seoDescription"></el-input>
        </el-form-item>
        <el-form-item label="分类所含商品集合">
          <div class="box">
            <div>
              <span>分类</span>
              <div style="float:right;">
                <el-button type="primary" @click="openDialog()">新增</el-button>
              </div>
            </div>
            <div>
              <div v-for="item in editForm.categoryList" :key="item.id" class="select-item">
                {{item.name}}
                <i class="el-icon-close" @click="deleteId(item)"></i>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div style="width:40%; margin:0 auto;">
        <el-button icon="el-icon-delete" @click="back()" type="danger">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="saveForm()">保存</el-button>
      </div>
    </el-card>
    <el-dialog title="商品分类树" :visible.sync="dialogFormVisible">
      <el-tree
        show-checkbox
        :data="listData"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        :highlight-current="true"
        :check-on-click-node="true"
        :filter-node-method="filterNode"
        ref="tree"
        @check-change="getChecked"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }" style="width: 100%;">
          <i :class="node.icon"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSelect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { PcCookie, enums } from "@/utils";
import { getCategoryTreeData } from "@/api/mall/mallClass";
import { insertOrEditStoreNavigation } from "@/api/store/navigation";
export default {
  name: "navigationDetail",
  data() {
    return {
      editForm: {
        name: "",
        status: true,
        urlType: 1,
        url: "",
        type: 1,
        seoTitle: "",
        seoKeywords: "",
        seoDescription: "",
        categoryIds: "",
        categoryList: [],
        icon: ""
      },
      imgSrcBasic: "",
      dialogFormVisible: false,
      //分类关联树表数据
      listData: [],
      defaultExpand: true, //是否默认展开节点
      //tree数据渲染配置项
      defaultProps: {
        children: "children",
        label: "text"
      }
    };
  },
  methods: {
    // 上传成功提示
    handleChange(response, file) {
      if (response.code == 200) {
        this.$set(this.editForm, "icon", response.result);
        this.$notify({
          title: response.message,
          type: "success"
        });
      }
    },
    // 上传限制
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message({
          showClose: true,
          message: "只能上传jpeg,gif,png,bmp,pdf等类型的图片文件",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          showClose: true,
          message: "图片大小不超过2M!",
          type: "warning"
        });
      }
      if ((isJPG || isBMP || isGIF || isPNG) && isLt2M) {
        this.typeBok = true;
      } else {
        this.typeBok = false;
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
    back() {
      this.$router.go(-1); //返回上一层
    },
    /**
     * @打开模态框
     */
    openDialog() {
      let keys = [];
      
      // console.log(this.editForm);
      // debugger;
      if(this.editForm.categoryList==null){
        this.editForm.categoryList=[]
      }
      if (this.editForm.categoryList.length > 0) {
        this.editForm.categoryList.map(v => {
          keys.push(v.id);
        });
      }
      
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys);
      });
    },
    /**
     * @获取树表数据
     */
    getData() {
      this.loding = true;
      getCategoryTreeData()
        .then(res => {
          if (res.code == "200") {
            this.listData = res.result;
          }
          this.loding = false;
        })
        .catch(err => {
          this.loding = false;
        });
    },
    /**
     * @前端过滤节点
     */
    filterNode(value, data) {
      console.log(data);
      //显示符合要求的节点
      if (!value) return true;
      return data.text.includes(value);
    },
    /**
     * @获取所有被选中节点的id
     */
    getChecked() {
      //获取所有被选中节点及半选中节点的ID
      console.log(this.$refs.tree.getCheckedKeys());

      // console.log(this.$refs.tree.getHalfCheckedKeys());
    },
    /**
     * @前端处理被选中的节点
     */

    submitSelect() {
      let selectArr = this.$refs.tree.getCheckedNodes();
      this.editForm.categoryList = [];
      this.editForm.categoryList.map(item => {
        selectArr.splice(selectArr.findIndex(v => v.id == item.id), 1);
      });
      selectArr.map(v => {
        this.$set(v, "name", v.text);
        this.editForm.categoryList.push(v);
      });
      this.dialogFormVisible = false;

      // this.editForm.categoryList.push([...selectArr]);
      // console.log(this.editForm.categoryList);
    },
    /**
     * @删除被选中的节点
     */

    deleteId(item) {
      this.editForm.categoryList.splice(
        this.editForm.categoryList.findIndex(v => v.id == item.id),
        1
      );
    },
    /**
     * @保存
     */

    saveForm() {
      let params = Object.assign({}, this.editForm);
      params.categoryIds = "";
      params.categoryList.map(v => {
        params.categoryIds += `${v.id},`;
      });
      
      params.categoryIds = params.categoryIds.substring(
        0,
        params.categoryIds.length - 1
      );
      if (params.status == true) {
        params.status = 1;
      } else {
        params.status = 0;
      }
      console.log(params);
      insertOrEditStoreNavigation(params)
        .then(res => {
          if (res.code == "200") {
            this.$message(res.message);
            this.$router.push({
              path: "/store/navigationTemplate/navigation"
            });
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.imgSrcBasic = process.env.BASE_API;
    console.log(this.$route.query.flag);
    //添加主菜单不做处理
    if (this.$route.query.flag == 0) {
    }
    //编辑菜单得处理
    if (this.$route.query.flag == 1) {
      if (window.sessionStorage.getItem("navagation_form")) {
        let sourceForm = Object.assign(
          {},
          JSON.parse(window.sessionStorage.getItem("navagation_form"))
        );
        console.log(sourceForm, 222);
        this.editForm = {};
        this.editForm = Object.assign({}, sourceForm);
        this.editForm.status == 1
          ? (this.editForm.status = true)
          : (this.editForm.status = false);
        console.log(this.editForm.status);
      } else {
        alert("FORM表单cookie被清除");
      }
    }
    //添加子菜单 设置parentId为上个页面被选中的节点id
    if (this.$route.query.flag == 2) {
      if (window.sessionStorage.getItem("navagation_form")) {
        let sourceForm = Object.assign(
          {},
          JSON.parse(window.sessionStorage.getItem("navagation_form"))
        );
        this.editForm.parentId = sourceForm.id;
        console.log(this.editForm);
      } else {
        alert("FORM表单cookie被清除");
      }
    }
    // console.log(this.editForm);
    this.getData();
  }
};
</script>
<style lang='scss' scoped>
.box-card {
  width: 80%;
  margin: 50px auto;
}
.box {
  padding: 20px;
  background: #ccc;
}
.select-item {
  margin-right: 40px;
  padding-left: 10px;
  border-top: 1px solid #000;
  background: #fff;
  & i {
    float: right;
    margin-top: 15px;
    margin-right: 10px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
