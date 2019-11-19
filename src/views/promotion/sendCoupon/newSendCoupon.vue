<template>
	<div class="information">
		<div class="title">{{pageTitle}}</div>
		<el-form
			:model="dialogForm"
			style="width: 80%;margin: 0 auto; overflow: hidden;"
			class="formStyle"
			status-icon
			:rules="dialogFormRules"
			ref="dialogForm">
			<el-form-item label="选择优惠券" label-width="160px" prop="couponId">
				<el-select
					:disabled="pageTitle == '查看优惠券'"
					style="width: 100%;"
					v-model="dialogForm.couponId"
					clearable
					placeholder="请选择优惠券">
					<el-option
						v-for="item in couponList"
						:key="item.couponId"
						:label="item.name"
						:value="item.couponId">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注说明" label-width="160px" prop="remarks">
				<el-input :disabled="pageTitle == '查看优惠券'"  type="textarea" v-model="dialogForm.marketingMessage"></el-input>
			</el-form-item>
			<el-form-item v-show="pageTitle == '查看优惠券'"  label="发送时间" label-width="160px" prop="remarks">
				{{dialogForm.createTime}}
			</el-form-item>
			<el-form-item label="选择会员" label-width="160px" prop="memberIds">
				<el-button :disabled="pageTitle == '查看优惠券'" type="primary" size="small" @click="selectVip" icon="el-icon-plus">选择会员</el-button>&nbsp;&nbsp;共 {{submitData.length}} 人
				
			</el-form-item>
			<el-form-item style="width: 90%; float: right;">
				<div class="searchBox">
					<div class="searchItem">
						<p>昵称</p>
						<el-input
							placeholder="请输入内容"
							v-model="searchForm.searchName"
							clearable>
						</el-input>
					</div>
					<div class="searchItem">
						<p>手机号码</p>
						<el-input
							placeholder="请输入内容"
							v-model="searchForm.searchMobile"
							clearable>
						</el-input>
					</div>
					<el-button size="small" class="tableButton" @click="searchTable" type="primary" icon="el-icon-search">搜索</el-button>
				</div>
				<el-table
					:data="tableData"
					height="500"
					border
					style="width: 100%">
					<el-table-column
									prop="nickname"
									align="center"
									label="会员名称">
					</el-table-column>
					<el-table-column
									prop="mobile"
									align="center"
									label="手机号码">
					</el-table-column>
					<el-table-column align="center" label="操作" >
						<template slot-scope="scope">
							<el-button :disabled="pageTitle == '查看优惠券'" @click="del(scope.row)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
			<el-button v-show="pageTitle == '查看优惠券'" @click="cancelDialog">关 闭</el-button>
			<el-button v-show="pageTitle !== '查看优惠券'" @click="cancelDialog">取 消</el-button>
			<el-button v-show="pageTitle !== '查看优惠券'" type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
		</div>
		
		<!--
			选择会员
		-->
		<div v-show="vipVisible" class="notifica">
			<h4>添加会员</h4>
			<div class="notificaChild">
				<el-form :model="vipForm" style="width: 90%;margin: 0 auto;" status-icon :rules="vipFormRules" :before-close="clearVipForm" ref="vipForm">
					<div class="selectVip">
						<div class="leftBox">
							<div class="selectType">
								<p>筛选方式</p>
								<el-select
									size="small"
									style="width: 90%;"
									v-model="vipForm.selectType"
									clearable
									placeholder="请选择筛选方式">
									<el-option
										v-for="item in vipSelectList"
										:key="item.id"
										:label="item.label"
										:value="item.id">
									</el-option>
								</el-select>
							</div>
							<div class="selectBody">
								<p>{{vipForm.selectType == 1 ? '选择分组' : vipForm.selectType ==  2 ? '会员名称' : '会员手机号'}}
									<el-button style="float: right; margin-right: 20px;" @click="clearVipSearch" type="text">清除</el-button>
								</p>
								<div class="selectBodyContent">
									<el-checkbox-group
										v-show="vipForm.selectType == 1"
										v-model="vipForm.memberIds"
										style="overflow: auto; height: 320px;">
										<el-checkbox style="width: 100%; margin: 5px 0;" v-for="item in groupList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
									</el-checkbox-group>
									<el-input
										v-show="vipForm.selectType == 2"
										type="textarea"
										:autosize="{ minRows: 15, maxRows: 15}"
										placeholder="请输入会员名称"
										v-model="vipForm.searchName">
									</el-input>
									<el-input
										v-show="vipForm.selectType == 3"
										type="textarea"
										:autosize="{ minRows: 15, maxRows: 15}"
										placeholder="请输入会员手机号"
										v-model="vipForm.searchMobile">
									</el-input>
								</div>
							</div>
							<div class="selectFooter">
								<el-button size="small" type="primary" @click="searchVip" icon="el-icon-search" :loading="searchBtnLoading">筛选</el-button>
							</div>
						</div>
						<div class="rightBox">
							<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
								<el-table
									ref="multipleTable"
									:data="vipUserList"
									tooltip-effect="dark"
									style="width: 100%"
									@selection-change="handleSelectionChange">
									<el-table-column
										type="selection"
										width="55">
									</el-table-column>
									<el-table-column
										label="会员姓名"
										prop="nickname">
									</el-table-column>
									<el-table-column
										prop="mobile"
										label="会员手机">
									</el-table-column>
								</el-table>
							</div>
							<div class="footerDataBox">
								<i v-show="loadMaxMore == false && vipUserList.length > 0 && vipForm.memberIds.length > 0" class="footerIcon el-icon-loading"></i>
								<div v-show="loadMaxMore == true" class="footerText">暂时没有更多数据</div>
							</div>
						</div>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer" style="text-align: right;margin-top: 20px">
					<el-button size="small" @click="clearVipForm">取 消</el-button>
					<el-button size="small" type="primary" @click="sureVipAdd">添加并继续</el-button>
					<el-button size="small" type="primary" @click="sureVip">确 定</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import {
    memberGroupList,
    availableCoupon,
    memberList,
    sendDetail,
    doSendCoupon
  } from '@/api/promotion/sendCoupon';
  import InfiniteLoading from "vue-infinite-loading";


  export default {
    name: 'information',
    data() {
      return {
        // 总人数
        selectNum: 0,

        // 优惠券列表
        couponList: [],
        // 分组列表
        groupList: [],

        vipVisible: false,
        vipForm: {
          selectType: 1,
          memberIds: [],
          searchName: '',
          getUsers: [],
          searchMobile: ''
        },
        vipFormRules: {},
        vipUserList: [],

	      searchForm: {
          searchName: '',
          searchMobile: ''
	      },
        tableData: [],
       

        vipSelectList: [
          {
            label: '会员分组',
            id: 1
          },
          {
            label: '会员姓名',
            id: 2
          },
          {
            label: '会员手机号',
            id: 3
          }
        ],
        dialogForm: {
          couponId: '',
          remarks: '',
          memberIds: []
        },
        dialogFormRules: {
          couponId:[
            {required: true,  message: '请选择优惠券', trigger: 'change'}
          ],
          memberIds: [
            {type: 'array', required: true,  message: '选择会员'}
          ]
        },
        btnLoading: false,
        searchBtnLoading: false,
        pageTitle: '',

        searchData: {

        },


        count: 0,
        data: [],
        busy: false,
        loadMaxMore: false,
        // 页数计数
        noPageNum: 1,
        maxPageNum: 1,

        // 搜索的数据
        searchParams: {
          pageNum: 1
        },
	      
	      // 提交的数据
        submitData: []
      }
    },
    components: {
      InfiniteLoading
    },
    created() {
      this.getCoupon();
      this.getGroup();
      this.pageTitle = this.$route.query.title;
      if(this.pageTitle == '查看优惠券') {
        sendDetail({
	        id: this.$route.query.id
        }).then(res => {
          this.dialogForm = Object.assign({}, res.result);
          this.submitData = this.dialogForm.memberList;
          this.tableData = this.dialogForm.memberList;
        })
      }
    },
    methods: {
      // 搜索数据
      searchTable() {
        if ( this.searchForm.searchName != "") {
          this.tableData = this.submitData.filter(v => {
            if(v.nickname.indexOf( this.searchForm.searchName) !== -1) {
              return v;
            }
          });
        }
        if (this.searchForm.searchMobile != "") {
          this.tableData = this.submitData.filter(v => {
            if(v.mobile.indexOf(this.searchForm.searchMobile) !== -1) {
              return v;
            }
          });
        }
        if(this.searchForm.searchMobile == '' && this.searchForm.searchName == '') {
          this.tableData = this.submitData;
        }
      },
      
      // 清除会员分组
      clearVipSearch() {
        this.vipForm.memberIds = [];
        this.vipForm.searchName = '';
        this.vipForm.searchMobile = '';
      },
      // 获取分组
      getGroup() {
        availableCoupon().then(res => {
          if(res.code == 200) {
            this.couponList = res.result;
          }else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
      },
      // 获取优惠券列表
      getCoupon() {
        memberGroupList().then(res => {
          if(res.code == 200) {
            this.groupList = res.result;
          }else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
      },
      // 选择会员
      selectVip() {
        let search = {
          pageNum: 1
        }
        memberList(search).then((res) => {
          this.maxPageNum = res.result.pages;
          this.vipUserList = this.vipUserList.concat(res.result.records);
          this.vipVisible = true;
        });
      },
      // 搜索
      searchVip() {
        this.searchParams = {
          pageNum: 1
        };
        this.noPageNum = 1;
        this.vipUserList = [];
        if(this.vipForm.selectType == 1) {
          if(this.vipForm.memberIds.length > 0) {
            this.searchBtnLoading = true;
            this.searchParams.groupIdList = this.vipForm.memberIds;
          }else {
            this.$message({
              type: "error",
              message: '请选择分组'
            });
            return;
          }
        }else if(this.vipForm.selectType == 2) {
          if(this.vipForm.searchName !== '') {
            this.searchBtnLoading = true;
            this.searchParams.nicknameList = this.vipForm.searchName.replace(/\n/g, ",");
            this.searchParams.nicknameList = this.searchParams.nicknameList.split(',');
          }else {
            this.$message({
              type: "error",
              message: '请输入会员姓名'
            });
            return;
          }
        }else {
          if(this.vipForm.searchMobile!== '') {
            this.searchBtnLoading = true;
            this.searchParams.phoneList = this.vipForm.searchMobile.replace(/\n/g, ",");
            this.searchParams.phoneList = this.searchParams.phoneList.split(',');
          }else {
            this.$message({
              type: "error",
              message: '请输入会员手机号'
            });
            return;
          }
        }
        memberList(this.searchParams).then(res => {
          this.searchBtnLoading= false;
          if(res.code == 200) {
            this.maxPageNum = res.result.pages;
            this.vipUserList = res.result.records;
            this.noPageNum = 1;
            this.loadMaxMore = false;
            this.loadMore()
          }else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
      },
      // 会员列表操作
      cancelDialog() {
        this.$router.push({
          path: '/promotion/sendCouponTemplate/sendCouponView'
        });
      },
      dialogClick() {
        this.dialogForm.memberIds = [];
        this.submitData.forEach(v => {
          this.dialogForm.memberIds.push(v.memberIdString)
        })
        this.$refs.dialogForm.validate((valid) => {
          if(valid) {
            this.btnLoading = true;
            doSendCoupon(this.dialogForm).then(res => {
              this.btnLoading = false;
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: '发送成功'
                });
                setTimeout(() => {
                  this.cancelDialog();
                }, 500)
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            })
          }
        })
      },
   
	    // 去重选中
	    handleSelectionChange(value) {
				let obj = {};
				for(let i =0; i<value.length; i++){
					if(!obj[value[i].memberIdString]){
						this.vipForm.getUsers.push(value[i]);
						obj[value[i].memberIdString] = true;
					}
				}
			},
	    
	    // 确认添加
      sureVipAdd() {
        this.vipForm.memberIds = [];
        this.vipUserList = [];
        this.tableData = this.vipForm.getUsers;
        this.submitData = this.vipForm.getUsers;
      },
      sureVip() {
        this.vipForm.memberIds = [];
        this.vipUserList = [];
        this.tableData = this.vipForm.getUsers;
        this.submitData = this.vipForm.getUsers;
        this.vipVisible = false;
      },
      clearVipForm() {
        this.vipForm.memberIds = [];
        this.vipUserList = [];
        this.vipVisible = false;
	    },
	    
			// 加载更多
      loadMore() {
        this.busy = true;
        if(this.loadMaxMore) return;
        if (this.noPageNum > this.maxPageNum) {
          this.loadMaxMore = true;
        } else {
          this.searchParams.pageNum = this.noPageNum;
          if (this.searchParams.pageNum == 1) {
            this.noPageNum++;
          }else {
            this.contactData(this.searchParams);
          }
        }
        this.busy = false;
       
      },
      // 数据拼接
      contactData(params) {
        let search = {
	        pageNum: this.noPageNum,
          groupIdList: params.groupIdList,
          nicknameList: params.nicknameList,
          phoneList: params.phoneList
	      }
        memberList(search).then((res) => {
          this.vipUserList = this.vipUserList.concat(res.result.records);
          this.noPageNum ++;
        });
      },
      del(item) {
        this.submitData.splice(
          //find the index of the element to be removed
          this.submitData.indexOf(this.submitData.find(function(element){ return element.memberIdString === item.memberIdString; }))
          //remove 1 element from the index found
          , 1
        );
        this.searchTable();
      }
    }
  }
</script>

<style lang="sass">
	.information
		overflow: hidden
		margin: 20px 20px 0
		.notifica
			width: 100vw
			height: 100vh
			background: rgba(0,0,0,0.7)
			position: fixed
			left: 0
			top: 0
			z-index: 998
			.notificaChild
				position: absolute
				width: 900px
				height: 600px
				left: 50%
				top: 50%
				margin-left: -450px
				margin-top: -300px
				background: #fff
				z-index: 999
				padding: 20px
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
		.searchBox
			margin: 10px 0
			overflow: hidden
			border: 1px solid #eee
			padding: 20px
			.searchItem
				float: left
				width: 30%
				margin-right: 1%
				p
					width: 25%
					margin: 0
					float: left
				.el-input
					width: 75%
		.tableButton
			margin-top: 20px
			float: right
			margin-right: 10px
		.selectVip
			padding: 0
			border-top: 1px solid #ccc
			height: 500px
			overflow: hidden
			p
				height: 40px
				line-height: 40px
				margin: 0
				overflow: hidden
			.leftBox
				width: 30%
				height: 100%
				float: left
				border-right: 1px solid #ccc
				.selectBody
					height: 75%
					overflow: hidden
					margin-bottom: 20px
					.selectBodyContent
						width: 90%
						height: calc(100% - 50px)
				.selectFooter
					height: 10%
					line-height: 10%
			.rightBox
				width: 65%
				float: right
				height: 485px
				border: 1px solid #ccc
				overflow-y: auto
				overflow-x: hidden
				margin-top: 10px
				padding: 10px
				.rightTitle
					overflow: hidden
					height: 20px
					line-height: 20px
					border-bottom: 1px solid #ccc
					width: 95%
					margin: 2.5% auto
					padding-bottom: 30px
					p
						width: 20%
						height: 20px !important
						line-height: 20px !important
						float: left
						margin-left: 15px
						margin-right: 42%
				.el-checkbox__label
					width: 80%
				.footerDataBox
					text-align: center
					font-size: 13px
					width: 95%
					margin:   10px auto 0
					border-top: 1px solid #ccc
					padding-top: 8px
</style>
