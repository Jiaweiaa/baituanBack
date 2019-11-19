<template>
  <div class="labberConcessionsBox">
    <!--图片查看-->
    <el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
      <div style="text-align: center;">
        <el-image
                width="360"
                :src="'http://qn.gaoshanmall.cn/'+photoUrl"
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
          label="推送App"
          align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pushApp ? scope.row.pushApp  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="发送状态"
              align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hasSend == 0 ?'未发送' : '已发送'}}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="图片"
              align="center">
        <template slot-scope="scope">
          <img @click="lookThis(scope.row.pageImg)"
               style="width: 50px; height: 50px; cursor: pointer;"
               :src='"http://qn.gaoshanmall.cn/"+scope.row.pageImg' />
        </template>
      </el-table-column>
      <!--
				v-if="hasPerm('sys:role:bindMenu')"
			-->
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button @click="sendSms(scope.row)" v-show="scope.row.hasSend == 0"  type="primary" icon="el-icon-message"></el-button>
          <el-button @click="edit(scope.row)" v-show="scope.row.hasSend == 0" type="primary" icon="el-icon-setting"></el-button>
          <el-button @click="del(scope.row)" v-show="scope.row.hasSend == 1" type="danger" icon="el-icon-delete"></el-button>
          <el-button @click="seeDetail(scope.row)" type="success" icon="el-icon-view"></el-button>
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
    <el-dialog :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form style="width: 95%; margin: 0 auto;" :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input :disabled="this.dialogTitle == '查看'" v-model="dialogForm.title"></el-input>
        </el-form-item>
        <!--<el-form-item label="类型" label-width="120px" prop="roleCode">-->
        <!--<el-input v-model="dialogForm.roleCode"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="推送App" label-width="120px" prop="pushApp">
          <el-checkbox-group  :disabled="this.dialogTitle == '查看'" v-model="dialogForm.pushApp">
            <el-checkbox v-for="channel in channelListData" :label="channel.id" :key="channel.id">{{channel.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!--<el-form-item label="发文日期" label-width="120px" prop="sentTime">-->
          <!--<el-date-picker-->
            <!--v-model="dialogForm.sentTime"-->
            <!--align="right"-->
            <!--type="datetime"-->
            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
            <!--placeholder="选择日期"-->
            <!--:picker-options="pickerOptions">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="发送对象" label-width="120px" prop="recipientsId">-->
        <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
        <!--<div style="margin: 15px 0;"></div>-->
        <!--<el-checkbox-group v-model="dialogForm.recipientsId" @change="handleCheckedCitiesChange">-->
        <!--<el-checkbox v-for="empData in empListData" :label="empData.id" :key="empData.id">{{empData.empName}}</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
        
        <el-form-item label="类型图标" label-width="120px" prop="img">
          <el-upload
            :disabled="this.dialogTitle == '查看'"
            class="avatar-uploader"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :show-file-list="false"
            :on-success="handleChange"
            :before-upload="beforeUpload">
            <el-image
              v-if="dialogForm.img"
              :src="`http://qn.gaoshanmall.cn/${dialogForm.img}?imageMogr2/thumbnail/180x180`"
              class="avatar"></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片" label-width="120px"  prop="pageImg">
          <el-upload
            :disabled="this.dialogTitle == '查看'"
            class="avatar-uploader"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :show-file-list="false"
            :on-success="handleChangeS"
            :before-upload="beforeUpload">
            <img v-if="dialogForm.pageImg" :src="`http://qn.gaoshanmall.cn/${dialogForm.pageImg}?imageMogr2/thumbnail/180x180`" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="概述" label-width="120px" prop="summary">
          <el-input  :disabled="this.dialogTitle == '查看'" v-model="dialogForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="发送内容" label-width="120px" prop="content">
          <tinymce  :disabled="this.dialogTitle == '查看'"  width="100%" ref="tinymce" :height="300" v-model="dialogForm.content"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="dialogTitle=='查看'" @click="cancelDialog">关 闭</el-button>
        <el-button v-show="dialogTitle !== '查看'" @click="cancelDialog">取 消</el-button>
        <el-button v-show="dialogTitle !== '查看'" :loading="btnLoading" type="primary" @click="dialogClick(1)">保 存</el-button>
        <el-button :loading="btnLoading" v-show="dialogTitle=='编辑'" type="primary" @click="dialogClick(2)">发 送</el-button>
        
      </div>
    </el-dialog>
  
  
  </div>
</template>

<script>
  import Tinymce from "@/components/Tinymce/keeperIndex";
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table';
  import { noticeList, allEmpl, doAdd, doSend, goUpdate, doUpdate, doUpdateAndSend, doDel} from '@/api/gskeeper/noticeList/index';
  
  export default {
    name: 'noticeList',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入通知标题',
                inputModel: 'title',
                labelName: '通知标题',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增通知'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
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
          sentTime: {
            required: true,  message:'请选择发送时间', trigger: 'blur'
          },
          pushApp: {
            required: true,  message:'请选择发送对象', trigger: 'blur'
          },
          // recipientsId : {
          //   required: true,  message:'请选择发送对象', trigger: 'blur'
          // },
          content: {
            required: true,  message:'请输入内容', trigger: 'blur'
          },
          summary: {
            required: true,  message:'请输入概述', trigger: 'blur'
          },
          img: [
            {required: true,  message: '请上传图标', trigger: 'blur'}
          ],
          pageImg: [
            {required: true,  message: '请上传图片', trigger: 'blur'}
          ]
        },
        typeBok: false,
        imgSrcBasic:"",
        
        dialogForm: {
          title: '',
          sentTime: '',
          recipientsId: [],
          content: '',
          img: '',
          summary: '',
          pageImg: ''
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
      this.getEmpList();
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
      handleChangeS(response, file) {
        if (response.code == 200) {
          this.$set(this.dialogForm, 'pageImg', response.result);
          this.$notify({
            title: response.message,
            type: "success"
          });
        }
      },
      
      // 员工选择
      handleCheckAllChange(val) {
        let checkeds = [];
        this.empListData.forEach(item => {
          checkeds.push(item.id);
        });
        this.dialogForm.recipientsId = val ? checkeds : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.empListData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.empListData.length;
      },
      // 获取员工列表
      getEmpList() {
        allEmpl().then(res => {
          this.empListData = res.result;
        })
      },
      
      // 获取列表
      getList() {
        this.listLoading = true;
        noticeList(this.searchParams).then((res) => {
          this.listData = res.result.records;
          this.totalNum = Number(res.result.total);
          this.current = Number(res.result.current);
          this.listLoading = false;
        })
      },
      // 搜索方法
      searchBtn(val) {
        this.searchParams.title = val.title;
        this.getList();
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
      
      
      // 发送邮件
      sendSms(val) {
        this.$confirm("此操作将发送通知是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let params = {
            id: val.id
          }
          doSend(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "发送成功!"
              });
              this.getList();
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发送"
          });
        });
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
          doDel(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              let params = Object.assign({
                pageNum: this.searchParams.pageNum,
                pageSize: this.searchParams.pageSize
              }, this.searchData);
              noticeList(params).then((res) => {
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
      //查看详情
      seeDetail(val){
        this.formFun(val, 'see')
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
            sentTime: '',
            recipientsId: [],
            pushApp: [],
            content:'',
            img: '',
            summary: ''
          }
        }else {
          if(type == 'see') {
            // console.log(val);
            this.dialogTitle = '查看';
          }else {
            this.dialogTitle = '编辑';
          }
          let params = {
            id: val.id
          }
          goUpdate(params).then(res => {
            this.dialogForm = res.result;
            this.dialogForm.pushApp = this.dialogForm.pushApp ? this.dialogForm.pushApp.split(',') : '';
            this.dialogForm.id = val.id;
            this.dialogFormVisible = true;
            // this.dialogForm = Object.assign({},res.result)
            this.dialogForm.id = val.id;
            // console.log(this.dialogForm);
          })
        }
      },
      // 编辑和新增点击
      dialogClick(val) {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let str = '';
            this.dialogForm.pushApp.map(v => {
              str += v+ ',';
            })
            str = str.substring(0, str.length - 1);
            this.dialogForm.pushApp = str;
            // this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              doAdd(this.dialogForm).then((res) => {
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
              if(val == 1) {
                doUpdate(this.dialogForm).then(res => {
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
                doUpdateAndSend(this.dialogForm).then(res => {
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
