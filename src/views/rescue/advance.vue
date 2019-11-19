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
				@selection-change="getSelectOption"
		/>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    getWithdrawApplicationWithPage,
    withdraw2WeChat
  } from '@/api/rescue/advance';

  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入提现人昵称',
                inputModel: 'memNickname',
                labelName: '提现人昵称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入提现人账号',
                inputModel: 'memLoginName',
                labelName: '提现人账号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入提现人手机号',
                inputModel: 'memMobile',
                labelName: '提现人手机号',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'status',
                labelName: '提现状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '已审核',
                  status: '1'
                }, {
                  name: '待审核',
                  status: '0'
                }]
              }
            ],
            button: [
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              },
              {
                type: 'success',
                func: 'addBtn',
                name: '批量审批'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'memLoginName',
            label: '提现人姓账号'
          },
          {
            prop: 'memNickname',
            label: '提现人昵称'
          },
          {
            prop: 'memMobile',
            label: '提现人手机号'
          },
          {
            prop: 'amount',
            label: '提现金额'
          },
          {
            prop: 'wechatAccount',
            label: '提现状态',
            render: (row, index) => {
              return (
                <span>{row.status == 0 ?'待审核' : '已审核'}</span>
            );
            }
          },
          {
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '审批',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.reviewed(row);
              }
            }]
          }
        ],
        // 全选
        selection: [],
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1 ,
          pageSize: 5
        },
        options: {
          mutiSelect: true,
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
      //批量选择
      getSelectOption(option) {
        this.selection = option;
      },

      // 列表, 搜索
      getList() {
        this.options.loading = true;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          },
          this.searchData
        );
        getWithdrawApplicationWithPage(params).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },
      searchBtn(val) {
        this.searchData = Object.assign({}, val);
        this.getList();
      },
      // 审核
      reviewed(val) {
        if(val.status == 1) {
          this.$message({
            message: '已审核完成',
            type: 'warning'
          });
          return;
        }
        this.$confirm("此操作将审核该提现是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let arr = [];
            arr.push(val.id);
            let params = {
              ids: arr
            };
            withdraw2WeChat(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "审核提现成功!"
                });
                this.getList();
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已经取消审核"
            });
          });
      },

      // 批量审批
      addBtn() {
        this.$confirm("此操作将审核选中提现是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let arr = [];
            this.selection.map(v => {
              arr.push(v.id)
            })
            let params = {
              ids: arr
            };
            withdraw2WeChat(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "审核提现成功!"
                });
                this.getList();
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已经取消审核"
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
