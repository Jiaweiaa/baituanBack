<template>
	<div class="information">
		<!--
			图片库
		-->
		<ImageLibrary
			@sendImageList="getSelectImage"
			:closeDialog="closeMyDialog"
			:isOpen="imageLibraryDialog"
		></ImageLibrary>
		
		<div class="title">{{pageTitle}}</div>
		<div class="formTitle">
			捆绑商品信息
		</div>
		<el-form
			:model="dialogForm"
			style="width: 80%;margin: 0 auto;"
			class="formStyle"
			status-icon
			:rules="dialogFormRules"
			ref="dialogForm">
			<el-form-item label="捆绑销售商品名称" label-width="160px" prop="title">
				<el-input :disabled="pageTitle == '查看捆绑销售'" v-model="dialogForm.title"></el-input>
			</el-form-item>
			<el-form-item label="捆绑销售商品编码" label-width="160px" prop="code">
				<el-input :disabled="pageTitle == '查看捆绑销售'" v-model="dialogForm.code"></el-input>
			</el-form-item>
			<el-form-item label="捆绑销售商品图片" label-width="160px" prop="bundleImages">
				<el-button :disabled="pageTitle == '查看捆绑销售'" type="primary" size="small" @click="addNewImg" icon="el-icon-picture">上传图片</el-button>
				<vuedraggable class="wrapper" v-model="dialogForm.bundleNewImages" @end="dragendFun">
					<transition-group>
						<div v-for="(item, index) in dialogForm.bundleImages" :key="item.id" class="item text">
							<p>
								<i class="el-icon-d-caret"></i>
								<span style="margin-right: 10px;">{{item.imgName}}</span>
								<img
									style="width: 30px; height: 40px;padding-top: 10px;"
									:src="`http://qn.gaoshanmall.cn/${item.imgUrl}`"
								/>
								<i style="float: right; margin-right: 10px;cursor: pointer;" @click="deleteImg(index)" class="el-icon-delete"></i>
							</p>
						</div>
					</transition-group>
				</vuedraggable>
			</el-form-item>
			<el-form-item label="捆绑销售商品简介" label-width="160px" prop="sketch">
				<el-input :disabled="pageTitle == '查看捆绑销售'" type="textarea" v-model="dialogForm.sketch"></el-input>
			</el-form-item>
			<el-form-item label="捆绑销售商品详情描述"  label-width="160px">
				<tinymce
					id="pcTinymce"
					:disabled="pageTitle == '查看捆绑销售'"
					@openImageLibrary="openImageLibrary"
					:imageList="selectImageList"
					:width="'100%'"
					:height="300"
					v-model="dialogForm.description"
				></tinymce>
			</el-form-item>
			<div class="formTitle">
				捆绑商品信息
			</div>
			<el-form-item label="开始时间" label-width="160px" prop="startTime">
				<el-date-picker
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dialogForm.startTime"
					type="datetime"
					:disabled="pageTitle !== '新增捆绑销售'"
					placeholder="选择日期时间"
					align="right"
					:picker-options="startDatePicker">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" label-width="160px" prop="endTime">
				<el-date-picker
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dialogForm.endTime"
					type="datetime"
					:disabled="pageTitle !== '新增捆绑销售'"
					placeholder="选择日期时间"
					align="right"
					:picker-options="endDatePicker">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="活动文案" label-width="160px">
				<el-input 	:disabled="pageTitle !== '新增捆绑销售'" type="textarea" v-model="dialogForm.promotionCopy"></el-input>
			</el-form-item>
			<el-form-item label="发布渠道" label-width="160px" prop="channelList">
				<el-checkbox-group 	:disabled="pageTitle !== '新增捆绑销售'" v-model="dialogForm.channelList">
					<el-checkbox v-for="channel in channelListData" :label="channel.id" :key="channel.id">{{channel.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="是否参与其他活动" label-width="160px" prop="isBundlePromotable">
				<el-radio-group 	:disabled="pageTitle !== '新增捆绑销售'" v-model="dialogForm.isBundlePromotable">
					<el-radio :label="true">参与</el-radio>
					<el-radio :label="false">不参与</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
				v-show="dialogForm.status !== 2 ? false : pageTitle.indexOf('编辑捆绑销售') !== -1 ? true : false"
				label="操作"
				label-width="160px">
				<el-button type="danger" @click="stopDo" icon="el-icon-warning">强制停止</el-button>
			</el-form-item>
			<el-form-item label="状态" label-width="160px" prop="status">
				<el-tag :type="dialogForm.status == 1 ? 'warning' : dialogForm.status == 2 ? 'success' : 'danger'">
					{{dialogForm.status == 1 ? '未开始' : dialogForm.status == 2 ? '进行中' : '已结束'}}
				</el-tag>
			</el-form-item>
			<el-form-item label="商品编码" label-width="160px" prop="goodsAddList">
				<el-input 	:disabled="pageTitle !== '新增捆绑销售'" type="textarea"  v-model="dialogForm.goodsCodes"></el-input>
				<el-button style="margin-bottom: 10px;"  icon="el-icon-refresh" type="primary" size="small" :loading="goodsLoading" @click="getGoods">获取商品</el-button>
			</el-form-item>
			
			<!--
				商品回显
			-->
			<div v-show="dialogForm.goodsAddList.length > 0">
				<el-form-item label="设置价格" label-width="160px">
					<el-radio-group 	:disabled="pageTitle !== '新增捆绑销售'" v-model="dialogForm.priceType">
						<el-radio :label="1">统一设置捆绑销售价格</el-radio>
						<el-radio :label="2">分别设置商品捆绑销售价格</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="dialogForm.priceType == 1 ? true: false" label="统一设置价格" label-width="160px" prop="salePrice">
					<el-input :disabled="pageTitle == '查看捆绑销售'"  v-model="dialogForm.salePrice"></el-input>
				</el-form-item>
				<el-form-item label="商品排序" label-width="160px" >
					<vuedraggable v-model="dialogForm.goodsAddNewList" @end="dragendGoodFun" class="wrapper">
						<transition-group>
							<div v-for="(item, index) in dialogForm.goodsAddList" :key="item.itemId" class="item text">
								<p>
									<i class="el-icon-d-caret"></i>
									<span>{{item.itemCode}}</span>
									<span style="float: right; margin-right: 10px;">{{item.itemTitle}}</span>
								</p>
							</div>
						</transition-group>
					</vuedraggable>
				</el-form-item>
				<el-form-item label="设置销售单元" label-width="160px" >
					<el-collapse v-model="activeNames">
						<el-collapse-item :name="index" v-for="(item, index) in dialogForm.goodsAddList" :key="index">
							<template slot="title">
									{{item.itemCode}}
									{{item.itemTitle}}
								<el-input
									@click.native="stopFun"
									@keydown.native="stopFun"
									@keyup.native="stopFun"
									@change.native="stopFun"
									:disabled="pageTitle == '查看捆绑销售'"
									placeholder="请输入活动描述"
									v-model="item.promotionCopy"
									style="width: 30%; position: absolute; left: 60%;"
									size="small"
									clearable>
								</el-input>
							</template>
							<el-table
								:data="item.skuList"
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
										捆绑销售价
									</template>
									<template slot-scope="scope">
										<el-input
											:disabled="dialogForm.priceType == 1 ? true: false"
											v-model="scope.row.actualSalePrice"
											placeholder="捆绑销售价"></el-input>
									</template>
								</el-table-column>
								<el-table-column>
									<template slot="header" slot-scope="scope">
										操作
									</template>
									<template slot-scope="scope">
										<el-switch
											:disabled="pageTitle !== '新增捆绑销售'"
											style="display: block"
											v-model="scope.row.priceType"
											active-text="不参与"
											:active-value="true"
											:inactive-value="false"
											inactive-text="参与">
										</el-switch>
									</template>
								</el-table-column>
							</el-table>
						</el-collapse-item>
					</el-collapse>
				</el-form-item>
			</div>
		</el-form>
		
		<div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
			<el-button v-show="pageTitle == '查看捆绑销售'" @click="cancelDialog">关 闭</el-button>
			<el-button v-show="pageTitle !== '查看捆绑销售'" @click="cancelDialog">取 消</el-button>
			<el-button v-show="pageTitle !== '查看捆绑销售'" type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
		</div>
	</div>
</template>

<script>
  import Tinymce from "@/components/Tinymce";
  import vuedraggable from 'vuedraggable';
  import ImageLibrary from "@/components/ImageLibrary";
  
  import {
    channelList,
    findProductByCodes
  } from '@/api/promotion/flashSale';
  import {
    getKbcode,
    validateBundleCode,
    stopBundle,
    bundleDetail,
    saveBundle
  } from '@/api/promotion/bundling';
  
  export default {
    name: 'information',
    components: {
      vuedraggable,
      Tinymce,
      ImageLibrary
    },
    data() {
      // 验证捆绑销售商品编码
      let validBundleCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入捆绑销售商品编码！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('捆绑销售商品编码不能带有空格！'));
        } else {
          let params =  {
            code: value,
	          bundleId: this.pageId
          };
          validateBundleCode(params).then((res) => {
            if(res.code == 500) {
              callback('该捆绑销售商品编码已存在!');
            }else {
              callback();
            }
          })
        }
      };
      
      return {
        //  图片库
        imageLibraryDialog: false,
        selectImageList: [], //本次已选择图片列表
        
        // 手风琴默认展开
        activeNames: [0],

        // 商品数据
        goodsList: [],
        pageData: '',
        dialogForm: {
          title: '',
          code: '',
          bundleNewImages: [],
          bundleImages: [],
          channelList: [],
          startTime: '',
          endTime: '',
          goodsAddList: [],
          salePrice: '',
          status: 1,
          goodsAddNewList: [],
          isBundlePromotable: true,
          priceType: 1
        },
        goodsLoading: false,
        dialogFormRules: {
          title:[
            {required: true,  message: '请输入捆绑销售商品名称', trigger: 'blur'}
          ],
          code:[
            {required: true,  validator: validBundleCode, trigger: 'blur'}
          ],
          startTime:[
            {required: true,  message: '请输入开始时间', trigger: 'blur'}
          ],
          salePrice:[
            {required: true,  message: '请输入统一设置价格', trigger: 'blur'}
          ],
          endTime:[
            {required: true,  message: '请输入结束时间', trigger: 'blur'}
          ],
          bundleImages: [
            {type: 'array', required: true,  message: '请上传捆绑销售商品图片'}
          ],
          goodsAddList: [
            {type: 'array', required: true,  message: '请选择商品'}
          ]
        },

        // 设置起始时间不能大于结束时间
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),

        // 渠道数据
        channelListData: [],
	      
	      
        // 添加商品loading
        btnLoading: false,

	      // 页面信息
        pageTitle: '',
        pageId: '',
	      
	      // 打开图片库类型
        openTypeImg: 1

      }
    },

    created() {
      this.pageTitle = this.$route.query.title;
      if(this.pageTitle !== '新增捆绑销售') {
        this.pageId = this.$route.query.id;
        this.getPageData();
      }else {
        // 获取商品销售编码
        getKbcode().then(res => {
          if(res.code == 200) {
            this.dialogForm.code = res.result;
          }else {
            this.$message.error(res.message);
          }
        });
      }
			
      // 获取渠道
      channelList().then(res => {
        if (res.code == 200) {
          res.result.map(v => {
            this.channelListData.push(v)
          });
        }
      })
    },
    methods: {
      // 获取页面数据
      getPageData() {
        bundleDetail({
          bundleId: this.pageId
        }).then(res => {
          this.dialogForm = Object.assign({
	          goodsAddNewList: [],
	          bundleNewImages: [],
            goodsCodes: ''
          }, res.result);
          this.dialogForm.priceType = Number( this.dialogForm.priceType);
          this.dialogForm.goodsAddList = this.dialogForm.bundleItemDto;
          this.dialogForm.goodsAddList.map(v => {
            v.skuList = v.skus;
            if(v.bundleItemSkus.length == 0) {
              v.skuList[0].priceType = true;
            }
           
            this.dialogForm.goodsCodes += v.code +'\n';
          });
          this.dialogForm.bundleImages.map(v => {
            this.dialogForm.bundleNewImages.push(v.id)
	        });
        })
      },
      
      // 阻止折叠面板默认事件
      stopFun(e) {
        e.stopPropagation();
      },
      // 删除
      deleteImg(index) {
        if(this.pageTitle == '查看捆绑销售') return;
        this.$confirm("确定要删除此捆绑销售商品图片吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogForm.bundleNewImages.splice(this.dialogForm.bundleNewImages.indexOf(this.dialogForm.bundleImages[index].id), 1);
            this.dialogForm.bundleImages.splice(index, 1)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
	    
      // 拖拽之后的事件 改变数据
      dragendFun() {
        if(this.pageTitle == '查看捆绑销售') return;
        let arr = [];
        this.dialogForm.bundleNewImages.map(v => {
          this.dialogForm.bundleImages.map(vv => {
            if(v == vv.id) {
              arr.push(vv);
            }
          })
        });
        this.dialogForm.bundleImages = arr
      },
      dragendGoodFun() {
        if(this.pageTitle == '查看捆绑销售') return;
        let arr = [];
        this.dialogForm.goodsAddNewList.map(v => {
          this.dialogForm.goodsAddList.map(vv => {
            if(v == vv.itemId) {
              arr.push(vv);
            }
          })
        });
        this.dialogForm.goodsAddList = arr
      },
	    
      // 新增图片库
      addNewImg() {
        this.openTypeImg = 1;
        this.imageLibraryDialog = true;
      },
      //打开图片库组件
      openImageLibrary() {
        this.openTypeImg = 2;
        this.imageLibraryDialog = true;
      },
	    // 选择的图片数据源
      getSelectImage(image) {
        if(this.openTypeImg == 1) {
          image.map(v => {
            if(this.dialogForm.bundleNewImages.indexOf(v.id) == -1) {
              v.url = v.imgUrl;
              this.dialogForm.bundleImages.push(v);
              this.dialogForm.bundleNewImages.push(v.id);
            }else {
              this.$message.error('已存在'+v.imgName);
            }
          })
        }else {
          image.map(v => {
            window.tinymce
              .get("pcTinymce")
              .insertContent(`<img class="wscnph" src="http://qn.gaoshanmall.cn/${v.imgUrl}" >`);
          });
        }
      },
      // 隐藏弹框
      closeMyDialog() {
        this.imageLibraryDialog = false;
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
            if (self.dialogForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.dialogForm.startTime).getTime() > time.getTime()
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

      // 强制停止
      stopDo() {
        this.$confirm("此操作将停止捆绑销售活动是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            bundleId: this.pageId
          }
          stopBundle(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "强制停止成功!"
              });
              this.$router.push({
                path: '/promotion/bundlingTemplate/newBundling',
                query: {
                  title: '查看捆绑销售',
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
	    
      // 获取商品
      getGoods() {
        if(this.pageTitle !== '新增捆绑销售') return;
        this.goodsLoading = true;
        if(this.dialogForm.goodsCodes) {
          findProductByCodes({
            codes: this.dialogForm.goodsCodes.replace(/\n/g, ",")
          }).then(res => {
            if(res.code == 200) {
              res.result.map(v => {
	              if(this.dialogForm.goodsAddNewList.indexOf(v.itemId) == -1) {
                  this.dialogForm.goodsAddList.push(v);
                  this.dialogForm.goodsAddNewList = [];
                  this.dialogForm.goodsAddList.map(v => {
                    this.dialogForm.goodsAddNewList.push(v.itemId);
                  })
	              }else {
                  this.$message.error('已经添加了您输入的商品编码,请查看重复商品并重新填写!');
	              }
              });
              this.dialogForm.goodsAddList.map(v => {
                v.priceType = true;
              })
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

      // 提交限时抢购
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.dialogForm.bundleItemDto = this.dialogForm.goodsAddList;
            this.dialogForm.bundleItemDto.map(v => {
              v.bundleItemSkus = v.skuList;
              v.bundleItemSkus.map(vv => {
                vv.originalSalePrice = vv.salePrice;
                if(vv.priceType == true) {
                  v.bundleItemSkus = [];
                }
              })
            });
            this.btnLoading = true;
            saveBundle(this.dialogForm).then(res => {
	            if(res.code == 200) {
	              this.btnLoading = false;
	              this.$router.push({
	                path: '/promotion/bundlingTemplate/bundlingView'
	              });
	            }else {
	              this.$message.error(res.message);
	            }
	          })
          }
        });
      },
      // 取消提交限时抢购
      cancelDialog() {
        this.$router.push({
          path: '/promotion/bundlingTemplate/bundlingView'
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
			width: 90%
			margin: 0 auto 30px
			line-height: 40px
			border-bottom: 1px solid #ccc
	.wrapper
		width: 100%
		.item
			width: 80%
			height: 50px
			background-color: #fff
			border: 1px solid #409EFF
			color: #409EFF
			float: left
			line-height: 50px
			i
				float: left
				line-height: 50px
				margin-right: 10px
			p
				height: 50px
				line-height: 50px
				overflow: hidden
				margin: 0 0 0 10px
				span
					float: left
</style>
<style>
	.wrapper span:first-child {
		width: 80%;
		float: left;
	}
</style>
