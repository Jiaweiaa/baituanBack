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
      新增/编辑模态框模态框
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="图片分组" label-width="200px" prop="groupId">
          <el-select v-model="dialogForm.groupId" placeholder="请选择">
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button class="el-icon-plus" type="text" @click="innerAddVisible=true">新建分组</el-button>
          <el-button class="el-icon-edit" type="text" @click="innerEditVisible=true">编辑分组</el-button>
        </el-form-item>
        <el-form-item label="图片名称" label-width="200px" >
          <el-input placeholder="请输入图片名称" style="width:300px;" v-model="dialogForm.imgName" clearable></el-input>
        </el-form-item>
        <el-form-item label="上传图片" label-width="200px">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            drag
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :beforeUpload="beforeUpload"
            :show-file-list="false"
            :on-success="handleChange"
            list-type="picture"
          >
            <div slot="tip" class="el-upload__tip">1. 图片单张大小支持2M以下。</div>
            <div slot="tip" class="el-upload__tip">2.支持的图片格式：jpg、jpeg、png、gif</div>
            <div slot="tip" class="el-upload__tip">3. 支持将照片拖拽进虚框，单次最多可选300张</div>
            <div>
              <img
                v-if="dialogForm.imgUrl!=''"
                :src="`http://static.ibaituan.cn/${dialogForm.imgUrl}`"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 新增分组模态框 -->
      <el-dialog width="70%" title="新建分组" :visible.sync="innerAddVisible" append-to-body center>
        <el-form :model="addGroupForm" status-icon :rules="addGroupFormRules" ref="addGroupForm">
          <el-form-item label="分组类型" label-width="200px" prop="type">
            <el-select v-model="addGroupForm.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组名称" label-width="200px" prop="name">
            <el-input style="width:130px;" size="small" v-model="addGroupForm.name" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveGroup(addGroupForm)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑分组模态框 -->
      <el-dialog
        width="40%"
        title="编辑分组"
        :visible.sync="innerEditVisible"
        append-to-body
        class="contentCt"
      >
        <el-table :data="selectOptions" style="width: 80%">
          <el-table-column label="分组类型" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.type == '0'">其他</div>
              <div v-else>商品</div>
            </template>
          </el-table-column>
          <el-table-column label="分组名称" width="280">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input
                  class="edit-input"
                  style="width:130px;"
                  size="small"
                  v-model="scope.row.name"
                  clearable
                ></el-input>
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(scope.row)"
                >cancel</el-button>
              </template>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isDefault"
                @click="deleteGroup(scope.row)"
                type="danger"
                icon="el-icon-delete"
                size="small"
                circle
              ></el-button>

              <span v-if="!scope.row.isDefault">
                <el-button
                  v-if="scope.row.edit"
                  type="success"
                  @click="saveGroup(scope.row)"
                  size="small"
                  circle
                  icon="el-icon-circle-check-outline"
                ></el-button>
                <el-button
                  v-else
                  type="primary"
                  @click="scope.row.edit=!scope.row.edit"
                  size="small"
                  circle
                  icon="el-icon-edit"
                ></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
  queryImagePage,
  deleteImageById,
  getImgGroupList,
  saveOrEditStoreImage,
  deleteImgGroup,
  insertOrEditImageGroup
} from "@/api/resources/picture";

export default {
  data() {
    return {
      // 搜索table渲染的数据
      searchModel: [
        {
          input: [
            {
              placeholder: "请输入分组名称",
              inputModel: "name",
              labelName: "分组名称",
              model: "",
              type: "el-input",
            },
            {
              placeholder: "请输入图片名称",
              inputModel: "imgName",
              labelName: "图片名称",
              model: "",
              type: "el-input"
            },
            {
              inputModel: "type",
              labelName: "分组类型",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "全部",
                  status: ""
                },
                {
                  name: "商品",
                  status: 1
                },
                {
                  name: "其他",
                  status: 0
                }
              ]
            }
          ],
          button: [
            {
              type: "success",
              func: "addBtn",
              name: "新增图片"
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
          showLabel: true,
          // prop: 'status',
          label: "图片",
          width:'200px',
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <img
                style="width: 50px; height: 50px;"
                src={"http://static.ibaituan.cn/" + row.imgUrl}
              />
            );
          }
        },
        {
          prop: "imgName",
          label: "图片名称",
          width:'300px',
        },
        {
          showLabel: true,
          label: "分组属性",
          width:'300px',
          render: (row, index) => {
            return <p>{row.type == 1 ? "商品" : "其他"}</p>;
          }
        },
        {
          prop: "name",
          label: "图片分组",
          width:'300px',
        },
  
  
  
        {
          button: true,
          label: '操作',
          group: [{
            // you can props => type size icon disabled plain
            name: '替换',
            type: 'warning',
            icon: 'el-icon-edit',
            plain: true,
            onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
              this.edit(row);
            }
          },
            {
            name: '删除',
            type: 'danger',
            icon: 'el-icon-delete',
            disabled: false,
            onClick: (row) => {
              this.del(row)
            }
          }]
        }
      ],
      tableData: [],
      searchData: {},
      selectOptions: [], //图片分组选项
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },

      btnLoading: false,
      imgSrcBasic: "",
      dialogTitle: "",
      // 编辑新增用户
      dialogForm: {
        groupId: "",
        imgName: "",
        id: "",
        imgPixel: "",
        imgSize: "",
        imgType: "",
        imgUrl: "",
        storeId: ""
      },
      dialogFormRules: {
        groupId: [
          { required: true, message: "请选择图片分组", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      innerEditVisible: false, //编辑图片分类模态框是否显示
      innerAddVisible: false, //添加图片分类模态框是否显示
      // 添加图片分类表单
      addGroupForm: {
        name: "",
        type: ""
      },
      addGroupFormRules: {
        type: [{ required: true, message: "请选择分组类型", trigger: "blur" }]
      },

      typeOptions: [
        {
          id: 0,
          name: "其他"
        },
        {
          id: 1,
          name: "商品"
        }
      ],
      searchParams: {
        name: "",
        imgName: "",
        type: "",
        pageSize: 10,
        pageNum: 1
      }
    };
  },
  components: {
    searchView,
    CommonTable
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
      console.log(file);
      if (response.code == 200) {
        this.$notify({
          title: response.message,
          type: "success"
        });
        this.dialogForm.imgUrl = response.result;
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
      queryImagePage(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    /**
     * @获取图片分组列表
     */
    getSelectList() {
      getImgGroupList()
        .then(res => {
          if (res.code == "200") {
            this.selectOptions = res.result;
            this.selectOptions.map(v => {
              this.$set(v, "edit", false);
              v.originalTitle = v.title;
              return v;
            });
          }
        })
        .catch(err => {});
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
        this.dialogForm.id = val.id;
        this.dialogForm.imgName= val.imgName;
        this.dialogForm = Object.assign({}, val);
      }
      this.dialogFormVisible = true;
    },
    /**
     * @编辑或新增点击
     */
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          saveOrEditStoreImage(this.dialogForm)
            .then(res => {
              this.cancelDialog();
              this.getList();
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    /**
     * @编辑或新增取消
     */
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogForm = {
        groupId: "",
        imgName: "",
        id: "",
        imgPixel: "",
        imgSize: "",
        imgType: "",
        imgUrl: "",
        storeId: ""
      };
      this.$refs["dialogForm"].resetFields();
    },
    // 搜索方法
    searchBtn(val) {
      this.searchData = val;
      this.getList();
    },
    /**
     * @删除图片方法
     */
    del(item) {
      // console.log(item);
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: item.id
          };
          deleteImageById(params)
            .then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
              let params = Object.assign(
                {
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize
                },
                this.searchData
              );
              queryImagePage(params).then(res => {
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
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @删除分组
     */
    deleteGroup(item) {
      let params = Object.assign({}, item);
      params.groupId = params.id;
      deleteImgGroup(params)
        .then(res => {
          this.getSelectList();
        })
        .catch(err => {});
    },
    /**
     * @新增或编辑分组
     */

    saveGroup(item) {
      let params = Object.assign({}, item);
      insertOrEditImageGroup(params)
        .then(res => {
          if (res.code == "200") {
            this.getSelectList();
          }
        })
        .catch(err => {});
      this.$refs["addGroupForm"].resetFields();
      this.innerAddVisible = false;
      this.innerEditVisible = false;
    },
    /**
     * @取消编辑分组
     */

    cancelEdit(row) {
      row.title = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "已取消编辑",
        type: "warning"
      });
    }
  },
  mounted() {
    this.imgSrcBasic = process.env.BASE_API;
    this.getSelectList();
  }
};
</script>

<style lang="sass">
    .labberConcessionsBox
       overflow: hidden
        margin: 20px 20px 0
    
       
   
</style>
<style>
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
.dialog__body {
  display: flex;
  justify-content: center;
}
</style>
