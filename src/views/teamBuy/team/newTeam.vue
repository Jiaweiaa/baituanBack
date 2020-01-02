<template>
	<div class="information newTeam">
		<div class="title">新建团长</div>
		
		<!-- 表单模态框 -->
		<el-dialog width="60%" title="选择用户" :visible.sync="innerVisible"  append-to-body  :before-close="cancelSelect">
			<div style="overflow: hidden; margin-bottom: 20px; width: 100%;">
				<div style="width: 300px;overflow: hidden; float: left;">
					<p style="width: 80px; float: left; text-align: right; margin: 8px 20px 0 0; ">姓名:</p>
					<el-input size="small" style="float: left; width: 180px;" v-model="searchForm.nickname"></el-input>
				</div>
				<div style="width: 300px;overflow: hidden">
					<p style="width: 80px; float: left; text-align: right; margin: 8px 20px 0 0; ">电话:</p>
					<el-input size="small" style="float: left; width: 180px;" v-model="searchForm.mobile"></el-input>
				</div>
				<div style="width: 300px;overflow: hidden; float: right; text-align: right; margin-right: 20px;">
					<el-button size="small" type="primary" @click="searchBtn">搜索</el-button>
				</div>
				
				
			</div>
			<el-table
					class="newTeamTable"
					:data="tableData"
					ref="multipleTable"
					@row-click="showRow"
					style="width: 100%">
				<el-table-column label="选择" width="50" align="center">
					<template  slot-scope="scope">
						<el-radio class="radio"  v-model="radio"  :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column
					prop="memberId"
					label="用户ID">
				</el-table-column>
				<el-table-column
					prop="nickname"
					show-overflow-tooltip
					label="用户名">
				</el-table-column>
				<el-table-column
					prop="address"
					label="头像">
					<template  slot-scope="scope">
						<el-image
							style="width: 100px; height: 100px"
							:src="'http://static.ibaituan.cn/'+scope.row.avatar"
							fit="fit"></el-image>
					</template>
				</el-table-column>
				<el-table-column
					prop="mobile"
					label="手机号">
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
				<el-button @click="cancelSelect">取 消</el-button>
				<el-button type="primary" @click="addSelect">确 定</el-button>
			</div>
		</el-dialog>
		
		<el-form
				:model="dialogForm"
				style="width: 80%;margin: 0 auto; overflow: hidden;"
				class="formStyle"
				status-icon
				:rules="dialogFormRules"
				ref="dialogForm">
			<el-form-item label="团长姓名" label-width="160px" prop="name">
				<el-input v-model="dialogForm.name"></el-input>
			</el-form-item>
			<el-form-item label="团长地址" label-width="160px" prop="address">
				<el-input  v-model="dialogForm.address"></el-input>
			</el-form-item>
			<el-form-item label="提货地址" label-width="160px" prop="deliveryAddress">
				<el-input  v-model="dialogForm.deliveryAddress"></el-input>
			</el-form-item>
			<el-form-item label="小区名称" label-width="160px" prop="community">
				<el-input  v-model="dialogForm.community"></el-input>
			</el-form-item>
			<el-form-item label="手机号" label-width="160px" prop="mobile">
				<el-input  v-model="dialogForm.mobile"></el-input>
			</el-form-item>
			<el-form-item label="所属用户" label-width="160px" prop="userId">
				<el-input disabled style="width: 80%; margin-right: 20px;" v-if="dialogForm.userId" @click="getAllUser" v-model="dialogForm.userName"></el-input>
				<el-button size="small" type="primary" round @click="getAllUser">所属用户</el-button>
			</el-form-item>
			<el-form-item label="所属城市" label-width="160px" prop="city">
				<el-input  v-model="dialogForm.city"></el-input>
			</el-form-item>
			<el-form-item label="经度" label-width="160px" prop="longitude">
				<el-input type="number" v-model="dialogForm.longitude"></el-input>
			</el-form-item>
			<el-form-item label="纬度" label-width="160px" prop="latitude">
				<el-input type="number" v-model="dialogForm.latitude"></el-input>
			</el-form-item>
			<el-button @click="getLocation" style="float: right; margin: 20px;" size="small" :loading="posiLoading" type="primary" icon="el-icon-position" round>获取定位</el-button>
		</el-form>
		<div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
			<el-button @click="cancelDialog">取 消</el-button>
			<el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
		</div>

	</div>
</template>

<script>
  import {
    getCustomerInfoList,
    saveOrEditCaptain
  } from '@/api/teamBuy/index';
  
  export default {
    name: 'newTeam',
    data() {
      // 验证账号
      let validateNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空！'));
        } else if(!/^\d+(\.\d+)?$/.test(value)){
          callback(new Error('请输入数字！'));
        } else {
          callback()
        }
      };
      return {
        posiLoading: false,
        btnLoading: false,
        dialogForm: {
          name: '',
          address: '',
          deliveryAddress: '',
          community: '',
	        mobile: '',
          userId: '',
          city: '',
          longitude: null,
          latitude: null
        },
        dialogFormRules: {
          name:[
            {required: true,  message: '请输入团长名称', trigger: 'change'}
          ],
          address:[
            {required: true,  message: '请输入团长地址', trigger: 'change'}
          ],
          deliveryAddress:[
            {required: true,  message: '请输入提货地址', trigger: 'change'}
          ],
          community:[
            {required: true,  message: '请输入小区名称', trigger: 'change'}
          ],
          mobile:[
            {required: true,  message: '请输入手机号', trigger: 'change'}
          ],
          userId:[
            {required: true,  message: '请选择所属用户', trigger: 'change'}
          ],
          city:[
            {required: true,  message: '请输入所属城市', trigger: 'change'}
          ],
          longitude:[
            {required: true,  validator: validateNum, trigger: 'change'}
          ],
          latitude:[
            {required: true, validator: validateNum, trigger: 'change'}
          ]
        },

        // table和分页的数据
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

	      searchForm: {
          nickname: '',
		      mobile: ''
	      },
	      
        innerVisible: false,
        radio: '',
	      selected: {}
	      
      }
    },
    methods: {
      // 获取定位
      getLocation() {
				let _this = this;
				this.posiLoading = true;
        AMap.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 3000,          //超过10秒后停止定位，默认：5s
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          });
          geolocation.getCurrentPosition(function (status, result) {
            _this.posiLoading = false;
            if (status == 'complete') {
              _this.onComplete(result)
            } else {
              _this.onError(result)
            }
          });
        });
      },
      //解析定位结果
      onComplete(data) {
        console.log(data)
	      this.dialogForm.city = data.addressComponent.city;
        this.dialogForm.longitude = data.position.lng;
        this.dialogForm.latitude = data.position.lat;
      },
      //解析定位错误信息
      onError(data) {
        this.$message({
          type: "error",
          message: data.message
        });
      },
	    
	    // 获取所有用户
      getAllUser() {
        this.getList()
        this.innerVisible = true;
      },
	    
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        getCustomerInfoList(params).then((res) => {
          this.tableData =  res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      // 搜索
      searchBtn() {
        this.searchData = this.searchForm;
        this.getList();
      },
      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.getList();
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageIndex = current;
        this.getList();
      },

      showRow(row){
        //赋值给radio
	      this.selected = row;
      },
      addSelect() {
        this.dialogForm.userId = this.selected.memberIdString;
        this.dialogForm.userName = this.selected.nickname;
				this.cancelSelect();
      },
	    cancelSelect() {
        this.radio = '';
        this.innerVisible = false;
        this.pagination = {
          total: 0,
          pageIndex: 1,
          pageSize: 10
        };
	    },

      cancelDialog() {
        this.$router.push({
          path: '/teamBuy/teamTemplate/team'
        });
      },
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if(valid) {
            this.btnLoading = true;
            saveOrEditCaptain(this.dialogForm).then(res => {
              this.btnLoading = false;
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: '新增成功'
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
