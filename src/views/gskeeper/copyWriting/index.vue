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
      <el-dialog :title="dialogTitle"  :visible.sync="dialogFormVisible" :before-close="cancelDialog">
        <el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
          <el-form-item label="文案编码" label-width="200px" prop="docCode">
            <el-input v-model="dialogForm.docCode"></el-input>
          </el-form-item>
          <el-form-item label="标题" label-width="200px" prop="title">
            <el-input v-model="dialogForm.title"></el-input>
          </el-form-item>
          <el-form-item label="概述" label-width="200px" prop="summary">
            <el-input v-model="dialogForm.summary"></el-input>
          </el-form-item>
          <el-form-item  label="内容" label-width="200px" prop="content">
            <el-input type="textarea" :rows="2" v-model="dialogForm.content"></el-input>
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
  import CommonTable from '@/components/Table';
  import { list, doUpdate, doAdd, goUpdate, doDel } from '@/api/gskeeper/copyWriting/index';

  export default {
    name: 'copyWriting',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入编码',
                inputModel: 'docCode',
                labelName: '编码',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入标题关键词',
                inputModel: 'title',
                labelName: '标题',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增文案'
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
            prop: 'docCode',
            label: '编码'
          },
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'summary',
            label: '概述'
          },
          {
            prop: 'content',
            label: '内容'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            button: true,
            label: '操作',
            group: [ {
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
          pageSize: 10
        },
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑/新增用户
        dialogForm: {
          docCode: '',
          content: '',
          title: '',
          summary: ''
        },
        dialogFormRules:{
          docCode: [
            {required: true,  message:'请输入文案编码', trigger: 'blur'}
          ],
          content: [
            {required: true,  message:'请输入内容', trigger: 'blur'}
          ],
          title: [
            {required: true,  message:'请输入标题', trigger: 'blur'}
          ],
          summary: [
            {required: true,  message:'请输入概述', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        list(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
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
            }
            doDel(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                let params = Object.assign({
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize
                }, this.searchData);
                list(params).then((res) => {
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
          this.dialogFormVisible = true;
        }else {
          this.dialogTitle = '编辑';
          let params = {
            id: val.id
          }
          goUpdate(params).then(res => {
            this.dialogForm = Object.assign({
              id : val.id
            }, res.result);
            this.dialogFormVisible = true;
          })
        }

      },

      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },

      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              doAdd(this.dialogForm).then((res) => {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.cancelDialog();
                this.getList();
                this.btnLoading = false;
              }).catch(err => {
                this.btnLoading = false;
              })
            }else {
              doUpdate(this.dialogForm).then((res) => {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.cancelDialog();
                this.getList();
                this.btnLoading = false;
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
      }
    }
  }
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
