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
		/>
		
		<!--
			新增/编辑模态框模态框
		-->
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="公告标题" label-width="200px" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="公告内容" label-width="200px" prop="content">
					<el-input v-model="dialogForm.content"></el-input>
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
  import searchView from '@/components/searchView/index'
  import CommonTable from '@/components/Table'
  import {
    saveOrUpdateBulletin,
    enableOrDisableBulletin,
    getAllBulletin,
    deleteBulletin
  } from "@/api/homeView/index";

  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新建公告'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'name',
            label: '公告标题'
          },
          {
            prop: 'content',
            label: '公告内容'
          },
          {
            showLabel: true,
            prop: 'status',
            label: '公告状态',
            hasPerm: 'sys:user:editStatus',
            // render 可以根据你想要渲染的方式渲染
            // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
            // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
            render: (row, index) => {
              return (
                <p onClick={e => this.openStatus(e, row)}>
                  <el-switch activeValue={1} inactiveValue={0} v-model={row.status} active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </p>
              )
            }
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row)
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
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          name: '',
          content: ''
        },
        dialogFormRules: {
          name:[
            {required: true,  message:'请输入公告标题', trigger: 'blur'},
          ],
	        content:[
            {required: true,  message:'请输入公告内容', trigger: 'blur'},
	        ]
        },
        dialogFormVisible: false
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      getList() {
        getAllBulletin().then((res) => {
          this.tableData = res.result;
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
          this.dialogForm.id = val.id;
          this.dialogForm = Object.assign({}, val)
        }
        this.dialogFormVisible = true;
      },

      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            saveOrUpdateBulletin(this.dialogForm).then((res) => {
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
          name: '',
	        content: '',
          status: '0'
        };
        this.$refs['dialogForm'].resetFields();
      },

      // 禁用启用
      openStatus(e, row) {
        let inBok = Object.assign({}, row);
        let params = {
          id: inBok.id
        }
        enableOrDisableBulletin(params).then((res) => {
          if(res.code == 200) {
            this.$notify({
              title: res.message,
              type: 'success'
            });
            this.getList();
          }else {
            this.$notify({
              title: res.message,
              type: 'error'
            });
          }
        });
        e.cancelBubble = true // 停止冒泡，否则会触发 row-click
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
            deleteBulletin(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
	              this.getList();
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
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
