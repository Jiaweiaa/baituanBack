<template>
	<div class="subsidyList">
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
  import CommonTable from '@/components/Table'
  import {
    getScoreLogPage
  } from '../../api/subsidyList/index'
  
  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
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
                name: '新增用户'
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
            prop: 'nickname',
            label: '姓名'
          },
          {
            prop: 'amount',
            label: '补贴金数量'
          },
          {
            label: "方式",
            render: (row, index) => {
              return <span> {row.type == 1 ? '发放' : "发放"}</span>;
            }
          },
          {
            prop: 'createTime',
            label: '创建时间'
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
        dialogForm: {},
        dialogFormRules: {},
        dialogFormVisible: false
      }
    },
    components: {
      CommonTable
    },
    methods: {
      getList() {
        this.options.loading = true;
        this.options.pageIndex = 1;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize,
	          type: 1
          }
        );
        getScoreLogPage(params).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },
    }
  }
</script>

<style lang="sass">
	.subsidyList
		overflow: hidden
		margin: 20px 20px 0
</style>
