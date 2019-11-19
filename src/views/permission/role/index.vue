<template>
  <div class="app-container">

    <!--
      wjw

      顶部搜索按钮
    -->
    <div style="margin-bottom:15px;">
      <searchView :searchModel="searchModel"></searchView>
    </div>

    <!--
      列表
    -->
    <el-table
      class="table"
      stripe
      :data="listData"
      v-loading="listLoading"
      border>
      <el-table-column
        label="角色编码"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode ? scope.row.roleCode  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色名称"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName ? scope.row.roleName  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime ? scope.row.createTime  : ''}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" v-if="isShowLabel">
        <template slot-scope="scope">
          <el-button @click="setMenu(scope.row)" v-if="hasPerm('sys:role:bindMenu')" type="primary" icon="el-icon-menu"></el-button>
          <el-button @click="setPermission(scope.row)" v-if="hasPerm('sys:role:bindAction')" type="primary" icon="el-icon-setting"></el-button>
          <el-button @click="edit(scope.row)" v-if="hasPerm('sys:role:editRole')" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="del(scope.row)" v-if="hasPerm('sys:role:deleteRole')" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
      新增/编辑模态框模态框
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="角色名称" label-width="200px" prop="roleName">
          <el-input v-model="dialogForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" label-width="200px" prop="roleCode">
          <el-input v-model="dialogForm.roleCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      分配菜单权限
    -->
    <el-dialog title="分配菜单权限" :visible.sync="roleVisible" :before-close="cancelRoleDialog">
      <el-tree
        :data="roleList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRoleDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogRoleClick">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      分配按钮权限
    -->
    <el-dialog title="分配功能权限"  :visible.sync="roleActionVisible"  :before-close="cancelActionDialog">
      <el-tree
        :data="roleActionList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="treeAction"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelActionDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogActionClick">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      分页
    -->
    <el-pagination
      class="paginationClass"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="current"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="searchParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</template>

<script>
import {  queryRoleListWithPage,
          roleSave,
          deleteRoleById,
          checkRoleCode,
          editRoleById,
          getActionTreeByRoleId,
          roleBindMenu,
          roleBindAction,
          saveAction,
          checkRoleName,
          getMenuTreeByRoleId} from "@/api/permission/role/index";
import searchView from "@/components/searchView/index";

export default {
  name: 'role',
  data() {
    // 验证角色编码
    let validRoleCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色编码！'));
      } else if(!/^[^\s]+$/.test(value)){
        callback(new Error('角色编码不能带有空格！'));
      } else {
        let params = '';
        if(this.dialogTitle== '新增'){
          params = {
            roleCode: value
          };
        }else {
          params = {
            roleCode: value,
            roleId: this.dialogForm.id
          };
        }
        checkRoleCode(params).then((res) => {
          if(res.result == false) {
            callback('该角色编码已存在!');
          }else {
            callback();
          }
        })
      }
    };

    // 验证角色名称
    let validRoleName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名称！'));
      } else if(!/^[^\s]+$/.test(value)){
        callback(new Error('角色名称不能带有空格！'));
      } else {
        let params = '';
        if(this.dialogTitle== '新增'){
          params = {
            roleName: value
          };
        }else {
          params = {
            roleName: value,
            roleId: this.dialogForm.id
          };
        }
        checkRoleName(params).then((res) => {
          if(res.result == false) {
            callback('该角色名称已存在!');
          }else {
            callback();
          }
        })
      }
    };
    return {
      btnLoading: false,
      roleId: '',

      isShowLabel: 0,

      roleBtnList: [
        'sys:role:bindMenu',
        'sys:role:bindAction',
        'sys:role:editRole',
        'sys:role:editRole',
        'sys:role:saveRole'
      ],
      searchModel: [
        {
          input: [
            {
              placeholder: '请输入角色名称',
              inputModel: 'roleName',
              labelName: '角色名称',
              model: '',
              type: 'el-input'
            },
            {
              placeholder: '请输入角色编码',
              inputModel: 'roleCode',
              labelName: '角色编码',
              model: '',
              type: 'el-input'
            }
          ],
          button: [
            {
              type: 'success',
              func: 'addBtn',
              name: '新增角色',
              hasPerm: 'sys:role:saveRole'
            },
            {
              type: 'primary',
              func: 'searchBtn',
              name: '搜索'
            }
          ]
        }
      ],

      defaultProps: {
        children: 'subMenu',
        label: 'menuName'
      },
      dialogForm: {
        roleName: ''
      },
      dialogFormRules: {
        roleName:[
          {required: true,  validator: validRoleName, trigger: 'blur'},
          { min: 1, max: 10, message: '角色名称最大长度不能超过10个字符', trigger: 'blur' }
        ],
        roleCode:[
          {required: true,  validator: validRoleCode, trigger: 'blur'},
          { min: 1, max: 10, message: '角色编码最大长度不能超过10个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,


      // 列表页数据
      searchParams: {
        roleName: '',
        roleCode: '',
        pageSize: 10,
        pageNum: 1,
      },
      listData: [],

      totalNum: 0,
      listLoading: true,
      current: 1,

      //  弹窗标题
      dialogTitle: '',

      roleList: [],
      roleVisible: false,
      roleActionVisible: false,
      roleActionList: []
    };
  },
  components: {
    searchView
  },
  mounted() {
    this.isShowLabel = this.isShowLabelNum(this.roleBtnList);
    this.getList();
  },
  methods: {
    // 确认/取消权限菜单提交
    cancelRoleDialog() {
      this.roleList = [];
      this.roleVisible = false;
    },
    dialogRoleClick() {
      let params = {
        roleId: this.roleId,
        menuIdList: this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      }
      this.btnLoading = true;
      roleBindMenu(params).then(res => {
        this.btnLoading = false;
        if(res.code == 200) {
          this.$notify.success({
            title: res.message,
            offset: 100
          });
          this.cancelRoleDialog();
        }
      }).catch(err => {
        this.btnLoading = false;
      })
    },

    // 确认/取消权限按钮提交
    dialogActionClick() {
      let params = {
        roleId: this.roleId,
        actionIdList: this.$refs.treeAction.getCheckedKeys()
      };
      this.btnLoading = true;
      roleBindAction(params).then(res => {
        this.btnLoading = false;
        if(res.code == 200) {
          this.$notify.success({
            title: res.message,
            offset: 100
          });
          this.cancelActionDialog();
        }
      }).catch(err => {
        this.btnLoading = false;
      })

    },
    cancelActionDialog() {
      this.roleActionVisible = false;
      this.roleActionList = [];
    },

    // 获取列表
    getList() {
      this.listLoading = true;
      queryRoleListWithPage(this.searchParams).then((res) => {
        this.listData = res.result.records;
        this.totalNum = Number(res.result.total);
        this.current = Number(res.result.current);
        this.listLoading = false;
      })
    },
    // 点击设置菜单权限
    setMenu(val) {
      this.roleId = val.id;
      let params = {
        roleId: val.id
      };
      getMenuTreeByRoleId(params).then(res => {
        if(res.code == 200) {
          this.roleVisible = true;
          this.roleList = res.result.authTree;
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(res.result.checkedAuthList);
          })
        }
      })
    },
    // 点击设置按钮权限
    setPermission(val) {
      this.roleId = val.id;
      let params = {
        roleId: val.id
      };
      getActionTreeByRoleId(params).then(res => {
        if(res.code == 200) {
          this.roleActionVisible = true;
          this.roleActionList = res.result.authTree;
          this.$nextTick(() => {
            this.$refs.treeAction.setCheckedKeys(res.result.checkedAuthList);
          })
        }
      })
    },


    // 编辑和新增点击
    dialogClick() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if(this.dialogTitle == '新增') {
            roleSave(this.dialogForm).then((res) => {
              this.btnLoading = false;
              if(res.code == 200) {
                this.cancelDialog();
                this.getList();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }
            }).catch(err => {
              this.btnLoading = false;
            })
          }else {
            editRoleById(this.dialogForm).then((res) => {
              this.btnLoading = false;
              this.cancelDialog();
              this.getList();
              this.$notify.success({
                title: res.message,
                offset: 100
              });
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
      this.dialogForm = {
        roleName: ''
      };
      this.$refs['dialogForm'].resetFields();
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
      this.formFun(val, 'edit')
    },
    // 新增调取方法
    addBtn() {
      this.formFun('', 'add')
    },
    // 编辑新增公共函数
    formFun(val, type) {
      if(type == 'add') {
        this.dialogTitle = '新增';

      }else {
        this.dialogTitle = '编辑';
        this.dialogForm.name = val.name;
        this.dialogForm = Object.assign({}, val)
      }
      this.dialogFormVisible = true;
    },

    // 搜索方法
    searchBtn(val) {
     this.searchParams.roleCode = val.roleCode;
     this.searchParams.roleName = val.roleName;
     this.getList();
    },
    // 删除
    del(val) {
      this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {
          id: val.id
        }
        deleteRoleById(params).then((res) => {
          if(res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            queryRoleListWithPage(this.searchParams).then((res) => {
              if(res.result.records.length <= 0 && this.searchParams.pageNum  > 1) {
                this.searchParams.pageNum --;
                this.getList();
              }else {
                this.getList();
              }
            })
          }
        })
    
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
  .paginationClass
    float: right
    margin-top: 20px
    margin-right: 20px
</style>
