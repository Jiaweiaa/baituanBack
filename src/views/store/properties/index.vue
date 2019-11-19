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
		/>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
	import {
    getModulePropertySet
	} from "@/api/store/properties"
  
  
  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
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
            prop: 'name',
            label: '属性值名称'
          },
          {
            prop: 'description',
            label: '属性集描述'
          },
          {
            label: '组件类型',
            render: (row, index) => {
              return <p>{row.type == 1 ? "基础组件" : row.type == 2 ? '营销组件' : '其他'}</p>;
            }
          },
          {
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '查看属性集',
              type: 'warning',
              icon: 'el-icon-search',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
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
        getModulePropertySet().then(res => {
          this.tableData = res.result;
          this.options.loading = false;
        })
      },
      edit(val) {
        this.$router.push({
          path:'/store/propertiesTemplate/detail',
          query:{
            id: val.id
          }
        })
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
		padding-bottom: 40px;
</style>
