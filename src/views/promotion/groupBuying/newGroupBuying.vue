<template>
	<div class="information">
		<div class="title">{{pageTitle}}</div>
		<el-form
			:model="dialogForm"
			style="width: 80%;margin: 0 auto;"
			class="formStyle"
			status-icon
			:rules="dialogFormRules"
			ref="dialogForm">
			<el-form-item label="活动名称" label-width="180px" prop="offerName">
				<el-input :disabled="pageTitle == '查看团购'" v-model="dialogForm.offerName"></el-input>
			</el-form-item>
			<el-form-item label="活动文案" label-width="180px" prop="marketingMessage">
				<el-input :disabled="pageTitle == '查看团购'" type="textarea" v-model="dialogForm.marketingMessage"></el-input>
			</el-form-item>
			<el-form-item label="开始时间" label-width="180px" prop="startDate">
				<el-date-picker
					:disabled="pageTitle !== '新建团购'"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dialogForm.startDate"
					type="datetime"
					placeholder="选择日期时间"
					align="right"
					:picker-options="startDatePicker">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" label-width="180px" prop="endDate">
				<el-date-picker
					:disabled="pageTitle !== '新建团购'"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dialogForm.endDate"
					type="datetime"
					placeholder="选择日期时间"
					align="right"
					:picker-options="endDatePicker">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="发布渠道" label-width="180px" prop="channelIds">
				<el-checkbox-group :disabled="pageTitle == '查看团购'" v-model="dialogForm.channelIds">
					<el-checkbox v-for="channel in channelListData" :label="channel.id" :key="channel.id">{{channel.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<!--<el-form-item-->
				<!--v-show="dialogForm.status !== 2 ? false : $route.query.title.indexOf('编辑团购') !== -1 ? true : false"-->
				<!--label="操作"-->
				<!--label-width="160px">-->
				<!--<el-button type="danger" @click="stopDo" icon="el-icon-warning">强制停止</el-button>-->
			<!--</el-form-item>-->
		
			<el-form-item label="状态" label-width="180px" prop="status">
				<el-tag
					:type="dialogForm.status == 1 ? 'warning' : dialogForm.status == 2 ? 'success' : 'danger'">
					{{dialogForm.status == 1 ? '未开始' : dialogForm.status == 2 ? '进行中' : '已结束'}}
				</el-tag>
			</el-form-item>
			<el-form-item label="成团人数" label-width="180px" prop="groupbuyCustomNum">
				<el-input :disabled="pageTitle == '查看团购' || (dialogForm.status !== 1 && pageTitle == '编辑团购')" v-model="dialogForm.groupbuyCustomNum"></el-input>
			</el-form-item>
			<el-form-item label="活动自动取消订单时间" label-width="180px" prop="autoCancelTimeout">
				<el-input  :disabled="pageTitle == '查看团购'" style="width: 20%;" v-model="dialogForm.autoCancelTimeout">
					<template slot="append">分钟</template>
				</el-input>
			</el-form-item>
			<el-form-item label=" 选择商品" label-width="180px" prop="itemSku">
				<el-button style="margin-bottom: 10px;" type="primary" size="small"  :disabled="pageTitle == '查看团购'" @click="addGoods">添加商品</el-button>
				<el-collapse v-model="activeNames">
					<el-collapse-item :name="index" v-for="(item, index) in dialogForm.itemSku" :key="index">
						<template slot="title">
							{{item.itemCode}}   {{item.itemTitle}}({{item.tableData[0].canBuy? item.tableData[0].canBuy: item.maxUsesPerCustomer == null ? '不限购':'每人限购'+item.maxUsesPerCustomer	+'件'}},<el-link type="primary" @click.stop="setBuyNum(item)">设置</el-link>)
							<i @click.stop="deleteGoods(index)" style="position: absolute; right: 40px;" class="header-icon el-icon-delete"></i>
						</template>
						<el-table
							:data="item.tableData"
							style="width: 100%;">
							<el-table-column
								label="销售单元">
								<template slot-scope="scope">
									<span style="margin-left: 10px">{{ scope.row.propertiesName }}</span>
								</template>
							</el-table-column>
							<el-table-column
								label="原销售价">
								<template slot-scope="scope">
									<span style="margin-left: 10px">{{ scope.row.salePrice }}</span>
								</template>
							</el-table-column>
							<el-table-column>
								<template slot="header" slot-scope="scope">
									团购价
									<!--
									<i style="cursor: pointer;" @click="saleSetClick(index)" class="el-icon-s-tools"></i>
									-->
								</template>
								<template slot-scope="scope">
									<el-input
										:disabled="pageTitle !== '新建团购'"
										v-model="scope.row.discountedPrice"
										placeholder="团购抢购价"></el-input>
								</template>
							</el-table-column>
							<el-table-column>
								<template slot="header" slot-scope="scope">
									团购库存 <i @click="inventorySetClick(index)"  style="cursor: pointer;" class="el-icon-s-tools"></i>
								</template>
								<template slot-scope="scope">
									<el-input
										:disabled="scope.row.availableInventory == '' ? true :  scope.row.availableInventory == null ? true: $route.query.title.indexOf('编辑团购') !== -1 ? true: false"
										v-model="scope.row.availableInventory"
										placeholder="请输入团购库存"></el-input>
								</template>
							</el-table-column>
						</el-table>
					</el-collapse-item>
				</el-collapse>
			</el-form-item>
		</el-form>
		<div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
			<el-button v-show="pageTitle == '查看团购'" @click="cancelDialog">关 闭</el-button>
			<el-button v-show="pageTitle !== '查看团购'" @click="cancelDialog">取 消</el-button>
			<el-button v-show="pageTitle !== '查看团购'" type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
		</div>

		<!--
			添加商品
		-->
		<el-dialog title="添加商品" :visible.sync="goodsVisible" :before-close="cancelGoodsDialog">
			<el-form :model="goodsForm" style="width: 90%;margin: 0 auto;" status-icon :rules="goodsFormRules"  ref="goodsForm">
				<el-form-item label="商品编码" label-width="180px" prop="codes">
					<el-input type="textarea" v-model="goodsForm.codes"></el-input>
					<el-button style="margin-bottom: 10px;" type="primary" size="small" :loading="goodsLoading" @click="getGoods">获取商品</el-button>
				</el-form-item>
				<el-form-item v-show="goodsList.length > 0" label="商品信息如下" label-width="180px" prop="list">
					<el-checkbox-group ref="checkedGoods" v-model="goodsForm.list">
						<el-checkbox
							v-for="(item, index) in goodsList"
              :key="item.itemId"
							:label="item.itemId"
              style="width: 100%; overflow: hidden;">{{item.itemCode}}{{item.itemTitle}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelGoodsDialog">取 消</el-button>
				<el-button type="primary" @click="addNext">添加并继续</el-button>
				<el-button type="primary" @click="goodsClick">确 定</el-button>
			</div>
		</el-dialog>

		<!--
			团购价dialog
		-->
		<el-dialog title="团购" :visible.sync="saleVisible" :before-close="cancelSaleDialog">
			<el-form :model="saleForm" style="width: 90%;margin: 0 auto;" status-icon  ref="saleForm">
				<el-form-item label="活动价格类型" label-width="180px" prop="codes">
					<el-radio-group v-model="saleForm.type">
						<el-radio :label="1">减金额</el-radio>
						<el-radio :label="2">折扣百分比</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="活动额度" label-width="180px" prop="codes">
					<el-input placeholder="请输入内容" v-model="saleForm.saleNum">
						<template slot="append">{{ saleForm.type == 1 ? '元' : '%'}}</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelSaleDialog">取 消</el-button>
				<el-button type="primary" @click="saleClick">确 定</el-button>
			</div>
		</el-dialog>

		<!--
			团购库存dialog
		-->
		<el-dialog title="团购库存" :visible.sync="buyVisible" :before-close="cancelBuyDialog">
		<el-form :model="buyForm" style="width: 90%;margin: 0 auto;" status-icon  ref="buyForm">
			<el-form-item label="活动价格类型" label-width="180px" prop="codes">
				<el-radio-group v-model="buyForm.type">
					<el-radio :label="1">共享商品本身库存</el-radio>
					<el-radio :label="2">单独设置抢购库存</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="库存数" label-width="180px" prop="codes">
				<el-input :disabled="buyForm.type == 1" placeholder="请输入库存数" v-model="buyForm.saleNum">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="cancelBuyDialog">取 消</el-button>
			<el-button type="primary" @click="buyClick">确 定</el-button>
		</div>
	</el-dialog>

		<!--
			设置限购
		-->
		<el-dialog title="限购" :visible.sync="canBuyVisible" :before-close="cancelCanBuyDialog">
			<el-form :model="canBuyForm" style="width: 90%;margin: 0 auto;" status-icon  ref="canBuyForm">
				<el-form-item label="活动价格类型" label-width="180px" prop="codes">
					<el-radio-group v-model="canBuyForm.type">
						<el-radio :label="1">不限购</el-radio>
						<el-radio :label="2">一个号限购</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="库存数" label-width="180px" prop="codes">
					<el-input :disabled="canBuyForm.type == 1" placeholder="请输入库存数" v-model="canBuyForm.saleNum">
						<template slot="append">件</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelCanBuyDialog">取 消</el-button>
				<el-button type="primary" @click="canBuyDialog">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import {
    channelList,
	  findProductByCodes,
    saveGroupBuy,
    groupBuyDetail,
    stopLimitDiscount
  } from '@/api/promotion/groupBuy';

  export default {
    name: 'information',
    data() {
      // 验证时间
      let validTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入时间！'));
        } else if(!/^[0-9]*[1-9][0-9]*$/.test(value)){
          callback(new Error('请输入正确时间！'));
        } else {
          callback();
        }
      };
      return {
        // 手风琴默认展开
        activeNames: [0],

	      // 商品数据
        goodsList: [],
        pageData: '',
        dialogForm: {
          offerName: '',
          startDate: '',
          endDate: '',
          channelIds: [],
          status: 1,
          autoCancelTimeout: '',
          groupbuyCustomNum: '',
          itemSku: [],

        },
       
        dialogFormRules: {
          offerName:[
            {required: true,  message: '请输入活动名称', trigger: 'blur'}
          ],
          groupbuyCustomNum:[
            {required: true,  message: '请输入成团人数', trigger: 'blur'}
          ],
          startDate:[
            {required: true,  message: '请输入开始时间', trigger: 'blur'}
          ],
          endDate:[
            {required: true,  message: '请输入结束时间', trigger: 'blur'}
          ],
          itemSku: [
            {type: 'array', required: true,  message: '请选择商品'}
          ],
          autoCancelTimeout: [
            {required: true,  validator: validTime, trigger: 'blur'},
          ]
        },
	      
	      // 设置起始时间不能大于结束时间
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
	      
	      // 渠道数据
        channelListData: [],
	      
	      // 商品表单
        goodsVisible: false,
        goodsForm: {
          codes: '',
	        list: []
        },
        goodsFormRules: {
          codes: [
            {required: true, message: '请输入商品编号', trigger: 'blur'}
          ]
        },
        goodsLoading: false,

        // 设置优惠表单
        saleForm: {
          type: 1,
          saleNum: ''
        },
        saleVisible: false,

        // 设置库存表单
        buyForm: {
          type: 1,
          saleNum: ''
        },
        buyVisible: false,

	      // 优惠
        canBuyForm: {
          type: 1,
          saleNum: ''
        },
        canBuyVisible: false,

	      // 当前点击index
	      clickIndex: '',
	      clickData: '',
	      
	      // 判断当前商品是否存在数组
	      isHaveGoodsList: [],
        btnLoading: false,
	      
	      pageTitle: '',
	      pageId: ''

      }
    },
    created() {
      this.pageTitle = this.$route.query.title;
			if(this.pageTitle !== '新建团购') {
        this.pageId = this.$route.query.id;
				this.getPageData();
      }
      channelList().then(res => {
        if (res.code == 200) {
          res.result.map(v => {
            this.channelListData.push(v)
          });
        }
      })
    },
    methods: {
      // 获取数据
	    getPageData() {
        groupBuyDetail({
          offerId: this.pageId
        }).then(res => {
          if(res.code == 200) {
            this.dialogForm = Object.assign({}, res.result);
            this.dialogForm.itemSku.map(v => {
              v.tableData = v.skuList;
            })
          }else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
	    },
      
      // 强制停止
      stopDo() {
        this.$confirm("此操作将停止团购是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            offerId: this.pageId
          }
          stopLimitDiscount(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "强制停止成功!"
              });
              this.$router.push({
                path: '/promotion/flashSaleTemplate/newFlashSale',
                query: {
                  title: '查看团购',
                  id: this.pageId
                }
              });
            }
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消强制停止"
          });
        });
      },

      // 设置起始时间不能大于结束时间
      beginDate(){
        const self = this
        return {
          disabledDate(time){
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }
      },
      processDate() {
        const  self = this
        return {
          disabledDate(time) {
            if (self.dialogForm.startDate) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.dialogForm.startDate).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }
      },
	    
      // 添加商品
      addGoods() {
        this.goodsVisible = true;
      },
			// 获取商品
      getGoods() {
        this.goodsLoading = true;
        if(this.goodsForm.codes) {
          findProductByCodes({
	          codes: this.goodsForm.codes.replace(/\n/g, ",")
          }).then(res => {
            if(res.code == 200) {
              this.goodsList = res.result;
            }else {
              this.$message.error(res.message);
            }
            this.goodsLoading = false;
          })
        }else {
          this.$message.error("请输入商品编码");
          this.goodsLoading = false;
        }
      },
      // 价格设置
      saleSetClick(val) {
        if(this.pageTitle !== '新建团购') return;
        this.clickIndex = val;
        this.saleVisible = true;
      },
	    // 保存价格设置
      saleClick() {
        let val = this.dialogForm.itemSku[this.clickIndex].tableData[0].salePrice;
        if(this.saleForm.type == 1) {
          val = val - this.saleForm.saleNum;
        }else {
          val = val * (this.saleForm.saleNum / 100);
        };
        this.$set(this.dialogForm.itemSku[this.clickIndex].tableData[0], 'offerActionType' , this.saleForm.type);
        this.$set(this.dialogForm.itemSku[this.clickIndex].tableData[0], 'offerActionValue' , this.saleForm.saleNum);
        this.$set(this.dialogForm.itemSku[this.clickIndex].tableData[0], 'discountedPrice' , val);
				this.cancelSaleDialog();
      },
	    // 取消价格设置
      cancelSaleDialog() {
				this.saleForm = {
          type: 1,
          saleNum: ''
        };
				this.saleVisible = false;
      },
      // 库存设置
      inventorySetClick(val) {
        if(this.pageTitle !== '新建团购') return;
        this.clickIndex = val;
        this.buyVisible = true;
      },
	    // 保存库存设置
	    buyClick() {
        this.$set(this.dialogForm.itemSku[this.clickIndex].tableData[0], 'availableInventory' , this.buyForm.saleNum);
        this.cancelBuyDialog();
	    },
      // 取消库存设置
      cancelBuyDialog() {
        this.buyForm = {
          type: 1,
          saleNum: ''
        };
        this.buyVisible = false;
      },
			// 设置限购数
      setBuyNum(val) {
        if(this.pageTitle == '查看团购') return;
        this.clickData = val;
        this.canBuyVisible = true;
      },

	    // 设置限购
	    canBuyDialog() {
        this.clickData.tableData[0].canBuyNum = this.canBuyForm.saleNum;
        this.clickData.tableData[0].canBuy = '每人限购'+ this.canBuyForm.saleNum +'件';
        this.cancelCanBuyDialog();
	    },
      cancelCanBuyDialog() {
        this.canBuyForm = {
          type: 1,
	        saleNum: ''
        };
        this.canBuyVisible = false;
      },
	    
	    // 商品保存
      goodsClick() {
        if(this.goodsForm.list.length > 0 && this.goodsList.length > 0){
          this.goodsForm.list.map(v => {
            // 判断商品是否已存在
            if(this.isHaveGoodsList.indexOf(v) == -1) {
              this.isHaveGoodsList.push(v);
              this.goodsList.map(vc => {
                if(vc.itemId === v) {
                  vc.tableData = [{
                    propertiesName: vc.skuList[0].propertiesName ? vc.skuList[0].propertiesName: '',
                    salePrice: vc.skuList[0].salePrice ? vc.skuList[0].salePrice : '',
                    discountedPrice: vc.skuList[0].salePrice ? vc.skuList[0].salePrice : '',
                    availableInventory: '',
                    canBuy: '不限购'
                  }];
                  this.dialogForm.itemSku.push(vc)
                }
              })
            }else {
              this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
            }
          });
          this.cancelGoodsDialog();
        }else {
          this.$message.error('请输入商品编码!');
        }
      },
      // 商品保存并
      addNext() {
        if(this.goodsForm.list.length > 0 ){
	        this.goodsForm.list.map(v => {
	          // 判断商品是否已存在
		        if(this.isHaveGoodsList.indexOf(v) == -1) {
	            this.isHaveGoodsList.push(v);
              this.goodsList.map(vc => {
                if(vc.itemId === v) {
                  vc.tableData = [{
                    propertiesName: vc.skuList[0].propertiesName ? vc.skuList[0].propertiesName: '',
                    salePrice: vc.skuList[0].salePrice ? vc.skuList[0].salePrice : '',
                    discountedPrice: vc.skuList[0].salePrice ? vc.skuList[0].salePrice : '',
                    availableInventory: '',
                    canBuy: '不限购'
                  }];
                  this.dialogForm.itemSku.push(vc)
                }
              })
		        }else {
	            this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
		        }
		      });
          this.goodsForm.codes = '';
          this.goodsList = [];
				}
      },
      // 取消重置商品
      cancelGoodsDialog() {
        this.goodsVisible = false;
        this.goodsList = [];
        this.goodsForm = {
          codes: '',
	        list: []
        };
      },
	    
	    // 删除
      deleteGoods(index) {
        this.$confirm("确定要删除此条商品数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.isHaveGoodsList.splice(this.isHaveGoodsList.indexOf(this.dialogForm.itemSku[index].itemId), 1);
          this.dialogForm.itemSku.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },

	    // 提交团购
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
				  if (valid) {
            this.dialogForm.itemSku.map(v => {
              v.maxUsesPerCustomer = v.tableData[0].canBuyNum;
              v.offerActionType = v.tableData[0].offerActionType;
              v.offerActionValue = v.tableData[0].offerActionValue;
              v.skuList[0].discountedPrice = v.tableData[0].discountedPrice;
              v.skuList[0].availableInventory = v.tableData[0].availableInventory;
            })
					  this.btnLoading = true;
            saveGroupBuy(this.dialogForm).then(res => {
              if(res.code == 200) {
                if(this.pageTitle == '新建团购') {
                  this.$message({
                    type: "success",
                    message: "新建团购成功!"
                  });
                }else {
                  this.$message({
                    type: "success",
                    message: "编辑团购成功!"
                  });
                }
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
      // 取消提交团购
      cancelDialog() {
        this.$router.push({
          path: '/promotion/groupBuyingTemplate'
        });
      }
    }
  }
</script>

<style lang="sass">
	.information
		overflow: hidden
		margin: 20px 20px 0
		.title
			font-size: 20px
			font-weight: bold
			margin-left: 20px
			margin-bottom: 20px
			color: #333
		.formTitle
			height: 40px
			line-height: 40px
			border-bottom: 1px solid #ccc
			margin-bottom: 20px
</style>
