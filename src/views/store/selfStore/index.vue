<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-17 16:14:05
 * @LastEditTime: 2019-09-17 14:11:12
 * @LastEditors: Please set LastEditors
 -->
<template>
	<div class="storeTemplateList">
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
  import CommonTable from "@/components/Table";
  import {
    getTemplateList,
    setUsingTemplate,
    delTemplate
  } from "@/api/store/storeList/index";

  export default {
    name: "storeList",
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [],
            button: [
              {
                type: "success",
                func: "addBtn",
                name: "新增店铺模板"
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: "name",
            label: "模板名称"
          },
          {
            showLabel: true,
            prop: 'isUsing',
            label: '模板状态',
            render: (row, index) => {
              return (
                <p onClick={e => this.openStatus(e, row)}>
                   <el-switch activeValue={1} inactiveValue={0} v-model={row.isUsing} active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </p>
              )
            }
          },
          {
            prop: "createTime",
            label: "创建时间"
          },
          {
            width: "300px",
            button: true,
            label: "操作",
            group: [
              {
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
                // you can props => type size icon disabled plain
                name: "删除",
                type: "danger",
                icon: "el-icon-delete",
                plain: true,
                onClick: (row, index) => {
                  // 箭头函数写法的 this 代表 Vue 实例
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
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 获取列表
      getList() {
        this.options.loading = true;
        getTemplateList().then(res => {
          this.tableData = res.result;
          this.options.loading = false;
        });
      },

	    // 设置为默认模板
      openStatus(dom, val) {
        this.options.loading = true;
        setUsingTemplate({
	        id: val.id
        }).then(res => {
          if(res.code == 200) {
            this.getList();
          }else {
            this.$notify.error({
              title: res.message,
              offset: 100
            });
          }
        })
        
      },
	    
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },

	    // 删除模板
	    del(row) {
        // console.log(item);
        this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          delTemplate({
            id: row.id
          }).then(res => {
            if (res.code == "200") {
              this.options.loading = true;
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            }else {
              this.$notify.error({
                title: res.message,
                offset: 100
              });
            }
          })
        });
	    },
	    
      // 编辑调取方法
      edit(val) {
        this.$router.push({
          path:'/store/selfStore/selfStoreDetail',
          query:{
            id: val.id
          }
        })
      },
      // 新增调取方法
      addBtn() {
        this.$router.push({
          path:'/store/selfStore/selfStoreDetail',
          query:{
            id: ''
          }
        })
      },
    }
  };
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
		.formTitle
			height: 40px
			line-height: 40px
			border-bottom: 1px solid #ccc
			margin-bottom: 20px

</style>
<style lang="sass">
	.storeTemplateList
		padding: 20px
</style>
