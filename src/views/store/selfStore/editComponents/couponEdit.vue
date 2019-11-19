<template>
	<div class="couponEdit">
		<!--
     wjw
     优惠券
    -->
		<el-form
				:model="dialogForm"
				style="width: 100%; margin: 0 auto;"
				status-icon ref="dialogForm">
			<el-form-item
					v-for="(item, index) in propertiesData"
					:key="index"
					:label="item.name"
					label-width="80px">
				<el-radio-group
						v-if="index == 0 || index == 1 || index == 3 "
						v-model="index == 0 ? dialogForm[item.id].id : dialogForm[item.id]"
						@change="valChange(item.id)">
					<el-radio
						v-for="(childItem, childIndex) in item.modulePropertyValues"
						:label="childItem.id"
						:key="childIndex">
						{{childItem.name}}
					</el-radio>
				</el-radio-group>
				<el-checkbox-group
					v-model="dialogForm['57']"
					@change="handleCheckedValueChange"
					:min="1"
					v-if="index == 2">
					<el-checkbox v-for="value in item.modulePropertyValues" :label="value.name" :key="value.name">
						<div
							:style="{
								'width': '40px',
								'height': '40px',
								'border': '1px solid #ccc',
								'background': value.name
							}"
						>
						</div>
					</el-checkbox>
				</el-checkbox-group>
				<div class="couponList" v-if="index == 0">
					<div class="child" v-for="(couponView, couponIndex) in dialogForm[55].data">
						<i @click="deleteGoodsItem(couponIndex)" class="closeIcon el-icon-close"></i>
						<span style="width: 48%; text-align: left;margin-left: 10px; font-size: 13px;">{{couponView.name}}</span>
						<span style="width: 48%; text-align: right;margin-right: 20px; font-size: 13px;">{{couponView.offerCouponType == 1000 ? '微信卡券' : couponView.offerCouponType == 2000 ? '通用卡券' :couponView.offerCouponType == 3000 ? '专用卡券' : ''}}</span>
					</div>
					<div @click="addCoupon" style="cursor: pointer;" class="child"><span>+</span>添加优惠券<span style="font-size: 11px; margin-top: 2px; margin-left: 5px;">(最多10个优惠券)</span></div>
				</div>
			</el-form-item>
		</el-form>
		
		<!--
			选择优惠券
		-->
		<el-dialog title="选择关联" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-table
				class="table"
				stripe
				ref="multipleTable"
				@selection-change="handleSelectionChange"
				:data="tableData"
				v-loading="options.loading"
				border>
				<el-table-column
					type="selection"
					align="center"
					width="55">
				</el-table-column>
				<el-table-column
						label="优惠券名称"
						align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.name ? scope.row.name  : ''}}</span>
					</template>
				</el-table-column>
				<el-table-column
						label="库存 | 已发放"
						align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.inventory ? scope.row.inventory  : ''}} | {{ scope.row.inventory - scope.row.availableInventory }}</span>
					</template>
				</el-table-column>
				<el-table-column
						label="优惠券类型"
						align="center">
					<template slot-scope="scope">
						<span>{{scope.row.offerCouponType == 1000 ? '微信卡券' : scope.row.offerCouponType == 2000 ? '通用卡券' : scope.row.offerCouponType == 3000 ? '专用卡券' : ''}}</span>
					</template>
				</el-table-column>
				<el-table-column
						label="商品范围"
						align="center">
					<template slot-scope="scope">
						<span>{{scope.row.isWholeOrder == 1 ? '全部商品' : scope.row.isWholeOrder == 0  ? '指定商品' : ''}}</span>
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
						label="状态"
						align="center">
					<template slot-scope="scope">
						<el-tag
								:type="scope.row.status == 1 ? 'warning' : scope.row.status == 2 ? 'success' : 'danger'">
							{{scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : '结束'}}
						</el-tag>
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
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import { couponList } from '@/api/promotion/coupon';
	
  export default {
    name: 'noticeEdit',
    props:  ['propertiesData', 'index', 'dialogForm'],

    data() {
      return {
        typeData: '',
        pagination: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        btnLoading: false,
        dialogFormVisible: false,

        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },
        current: '',
	      selectedData: [],
	      tableData: []
      }
    },
    created() {
    },
    methods: {
      // 选中
      handleCheckedValueChange(val) {
        this.dialogForm['57'] = new Array(val[val.length - 1]);
      },
      
      // 全选
      handleSelectionChange(val) {
        this.selectedData = val;
      },

      // 确认取消
      dialogClick() {
        if((this.dialogForm[55].data.length + this.selectedData.length) > 10) {
          this.$notify({
            type: 'warning',
            title: '条数超出',
            message: '最多10个优惠券！'
          });
          return;
        }
        this.selectedData.forEach((v, i) => {
          this.dialogForm[55].data.push(v);
        });
        this.cancelDialog();
      },
      cancelDialog() {
        this.selectedData = [];
        this.pagination = {
          total: 0,
          pageNum: 1,
          pageSize: 10
        };
        this.$refs.multipleTable.clearSelection();
        this.dialogFormVisible = false;
      },
	    
      // 添加优惠券
      addCoupon() {
        this.getList();
      },
	    // 删除优惠券
      deleteGoodsItem(index) {
        this.dialogForm[55].data.splice(index, 1);
      },
	    
      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.getList();
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageNum = current;
        this.getList();
      },
      
      // 获取列表
	    getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        couponList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.dialogFormVisible = true;
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
	    },
      
      // 数据改变即时保存
      valChange() {
        this.$parent.isChange({
          data: this.dialogForm,
          index: this.index
        });
      }
    }
  }
</script>

<style lang="sass">
	.couponEdit
		.el-checkbox
			display: flex
			align-items: center
			float: left
		.couponList
			.closeIcon
				cursor: pointer
			.child
				border: 1px solid #ccc
				height: 35px
				line-height: 35px
				padding-left: 10px
				font-size: 13px
				align-items: center
				display: flex
				color: skyblue
				span
					font-size: 18px
					margin-right: 10px
					margin-top: -5px
</style>
