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
  import {
    get400OnlineOrder
  } from '@/api/rescue/telephoneRescue'
  
  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入救援手机号',
                inputModel: 'mobile',
                labelName: '救援手机',
                model: '',
                type: 'el-input'
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
            prop: 'code',
            label: '救援单号'
          },
          {
            prop: 'memberName',
            label: '救援姓名'
          },
          {
            prop: 'memberMobile',
            label: '救援电话'
          },
          {
            prop: "seq",
            label: "救援地址",
            render: (row, index) => {
              return (
                <span>{row.province},{row.city},{row.district}</span>
            );
            }
          },
          {
            prop: 'address',
            label: '详细地址'
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
        get400OnlineOrder(this.searchData).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
	      
      },
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
