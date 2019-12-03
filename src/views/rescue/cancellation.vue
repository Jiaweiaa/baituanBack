<template>
	<div class="appraiseBox">
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
				<el-form-item label="关键词" label-width="200px" prop="word">
					<el-input v-model="dialogForm.word"></el-input>
				</el-form-item>
				<el-form-item label="类型" label-width="200px" prop="type">
					<el-select v-model="dialogForm.type" clearable placeholder="请选择状态">
						<el-option
								v-for="item in typeArray"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" label-width="200px" prop="status">
					<el-select v-model="dialogForm.status" clearable placeholder="请选择状态">
						<el-option
								v-for="item in statusArray"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
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
    saveOrEditCancelKeyword,
    getCancelKeyword,
    delCancelKeyword
  } from '@/api/rescue/cancellation/index'

  export default {
    name: 'cancellation',
    data() {
      // 验证角色编码
      let validRates = (rule, value, callback) => {
        console.log(value);
        if (value === 0) {
          callback(new Error('请选择星级！'));
        } else {
          callback();
        }
      };
      return {
        starColors: ['#99A9BF', '#F7BA2A', '#FF9900'],  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' },
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入取消原因',
                inputModel: 'word',
                labelName: '取消原因',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'type',
                labelName: '类型',
                model: '',
                type: 'el-select',
                options: [{
                  name: '司机端',
                  status: '1'
                }, {
                  name: '修理厂端',
                  status: '2'
                }]
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '可用',
                  status: '1'
                }, {
                  name: '不可用',
                  status: '0'
                }]
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增关键词'
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
            prop: 'word',
            label: '关键词'
          },
          {
            prop: 'star',
            label: '类型',
            render: (row, index) => {
              return (
                <span>{row.type == 1 ? '司机端' : '修理厂端 '}</span>
            );
            }
          },
          {
            prop: "status",
            label: "状态",
            render: (row, index) => {
              return (
                <span>{row.status == 0 ? '不可用' : '可用 '}</span>
            );
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
        typeArray: [{
          value: 1,
          label: '司机端'
        }, {
          value: 2,
          label: '修理厂端'
        }],
        statusArray: [{
          value: 1,
          label: '可用'
        }, {
          value: 0,
          label: '不可用'
        }],

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增
        dialogForm: {
          word: '',
          type: '',
          status: ''
        },
        dialogFormRules: {
          word : [
            {required: true,  message: '请输入取消原因', trigger: 'blur'},
          ],
          type : [
            {required: true,  message: '请选择类型', trigger: 'change'},
          ],
          status : [
            {required: true,  message: '请选择状态', trigger: 'change'},
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
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.pagination.pageIndex = 1;
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
        getCancelKeyword(params).then((res) => {
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
          this.dialogForm = Object.assign({}, val)
        }
        this.dialogFormVisible = true;
      },

      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            saveOrEditCancelKeyword(this.dialogForm).then(res => {
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
          word: '',
          type: '',
          status: ''
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
          delCancelKeyword(params).then((res) => {
            if(res.code == 200) {
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              let params = Object.assign({
                menuId: this.$route.query.menuId,
                pageNum: this.pagination.pageIndex,
                pageSize: this.pagination.pageSize
              }, this.searchData);
              getCancelKeyword(params).then((res) => {
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
      }
    }
  }
</script>

<style lang="sass">
	.appraiseBox
		overflow: hidden
		margin: 20px 20px 0
		.el-rate
			position: absolute
			top: 10px
</style>
