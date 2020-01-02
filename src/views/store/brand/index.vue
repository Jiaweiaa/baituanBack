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
        弹层列表
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="品牌名称" label-width="200px" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="200px" prop="description">
          <el-input v-model="dialogForm.description"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" label-width="200px" prop="logo">
          <el-upload
            ref="upload"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :beforeUpload="beforeUpload"
            :show-file-list="false"
            :on-success="handleChange"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div>
              <img
                v-if="dialogFormVisible"
                style="width: 50px; height: 50px;"
                :src="`http://static.ibaituan.cn/${dialogForm.logo}`"
                alt
              >
            </div>

            <div slot="tip" class="el-upload__tip">只能上传单个jpeg,gif,png,bmp等类型的图片文件，且不超过2M。</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否启用" label-width="200px" prop="status">
          <el-switch
            v-model="dialogForm.status"
            :activeValue="1"
            :inactiveValue="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
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
  queryStoreBrandList,
  insertOrEditBrand,
  updateBrandStatus,
  deleteBrand
} from "@/api/store/brand/index";

export default {
  name: "brand",
  data() {
    return {
      //类型
      typeBok: true,

      // 图片源
      imgSrcBasic: "",

      // 搜索table渲染的数据
      searchModel: [
        {
          input: [
            {
              placeholder: "请输入品牌名称",
              inputModel: "name",
              labelName: "品牌名称",
              model: "",
              type: "el-input"
            },
            {
              inputModel: "status",
              labelName: "是否可用",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "全部",
                  status: ''
                },
                {
                  name: "启用",
                  status: 1
                },
                {
                  name: "禁用",
                  status: 0
                }
              ]
            }
          ],
          button: [
            {
              type: "success",
              func: "addBtn",
              name: "新增品牌"
            },
            {
              type: "primary",
              func: "searchBtn",
              name: "搜索"
            }
          ]
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "id",
          label: "ID"
        },
        {
          showLabel: true,
          // prop: 'status',
          label: "Logo",
          hasPerm: "sys:user:editStatus",
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <img
                style="width: 50px; height: 50px;"
                src={"http://static.ibaituan.cn/"+row.logo }
              />
            );
          }
        },
        {
          prop: "name",
          label: "品牌名称"
        },
        {
          showLabel: true,
          prop: "status",
          label: "是否可用",
          hasPerm: "sys:user:editStatus",
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <p onClick={e => this.openStatus(e, row)}>
                <el-switch
                  activeValue={1}
                  inactiveValue={0}
                  v-model={row.status}
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </p>
            );
          }
        },
        {
          width: "300px",
          button: true,
          label: "操作",
          group: [
            {
              // you can props => type size icon disabled plain
              name: "编辑",
              type: "warning",
              icon: "el-icon-edit",
              plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            },
            {
              name: "删除",
              type: "danger",
              icon: "el-icon-delete",
              hasPerm: "sys:user:deleteUser",
              disabled: false,
              onClick: row => {
                this.del(row);
              }
            }
          ]
        }
      ],
      searchParams: {
        name: "",
        status: "",
        pageSize: 10,
        pageNum: 1
      },
      tableData: [],
      searchData: {},
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        status: 0
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },

      // 弹层
      //  弹窗标题
      dialogTitle: "",
      dialogForm: {
        name: "",
        description: "",
        logo: "",
        fileList: [],
        status:0
      },
      btnLoading: false,
      dialogFormRules: {
        name: [{ required: true, message: "请输入品牌名称!", trigger: "blur" }],
        description: [
          { required: true, message: "请输入品牌描述!", trigger: "blur" }
        ],
        logo: [{ required: true, message: "请输入品牌logo!", trigger: "blur" }]
      },
      dialogFormVisible: false
    };
  },
  components: {
    searchView,
    CommonTable
  },
  mounted() {
    this.imgSrcBasic = process.env.BASE_API;
  },
  methods: {
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
        this.$notify({
          title: response.message,
          type: "success"
        });
        this.dialogForm.logo = response.result;
      }
    },

    // 获取列表
    getList() {
      this.options.loading = true;
      let params = Object.assign(
        {
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        },
        this.searchData
      );
      queryStoreBrandList(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    // 更改品牌状态
    openStatus(e, row) {
      let inBok = Object.assign({}, row);
      let params = {
        id: inBok.id
      };
      updateBrandStatus(params)
        .then(res => {
          if (res.code == 200) {
            this.$notify({
              title: res.message,
              type: "success"
            });
          } else {
            this.getList();
          }
        })
        .catch(() => {
          this.getList();
        });
      e.cancelBubble = true; // 停止冒泡，否则会触发 row-click
    },

    // 编辑和新增点击
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          insertOrEditBrand(this.dialogForm)
            .then(res => {
              this.btnLoading = false;
              if (res.code == 200) {
                this.cancelDialog();
                this.getList();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    // 编辑新增点击取消
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogForm = {
        roleName: ""
      };
      this.$refs.upload.clearFiles();
      this.$refs["dialogForm"].resetFields();
    },

    // 列表页数更改
    handleCurrentChange(val) {
      this.searchParams.pageNum = val;
      this.getList();
    },
    // 列表条数更改
    handleSizeChange(val) {
      this.searchParams.pageSize = val;
      this.getList();
    },

    // 编辑调取方法
    edit(val) {
      this.formFun(val, "edit");
    },
    // 新增调取方法
    addBtn() {
      this.formFun("", "add");
    },
    // 编辑新增公共函数
    formFun(val, type) {
      if (type == "add") {
        this.dialogTitle = "新增";
      } else {
        this.dialogTitle = "编辑";
        this.dialogForm = Object.assign({}, val);
        // this.dialogForm.logo = `http://pps0h02bj.bkt.clouddn.com/${val.logo}`;
        // this.dialogForm = Object.assign({
        //   fileList: [{
        //     name: val.logo,
        //     url:  'http://pps0h02bj.bkt.clouddn.com/' + val.logo,
        //   }]
        // }, val)
      }
      // console.log(this.dialogForm)
      this.dialogFormVisible = true;
    },

    // 搜索方法
    searchBtn(val) {
      this.searchData = val;
      this.getList();
    },

    // 删除操作
    del(val) {
      this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {
          id: val.id
        };
        deleteBrand(params).then(res => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            let params = Object.assign(
              {
                pageNum: this.pagination.pageIndex,
                pageSize: this.pagination.pageSize
              },
              this.searchData
            );
            queryStoreBrandList(params).then(res => {
              if (
                res.result.records.length <= 0 &&
                this.pagination.pageIndex > 1
              ) {
                this.pagination.pageIndex--;
                this.getList();
              } else {
                this.getList();
              }
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    }
  }
};
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
