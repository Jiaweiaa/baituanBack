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
    getGarList
  }  from "@/api/gskeeper/repairPlant/index";

  export default {
    name: 'repairPlant',
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
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'summary',
            label: '概述'
          },
          {
            prop: 'content',
            label: '内容'
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
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        getGarList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },

    }
  }
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
