<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-02 10:05:05
 * @LastEditTime: 2019-10-06 15:20:54
 * @LastEditors: Please set LastEditors
 -->
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
			@selection-change="handleSelectionChange"
		/>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
	import { getSupplierListWithPage, refuseSupplier, passSupplier, deleteSupplier } from '@/api/teamBuy/index'
  
  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [{
	            input: [{
	            placeholder: '请输入供应商',
	            inputModel: 'name',
	            labelName: '供应商',
	            model: '',
	            type: 'el-input'
	          },
	          {
	            placeholder: '请输入供应商手机号',
	            inputModel: 'mobile',
	            labelName: '手机号',
	            model: '',
	            type: 'el-input'
	          },
	          {
	            inputModel: 'approvalStatus',
	            labelName: '审核状态',
	            model: '',
	            type: 'el-select',
	            options: [{
	              name: '通过',
	              status: '1'
	            }, {
	              name: '未通过',
	              status: '0'
	            }]
	          }],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增供货商'
              },
              {
                type: 'success',
                func: 'toggleSure',
                name: '通过选择的供货商'
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
            prop: 'fullName',
            label: '供货商名称'
          },
          {
            prop: 'mobile',
            label: '手机号'
          },
          {
            prop: 'companyAddress',
            label: '地址'
          },
          {
            prop: 'createTime',
            label: '申请时间'
          },
          {
            showLabel: true,
            prop: 'status',
            label: '状态',
            hasPerm: 'sys:user:editStatus',
            // render 可以根据你想要渲染的方式渲染
            // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
            // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
            render: (row, index) => {
              return (
                <p onClick={e => this.openStatus(e, row)}>
                 <el-switch
		              active-value={1}
		              inactive-value={2}
                  active-text="通过"
                  inactive-text="不通过"
	                v-model={row.status}
	                active-color="#13ce66"
	                inactive-color="#ff4949">
                </el-switch>
                </p>
              )
            }
          },
          {
            button: true,
            label: '操作',
            group: [{
              name: '编辑',
              type: '',
              icon: 'el-icon-edit',
              hasPerm: 'sys:user:deleteUser',
              disabled: false,
              onClick: (row) => {
                this.edit(row)
              }
            }, {
              name: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              hasPerm: 'sys:user:deleteUser',
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
	      selectIds: []
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        getSupplierListWithPage(params).then((res) => {
          this.tableData =  res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      // 搜索
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },
      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.getList();
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageIndex = current;
        this.getList();
      },
	    // 状态修改
      openStatus(e, row) {
        let inBok = Object.assign({}, row);
        let params = {
          id: inBok.id,
          status: inBok.status
        }
        refuseSupplier(params).then((res) => {
          if(res.code == 200) {
            this.getList();
          }else {
            this.$notify({
              title: res.message,
              type: 'success'
            });
          }
        });
        e.cancelBubble = true // 停止冒泡，否则会触发 row-click
      },
	    // 选择
      handleSelectionChange(selection) {
        this.selectIds = [];
        selection.map(v => {
          this.selectIds.push(v.id)
        })
      },
	    // 批量通过
      toggleSure() {
        let params = {
          ids: this.selectIds
        }
        passSupplier(params).then(res => {
          if(res.code == 200) {
            this.getList();
          }else {
            this.$notify({
              title: res.message,
              type: 'success'
            });
          }
        })
      },
      addBtn() {
        this.$router.push({
          path: '/teamBuy/vendorTemplate/newVendor'
        });
      },

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
            deleteSupplier(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                let params = Object.assign({
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize
                }, this.searchData);
                this.options.loading = true;
                getSupplierListWithPage(params).then((res) => {
                  if(res.result.records.length <= 0 && this.pagination.pageIndex  > 1) {
                    this.pagination.pageIndex --;
                    this.getList();
                  }else {
                    this.getList();
                  }
                })
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

      edit(item) {
        this.$router.push({
          path: '/teamBuy/vendorTemplate/editVendor?id='+item.id
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
