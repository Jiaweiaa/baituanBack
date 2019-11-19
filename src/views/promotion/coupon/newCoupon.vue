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
			<el-form-item label="优惠券名称" label-width="200px" prop="name">
				<el-input 	:disabled="pageTitle == '查看优惠券'" v-model.trim="dialogForm.name"></el-input>
			</el-form-item>
			<el-form-item label="说明" label-width="200px" prop="marketingMessage">
				<el-input 	:disabled="pageTitle == '查看优惠券'" type="textarea" v-model.trim="dialogForm.marketingMessage"></el-input>
			</el-form-item>
			<el-form-item label="开始时间" label-width="200px" prop="startDate">
				<el-date-picker
					:disabled="pageTitle == '查看优惠券' ? true : pageTitle !== '新增优惠券' && dialogForm.status !== 1 "
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
					:disabled="pageTitle == '查看优惠券' ? true : pageTitle !== '新增优惠券' && dialogForm.status !== 1"
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
				<el-checkbox-group :disabled="pageTitle == '查看优惠券' ? true : pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model="dialogForm.channelIds">
					<el-checkbox v-for="channel in channelListData" :label="channel.id" :key="channel.id">{{channel.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="状态" label-width="200px" prop="status">
				<el-tag
					:type="dialogForm.status == 1 ? 'warning' : dialogForm.status == 2 ? 'success' : 'danger'">
					{{dialogForm.status == 1 ? '未开始' : dialogForm.status == 2 ? '进行中' : '已结束'}}
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
			<el-form-item label="优惠券类型" label-width="200px" prop="offerCouponType">
				<el-radio-group :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1"  style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.offerCouponType">
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="2000">通用优惠码 (所有用户都能通过输入可见的优惠码获得优惠)</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="3000">专用优惠券 (只能会员享用，会员可通过链接领取该优惠券，商家也可以发送该优惠券给特定会员)</el-radio>
					<el-radio :disabled="true" style="width: 100%; margin-bottom: 10px;" :label="1000">微信卡券 (通过微信接口，在PTS系统内定义的卡券)</el-radio>
				</el-radio-group>
			</el-form-item>
			<!--  通用优惠券 -->
			<el-form-item v-if="dialogForm.offerCouponType == 2000" label="优惠码形式" label-width="200px" prop="isGeneral">
				<el-radio-group :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" style="width: 100%; overflow: hidden;padding-top: 12px; "   v-model="dialogForm.isGeneral">
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="true">所有人使用一个相同的优惠码</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="false">一人次使用一个唯一的优惠码(自动生成)</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 专用优惠券 -->
			<el-form-item v-if="dialogForm.offerCouponType == 3000" label="优惠券库存数量" label-width="200px" prop="inventory">
				<el-input :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model="dialogForm.inventory"></el-input>
			</el-form-item>
			<!-- 优惠券形式 所有人 -->
			<div v-if="dialogForm.isGeneral == true && dialogForm.offerCouponType == 2000">
				<el-form-item label="输入优惠码" label-width="200px" prop="generalCode">
					<el-input :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model.trim="dialogForm.generalCode"></el-input>
				</el-form-item>
				<el-form-item label="优惠码库存数量" label-width="200px" prop="inventory">
					<el-input :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model="dialogForm.inventory"></el-input>
				</el-form-item>
				<el-form-item label="每个账号使用次数" label-width="200px" prop="maxUses">
					<el-input :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model="dialogForm.maxUses"></el-input>
				</el-form-item>
			</div>
			
			<div class="formTitle">
				使用规则
			</div>
			<el-form-item label="优惠方式" label-width="200px" prop="offerActionType">
				<el-radio-group  :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.offerActionType">
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="2000">减免金额</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="1000">打折额度</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 优惠方式 -->
			<el-form-item :label="dialogForm.offerActionType == 2000 ? '减免金额' : '打折额度'" label-width="200px" prop="actionTypeValue">
				<el-input :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model="dialogForm.actionTypeValue">
					<template slot="append">{{dialogForm.offerActionType == 2000 ? '元' : '%'}}</template>
				</el-input>
			</el-form-item>
			<el-form-item label="指定商品满足金额" label-width="200px" prop="offerActionType">
				<el-radio-group :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.satisfy">
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="0">不限制</el-radio>
					<el-radio style="width: 100%; margin-bottom: 10px;" :label="1">满足具体金额</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 满足额度 -->
			<el-form-item label="设置订单金额" label-width="200px" v-if="dialogForm.satisfy == 1" prop="ruleAmount">
				<el-input :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" v-model="dialogForm.ruleAmount">
					<template slot="prepend">满</template>
					<template slot="append">元可使用</template>
				</el-input>
			</el-form-item>
			
			<el-form-item label="商品使用范围" label-width="200px" prop="isWholeOrder">
				<el-radio-group :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1"  style="width: 100%; overflow: hidden; padding-top: 12px; "  v-model="dialogForm.isWholeOrder">
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
					<el-button :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" @click="showGoodsForm" size="small" type="primary"><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
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
				<el-button :disabled="pageTitle == '查看优惠券' ? true :pageTitle !== '新增优惠券' && dialogForm.status !== 1" @click="showGoodsForm" size="small" type="primary"><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
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
		<div style="float: right;margin-right: 10%;margin-bottom:410px;" slot="footer" class="dialog-footer">
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
    saveCoupon,
    couponDetail
  } from "@/api/promotion/coupon";


  export default {
    name: 'information',
    data() {
      // 验证额度
      let validMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入额度！'));
        } else if(!/^[0-9]*[1-9][0-9]*$/.test(value)){
          callback(new Error('请输入正整数额度！'));
        } else {
          callback();
        }
      };
      
      return {
        excludeTable: [],
        listTable: [],
        
        dialogForm: {
          name: '',
          marketingMessage: '',
	        startDate: '',
          endDate: '',
          channelIds: [],
	        
          status: 1,
          offerCouponType: 2000,
          isGeneral: true,
          inventory: '',

          generalCode: '',
          isFormat: true,
          maxUses: '',

          offerActionType: 2000,
          actionTypeValue: '',
          satisfy: 0,
          ruleAmount: '',

          excludeCategoryList: [],
          isWholeOrder: 1,
          itemIdsList: [],
          excludeItemIdsList: [],
          categoryList: []
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
          itemIdsList: [
            {type: 'array', required: true,  message: '请选择参加的商品'}
          ],
          generalCode: [
            {required: true, message: '请输入输入优惠码', trigger: 'blur'}
          ],
          inventory: [
            {required: true, message: '请输入优惠码库存数量', trigger: 'blur'}
          ],
          actionTypeValue: [
            {required: true,  validator: validMoney, trigger: 'blur'},
          ],
          ruleAmount: [
            {required: true,  validator: validMoney, trigger: 'blur'},
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
        if(this.pageTitle !== '新增优惠券') {
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
          console.log(this.channelListData)
        }else {
          this.$message.error(res.message);
        }
      });
			
    },
    methods: {
      // 获取页面数据
	    getPageData() {
	      couponDetail({
	        id: this.pageId
	      }).then(res => {
	        if(res.code == 200) {
	          this.dialogForm = Object.assign({}, res.result);
	          this.dialogForm.offerCouponType = Number(this.dialogForm.offerCouponType);
	          this.dialogForm.offerActionType = Number(this.dialogForm.offerActionType);
	          if(this.dialogForm.ruleAmount) {
	            this.dialogForm.satisfy = 1;
	          }else {
	            this.dialogForm.satisfy = 0;
	          }
	          // 重复
            this.isHave =res.result.itemIdsList;
            this.isHaveExclude = res.result.excludeItemIdsList;
	          
	          this.dialogForm.isWholeOrder = Number(this.dialogForm.isWholeOrder);
	          
            this.dialogForm.excludeItemIdsList = this.dialogForm.excludeItemList  ? this.dialogForm.excludeItemList : [];
            this.defaultCategoryList = this.dialogForm.categoryList ? this.dialogForm.categoryList : [];
	          this.defaultExcludeCategoryList = this.dialogForm.excludeCategoryList ? this.dialogForm.excludeCategoryList: [];
            this.dialogForm.itemIdsList = res.result.itemList ? res.result.itemList : [];
            let data = [];
            this.dialogForm.channelIds.map(v => {
              data.push(v.toString());
            });
            this.dialogForm.channelIds = data;
            
            if(this.pageTitle == '查看优惠券' ?true : this.$refs.tree && this.dialogForm.status !== 1) {
              this.$nextTick(() => {
               if(this.$refs.tree) {
                 this.$refs.tree.checkboxItems.forEach(v => {
                   v.disabled = true;
                 })
               }
              })
            }
            if( this.pageTitle == '查看优惠券' ?true :  this.$refs.excludeTree && this.dialogForm.status !== 1) {
              this.$nextTick(() => {
                if(this.$refs.excludeTree) {
                  this.$refs.excludeTree.checkboxItems.forEach(v => {
                    v.disabled = true;
                  })
                }
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
          this.dialogForm.excludeCategoryList = this.$refs.excludeTree.getCheckedKeys().concat(this.$refs.excludeTree.getHalfCheckedKeys())
        }else if(this.dialogForm.isWholeOrder == 2){
          this.dialogForm.categoryList = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        }
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
            saveCoupon(newDialogForm).then(res => {
              if(res.code == 200) {
                this.cancelDialog();
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
              this.btnLoading = false;
            }).catch((err) => {
              this.btnLoading = false;
            })
          }
        });
      },
	    
	    // 取消
      cancelDialog() {
        this.$router.push({
          path: '/promotion/couponTemplate/couponView'
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
                path: '/promotion/couponTemplate/newCoupon',
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
