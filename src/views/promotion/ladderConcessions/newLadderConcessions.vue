<template>
	<div class="information">
		<!--
			添加商品
		-->
		<el-dialog title="添加商品" :visible.sync="goodsVisible" :before-close="cancelGoodsDialog">
			<el-form :model="goodsForm" style="width: 90%;margin: 0 auto;" status-icon :rules="goodsFormRules"  ref="goodsForm">
				<el-form-item label="商品编码" label-width="160px" prop="codes">
					<el-input type="textarea" v-model="goodsForm.codes"></el-input>
					<el-button style="margin-bottom: 10px;" type="primary" size="small" :loading="goodsLoading" @click="getGoods">获取商品</el-button>
				</el-form-item>
				<el-form-item v-show="goodsList.length > 0" label="商品信息如下" label-width="160px" prop="list">
					<el-checkbox-group ref="checkedGoods" v-model="goodsForm.list">
						<el-checkbox
							v-for="(item, index) in goodsList"
							:key="index"
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
		
		
		<div class="title">{{$route.query.title}}</div>
		<el-form :model="dialogForm" style="width: 80%;margin: 0 auto;" class="formStyle" status-icon :rules="dialogFormRules"  ref="dialogForm">
			<div class="formTitle">
				基本信息
			</div>
			<el-form-item label="阶梯优惠名称" label-width="200px" prop="name">
				<el-input 	:disabled="pageTitle == '查看阶梯优惠'" v-model.trim="dialogForm.name"></el-input>
			</el-form-item>
			<el-form-item label="说明" label-width="200px" prop="marketingMessage">
				<el-input 	:disabled="pageTitle == '查看阶梯优惠'" type="textarea" v-model.trim="dialogForm.marketingMessage"></el-input>
			</el-form-item>
			<el-form-item label="开始时间" label-width="200px" prop="startDate">
				<el-date-picker
					style="width: 50%"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dialogForm.startDate"
					type="datetime"
					placeholder="选择日期时间"
					align="right"
					:picker-options="startDatePicker">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" label-width="200px" prop="endDate">
				<el-date-picker
					style="width: 50%"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dialogForm.endDate"
					type="datetime"
					placeholder="选择日期时间"
					align="right"
					:picker-options="endDatePicker">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="发布渠道" label-width="200px" prop="channelIds">
				<el-checkbox-group v-model="dialogForm.channelIds">
					<el-checkbox v-for="channel in channelListData" :label="channel.id" :key="channel.id">{{channel.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="状态" label-width="200px" prop="activeStatus">
				<el-tag :type="dialogForm.activeStatus == 1 ? 'warning' : dialogForm.activeStatus == 2 ? 'success' : 'danger'">
					{{dialogForm.activeStatus == 1 ? '未开始' : dialogForm.activeStatus == 2 ? '进行中' : '已结束'}}
				</el-tag>
			</el-form-item>
			<el-form-item
				v-show="dialogForm.status !== 2 ? false : pageTitle.indexOf('编辑优惠券') !== -1 ? true : false"
				label="操作"
				label-width="200px">
				<el-button type="danger" @click="stopDo" icon="el-icon-warning">强制停止</el-button>
			</el-form-item>
			
			<div class="formTitle">
				类型设置
			</div>
			<!--  阶梯模式 -->
			<el-form-item label="阶梯模式" label-width="200px" prop="type">
				<el-radio-group style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.type">
					<el-radio style="width: 100%; margin-bottom: 10px;" label="ACTIVITY">典型模式 （多个层级中，只会有一个层级满足条件</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" label="NON_TIER_PRICE_DOWN">非典型模式 （多个层级中，可能有多个层级满足条件）</el-radio>
				</el-radio-group>
			</el-form-item>
			<!--  优惠类型 -->
			<el-form-item label="优惠类型" label-width="200px" prop="offerActionType">
				<el-radio-group @change="offerActionChange" style="width: 100%; overflow: hidden;padding-top: 12px; "   v-model="dialogForm.offerActionType">
					<el-radio style="width: 100%; margin-bottom: 10px;" label="PERCENT_OFF">折扣 （满N件，打几折）</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" label="AMOUNT_OFF">减金额 （满N件，减几元）</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 优惠计算范围 -->
			<el-form-item v-if="dialogForm.type == 'ACTIVITY'" label="优惠计算范围" label-width="200px" prop="preferentialRange">
				<el-radio-group  style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.preferentialRange">
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="1">商品范围（只给参与此次阶梯优惠的商品计算优惠）</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="2">订单总金额（给订单里面的所有商品计算优惠）</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<!--  阶梯设置 -->
			<el-form-item label="阶梯设置" label-width="200px" prop="actions">
				<el-table
					:data="tableData"
					style="width: 100%">
					<el-table-column
						type="index"
						align="center"
						label="层数"
						width="50">
					</el-table-column>
					<el-table-column
						align="center"
						label="满足件数">
						<template slot-scope="scope">
							<el-input style="width: 60%" size="small" v-model="scope.row.filled" required :validate-event="false">
								<template slot="prepend">满</template>
								<template slot="append">{{scope.$index == tableData.length - 1 && scope.$index !== 0 ? '件及以上' : '件'}}</template>
							</el-input>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="促销效果">
						<template slot-scope="scope">
							<el-input style="width: 60%;" size="small" v-model="scope.row.reduce" required :validate-event="false">
								<template slot="prepend">{{dialogForm.offerActionType == 'PERCENT_OFF' ? '打' : '减'}}</template>
								<template slot="append">{{dialogForm.offerActionType == 'PERCENT_OFF' ? '折' : '元'}}</template>
							</el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="操作"
						align="center"
						width="120">
						<template slot-scope="scope">
							<el-button
								v-show="scope.$index !== 0"
								@click.native.prevent="deleteRow(scope.$index, tableData)"
								type="text"
								size="small">
								移除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button @click="addTable" type="text"><i class="el-icon-plus el-icon--left"></i>新增一级</el-button>
			</el-form-item>
			
			<!-- 满足额度 -->
			<el-form-item label="商品使用范围" label-width="200px" prop="isWholeOrder">
				<el-radio-group style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.isWholeOrder">
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="1">全部商品</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="2">指定商品分类</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="3">指定具体商品</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<!-- 不参加的分类 -->
			<el-form-item v-if="dialogForm.isWholeOrder == 1" label="不参加的商品分类" label-width="200px" prop="excludeCategoryList">
				<el-tree
					:default-expanded-keys="disTreeList"
					:default-checked-keys="defaultExcludeCategoryList"
					:data="treeData"
					show-checkbox
					node-key="id"
					ref="excludeTree"
					highlight-current
					:props="defaultProps">
				</el-tree>
			</el-form-item>
			
			
			<!-- 参加的分类 -->
			<el-form-item  v-if="dialogForm.isWholeOrder == 2" label="选择参加的商品分类" label-width="200px" prop="categoryList">
				<el-tree
					:default-expanded-keys="disTreeList"
					:default-checked-keys="defaultCategoryList"
					:data="treeData"
					show-checkbox
					node-key="id"
					ref="tree"
					highlight-current
					:props="defaultProps">
				</el-tree>
			</el-form-item>
			
			<!-- 不参加的商品 -->
			<div v-if="dialogForm.isWholeOrder !== 3">
				<el-form-item label="不参加的具体商品" label-width="200px" prop="excludeItemIdsList">
					<el-button @click="showGoodsForm" size="small" type="primary"><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
					<el-table
						v-if="dialogForm.excludeItemIdsList.length > 0"
						stripe
						:data="dialogForm.excludeItemIdsList"
						size="small"
						border>
						<el-table-column
							label="商品编码"
							align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.itemCode ? scope.row.itemCode  : ''}}</span>
							</template>
						</el-table-column>
						<el-table-column
										label="商品名称"
										align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.itemTitle ? scope.row.itemTitle  : ''}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="created_at" label="操作" >
							<template slot-scope="scope">
								<el-button  @click="deleteGoods(scope.$index)" :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" size="small" type="danger" icon="el-icon-delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</div>
			
			<!-- 参加的商品 -->
			<el-form-item  v-if="dialogForm.isWholeOrder == 3" label="参加的具体商品" label-width="200px" prop="itemIdsList">
				<el-button @click="showGoodsForm" size="small" type="primary"><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
				<el-table
					v-show="dialogForm.itemIdsList.length > 0"
					stripe
					size="small"
					:data="dialogForm.itemIdsList"
					border>
					<el-table-column
						label="商品编码"
						align="center">
						<template slot-scope="scope">
							<span>{{ scope.row.itemCode ? scope.row.itemCode  : ''}}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="商品名称"
						align="center">
						<template slot-scope="scope">
							<span>{{ scope.row.itemTitle ? scope.row.itemTitle  : ''}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="created_at" label="操作" >
						<template slot-scope="scope">
							<el-button  @click="deleteGoods(scope.$index)" :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" size="small" type="danger" icon="el-icon-delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
			<el-button size="small" v-show="pageTitle == '查看优惠券'" @click="cancelDialog">关 闭</el-button>
			<el-button size="small" v-show="pageTitle !== '查看优惠券'" @click="cancelDialog">取 消</el-button>
			<el-button size="small" v-show="pageTitle !== '查看优惠券'" :loading="btnLoading"  type="primary" @click="dialogClick">确 定</el-button>
		</div>
	
	</div>
</template>

<script>
  import {
    channelList,
    stopCoupon
  } from "@/api/promotion/coupon/index";

  import {
    getCategoryTreeData
  } from "@/api/mall/mallClass";

  import {
    findProductByCodes
  } from '@/api/promotion/flashSale';

  import {
    saveOfferTier,
    offerTierDetail
  } from "@/api/promotion/ladderConcessions";
  
  export default {
    name: 'information',
    data() {
      return {
        // 列表数据
	      tableData: [{
          filled: '',
          reduce: ''
	      }],
        
        excludeTable: [],
        listTable: [],

        dialogForm: {
          name: '',
          marketingMessage: '',
          startDate: '',
          endDate: '',
          channelIds: [],
          // 列表对应的table数据
          actions: [],
	        // 状态
          activeStatus: 1,
	        //阶梯模式
          type: 'ACTIVITY',
	        // 优惠类型
          offerActionType: 'PERCENT_OFF',
	        // 优惠计算范围
          preferentialRange: 1,
	        
          excludeCategoryList: [],
          isWholeOrder: 1,
          itemIdsList: [],
          excludeItemIdsList: [],
          categoryList: [],
          categories: [],
          excludeItemIds: []
        },
        dialogFormRules: {
          name: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'}
          ],
          startDate:[
            {required: true,  message: '请输入开始时间', trigger: 'blur'}
          ],
          endDate:[
            {required: true,  message: '请输入结束时间', trigger: 'blur'}
          ],
          channelIds: [
            {type: 'array', required: true,  message: '请选择渠道'}
          ],
          categoryList: [
            {type: 'array', required: true,  message: '请选择参加的商品分类'}
          ],
          actions: [
            {type: 'array', required: true,  message: '请选择阶梯设置'}
          ],
          itemIdsList: [
            {type: 'array', required: true,  message: '请选择参加的商品'}
          ]
        },

        btnLoading: false,
        // 设置起始时间不能大于结束时间
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),

        // 渠道
        channelListData:[],

        // 上传
        // 图片源
        imgSrcBasic: "",
        //类型
        typeBok: true,
        imageUrl: '',

        // 树形数据配置
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },

        // 商品表单
        goodsLoading: false,
        goodsVisible: false,
        goodsForm: {
          list: []
        },
        goodsFormRules: {
          codes: [
            {required: true, message: '请输入商品编号', trigger: 'blur'}
          ]
        },
        goodsList: [],

        isHaveExclude: [],
        isHave: [],

        pageTitle: '',
        pageId: '',

        // tree 数据
        disTreeList: [],
        defaultExcludeCategoryList: [],
        defaultCategoryList: []
      }
    },

    created() {
      this.pageTitle = this.$route.query.title;
      // 获取所有分类
      getCategoryTreeData().then(res => {
        if(res.code == 200) {
          this.treeData = res.result;
        }else {
          this.$message.error(res.message);
        }
        if(this.pageTitle !== '新建阶梯优惠') {
          this.pageId = this.$route.query.id;
          this.getPageData();
        }
      });

      // 获取销售渠道
      channelList().then(res => {
        if (res.code == 200) {
          res.result.map(v => {
            this.channelListData.push(v)
          });
        }else {
          this.$message.error(res.message);
        }
      });
    },
    methods: {
      // 删除列表
      deleteRow(index) {
        this.tableData.splice(index, 1)
      },
	    
			// 新增一级
      addTable() {
         if(this.tableData.length >= 5) {
           this.$message({
             type: "warning",
             message: "最多只有5级!"
           });
         }else {
           this.tableData.push({
             filled: '',
             reduce: ''
           })
         }
      },
	    
      // 优惠类型
      offerActionChange(val) {
        this.tableData = [{
          filled: '',
          reduce: ''
        }]
      },
      
      // 获取页面数据
      getPageData() {
        offerTierDetail({
          id: this.pageId
        }).then(res => {
          if(res.code == 200) {
            this.dialogForm = Object.assign({}, res.result);

            // 重复
            this.isHave =res.result.itemIdsList;
            this.isHaveExclude = res.result.excludeItemIdsList;

            this.dialogForm.isWholeOrder = Number(this.dialogForm.isWholeOrder);
            this.dialogForm.excludeItemIdsList = this.dialogForm.excludeItemList;
            this.defaultCategoryList = this.dialogForm.categoryList;
            this.defaultExcludeCategoryList = this.dialogForm.excludeCategoryList;
            this.dialogForm.itemIdsList = res.result.itemList;

            if(this.pageTitle == '查看阶梯优惠' ?true : this.$refs.tree && this.dialogForm.status !== 1) {
              this.$nextTick(() => {
                this.$refs.tree.checkboxItems.forEach(v => {
                  v.disabled = true;
                })
              })
            }
            if( this.pageTitle == '查看阶梯优惠' ?true :  this.$refs.excludeTree && this.dialogForm.status !== 1) {
              this.$nextTick(() => {
                this.$refs.excludeTree.checkboxItems.forEach(v => {
                  v.disabled = true;
                })
              })
            }
          }else {
            this.$message.error(res.message);
          }
        })
      },

      // 显示商品
      showGoodsForm() {
        this.goodsVisible = true;
      },
      // 获取商品
      getGoods() {
        if(this.pageTitle == '查看优惠券' ? true :this.pageTitle !== '新增优惠券' && this.dialogForm.status !== 1) return;
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

      // 删除商品
      deleteGoods(index) {
        this.$confirm("确定要删除此条商品数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if(this.dialogForm.isWholeOrder == 3) {
              this.isHave.splice(this.isHave.indexOf(this.dialogForm.itemIdsList[index].itemId), 1);
              this.dialogForm.itemIdsList.splice(index, 1)
            }else {
              this.isHaveExclude.splice(this.isHaveExclude.indexOf(this.dialogForm.excludeItemIdsList[index].itemId), 1);
              this.dialogForm.excludeItemIdsList.splice(index, 1)
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },

      // 商品保存
      goodsClick() {
        // if 参与的
        if(this.dialogForm.isWholeOrder == 3) {
          this.goodsForm.list.map(v => {
            if(this.isHave.indexOf(v) == -1) {
              this.isHave.push(v);
              this.goodsList.map(vv => {
                if(vv.itemId == v) {
                  this.dialogForm.itemIdsList.push(vv);
                }
              })
            }else {
              this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
            }
          })
          this.cancelGoodsDialog();
        }else {
          this.goodsForm.list.map(v => {
            if(this.isHaveExclude.indexOf(v) == -1) {
              this.isHaveExclude.push(v);
              this.goodsList.map(vv => {
                if(vv.itemId == v) {
                  this.dialogForm.excludeItemIdsList.push(vv);
                }
              })
            }else {
              this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
            }
          })
        }
        this.goodsForm.codes = '';
        this.goodsList = [];
      },
      // 商品保存并新增
      addNext() {
        // if 参与的
        if(this.dialogForm.isWholeOrder == 3) {
          this.goodsForm.list.map(v => {
            if(this.isHave.indexOf(v) == -1) {
              this.isHave.push(v);
              this.goodsList.map(vv => {
                if(vv.itemId == v) {
                  this.dialogForm.itemIdsList.push(vv);
                }
              })

            }else {
              this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
            }
          })
        }else {
          this.goodsForm.list.map(v => {
            if(this.isHaveExclude.indexOf(v) == -1) {
              this.isHaveExclude.push(v);
              this.goodsList.map(vv => {
                if(vv.itemId == v) {
                  this.dialogForm.excludeItemIdsList.push(vv);
                }
              })
            }else {
              this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
            }
          })
        }
        this.goodsForm.codes = '';
        this.goodsList = [];
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

      // 确定
      dialogClick() {
        if(this.dialogForm.isWholeOrder == 1) {
          this.dialogForm.excludeCategoryList = this.$refs.excludeTree.getCheckedKeys().concat(this.$refs.excludeTree.getHalfCheckedKeys());
        }else if(this.dialogForm.isWholeOrder == 2){
          this.dialogForm.categoryList = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
        }
	      
        this.dialogForm.actions = this.tableData;
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let newDialogForm = Object.assign({}, this.dialogForm)
            this.btnLoading = true;
            let newArr = [];
            let newExclude = [];
            if(newDialogForm.itemIdsList) {
              if(newDialogForm.itemIdsList.length > 0) {
                newDialogForm.itemIdsList.map(v => {
                  newArr.push(v.itemId);
                });
              }
            }
            if(newDialogForm.excludeItemIdsList) {
              if(newDialogForm.excludeItemIdsList.length > 0) {
                newDialogForm.excludeItemIdsList.map(v => {
                  newExclude.push(v.itemId);
                });
              }
            }
            newDialogForm.itemIdsList = newArr;
            newDialogForm.excludeItemIdsList = newExclude;
	          
            newDialogForm.itemIds = newDialogForm.itemIdsList;
            newDialogForm.excludeItemIds = newDialogForm.excludeItemIdsList;
            newDialogForm.categories = newDialogForm.categoryList;
            newDialogForm.excludeCategories = newDialogForm.excludeCategoryList;
	          
            saveOfferTier(newDialogForm).then(res => {
              if(res.code == 200) {
                this.cancelDialog();
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

      // 取消
      cancelDialog() {
        this.$router.push({
          path: '/promotion/ladderConcessionsTemplate/ladderConcessionsView',
        });
      },

      // 强制停止
      stopDo() {
        this.$confirm("此操作将停止优惠券活动是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              offerId: this.dialogForm.offerId
            };
            stopCoupon(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "强制停止成功!"
                });
                this.$router.push({
                  path: '/promotion/ladderConcessionsTemplate/ladderConcessionsView',
                  query: {
                    title: '查看优惠券',
                    id:  this.pageId
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
            let beginDateVal = self.dialogForm.startDate;
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime()
              );
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
			width: 100%
			margin: 0 auto 30px
			line-height: 40px
			border-bottom: 1px solid #ccc
		.avatar-uploader
			.avatar-uploader .el-upload
				border: none
</style>
