<template>
  <div class="roleSetting">
    <div >
      <el-tree
        :data="treeData"
        accordion
        :props="defaultProps"
        :highlight-current="true"
        @node-click="handleNodeClick"
        :render-content="renderContent"
      ></el-tree>

      <div class="controller" v-show="controllerVisible" v-if="isShowLabel">
        <el-button type="primary" size="small" :disabled="activeData.level == '3'"  @click="onAdd">新增</el-button>
        <el-button type="warning" size="small"  @click="onEdit">修改</el-button>
        <el-button type="danger" size="small"  @click="onDelete">删除</el-button>
      </div>

      <!--
        新增/编辑模态框模态框
      -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
        <el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">

          <el-form-item label="车型名称" label-width="150px" prop="typeName">
            <el-input v-model="dialogForm.typeName"></el-input>
          </el-form-item>
          <el-form-item label="车型编码" label-width="150px" prop="typeCode">
            <el-input v-model="dialogForm.typeCode"></el-input>
          </el-form-item>
          <el-form-item label="车型描述" label-width="150px" prop="typeDesc">
            <el-input v-model="dialogForm.typeDesc"></el-input>
          </el-form-item>
          <el-form-item label="类型图标" label-width="150px" prop="icon">
            <el-upload
              class="avatar-uploader"
              :action="imgSrcBasic + '/opc/auth/uploadFile'"
              :show-file-list="false"
              :on-success="handleChange"
              :before-upload="beforeUpload">
              <img v-if="dialogForm.icon" :src="'http://qn.gaoshanmall.cn/'+dialogForm.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getVehicleTypeTree,
    addVehicleType,
    getVehicleTypeDetail,
    delVehicleType,
    updateVehicleType
  } from "@/api/gskeeper/vehicleType/index";
  export default {
    name: 'vehicleType',
    data() {
      return {
        // 按钮级权限
        isShowLabel: false,
        roleBtnList: [
          "sys:menu:saveMenu",
          "sys:menu:deleteMenu",
          "sys:menu:editMenu",
          "sys:menu:actionUnderMenu"
        ],

        // 弹层
        btnLoading: false,
        dialogTitle: '',
        dialogFormVisible: false,
        dialogForm: {
          typeName: '',
          typeCode: '',
          typeDesc: '',
          icon: ''
        },
        dialogFormRules: {
          typeName: [
            {required: true,  message: '请输入车型名称', trigger: 'blur'}
          ],
          typeCode: [
            {required: true,  message: '请输入车型编码', trigger: 'blur'}
          ],
          typeDesc: [
            {required: true,   message: '请输入车型描述', trigger: 'blur'}
          ],
          icon: [
            {required: true,  message: '请上传车型icon图标', trigger: 'blur'}
          ]
        },

        controllerVisible: false,

        activeData: '',

        treeData: [],
        defaultProps: {
          children: 'childList',
          label: 'typeName'
        },

        // 上传
        // 图片源
        imgSrcBasic: "",
        //类型
        typeBok: true,
        imageUrl: ''
      };
    },

    mounted() {
      this.imgSrcBasic = process.env.BASE_API;
      this.isShowLabel = this.isShowLabelNum(this.roleBtnList);
      this.getTreeList();
    },

    methods: {
      // 获取树状数据
      getTreeList() {
        getVehicleTypeTree().then(res => {
          this.treeData = res.result.childList;
        })
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
          this.$notify({
            title: response.message,
            type: "success"
          });
          this.dialogForm.icon = response.result;
        }
      },

      handleNodeClick(data) {
        this.controllerVisible = true;
        this.activeData = data;
      },

      onAdd() {
        this.formFun(this.activeData, 'add')
      },
      onEdit() {
        this.formFun(this.activeData, 'edit')
      },
      // 编辑新增公共函数
      formFun(val, type) {
        if(type == 'add') {
          this.dialogTitle = '新增';
          this.dialogFormVisible = true;
        }else {
          this.dialogTitle = '编辑';
          let params = {
            id: val.id
          }
          getVehicleTypeDetail(params).then(res => {
            this.dialogForm = res.result;
            this.dialogFormVisible = true;
          })
        }

      },


      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              let params = Object.assign({
                parentId: this.activeData.id,
                level: Number(this.activeData.level) + 1
              }, this.dialogForm)
              addVehicleType(params).then((res) => {
                if(res.code == 200) {
                  this.getTreeList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
                this.btnLoading = false;
                this.cancelDialog();
              }).catch(err => {
                this.btnLoading = false;
              })
            }else {
              updateVehicleType(this.dialogForm).then(res => {
                if(res.code == 200) {
                  this.getTreeList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
                this.btnLoading = false;
                this.cancelDialog();
              }).catch(err => {
                this.btnLoading = false;
              })
            }
          }
        });
      },
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs['dialogForm'].resetFields();
        this.dialogForm = {
          menuCode: '',
          menuName: '',
          url: '',
          remark: ''
        };

      },

      renderContent(h, { node, data, store }) {
        return (
          <div class="custom-tree-node" style="hight: 30px; display: table-cell;text-align: center;  ">
            <img
              style="width: 20px; height: 20px; margin-right: 5px;  vertical-align: middle;"
              src={"http://qn.gaoshanmall.cn/"+node.icon }
            />
            <span>{node.label}</span>
          </div>
        );
      },

      // 删除
      onDelete() {
        this.$confirm(`此操作将永久删除${this.activeData.typeName}该数据是否继续且删除所有相关数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              id: this.activeData.id
            }
            delVehicleType(params).then(res => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getTreeList();
              }else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            })

          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
    }
  };
</script>
<style lang="sass">
  .roleSetting .controller
    position: absolute
    left: 40%
    top: 5%
    padding: 20px
    border: 1px solid #eee
    z-index: 9
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
