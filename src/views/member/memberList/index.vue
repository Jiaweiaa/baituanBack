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
		
		<!--图片查看-->
		<el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
			<div style="text-align: center;">
				<img
					width="360"
					:src="'https://static.ibaituan.cn/'+photoUrl"
					alt="">
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    getMemListWithPage,
    editMemStatus
  } from '@/api/member/memberList/index'

  export default {
    name: 'name',
    data() {
      return {
        // 图片是否显示
        photoVisible: false,
        photoUrl: '',
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入登录名',
                inputModel: 'loginName',
                labelName: '登录名',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入昵称',
                inputModel: 'nickname',
                labelName: '昵称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入邮箱',
                inputModel: 'email',
                labelName: '邮箱',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入分组id',
                inputModel: 'groupId',
                labelName: '分组id',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请选择来源',
                inputModel: 'source',
                labelName: '来源',
                model: '',
                type: 'el-select',
                options: [{
					        name: '自注册',
					        status: '1'
					      }, {
					        name: '第三方',
					        status: '2'
					      }]
              },
              {
                placeholder: '状态',
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '可用',
                  status: '1'
                }, {
                  name: '不可用',
                  status: '3'
                }]
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
            prop: 'loginName',
            label: '登录名'
          },
          {
            prop: 'type',
            label: '用户类型',
            render: (row, index) => {
              return (
               <p>{row.type == 1 ?'自注册': '第三方'}</p>
            )
            }
          },
          {
            prop: 'type',
            label: '用户来源',
            render: (row, index) => {
              return (
                <p>{row.source == 1 ?'自注册':  '第三方' }</p>
            )
            }
          },
          {
            prop: 'type',
            label: '用户头像',
            render: (row, index) => {
              return (
                <img
		            on-click={() => this.lookThis(row.avatar)}
		            style="width: 50px; height: 50px; cursor: pointer;"
		            src={"http:"+row.avatar }
		            />
		          )
            }
          },
          {
            prop: 'nickname',
            label: '昵称'
          },
          {
            prop: 'mobile',
            label: '手机'
          },
          {
            prop: 'email',
            label: '邮箱'
          },
          {
            prop: 'groupName',
            label: '分组名称'
          },
          {
            prop: 'groupId',
            label: '分组id'
          },
          {
            prop: 'status',
            label: '状态',
            render: (row, index) => {
              return (
                <p>{row.status == 1 ?'可用': '不可用'}</p>
            )
            }
          },
          {
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '启用/禁用',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.stop(row);
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
        this.options.pageIndex = 1;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          },
          this.searchData
        );
        getMemListWithPage(params).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },
      lookThis(val) {
        this.photoUrl = val;
        this.photoVisible = true;
      },
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },
      stop(row) {
        console.log(row);
        let val = '';
        let status = '';
        if(row.status == 1) {
          val = '禁用';
          status = 0;
        }else {
          val = '启用';
          status = 1;
        }
	      this.$confirm("此操作将"+val+"该用户是否继续?", "提示", {
	        confirmButtonText: "确定",
	        cancelButtonText: "取消",
	        type: "warning"
	      })
        .then(() => {
          let params = {
            id: row.userId,
            status
          }
          editMemStatus(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: val+"成功!"
              });
              this.getList();
            }else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"+val
          });
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
