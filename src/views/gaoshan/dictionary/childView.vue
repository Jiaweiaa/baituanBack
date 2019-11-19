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
				<div v-for="(domain, index) in dialogForm.domains" class="rowDomainsStyle">
					<el-form-item
						:label="'字典名称'"
						label-width="100px"
						:key="Math.random()"
						:prop="'domains.' + index + '.name'"
						:rules="{
				      required: true, message: '字典名称不能为空', trigger: 'blur'
				    }"
					>
						<el-input v-model="domain.name"></el-input>
					</el-form-item>
					<el-form-item
							:label="'字典code'"
							label-width="100px"
							:key="Math.random()"
							:prop="'domains.' + index + '.code'"
							:rules="{
				      required: true, message: '字典code不能为空', trigger: 'blur'
				    }"
					>
						<el-input v-model="domain.code"></el-input>
					</el-form-item>
					<i class="add icon el-icon-circle-plus-outline" v-show="dialogForm.domains.length == (index + 1) && dialogTitle == '新增'" @click="addDomain"></i>
					<i class="del icon el-icon-delete" v-show="dialogForm.domains.length > 1 && dialogTitle == '新增'" @click="removeDomain(domain)"></i>
				</div>
				
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
    deleteDicInfo,
    infoPageQuery,
    saveDicInfo
  } from '@/api/gaoshan/dictionary/index'

  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入字典名称',
                inputModel: 'name',
                labelName: '字典名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入字典code',
                inputModel: 'code',
                labelName: '字典code',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增字典'
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
            prop: 'name',
            label: '字典名称'
          },
          {
            prop: 'code',
            label: '字典code'
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

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增
        dialogForm: {
          domains: [{
            name: '',
            code: ''
          }]
        },
        dialogFormRules: {
          name   : [
            {required: true,  message: '请输入车辆类型名称', trigger: 'blur'},
          ],
          code   : [
            {required: true,  message: '请输入字典code', trigger: 'blur'},
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
        this.pagination.pageIndex = 1;
        this.searchData = val;
        this.getList();
      },

      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          parentId: this.$route.query.id,
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        infoPageQuery(params).then((res) => {
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
          let domains = [{
            name: val.name,
	          code: val.code,
	          id: val.id
          }]
          this.dialogForm = Object.assign({
            domains
          })
        }
        this.dialogFormVisible = true;
      },

      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            let params = {
              id: this.$route.query.id,
              infoArray: this.dialogForm.domains
            };
            saveDicInfo(params).then(res => {
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
          code: '',
          name: ''
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
          deleteDicInfo(params).then((res) => {
            if(res.code == 200) {
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              let params = Object.assign({
                parentId: this.$route.query.id,
                pageNum: this.pagination.pageIndex,
                pageSize: this.pagination.pageSize
              }, this.searchData);
              infoPageQuery(params).then((res) => {
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
	    
	    // 新增列表里的
      addDomain() {
        this.dialogForm.domains.push({
	        name: '',
	        code: ''
        })
      },
	    // 删除
      removeDomain(item) {
        let index = this.dialogForm.domains.indexOf(item)
        if (index !== -1) {
          this.dialogForm.domains.splice(index, 1)
        }
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
	.rowDomainsStyle
		width: 100%
		min-width: 720px
		height: 60px
		position: relative
		overflow: hidden
		.el-form-item
			margin-top: 5px
			width: 45%
			float: left
		.icon
			font-size: 20px
			margin-top: 15px
			margin-left: 2%
			cursor: pointer
</style>
