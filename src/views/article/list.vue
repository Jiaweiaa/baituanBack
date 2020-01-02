<template>
	<div class="labberConcessionsBox">
		<!--图片查看-->
		<el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
			<div style="text-align: center;">
				<el-image
						width="360"
						:src="'https://static.ibaituan.cn/'+photoUrl"
						alt="">
				</el-image>
			</div>
		</el-dialog>
		<!--
		 wjw
		 顶部搜索
		-->
		<div style="margin-bottom:15px;">
			<searchView :searchModel="searchModel"></searchView>
		</div>
		
		<!--
			列表
		-->
		<el-table
				class="table"
				stripe
				:data="listData"
				height="550"
				v-loading="listLoading"
				border>
			<el-table-column
					label="标题"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.title ? scope.row.title  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="图片"
					align="center">
				<template slot-scope="scope">
					<img @click="lookThis(scope.row.img)"
					     style="width: 50px; height: 50px; cursor: pointer;"
					     :src='"https://static.ibaituan.cn/"+scope.row.img' />
				</template>
			</el-table-column>
			<el-table-column
					label="修改时间"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.updateTime ? scope.row.updateTime  : ''}}</span>
				</template>
			</el-table-column>
			<!--
				v-if="hasPerm('sys:role:bindMenu')"
			-->
			<el-table-column align="center" prop="created_at" label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="edit(scope.row)" type="primary" icon="el-icon-setting">修改</el-button>
					<el-button size="small" @click="del(scope.row)" type="danger" icon="el-icon-delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!--
			分页
		-->
		<el-pagination
			class="paginationClass"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page.sync="current"
			:page-sizes="[5, 10, 15, 20]"
			:page-size="searchParams.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="totalNum">
		</el-pagination>
		
		<!--
			新增弹层
		-->
		<el-dialog width="60%" :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form style="width: 95%; margin: 0 auto;" :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="标题" label-width="120px" prop="title">
					<el-input v-model="dialogForm.title"></el-input>
				</el-form-item>
				<el-form-item label="描述" label-width="120px" prop="spare">
					<el-input type="textarea" v-model="dialogForm.spare"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px" prop="img">
					<el-upload
						class="avatar-uploader"
						:action="imgSrcBasic + '/opc/auth/uploadFile'"
						:show-file-list="false"
						:on-success="handleChange"
						:before-upload="beforeUpload">
						<el-image
							v-if="dialogForm.img"
							:src="`https://static.ibaituan.cn/${dialogForm.img}?imageMogr2/thumbnail/180x180`"
							class="avatar"></el-image>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="内容" label-width="120px" prop="content">
					<tinymce  :disabled="this.dialogTitle == '查看'"  width="100%" ref="tinymce" :height="300" v-model="dialogForm.content"></tinymce>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button :loading="btnLoading" type="primary" @click="dialogClick(1)">保 存</el-button>
			</div>
		</el-dialog>
	
	
	</div>
</template>

<script>
  import Tinymce from "@/components/Tinymce/keeperIndex";
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table';
  import {
    getNewsPage,
    removeNewsById,
    updateNewsById,
    getNewsById,
    createNews
  } from '@/api/homeView/article/index';

  export default {
    name: 'noticeList',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增专题'
              }
            ]
          }
        ],

        // table和分页的数据
        searchData: {},
        listData: [],
        listLoading: true,

        // 列表页数据
        searchParams: {
          title: '',
          pageSize: 10,
          pageNum: 1,
        },
        totalNum: 0,
        current: 0,

        // 弹层
        dialogTitle: '',
        dialogFormVisible: false,
        dialogFormRules:{
          title: {
            required: true,  message:'请输入标题', trigger: 'blur'
          },
          content: {
            required: true,  message:'请输入内容', trigger: 'blur'
          },
          img: [
            {required: true,  message: '请上传图标', trigger: 'blur'}
          ],
          spare: {
            required: true,  message:'请输入描述', trigger: 'blur'
          }
        },
        typeBok: false,
        imgSrcBasic:"",

        dialogForm: {
          title: '',
          content: '',
          img: '',
          spare: ''
        },
        btnLoading: false,

        // 员工列表
        empListData: [],
        isIndeterminate: true,
        checkAll: false,
        // 时间控件
        pickerOptions: {
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
        },

        photoVisible: false,
        photoUrl: '',
        channelListData: [{
          id: '1000',
          name: '救援'
        },{
          id: '2000',
          name: '大管家'
        }]
      }
    },
    components: {
      searchView,
      CommonTable,
      Tinymce
    },
    created() {
      this.imgSrcBasic = process.env.BASE_API;
      this.getList();
    },
    methods: {
      // 上传限制
      beforeUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isGIF = file.type === "image/gif";
        const isPNG = file.type === "image/png";
        const isBMP = file.type === "image/bmp";
        const isLt2M = file.size / 1024 / 1024 <2;
        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message({
            showClose: true,
            message: "只能上传jpeg,gif,png,bmp,pdf等类型的图片文件",
            type: "warning"
          });
        }
        if (!isLt2M) {
          this.$message({
            showClose: true,
            message: "图片大小不超过2M!",
            type: "warning"
          });
        }
        if ((isJPG || isBMP || isGIF || isPNG) && isLt2M) {
          this.typeBok = true;
        } else {
          this.typeBok = false;
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
      // 上传成功提示
      handleChange(response, file) {
        if (response.code == 200) {
          this.$set(this.dialogForm, 'img', response.result);
          this.$notify({
            title: response.message,
            type: "success"
          });
        }
      },
	    
      // 获取列表
      getList() {
        this.listLoading = true;
        getNewsPage(this.searchParams).then((res) => {
          this.listData = res.result.records;
          this.totalNum = Number(res.result.total);
          this.current = Number(res.result.current);
          this.listLoading = false;
        })
      },
    
      // 列表页数更改
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getList();
      },
      // 列表条数更改
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList();
      },
      // 删除操作
      del(val) {
        this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: val.id
          }
          removeNewsById(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              let params = Object.assign({
                pageNum: this.searchParams.pageNum,
                pageSize: this.searchParams.pageSize
              }, this.searchData);
              getNewsPage(params).then((res) => {
                if(res.result.records.length <= 0 && this.current  > 1) {
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
	    
      // 编辑调取方法
      edit(val) {
        this.formFun(val, 'edit')
      },
      // 新增调取方法
      addBtn() {
        this.formFun('', 'add')
      },
      // 编辑新增公共函数
      formFun(val, type) {
        if(type == 'add') {
          this.dialogTitle = '新增';
          this.dialogFormVisible = true;
          this.dialogForm= {
            title: '',
            content:'',
            spare: '',
            img: ''
          }
        }else {
          this.dialogTitle = '编辑';
          let params = {
            id: val.id
          }
          getNewsById(params).then(res => {
            this.dialogForm = res.result;
            this.dialogForm.id = val.id;
            this.dialogFormVisible = true;
          })
        }
      },
      // 编辑和新增点击
      dialogClick(val) {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              createNews(this.dialogForm).then((res) => {
                if(res.code == 200) {
                  this.getList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
                this.btnLoading = false;
                this.cancelDialog();
              }).catch(err => {
                this.btnLoading = false;
              })
            }else {
              updateNewsById(this.dialogForm).then(res => {
                if(res.code == 200) {
                  this.getList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
                this.btnLoading = false;
                this.cancelDialog();
              }).catch(err => {
                this.btnLoading = false;
              })
            }
          }
        });
      },
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {
          title: '',
          sentTime: '',
          recipientsId: [],
          content: '',
          img: '',
          summary: ''
        };
        this.$refs['tinymce'].setContent('');
      },

      lookThis(val) {
        this.photoUrl = val;
        this.photoVisible = true;
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
		.paginationClass
			float: right
			margin-top: 20px
			margin-right: 20px
		.avatar
			width: 178px
			height: 178px
			display: block
		
		.avatar-uploader .el-upload
			border: 1px dashed #d9d9d9
			border-radius: 6px
			cursor: pointer
			position: relative
			overflow: hidden
		
		.avatar-uploader .el-upload:hover
			border-color: #409EFF
		
		.avatar-uploader-icon
			font-size: 28px
			color: #8c939d
			width: 178px
			height: 178px
			line-height: 178px
			text-align: center
</style>
