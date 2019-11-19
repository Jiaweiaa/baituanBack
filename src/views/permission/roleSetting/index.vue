<template>
  <div class="roleSetting">
    <div >
      <el-tree
        :data="treeData"
        accordion
        :expand-on-click-node="false"
        node-key="id"
        :default-expanded-keys="openTree"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="handleNodeClick"
      ></el-tree>

      <div class="controller" v-show="controllerVisible" v-if="isShowLabel">
        <el-button type="primary" size="small" v-if="hasPerm(roleBtnList[0])"  @click="onAdd">新增</el-button>
        <el-button type="warning" size="small" v-if="hasPerm(roleBtnList[2])"  @click="onEdit">修改</el-button>
        <el-button type="success" size="small" v-if="hasPerm(roleBtnList[3])"  @click="getAction">查看权限</el-button>
        <el-button type="danger" size="small" v-if="hasPerm(roleBtnList[1])"  @click="onDelete">删除</el-button>
      </div>

      <!-- 新增/编辑模态框模态框 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
        <el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
          <el-form-item label="菜单编码" label-width="200px" prop="menuCode">
            <el-input v-model="dialogForm.menuCode"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" label-width="200px" prop="menuName">
            <el-input v-model="dialogForm.menuName"></el-input>
          </el-form-item>
          <el-form-item label="菜单地址" label-width="200px" prop="url">
            <el-input v-model="dialogForm.url"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="200px" prop="remark">
            <el-input v-model="dialogForm.remark"></el-input>
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
    getMenuList,
    saveMenu,
    deleteMenuById,
    editMenu,
    getActionUnderMenu,
    checkMenuName,
    checkMenuUrl,
    checkMenuCode
  } from "@/api/permission/roleSetting/index";
  export default {
    name: 'roleSetting',
    data() {
      //  检测菜单名称唯一性
      let validataMenuName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入菜单名称！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('菜单名称不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              menuName: value,
              pid: this.activeData.id
            };
          }else {
            params = {
              menuName: value,
              id: this.dialogForm.id,
              pid: this.dialogForm.pid
            };
          }
          checkMenuName(params).then((res) => {
            if(res.result == false) {
              callback('该菜单名称已存在!');
            }else {
              callback();
            }
          })
        }
      };
      //  检测菜单url唯一性
      let validMenuUrl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入菜单url！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('菜单url不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              url: value
            };
          }else {
            params = {
              url: value,
              id: this.dialogForm.id,
              pid: this.dialogForm.pid
            };
          }
          checkMenuUrl(params).then((res) => {
            if(res.result == false) {
              callback('该菜单url已存在!');
            }else {
              callback();
            }
          })
        }
      };
      // 检测菜单编码是否已存在
      let validMenuCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入菜单编码！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('菜单编码不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              menuCode: value
            };
          }else {
            params = {
              menuCode: value,
              id: this.dialogForm.id,
              pid: this.dialogForm.pid
            };
          }
          checkMenuCode(params).then((res) => {
            if(res.result == false) {
              callback('该菜单编码已存在!');
            }else {
              callback();
            }
          })
        }
      };


      return {
        // 按钮级权限
        isShowLabel: false,
        roleBtnList: [
          "sys:menu:saveMenu",
          "sys:menu:deleteMenu",
          "sys:menu:editMenu",
          "sys:menu:actionUnderMenu"
        ],
	      // 默认展开的树
        openTree: [],

        // 弹层
        btnLoading: false,
        dialogTitle: '',
        dialogFormVisible: false,
        dialogForm: {
          menuCode: '',
          menuName: '',
          url: '',
          remark: ''
        },
        dialogFormRules: {
          menuCode: [
            {required: true,  validator: validMenuCode, trigger: 'blur'}
          ],
          menuName: [
            {required: true,  validator: validataMenuName, trigger: 'blur'}
          ],
          url: [
            {required: true,  validator: validMenuUrl, trigger: 'blur'},
          ]
        },

        controllerVisible: false,

        activeData: '',

        treeData: [],
        defaultProps: {
          children: 'subMenu',
          label: 'menuName'
        }
      };
    },

    mounted() {
      this.isShowLabel = this.isShowLabelNum(this.roleBtnList);
      this.getTreeList();
    },

    methods: {
      // 获取树状数据
      getTreeList() {
        getMenuList().then(res => {
          this.treeData = res.result;
          this.openTree.push( this.treeData[0].subMenu[0].id);
        })
      },

      getAction() {
        let params = {
          menuId: this.activeData.id
        }
        getActionUnderMenu(params).then(res => {
          if(res.code == 200) {
            this.$router.push({
              path: '/permission/roleWay/activeManager',
              query: {
                'menuId': this.activeData.id
              }
            })
          }
        })
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
        }else {
          this.dialogTitle = '编辑';
          this.dialogForm = Object.assign({}, val)
        }
        console.log(this.dialogForm)
        this.dialogFormVisible = true;
      },

      onDelete() {
        this.$confirm(`此操作将永久删除${this.activeData.menuName}该数据是否继续且删除所有相关数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: this.activeData.id
          }
          deleteMenuById(params).then(res => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getTreeList();
            }else {
              this.$message({
                type: "error",
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


      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              let params = Object.assign({
                pid: this.activeData.id
              }, this.dialogForm)
              saveMenu(params).then((res) => {
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
              editMenu(this.dialogForm).then(res => {
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
    }
  };
</script>
<style lang="sass">
  .roleSetting .controller
    position: absolute
    left: 35%
    top: 5%
    padding: 20px
    border: 1px solid #eee
    z-index: 9
</style>
