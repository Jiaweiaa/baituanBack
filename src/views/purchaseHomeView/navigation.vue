<template>
  <div class="labberConcessionsBox">
    <!--
         wjw
    
         顶部搜索
    -->
    <div style="margin-bottom:15px;">
      <searchView :searchModel="searchModel"></searchView>
    </div>
    <!--
			图片查看
    -->
    <el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
      <div style="text-align: center;">
        <img width="360" :src="'http://static.ibaituan.cn/'+photoUrl" alt />
      </div>
    </el-dialog>

    <!--
      列表组件
    -->
    <CommonTable
      :columns="columns"
      :dataSource="tableData"
      :options="options"
      :fetch="getList"
      :pagination="pagination"
    />

    <!--
			编辑分类
    -->
    <el-dialog title="热门导航" :visible.sync="dialogFormVisible" :before-close="cancelDialog" >
      <el-form
      v-loading="loading"
        :model="dialogForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dialogFormRules"
        ref="dialogForm"
      >
        <el-form-item label="分类标题" label-width="160px" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类logo" label-width="160px" prop="logo">
          <el-upload
            class="avatar-uploader"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :show-file-list="false"
            :on-success="handleChange"
            :before-upload="beforeUpload"
          >
            <img
              v-if="dialogForm.logo"
              :src="`http://static.ibaituan.cn/${dialogForm.logo}?imageMogr2/thumbnail/180x180`"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="导航菜单" label-width="160px" prop="codes">
          <el-tree
            :data="catoryTree"
            show-checkbox
            ref="tree"
            node-key="id"
            :check-strictly="true"
            :default-checked-keys="[defaultSelect]"
            @check-change="checkChange"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item
          v-show="goodsList.length > 0"
          label="已选择的关联的商品分类"
          label-width="160px"
          prop="list"
        >
          <span>已关联的商品分类</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import {
  getIndexCategory,
  editIndexCategory,
  getCategoryByCode,
  deleteIndexCategory,
  getStoreNavigationTree
} from "@/api/homeView/index";
export default {
  name: "name",
  data() {
    return {
      loading:false,
      // 搜索table渲染的数据
      searchModel: [
        {
          input: [],
          button: [
            {
              type: "success",
              func: "addBtn",
              name: "新增商品分类"
            }
          ]
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "title",
          label: "标题",
          render: (row, index) => {
            return <span> {row.name}</span>;
          }
        },
        {
          prop: "title",
          label: "所关联的导航",
          render: (row, index) => {
            return <span> {row.category ? row.category.name : ""}</span>;
          }
        },
        {
          prop: "img",
          label: "logo",
          render: (row, index) => {
            return (
              <img
                on-click={() => this.lookThis(row.logo)}
                style="width: 50px; height: 50px; cursor: pointer;"
                src={"http://static.ibaituan.cn/" + row.logo}
              />
            );
          }
        },
        {
          button: true,
          label: "操作",
          group: [
            {
              name: "编辑",
              icon: "el-icon-edit",
              disabled: false,
              onClick: row => {
                this.addBtn(row);
              }
            },
            {
              name: "删除",
              type: "danger",
              icon: "el-icon-delete",
              disabled: false,
              onClick: row => {
                this.del(row);
              }
            }
          ]
        }
      ],
      tableData: [],
      searchData: {},
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 5
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },

      btnLoading: false,
      dialogTitle: "",
      // 编辑新增用户
      dialogForm: {
        list: [],
        name: "",
        logo: "",
        code: "",
        type: 2
      },
      dialogFormRules: {
        name: {
          required: true,
          message: "请输入商品分类名称",
          trigger: "blur"
        },
        logo: {
          required: true,
          message: "请上传logo",
          trigger: "blur"
        }
      },
      dialogFormVisible: false,
      catoryTree: [],
      //树节点配置
      defaultProps: {
        children: "nodes",
        label: "name"
      },
      photoVisible: false,
      photoUrl: "",
      goodsLoading: false,
      goodsList: [],
      imgSrcBasic: "",
      selectOrg: {
        orgsid: []
      },
      defaultSelect:"" //回显时默认选中的节点
    };
  },
  created() {
    this.imgSrcBasic = process.env.BASE_API;
  },
  components: {
    searchView,
    CommonTable
  },
  methods: {
    // 分类变更
    codeChange() {
      this.goodsList = [];
      this.dialogForm.list = [];
    },
    //节点选中状态发生变化方法
    checkChange(data, checked, indeterminate) {
      // console.log(data, "数据");
      // console.log(checked, "选中状态");
      // console.log(indeterminate, "子树中选中状态");
      // 获取当前选择的id在数组中的索引
      const indexs = this.selectOrg.orgsid.indexOf(data.id);
      // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
        console.log("only one");
        this.$message({
          message: "切换选中节点成功",
          type: "success",
          showClose: true
        });
        // 设置之前已选择的节点为false 很重要
        // console.log(this.selectOrg.orgsid);
        this.$refs.tree.setChecked(this.selectOrg.orgsid[0], false);
        this.selectOrg.orgsid = [];
        this.selectOrg.orgsid.push(data.id);
      } else if (this.selectOrg.orgsid.length === 0 && checked) {
        // 发现数组为空 并且是已选择
        // 防止数组有值，首先清空，再push
        this.selectOrg.orgsid = [];
        this.selectOrg.orgsid.push(data.id);
      } else if (
        indexs >= 0 &&
        this.selectOrg.orgsid.length === 1 &&
        !checked
      ) {
        // 再次直接进行赋值为空操作
        this.selectOrg.orgsid = [];
      }
    },
    // 获取列表
    getList() {
      this.options.loading = true;
      getIndexCategory({
        type: 2
      }).then(res => {
        this.tableData = res.result;
        this.options.loading = false;
      });
    },
    //获取商品导航树表
    getCatoryTree() {
      this.loading = true;
      getStoreNavigationTree()
        .then(res => {
          this.loading = false;
          if (res.code == "200") {
            this.catoryTree = res.result.nodes;
          } else {
            this.$message(res.message);
            this.dialogFormVisible = false;
          }
        })
        .catch(err => {
          this.$message("网络错误");
          this.dialogFormVisible = false;
          this.loading = false;
        });
    },

    // 查看图片
    lookThis(val) {
      this.photoUrl = val;
      this.photoVisible = true;
    },

    // 新增
    addBtn(val) {
      if (val) {
        this.dialogForm.id = val.id;
        this.dialogForm.name = val.name;
        this.dialogForm.logo = val.logo;
        this.defaultSelect = "";
        this.selectOrg.orgsid = [];
        if(val.category!=null){
          this.defaultSelect = val.category.id;
          this.selectOrg.orgsid.push(val.category.id);
        }
      } else {
        this.dialogForm.id = "";
        this.dialogForm.name = "";
        this.dialogForm.logo = "";
        this.defaultSelect = "";
      }
      this.dialogFormVisible = true;
      // this.getGoods();
      this.getCatoryTree();
    },

    // 获取商品
    getGoods() {
      this.goodsLoading = true;
      if (this.dialogForm.code) {
        getCategoryByCode({
          code: this.dialogForm.code
        }).then(res => {
          this.goodsList = [];
          if (res.code == 200 && res.result != null) {
            this.goodsList.push(res.result);
            this.dialogForm.list.push(res.result.code);
          } else {
            this.$message.error("分类编码无效");
          }
          this.goodsLoading = false;
        });
      } else {
        this.$message.error("请输入商品编码");
        this.goodsLoading = false;
      }
    },

    // 取消编辑
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogForm = {
        list: [],
        name: "",
        logo: "",
        code: "",
        type: 2
      };
      this.$refs["dialogForm"].resetFields();
    },
    // 编辑
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.selectOrg.orgsid.length > 0) {
            this.dialogForm.categoryId = this.selectOrg.orgsid[0];
            editIndexCategory(this.dialogForm).then(res => {
              if (res.code == 200) {
                this.cancelDialog();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.getList();
              } else {
                this.$notify.error({
                  title: res.message,
                  offset: 100
                });
              }
            });
          } else {
            this.$message("请关联一个导航节点");
          }
        } else {
          this.$notify.error({
            title: "错误",
            message:
              "请确认信息输入无误没有遗漏,如果没有选择商品分类请输入正确的分类编码获取分类并勾选"
          });
        }
      });
    },
    // 删除
    del(val) {
      this.$confirm("此操作将从首页删除该分类是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: val.id
          };
          deleteIndexCategory(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
          message: "图片大小不超过2M",
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
    // 上传成功提示
    handleChange(response, file) {
      if (response.code == 200) {
        this.dialogForm.logo = response.result;
        this.$notify({
          title: response.message,
          type: "success"
        });
      }
    }
  }
};
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
	.avatar
		width: 178px
		height: 178px
		display: block
	.avatar-uploader .el-upload
		border: 1px dashed #d9d9d9
		border-radius: 6px
		cursor: pointer
		position: relative
		overflow: hidden
	.avatar-uploader .el-upload:hover
		border-color: #409EFF
	.avatar-uploader-icon
		font-size: 28px
		color: #8c939d
		width: 178px
		height: 178px
		line-height: 178px
		text-align: center
</style>
