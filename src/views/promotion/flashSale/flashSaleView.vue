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
		<el-table
			class="table"
			stripe
			:data="tableData"
			v-loading="options.loading"
			border>
			<el-table-column
					label="活动名称"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.offerName ? scope.row.offerName  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="商品名称"
				align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.itemTitle ? scope.row.itemTitle  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="有效期"
				align="center">
				<template slot-scope="scope">
					<span>{{scope.row.startDate}} - {{scope.row.endDate}}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="可用渠道"
				align="center">
				<template slot-scope="scope">
					<span>{{scope.row.channelName}}</span>
				</template>
			</el-table-column>
			<el-table-column
							label="状态"
							align="center">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.status == 1 ? 'warning' : scope.row.status == 2 ? 'success' : 'danger'">
						{{scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : '结束'}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column
							label="复制链接"
							align="center">
				<template slot-scope="scope">
					<p style="cursor:pointer;">
					<el-button type="text">复制url</el-button>
					</p>
				</template>
			</el-table-column>

			<el-table-column align="center" prop="created_at" label="操作" >
				<template slot-scope="scope">
					<el-button @click="see(scope.row)" size="small" type="success" icon="el-icon-setting">查看</el-button>
					<el-button v-show="scope.row.status == 0 ? false :true"  @click="edit(scope.row)" size="small" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button v-show="scope.row.status == 0 || scope.row.status == 2 ? false :true" @click="del(scope.row)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
					<el-button v-show="scope.row.status == 2 ? true : false" @click="stop(scope.row)" size="small" type="danger" icon="el-icon-delete">强制停止</el-button>
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
  import { channelList, limitDiscountList, deleteLimitDiscount, stopLimitDiscount } from '@/api/promotion/flashSale';

  export default {
    name: 'flashSale',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入活动名称',
                inputModel: 'offerName',
                labelName: '活动名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入商品名称',
                inputModel: 'itemTitle',
                labelName: '商品名称',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'searchDate',
                labelName: '有效期',
                model: '',
                type: 'el-date-picker'
              },
              {
                inputModel: 'status',
                labelName: '渠道',
                model: '',
                type: 'el-select',
                options: ''
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '未开始',
                  status: '1'
                }, {
                  name: '进行中',
                  status: '2'
                },{
                  name: '已结束',
                  status: '0'
                }]
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新建限时抢购'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
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
          initTable: true, // 是否一挂载就加载数据
        },
        channelListData: [{
          name: '全部',
          status: ''
        }]
      }
    },
    components: {
      searchView,
      CommonTable
    },
	  created() {
      this.getList();
      channelList().then(res => {
        if(res.code == 200) {
          res.result.map(v => {
            this.channelListData.push(v)
          });
          this.searchModel[0].input[3].options = this.channelListData;
        }
      })
	  },
    methods: {
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        limitDiscountList(params).then((res) => {
          this.tableData = res.result.records;
          this.tableData.map(v => {
            v.channelName = '';
            v.channelIds.map(vv => {
              if(vv = 33) {
                v.channelName += '微信'
              }
            })
          });
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
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
	    
	    // 搜索
      searchBtn(val) {
        this.searchData = val;
        if(this.searchData.searchDate) {
          this.searchData.startTime = this.searchData.searchDate[0];
          this.searchData.endTime = this.searchData.searchDate[1];
        }
        this.getList();
      },
	    // 新增
      addBtn() {
        this.$router.push({
          path: '/promotion/flashSaleTemplate/newFlashSale',
          query: {
            title: '新增限时抢购'
          }
        });
      },
	    
	    // 列表操作
	    see(val) {
        this.$router.push({
          path: '/promotion/flashSaleTemplate/newFlashSale',
          query: {
            title: '查看限时抢购',
	          id: val.offerId
          }
        });
	    },
	    edit(val) {
        this.$router.push({
          path: '/promotion/flashSaleTemplate/newFlashSale',
          query: {
            title: ' 编辑限时抢购',
            id: val.offerId
          }
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
            offerId: val.offerId
          }
          deleteLimitDiscount(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              limitDiscountList(this.searchData).then((res) => {
                if(res.result.records.length <= 0 && this.searchParams.pageNum  > 1) {
                  this.searchParams.pageNum --;
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
      stop(val) {
        this.$confirm("此操作将停止限时抢购是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            offerId: val.offerId
          }
          stopLimitDiscount(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "强制停止成功!"
              });
              limitDiscountList(this.searchData).then((res) => {
                if(res.result.records.length <= 0 && this.searchParams.pageNum  > 1) {
                  this.searchParams.pageNum --;
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
            message: "已取消强制停止"
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
