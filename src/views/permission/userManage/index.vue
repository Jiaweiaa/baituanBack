<template>
  <div class="app-container">
    <!--
      wjw

      顶部搜索
    -->
    <div style="margin-bottom:15px;">
      <searchView :searchModel="searchModel"></searchView>
    </div>

    <!--
      列表组建
    -->

    <CommonTable
      :columns="columns"
      :dataSource="tableData"
      :options="options"
      :roleBtnList = "roleBtnList"
      :fetch="getList"
      :pagination="pagination"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    />

    <!--
      新增/编辑模态框模态框
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="账号" label-width="200px" prop="loginName">
          <el-input v-model="dialogForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="200px" prop="userName">
          <el-input v-model="dialogForm.userName"></el-input>
        </el-form-item>
        <!--<el-form-item label="手机号码" label-width="200px" prop="mobile">-->
          <!--<el-input v-model="dialogForm.mobile"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="邮箱地址" label-width="200px" prop="email">
          <el-input v-model="dialogForm.email"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle == '新增'" label="密码" label-width="200px" prop="password">
          初始密码为123456,初次登录必须修改密码
        </el-form-item>
        <el-form-item label="账号是否可用" label-width="200px" prop="status">
          <el-switch
            v-model="dialogForm.status"
            activeValue="ENABLE"
            inactiveValue="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      分配角色
    -->
    <el-dialog  title="分配角色" :visible.sync="dialogUserVisible" :before-close="cancelUserDialog">
      <el-form :model="dialogUserForm" status-icon :rules="dialogUserFormRules"  ref="dialogUserForm">
        <el-form-item label="用户" label-width="200px" prop="email">
          {{dialogUserForm.userName}}
        </el-form-item>
        <el-form-item label="角色" label-width="200px" prop="email">
          <el-checkbox-group
            v-model="dialogUserForm.roleId"
            :min="1">
            <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogUserClick">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    queryUserWithPage,
    modifyUserStatusById,
    checkLoginName,
    getBindRoleByUserId,
    saveOrUpdateUser,
    deleteUserById,
    userBindRole,
    checkEmail
  } from "@/api/permission/userManage/index";
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'

  export default {
    name: 'userManager',
    data() {
      // 验证账号
      let validateLoginName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('账号不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              loginName: value
            };
          }else {
            params = {
              loginName: value,
              userId: this.dialogForm.id
            };
          }
          checkLoginName(params).then((res) => {
            if(res.result == false) {
              callback('该账号已存在!');
            }else {
              callback();
            }
          })
        }
      };

      // 校验邮箱
      let validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱！'));
        } else {
          var reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的邮箱！'));
          } else {
            let params = '';
            if(this.dialogTitle== '新增'){
              params = {
                loginName: value
              };
            }else {
              params = {
                email: value,
                userId: this.dialogForm.id
              };
            }
            checkEmail(params).then((res) => {
              if (res.code == 200) {
                if(res.result == false) {
                  callback('该邮箱已存在!');
                }else {
                  callback();
                }
              }
            })
          }
        }
      };

      return {
        // 权限
        isShowLabel: false,

        roleBtnList: [
          "sys:user:saveUser",
          "sys:user:editUser",
          "sys:user:bindRole",
          "sys:user:deleteUser"
        ],


        // 点击loading
        btnLoading: false,

        // 用户列表
        roleList: [],

        // 搜索的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入登录名',
                inputModel: 'loginName',
                labelName: '登录名',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入用户姓名',
                inputModel: 'userName',
                labelName: '用户姓名',
                model: '',
                type: 'el-input'
              }, {
                placeholder: '请输入电话',
                inputModel: 'mobile',
                labelName: '电话',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '全部',
                  status: ''
                },{
                  name: '启用',
                  status: 'enable'
                }, {
                  name: '禁用',
                  status: 'disable'
                }]
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增用户',
                hasPerm: 'sys:user:saveUser'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ],

        // 分配角色表单
        dialogUserVisible: false,
        dialogUserForm: {
          userName: '',
          roleId: []
        },
        dialogUserFormRules: {},


        // 编辑新增用户
        dialogForm: {
          loginName: '',
          userName: '',
          mobile: '',
          email: '',
          status: 'ENABLE'
        },
        dialogFormRules: {
          loginName:[
            {required: true,  validator: validateLoginName, trigger: 'blur'}
            // { min: 6, max: 12, message: '账号最小长度不能少于6个字符最大长度不能超过12个字符', trigger: 'blur' }
          ],
          userName:[
            {required: true,  message:'请输入姓名', trigger: 'blur'},
            { min: 1, max: 10, message: '用户名最小长度不能少于2个字符最大长度不能超过5个字符', trigger: 'blur' }
          ],
          email:[
            {required: true,  validator: validateEmail, trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,

        columns: [
          {
            prop: 'loginName',
            label: '账号'
          },
          {
            prop: 'userName',
            label: '姓名'
          },
          {
            prop: 'mobile',
            label: '手机号码'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            showLabel: true,
            prop: 'status',
            label: '状态',
            hasPerm: 'sys:user:editStatus',
            // render 可以根据你想要渲染的方式渲染
            // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
            // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
            render: (row, index) => {
              return (
                <p onClick={e => this.openStatus(e, row)}>
                  <el-switch activeValue="ENABLE" inactiveValue="DISABLE" v-model={row.status} active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </p>
               )
            }
          },
          {
            showLabel: true,
            width: '300px',
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '分配角色',
              type: 'warning',
              icon: 'el-icon-setting',
              hasPerm: 'sys:user:bindRole',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.setting(row);
              }
            }, {
              // you can props => type size icon disabled plain
              name: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              hasPerm: 'sys:user:editUser',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            }, {
              name: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              hasPerm: 'sys:user:deleteUser',
              disabled: false,
              onClick: (row) => {
                this.del(row)
              }
            }]
          }
        ],
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 10
        },
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        dialogTitle: ''
      };
    },
    mounted() {
      this.columns[4].showLabel =  this.isShowLabelNum(["sys:user:editStatus"]);
      this.columns[5].showLabel =  this.isShowLabelNum(this.roleBtnList);
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      dialogUserClick() {
        this.btnLoading = true;
        userBindRole(this.dialogUserForm).then(res => {
          if(res.code == 200) {
            this.$notify.success({
              title: res.message,
              offset: 100
            });
          }
          this.btnLoading = false;
          this.cancelUserDialog();
        }).catch(err => {
          this.btnLoading = false;
        })
      },
      cancelUserDialog() {
        this.dialogUserVisible = false;
        this.$refs['dialogUserForm'].resetFields();
      },

      // 分配权限
      setting(row) {
        this.dialogUserVisible = true;
        this.dialogUserForm.userName = row.userName;
        this.dialogUserForm.userId =  row.id;
        let params = {
          userId: this.dialogUserForm.userId
        };
        getBindRoleByUserId(params).then(res => {
          this.dialogUserForm.roleId = res.result.alreadyBindRoleId;
          this.roleList = res.result.roleList;
        })
      },
      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              this.dialogForm.password = '123456';
            }
            saveOrUpdateUser(this.dialogForm).then((res) => {
              this.cancelDialog();
              this.getList();
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              this.btnLoading = false;
            }).catch(err => {
              this.btnLoading = false;
            })
          }
        });
      },
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm =  {
          loginName: '',
            userName: '',
            mobile: '',
            email: '',
            status: 'ENABLE'
        };
        this.$refs['dialogForm'].resetFields();
      },
      // 禁用启用
      openStatus(e, row) {
        let inBok = Object.assign({}, row);
        let params = {
          userId: inBok.id,
          status: inBok.status
        }
        modifyUserStatusById(params).then((res) => {
          if(res.code == 200) {
            this.$notify({
              title: res.message,
              type: 'success'
            });
          }else {
            this.getList();
          }
        });
        e.cancelBubble = true // 停止冒泡，否则会触发 row-click
      },
      handleRowClick(row, event, column){ // 点击行的事件，同理可以绑定其他事件
        console.log('click row:',row, event, column)
      },
      handleSelectionChange(selection){
        console.log(selection)
      },

      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        queryUserWithPage(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },

      // 删除操作
      del(val) {
        console.log(val);
        this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              userId: val.id
            }
            deleteUserById(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                let params = Object.assign({
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize
                }, this.searchData);
                queryUserWithPage(params).then((res) => {
                  if(res.result.records.length <= 0 && this.pagination.pageIndex  > 1) {
                    this.pagination.pageIndex --;
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
          this.dialogForm.id = val.id;
          this.dialogForm = Object.assign({}, val)
        }
        this.dialogFormVisible = true;
      },

      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
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
