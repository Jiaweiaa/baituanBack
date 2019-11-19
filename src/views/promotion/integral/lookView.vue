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
		<!--
	列表组件
	-->
		<el-table
				class="table"
				stripe
				:data="tableData"
				v-loading="options.loading"
				border>
			<el-table-column
					label="code"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.code ? scope.row.code  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="状态"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.status == 1 ? '未使用': scope.row.status == 3 ? '未使用' : '已使用'}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="面值"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.score}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="使用人"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.userName}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="使用时间"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.userTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="操作" >
				<template slot-scope="scope">
					<el-button v-show="scope.row.status == 3" @click="edit(scope.row)" size="small" type="success" icon="el-icon-setting">启用</el-button>
					<el-button v-show="scope.row.status == 1" @click="edit(scope.row)" size="small" type="danger" icon="el-icon-setting">禁用</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<el-pagination
				:total="pagination.total"
				:page-size="pagination.pageSize"
				:page-sizes="[5, 10, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleIndexChange"
				style="margin-top: 20px;text-align: right"
		></el-pagination>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    codeList,
    EnableOrDisableCode
  } from '@/api/promotion/integrai/index'
  export default {
    name: 'name',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '已使用',
                  status: '2'
                }, {
                  name: '未使用',
                  status: '1'
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
            prop: 'code',
            label: 'code'
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
              <div>{row.status == 1 ? '未使用': '已使用'}</div>
              )
		      }
		      },
          {
            prop: 'score',
            label: '面值'
          },
          {
            prop: 'userTime',
            label: '使用时间'
          }
        ],
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 30,
          name: '',
          activeId: ''
        },
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },
        dialogFormVisible: false
      }
    },
    components: {
      searchView,
      CommonTable
    },
	  created() {
      this.getList();
	  },
    methods: {
      getList() {
        this.pagination.activeId = this.$route.query.id;
        codeList(this.pagination).then(res => {
          this.tableData = res.result.records;
	        this.tableData.map(v => {
	          if(v.userTime) {
	            v.userTime =this.formatTime(v.userTime) ;
	          }
	          
	        })
          this.pagination.total = Number(res.result.total);
        })
      },


      handleSizeChange(size) {
        // 切换每页显示的数量
        this.pagination.pageSize = size;
        this.getList();
      },
      handleIndexChange(current) {
        // 切换页码
        this.pagination.pageIndex = current;
        this.getList();
      },


      // 搜索方法
      searchBtn(val) {
        this.pagination.status = val.status;
        this.getList();
      },
	    
	    addZero(s) {
			  return s < 10 ? '0' + s: s;
			},
	    formatTime(getDate) {
        const date = new Date(getDate)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
		    
		    let newDate = year + '-' + this.addZero(month) + '-' +  this.addZero(day) + ' ' + this.addZero(hour) + ':' +  this.addZero(minute) + ':' + this.addZero(second);
        return newDate;
      },

      edit(val) {
        this.$confirm("此操作将改变该券的状态是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let status = '';
          if(val.status == 1) {
            status = 3;
          }else {
            status = 1;
          }
          let params = {
            id: val.id,
            status
          }
          EnableOrDisableCode(params).then((res) => {
            console.log(res);
            if(res.code == 200) {
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

    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
