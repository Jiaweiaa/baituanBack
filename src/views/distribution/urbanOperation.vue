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
			新增/编辑
		-->
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="名称" label-width="150px" prop="name">
					<el-input placeholder="请输入名称"  v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="地址" label-width="150px" prop="address">
					<el-input placeholder="请输入地址"  v-model="dialogForm.address"></el-input>
				</el-form-item>
				<el-form-item label="联系人" label-width="150px" prop="linkman">
					<el-input placeholder="请输入联系人"  v-model="dialogForm.linkman"></el-input>
				</el-form-item>
				<el-form-item label="电话" label-width="150px" prop="mobile">
					<el-input placeholder="请输入电话"  v-model="dialogForm.mobile"></el-input>
				</el-form-item>
				<el-form-item label="描述" label-width="150px" prop="depiction">
					<el-input placeholder="请输入描述"  v-model="dialogForm.depiction"></el-input>
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
  import searchView from '@/components/searchView/index'
  import CommonTable from '@/components/Table'
  import {
    getOperationCenterPage,
    createOrUpdateOperationCenter
  } from "@/api/distribution/index";

  export default {
    name: 'urbanOperation',
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
                name: '新增运营中心'
              }
              // {
              //   type: 'primary',
              //   func: 'searchBtn',
              //   name: '搜索'
              // }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'name',
            label: '名称'
          },
          {
            prop: 'linkman',
            label: '联系人'
          },
          {
            prop: 'mobile',
            label: '联系电话'
          },
	        {
	          prop: 'address',
		        label: '地址'
	        },
          {
            prop: 'depiction',
            label: '描述'
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
          initTable: true // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          name: '',
	        address: '',
	        linkman: '',
	        mobile: '',
	        depiction: ''
        },
        dialogFormRules: {
          name: [
            {required: true,  message: '请输入名称', trigger: 'blur'}
          ],
          address: [
            {required: true,  message: '请输入地址', trigger: 'blur'}
          ],
          linkman: [
            {required: true,  message: '请输入联系人', trigger: 'blur'}
          ],
          mobile: [
            {required: true,  message: '请输入联系电话', trigger: 'blur'}
          ],
        },
        dialogFormVisible: false
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
        this.options.pageIndex = 1;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          },
          this.searchData
        );
        getOperationCenterPage(params).then(res => {
          console.log(res)
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
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
          this.dialogTitle = '新增运营中心';
        }else {
          this.dialogTitle = '编辑运营中心';
          this.dialogForm = Object.assign({}, val);
        }
        this.dialogFormVisible = true;
      },

      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            let params = Object.assign({}, this.dialogForm);
            if(this.dialogTitle == '新增') {
              createOrUpdateOperationCenter(params).then((res) => {
                if(res.code == 200) {
                  this.getList();
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
              createOrUpdateOperationCenter(params).then(res => {
                if(res.code == 200) {
                  this.getList();
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
      // 取消
      cancelDialog() {
        this.$refs['dialogForm'].resetFields();
        this.dialogFormVisible = false;
      },
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
