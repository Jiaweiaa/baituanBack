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
		<el-table
				class="table"
				stripe
				:data="tableData"
				v-loading="options.loading"
				border>
			<el-table-column
					label="活动名称"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.name ? scope.row.name  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="成团人数"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.groupbuyCustomNum}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="创建时间"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.createTime}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="修改时间"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.updateTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="操作" >
				<template slot-scope="scope">
					<el-button @click="see(scope.row)" size="small" type="success" icon="el-icon-setting">查看</el-button>
					<el-button @click="edit(scope.row)" size="small" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button @click="del(scope.row)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<el-pagination
			:total="pagination.total"
			:page-size="pagination.pageSize"
			:page-sizes="[5, 10, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="handleSizeChange"
			@current-change="handleIndexChange"
			style="margin-top: 20px;text-align: right"
		></el-pagination>
		
		
		<el-dialog title="编辑团购"  :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="活动名称" label-width="160px" prop="name">
					<el-input  v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="活动文案" label-width="160px" prop="marketingMessage">
					<el-input  type="textarea" v-model="dialogForm.marketingMessage"></el-input>
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
  import CommonTable from '@/components/Table'
  import {
    groupList,
    groupDetail,
    saveGroup,
    deleteGroup
  } from '@/api/promotion/groupBuy/index'

  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入活动名称',
                inputModel: 'offerName',
                labelName: '活动名称',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新建团购'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
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
          name: '',
          marketingMessage: ''
        },

        dialogFormRules: {
          name:[
            {required: true,  message: '请输入活动名称', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
	  created() {
      this.getList();
	  },
    methods: {
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        groupList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      handleSizeChange(size) {
        // 切换每页显示的数量
        this.pagination.pageSize = size;
        this.getList();
      },
      handleIndexChange(current) {
        // 切换页码
        this.pagination.pageIndex = current;
        this.getList();
      },


      // 新增
      addBtn() {
        this.$router.push({
          path: '/promotion/groupBuyingTemplate/newGroupBuying',
          query: {
            title: '新建团购'
          }
        });
      },

      edit(row) {
        groupDetail({
          groupId: row.id
        }).then(res => {
          this.dialogForm = res.result;
          this.dialogFormVisible = true;
        })
      },
      // 列表操作
      see(val) {
        this.$router.push({
          path: '/promotion/groupBuyingTemplate/groupBuyingView',
          query: {
            id: val.id
          }
        });
      },
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            saveGroup(this.dialogForm).then((res) => {
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
        });
      },
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {};
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
            deleteGroup(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                let params = Object.assign({
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize
                }, this.searchData);
                groupList(params).then((res) => {
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
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
