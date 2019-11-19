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
			查看
		-->
		<el-dialog title="查看详情" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="维修明细" label-width="100px">
					<el-table
						:data="dialogForm.repairDetail"
						style="width: 100%">
						<el-table-column
							prop="name"
							align="center"
							label="维修项目">
						</el-table-column>
						<el-table-column
							prop="type"
							align="center"
							label="维修类型">
							<template slot-scope="scope">{{ scope.row.type == 1? '联保联服' :'其他' }}</template>
						</el-table-column>
						<el-table-column
							prop="cost"
							align="center"
							label="维修价钱">
						</el-table-column>
						<el-table-column
							prop="description"
							align="center"
							label="维修描述">
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="btnLoading" @click="cancelDialog">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
	import {
    getRepairOrderWithPage
	} from '@/api/rescue/maintenance/index'
  
  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入用户昵称',
                inputModel: 'memNickname',
                labelName: '用户昵称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入用户电话',
                inputModel: 'memMobile',
                labelName: '用户电话',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入修配厂名称',
                inputModel: 'garageName',
                labelName: '修配厂名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入修配厂电话',
                inputModel: 'garageMobile',
                labelName: '修配厂电话',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入救援单code',
                inputModel: 'rescueOrderCode',
                labelName: '救援单code',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '未支付',
                  status: '1'
                }, {
                  name: '已支付',
                  status: '2'
                }]
              }
            ],
            button: [
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
            prop: 'memNickname',
            label: '用户昵称'
          },
          {
            prop: 'memMobile',
            label: '用户电话'
          },
          {
            prop: 'garageName',
            label: '修配厂名称'
          },
          {
            prop: 'garageMobile',
            label: '修配厂电话'
          },
          {
            prop: 'rescueOrderCode',
            label: '救援单code'
          },
          {
            prop: 'totalAmount',
            label: '维修总价'
          },
          {
            prop: 'status',
            label: '状态',
            render: (row, index) => {
              return (
                <span>{row.status == 1 ? '未支付' : '已支付 '}</span>
            );
            }
          },
          {
            prop: 'createTime',
            label: '订单创建时间'
          },
          {
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '查看',
              type: 'success',
              icon: 'el-icon-view',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.see(row);
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
        dialogForm: {},
        dialogFormRules: {},
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      getList() {
        this.options.loading = true;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          },
          this.searchData
        );
        getRepairOrderWithPage(params).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },

      // 搜索方法
      searchBtn(val) {
        this.pagination.pageIndex = 1;
        this.searchData = val;
        this.getList();
      },
	     
      see(val) {
        this.dialogFormVisible = true;
        this.dialogForm = val;
        console.log(val);
      },

      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {};
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
