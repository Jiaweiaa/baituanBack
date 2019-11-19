<template>
	<div class="positionBox">
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
				<el-form-item label="机构编码" label-width="180px" prop="orgCode">
					<el-input v-model="dialogForm.orgCode"></el-input>
				</el-form-item>
				<el-form-item label="职位名称" label-width="180px" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="职位编码" label-width="180px" prop="code">
					<el-input v-model="dialogForm.code"></el-input>
				</el-form-item>
				<el-form-item label="状态" label-width="180px" prop="status">
					<el-radio-group v-model="dialogForm.status">
						<el-radio :label="1">启用</el-radio>
						<el-radio :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="首页显示" label-width="180px" prop="displayStatus">
					<el-radio-group v-model="dialogForm.displayStatus">
						<el-radio :label="1">显示</el-radio>
						<el-radio :label="0">不显示</el-radio>
					</el-radio-group>
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
    saveOrEditPosition,
    getPositionWithPage,
    deletePosition
  } from "@/api/gaoshan/position/index";
  
  export default {
    name: 'name',
	  props: {
      treeId: {
        type: String,
        default: ''
      }
	  },
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入机构编码',
                inputModel: 'orgCode',
                labelName: '机构编码',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入机构名称',
                inputModel: 'orgName',
                labelName: '机构名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入职位名称',
                inputModel: 'name',
                labelName: '职位名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入职位编码',
                inputModel: 'code',
                labelName: '职位编码',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'displayStatus',
                labelName: '首页显示',
                model: '',
                type: 'el-select',
                options: [{
                  name: '显示',
                  status: '1'
                }, {
                  name: '隐藏',
                  status: '0'
                }]
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '启用',
                  status: '1'
                }, {
                  name: '禁用',
                  status: '0'
                }]
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增职位'
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
            prop: 'orgCode',
            label: '机构编码'
          },
          {
            prop: 'orgName',
            label: '机构名称'
          },
          {
            prop: 'name',
            label: '职位名称'
          },
          {
            prop: 'code',
            label: '职位编码'
          },
          {
            prop: "status",
            label: "状态",
            render: (row, index) => {
              return (
                <span>{row.status == 0 ? '禁用' : '启用'}</span>
            );
            }
          },
          {
            prop: "displayStatus",
            label: "首页显示",
            render: (row, index) => {
              return (
                <span>{row.displayStatus == 0 ? '隐藏' : '显示 '}</span>
            );
            }
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            button: true,
	          width: '200px',
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

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          orgCode: '',
	        name: '',
	        code: '',
	        status: 1,
          displayStatus: 1
        },
        dialogFormRules: {
          orgCode : [
            {required: true,  message: '请输入机构编码', trigger: 'blur'},
          ],
          name : [
            {required: true,  message: '请输入职位名称', trigger: 'blur'},
          ],
          code : [
            {required: true,  message: '请输入职位编码', trigger: 'blur'},
          ],
        },
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.pagination.pageIndex = 1;
        this.getList();
      },

      // 获取列表
      getList() {
        this.options.loading = true;
        if(this.treeId == '') {
          return;
        }
        let params = Object.assign({
          orgId: this.treeId,
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        getPositionWithPage(params).then((res) => {
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
          this.dialogTitle = '新增职位';
        }else {
          this.dialogTitle = '编辑职位';
          this.dialogForm = Object.assign({}, val)
        }
        this.dialogFormVisible = true;
      },

      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            this.dialogForm.orgId = this.treeId;
            saveOrEditPosition(this.dialogForm).then(res => {
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
        this.dialogForm = {
          orgCode: '',
          name: '',
          code: '',
          status: 1,
          displayStatus: 1
        };
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
          deletePosition(params).then((res) => {
            if(res.code == 200) {
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              let params = Object.assign({
                orgId: this.treeId,
                pageNum: this.pagination.pageIndex,
                pageSize: this.pagination.pageSize
              }, this.searchData);
              getPositionWithPage(params).then((res) => {
                if(res.result.records.length <= 0 && this.pagination.pageIndex  > 1) {
                  this.pagination.pageIndex --;
                  this.getList();
                }else {
                  this.getList();
                }
              })
            }else {
              this.$notify.error({
                title: res.message,
                offset: 100
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
      }
    },
    watch: {
      'treeId': function(id){
        this.treeId = id;
        this.searchData = {};
        this.pagination = {
          total: 0,
          pageIndex: 1,
          pageSize: 5
        };
        this.searchModel = [
          {
            input: [
              {
                placeholder: '请输入机构编码',
                inputModel: 'orgCode',
                labelName: '机构编码',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入机构名称',
                inputModel: 'orgName',
                labelName: '机构名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入职位名称',
                inputModel: 'name',
                labelName: '职位名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入职位编码',
                inputModel: 'code',
                labelName: '职位编码',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'displayStatus',
                labelName: '首页显示',
                model: '',
                type: 'el-select',
                options: [{
                  name: '显示',
                  status: '1'
                }, {
                  name: '隐藏',
                  status: '0'
                }]
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '启用',
                  status: '1'
                }, {
                  name: '禁用',
                  status: '0'
                }]
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增职位'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ];
        this.getList();
      }
    }
  }
</script>

<style lang="sass">
	.positionBox
		min-width: 1100px
		overflow: hidden
		margin: 20px 20px 0
</style>
