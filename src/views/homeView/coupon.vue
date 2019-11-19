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
			图片查看
		-->
		<el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
			<div style="text-align: center;">
				<img width="360" :src="'http://qn.gaoshanmall.cn/'+photoUrl" alt />
			</div>
		</el-dialog>
		
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
					label="优惠券名称"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.offerCouponListVo ? scope.row.offerCouponListVo.name  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="排序"
					align="center">
				<template slot-scope="scope">
					<el-input-number size="small" v-model="scope.row.sort" @change="handleChange(scope.row)" :min="1"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column
					label="库存 | 已发放"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.offerCouponListVo.inventory ? scope.row.offerCouponListVo.inventory  : ''}} | {{ scope.row.offerCouponListVo.inventory - scope.row.offerCouponListVo.availableInventory }}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="优惠券类型"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.offerCouponListVo.offerCouponType == 1000 ? '微信卡券' : scope.row.offerCouponListVo.offerCouponType == 2000 ? '通用卡券' : scope.row.offerCouponListVo.offerCouponType == 3000 ? '专用卡券' : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="商品范围"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.offerCouponListVo.isWholeOrder == 1 ? '全部商品' : scope.row.offerCouponListVo.isWholeOrder == 0  ? '指定商品' : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="有效期"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.offerCouponListVo.startDate}} - {{scope.row.offerCouponListVo.endDate}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="状态"
					align="center">
				<template slot-scope="scope">
					<el-tag
							:type="scope.row.offerCouponListVo.status == 1 ? 'warning' : scope.row.offerCouponListVo.status == 2 ? 'success' : 'danger'">
						{{scope.row.offerCouponListVo.status == 1 ? '未开始' : scope.row.offerCouponListVo.status == 2 ? '进行中' : '结束'}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200" prop="created_at" label="操作" >
				<template slot-scope="scope">
					<el-button @click="edit(scope.row)" size="small" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button @click="del(scope.row)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!--
			新增热销
		-->
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form
				:model="dialogForm"
				style="width: 95%; margin: 0 auto;"
				status-icon
				:rules="dialogFormRules"
				ref="dialogForm">
				<el-form-item>
					<div style="float: left; margin-right: 10px; margin-top: 1px; margin-bottom: 20px;">店铺筛选:</div>
					<el-select
						@change="selectTableChange"
						clearable
						size="small"
						v-model="couponSearch.storeId"
						filterable
						placeholder="请选择">
						<el-option
							v-for="item in storeList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-table
					:loading="couponLoading"
					:data="couponList"
					style="width: 100%"
					max-height="250">
					<el-table-column
						prop="name"
						align="center"
						label="优惠券名称">
					</el-table-column>
					<el-table-column
						prop="inventory"
						align="center"
						label="已发放">
					</el-table-column>
					<el-table-column
							prop="startDate"
							align="center"
							label="起始时间">
					</el-table-column>
					<el-table-column
							prop="endDate"
							align="center"
							label="结束时间">
					</el-table-column>
					<el-table-column
							align="center"
							label="操作">
						<template slot-scope="scope">
							<el-button @click="checkRow(scope.row)" type="text" size="small">选中</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					:total="couponSearch.total"
					:page-size="couponSearch.pageSize"
					:page-sizes="[5, 10, 20]"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleIndexChange"
					style="margin-top: 20px;text-align: right"
				></el-pagination>
				<el-form-item label="选中优惠券" prop="selectData">
					{{dialogForm.selectData.name}}
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from "@/components/Table";
  import {
    getIndexCoupon,
    saveOrEditCoupon,
    deleteIndexCoupon,
    editCouponDetail,
    allAavailableCoupon,
    getAllStoreList
  } from "@/api/homeView/index";

  import { getItemByCode } from "@/api/homeView";
  export default {
    name: "name",
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
                name: "新增优惠券列表"
              }
            ]
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
          initTable: true // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogId: '',
        dialogTitle: "",
        // 编辑新增用户
        dialogForm: {
          selectData: []
        },
        dialogFormRules: {
          selectData: {
            type: "object",
            required: true,
            message: "请选择优惠券",
            trigger: "blur"
          }
        },
        dialogFormVisible: false,

        photoVisible: false,
        photoUrl: "",
        goodsLoading: false,
        goodsList: null,
	      
	      // 店铺列表
	      storeList: [],
	      couponList: [],
	      couponSearch: {
          storeId: '',
		      pageSize: 5,
		      pageNum: 1,
          total: 0
	      },
        couponLoading: false
       
      };
    },
    components: {
      searchView,
      CommonTable
    },
	  created() {
      this.getList();
      this.getAllAavailableCoupon();
      getAllStoreList().then(res => {
        this.storeList = res.result;
      })
	  },
    methods: {
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize,
	          type: 1
          },
          this.searchData
        );
        getIndexCoupon(params).then(res => {
          this.tableData = res.result;
          this.options.loading = false;
        });
      },

	    // 获取优惠券
      getAllAavailableCoupon() {
        this.couponLoading = true;
        allAavailableCoupon(this.couponSearch).then(res => {
          this.couponLoading = false;
          this.couponList = res.result.records;
          this.couponSearch.total = Number(res.result.total);
          this.couponSearch.pageNum = Number(res.result.current);
        })
      },
      handleSizeChange(val) {
				this.couponSearch.pageSize = val;
				this.getAllAavailableCoupon();
      },
      handleIndexChange(val) {
        this.couponSearch.pageNum = val;
        this.getAllAavailableCoupon();
      },
      checkRow( val) {
        this.dialogForm.selectData = val;
      },
	    // 优惠券筛选
      selectTableChange(val) {
        this.couponSearch.storeId = val;
        this.getAllAavailableCoupon();
      },
	    
      // 查看图片
      lookThis(val) {
        if(val.itemDto!=null){
          this.photoUrl = val;
          this.photoVisible = true;
        }else{
          this.$message('该商品已失效,请删除')
        }

      },

      // 新增
      addBtn() {
        this.dialogTitle = '新增';
        this.dialogFormVisible = true;
      },

      // 取消新增
      cancelDialog() {
        this.dialogFormVisible = false;
        this.couponSearch.storeId = '';
        this.dialogForm = {
          selectData: [],
	        type: 1
        };
        this.getAllAavailableCoupon();
        this.$refs["dialogForm"].resetFields();
      },
      // 新增或编辑
      dialogClick() {
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            let paramsData = '';
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              paramsData = {
                couponId: this.dialogForm.selectData.id
              };
            }else {
              paramsData = {
                id: this.dialogId,
                couponId: this.dialogForm.selectData.id,
	              type: 1
              }
            }
            saveOrEditCoupon(paramsData).then(res => {
              if (res.code == 200) {
                this.cancelDialog();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.btnLoading = false;
                this.getList();
              } else {
                this.$notify.error({
                  title: res.message,
                  offset: 100
                });
              }
            });
          }
        });
      },

      // 删除
      del(val) {
        this.$confirm("此操作将永久删除该优惠券是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              id: val.id
            };
            deleteIndexCoupon(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getList();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
	    
	    // 编辑
	    edit(val) {
        this.dialogTitle = '编辑';
        this.dialogId = val.id;
        editCouponDetail({
	        id: val.id
        }).then(res => {
          this.dialogForm = {
	          selectData:  res.result.offerCouponListVo
          };
          this.dialogFormVisible = true;
        })
      },
	    
	    handleChange(val) {
        // 排序问题
        this.options.loading = true;
        let params = {
          id: val.id,
	        type: 1,
          sort: val.sort
        };
        saveOrEditCoupon(params)
        .then(res => {
          if (res.code == 200) {
            this.getList();
            this.$notify.success({
              title: res.message,
              offset: 100
            });
          }
        })
	    }
    }
  };
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
