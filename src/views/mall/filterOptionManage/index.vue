<template>
  <div class="filterOptionManageBox">
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
import CommonTable from "@/components/Table";

import {
  getFilterOptionList,
  deleteFilterOption
} from "@/api/gskeeper/filterOptionManage/index";

export default {
  name: "filterOptionManage",
  components: {
    searchView,
    CommonTable
  },
  data() {
    return {
      // 搜索table渲染的数据
      searchModel: [
        {
          input: [
            {
              inputModel: "type",
              labelName: "筛选项类型",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "全部",
                  status: ""
                },
                {
                  name: "系统内置",
                  status: "1"
                },
                {
                  name: "销售属性",
                  status: "2"
                },
                {
                  name: "功能属性",
                  status: "3"
                }
              ]
            },
            // {
            //   placeholder: "请输入筛选项",
            //   inputModel: "loginName",
            //   labelName: "筛选项",
            //   model: "",
            //   type: "el-input"
            // },
            {
              placeholder: "请输入筛选显示名称",
              inputModel: "displayName",
              labelName: "筛选显示名称",
              model: "",
              type: "el-input"
            },
            {
              inputModel: "optionType",
              labelName: "筛选类型",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "全部",
                  status: ""
                },
                {
                  name: "单选",
                  status: "1"
                },
                {
                  name: "多选",
                  status: "2"
                }
              ]
            }
          ],
          button: [
            {
              type: "success",
              func: "addBtn",
              name: "新增筛选项"
            },
            {
              type: "primary",
              func: "searchBtn",
              name: "搜索"
            }
          ]
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "type",
          label: "筛选项类型",
          render: (row, index) => {
            return (
              <div>{row.type == 1 ? '系统内置' : row.type == 2 ? '销售属性' : '功能属性'}</div>
            )}
        },
        // {
        //   prop: "userName",
        //   label: "筛选项"
        // },
        {
          prop: "displayName",
          label: "筛选显示名称"
        },
        {
          prop: "optionType",
          label: "筛选类型",
          render: (row, index) => {
            return (
              <div>{row.optionType == 1 ? '单选' :  '多选'}</div>
          )}
        },
        {
          prop: "channelNameString",
          label: "可用渠道"
        },
        {
          prop: "sortNo",
          label: "排序号"
        },
        {
          width: "300px",
          button: true,
          label: "操作",
          group: [{
              // you can props => type size icon disabled plain
              name: "编辑",
              type: "warning",
              icon: "el-icon-edit",
              plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            },
            {
              name: "删除",
              type: "danger",
              icon: "el-icon-delete",
              disabled: false,
              onClick: row => {
                this.del(row);
              }
            }
          ]
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
        initTable: true // 是否一挂载就加载数据
      }
    };
  },

  methods: {
    // 获取数据
    getList() {
      this.options.loading = true;
      let params = Object.assign({
        pageNum: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }, this.searchData);
      getFilterOptionList(params).then((res) => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      })
    },

    // 编辑调取方法
    edit(val) {
      this.$router.push({
        path: '/mall/filterOptionTemplate/filterOptionManageDetail',
        query: {
          title: '编辑',
          id: val.id
        }
      });
    },
    // 新增调取方法
    addBtn() {
      this.$router.push({
        path: '/mall/filterOptionTemplate/filterOptionManageDetail',
        query: {
          title: '新增'
        }
      });
    },


    // // 图片库关闭/开启
    // this.imageLibrary.$emit("dialogFormVisible", false);
    // this.imageLibrary.$emit("dialogFormVisible", true);



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
        deleteFilterOption(params).then((res) => {
          if(res.code == 200) {
            this.$notify.success({
              title: res.message,
              offset: 100
            });
            this.getList();
          }
        })

      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    // 搜索方法
    searchBtn(val) {
      console.log(val);
      this.searchData = val;
      this.getList();
    },
  }
};
</script>

<style lang="sass">
  .filterOptionManageBox
    overflow: hidden
    margin: 20px 20px 0
</style>
