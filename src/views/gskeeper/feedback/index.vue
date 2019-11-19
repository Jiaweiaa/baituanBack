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
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import { feedbackList } from '@/api/gskeeper/feedback/index';

  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入修配厂名称',
                inputModel: 'garageName',
                labelName: '修配厂名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入手机号',
                inputModel: 'mobile',
                labelName: '手机号',
                model: '',
                type: 'el-input'
              }
            ],
            button: [

            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'garageName',
            label: '修配厂名称'
          },
          {
            prop: 'feedback',
            label: '反馈意见'
          },
          {
            prop: 'empName',
            label: '反馈人姓名'
          },
          {
            prop: 'loginMobile',
            label: '反馈人手机'
          },
          {
            prop: 'createTime',
            label: '反馈时间'
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
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        feedbackList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
