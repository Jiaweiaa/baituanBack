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
  import CommonTable from '@/components/Table';
  import {
    sendList
  } from '@/api/promotion/sendCoupon';

  export default {
    name: 'sendCoupon',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入优惠券名称',
                inputModel: 'name',
                labelName: '优惠券名称',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'searchDate',
                labelName: '发送时间',
                model: '',
                type: 'el-date-picker'
              },
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '发送优惠券'
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
            label: '优惠券名称'
          },
          {
            prop: 'memberCounts',
            label: '会员数量'
          },
          {
            prop: 'createTime',
            label: '发送时间'
          },
          {
            width: '300px',
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '查看',
              type: 'primary',
              icon: 'el-icon-search',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.look(row);
              }
            }]
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
        }
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
        sendList(params).then((res) => {
          this.tableData = res.result.records;
          this.options.loading = false;
        })
      },
      addBtn() {
        this.$router.push({
          path: '/promotion/sendCouponTemplate/newSendCoupon',
          query: {
            title: '发送优惠券'
          }
        });
      },
      searchBtn(val) {
        this.searchData = val;
        if(this.searchData.searchDate) {
          this.searchData.startTime = this.searchData.searchDate[0];
          this.searchData.endTime = this.searchData.searchDate[1];
        }
        this.getList();
      },
	    look(item) {
        this.$router.push({
          path: '/promotion/sendCouponTemplate/newSendCoupon',
          query: {
            title: '查看优惠券',
	          id: item.id
          }
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
