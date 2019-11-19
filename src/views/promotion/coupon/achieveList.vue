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
  import { achieveList } from '@/api/promotion/coupon';

  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入优惠码',
                inputModel: 'offerCode',
                labelName: '优惠码',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'achieveType',
                labelName: '获取方式',
                model: '',
                type: 'el-select',
                options: [{
                  name: '领取',
                  status: '1'
                }, {
                  name: '发放',
                  status: '0'
                }]
              },
              {
                inputModel: 'date',
                labelName: '获取时间',
                model: '',
                type: 'el-date-picker'
              },
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
            prop: 'offerCode',
            label: '优惠码'
          },
          {
            prop: 'nickname',
            label: '会员昵称'
          },
          {
            prop: 'mobile',
            label: '会员手机'
          },
          {
            prop: 'email',
            label: '会员邮箱'
          },
          {
            prop: 'achieveTime',
            label: '获取时间'
          },
          {
            prop: 'achieveType',
            label: '获取方式'
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
      // 获取数据
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          offerId: this.$route.query.id
        }, this.searchData);
        achieveList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },

      // 搜索方法
      searchBtn(val) {
        this.searchData = Object.assign({
          startTime: val.date[0],
	        endTime: val.date[1]
        } ,val);
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
