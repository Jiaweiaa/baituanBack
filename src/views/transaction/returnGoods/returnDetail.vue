<template>
	<div class="information">
		<div class="title">退换货详情</div>
		<el-form :model="dialogForm" style="width: 80%;margin: 0 auto;" class="formStyle" status-icon :rules="dialogFormRules"  ref="dialogForm">
			<el-form-item label="退换商品" label-width="120px" prop="applylines">
				<el-table
					ref="multipleTable"
					:data="tableData"
					tooltip-effect="dark"
					style="width: 100%"
					@selection-change="handleSelectionChange">
					<el-table-column
						type="selection"
						align="center">
					</el-table-column>
					<el-table-column
						label="购买商品名"
						align="center">
						<template slot-scope="scope">{{ scope.row.itemName }}</template>
					</el-table-column>
					<el-table-column
						prop="quantity"
						label="购买数量"
						align="center">
					</el-table-column>
					<el-table-column
						prop="discountPrice"
						label="购买单价"
						show-overflow-tooltip
						align="center">
					</el-table-column>
					<el-table-column
							prop="subTotal"
							label="行小记"
							align="center"
							show-overflow-tooltip>
					</el-table-column>
					<el-table-column
							prop="discountPrice"
							label="退款数量"
							width="200px"
							align="center">
						<template slot-scope="scope">
							<el-input-number :validate-event="false" v-model="scope.row.refundCount" size="small" label="请输入退款数量" :min="0" :max="scope.row.quantity"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column
							prop="discountPrice"
							label="退款金额"
							show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.refundCount ? scope.row.refundCount * scope.row.discountPrice : ''}}
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="取消原因" label-width="120px" prop="refundReason">
				<el-select style="width: 100%;" v-model="dialogForm.refundReason" placeholder="请选择">
					<el-option
							v-for="item in refundList"
							:key="item.name"
							:label="item.name"
							:value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注" label-width="120px" prop="remark">
				<el-input v-model="dialogForm.remark"></el-input>
			</el-form-item>
		</el-form>
		<div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
			<el-button @click="cancelDialog">取 消</el-button>
			<el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
		</div>
	</div>
</template>

<script>
  import {
    actOrderDetail,
    returnOrExchange,
    findAvailableOrderlines
  } from "@/api/transaction/returnGoods";

  export default {
    name: 'information',
    data() {
      return {
        tableData: [],
        btnLoading: false,
        
        refundList: [
          {
            name: '顾客原因要求取消'
          },
          {
            name: '联系不上顾客'
          },
          {
            name: '订单商品缺货'
          },
          {
            name: '价格错标，商家要求取消订单'
          },
          {
            name: '地址无法送达'
          },
          {
            name: '其他原因'
          },
        ],
        pageData: '',
        dialogForm: {
          applylines: [],
          refundType: 1
        },
        dialogFormRules: {
          applylines:[
            {required: true, type: 'array', message: '请选择退换货', trigger:  'blur'}
          ],
          refundReason:[
            {required: true, message: '请选择退货原因', trigger:  'select'}
          ],
        }
      }
    },
    created() {
      let params = {
        id: this.$route.query.id,
	      memberId: this.$route.query.memberId
      };
      findAvailableOrderlines({
        orderId: params.id
      }).then(res => {
        this.tableData = res.result;
      });
      actOrderDetail(params).then(res => {
        this.pageData = Object.assign({ refundType: 1}, res.result.orderVo);
      })
    },
    methods: {
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let bok = false;
            this.dialogForm.applylines.map((v, index) => {
              if(v.refundCount == undefined) {
                this.$notify.info({
                  title: '填写退货数量',
                  type: 'warning',
                  message: '填写第' + (Number(index + 1)) +'列的要退货商品数量'
                });
                bok = true;
              }
              v.orderLineId = v.id;
            });
            if(bok) return;
            this.btnLoading = true;
            this.dialogForm.orderId = this.pageData.id;
            this.dialogForm.orderCode = this.pageData.code;
            this.dialogForm.refundType = 1;
            returnOrExchange(this.dialogForm).then(res => {
              if(res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "申请退货成功!"
                  });
                this.cancelDialog()
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
              this.btnLoading = false;
            })
          }
        });
      },
      cancelDialog() {
        this.$router.push({
          path: '/transaction/returnGoodsTemplate/returnList'
        });
      },
      handleSelectionChange(val) {
	      this.dialogForm.applylines = val;
      }
    }
  }
</script>

<style lang="sass">
	.title
		font-size: 20px
		font-weight: bold
		margin-left: 20px
		margin-bottom: 20px
		margin-top: 20px
		color: #333
		.information
			overflow: hidden
			margin: 20px 20px 0
		.formTitle
			height: 40px
			line-height: 40px
			border-bottom: 1px solid #ccc
			margin-bottom: 20px
</style>
