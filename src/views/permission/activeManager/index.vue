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
      新增/编辑权限
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="权限编码" label-width="200px" prop="actionCode">
          <el-input v-model="dialogForm.actionCode"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" label-width="200px" prop="actionName">
          <el-input v-model="dialogForm.actionName"></el-input>
        </el-form-item>
        <el-form-item label="权限链接" label-width="200px" prop="url">
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
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    getActionUnderMenu,
    deleteActionById,
    editAction,
    checkActionUrl,
    checkActionCode,
    saveAction
  } from "@/api/permission/activeManager/index";

  export default {
    name: 'activeManager',
    data() {
      //  检测权限编码是否已存在
      let validActionCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入权限编码！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('权限编码不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              actionCode: value
            };
          }else {
            params = {
              actionCode: value,
              id: this.dialogForm.id
            };
          }
          checkActionCode(params).then((res) => {
            if(res.result == false) {
              callback('该权限编码已存在!');
            }else {
              callback();
            }
          })
        }
      };

      //   检测权限URL唯一性
      let validActionUrl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入权限URL！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('权限URL不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              url: value
            };
          }else {
            params = {
              url: value,
              id: this.dialogForm.id
            };
          }
          checkActionUrl(params).then((res) => {
            if(res.result == false) {
              callback('该权限URL已存在!');
            }else {
              callback();
            }
          })
        }
      };

      return {
        btnLoading: false,

        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入权限名称',
                inputModel: 'actionName',
                labelName: '权限名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入权限链接',
                inputModel: 'url',
                labelName: '权限链接',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增权限'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'actionCode',
            label: '权限编码'
          },
          {
            prop: 'actionName',
            label: '权限名称'
          },
          {
            prop: 'url',
            label: '权限链接'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            width: '300px',
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            }, {
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
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 5
        },
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        dialogTitle: '',
        dialogForm: {
          menuId: '',
          storeId: '1',
          status: 'ENABLE',
          actionCode: '',
          actionName: '',
          url: '',
          remark: ''
        },
        dialogFormRules: {
          actionCode  : [
            {required: true,  validator: validActionCode, trigger: 'blur'},
          ],
          actionName   : [
            {required: true,  message: '请输入权限名称', trigger: 'blur'},
          ],
          url: [
            {required: true,  validator: validActionUrl, trigger: 'blur'},
          ]
        },
        dialogFormVisible: false

      }
    },
    mounted() {
      this.dialogForm.menuId = this.$route.query.menuId;
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },

      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          menuId: this.$route.query.menuId,
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        getActionUnderMenu(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
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
          console.log(val)
          this.dialogForm = Object.assign({}, val)
        }
        this.dialogFormVisible = true;
      },

      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            saveAction(this.dialogForm).then(res => {
              if(res.code == 200) {
                this.cancelDialog();
                this.getList();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }
              this.btnLoading = false;
            }).catch(err => {
              this.btnLoading = false;
            })
          }
        });
      },
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs['dialogForm'].resetFields();
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
            deleteActionById(params).then((res) => {
              if(res.code == 200) {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.getList();
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
  }
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
