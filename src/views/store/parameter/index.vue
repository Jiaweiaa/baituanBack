<template>
    <div class="labberConcessionsBox">
      <div class="title">参数设置</div>
      <el-form :model="dialogForm" style="width: 80%;margin: 0 auto;" class="formStyle" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="Logo图片" label-width="200px" prop="logo">
	        <el-upload
			        class="avatar-uploader"
			        :action="imgSrcBasic + '/opc/auth/uploadFile'"
			        :show-file-list="false"
			        :on-success="handleChange"
			        :before-upload="beforeUpload">
		        <img v-if="dialogForm.logo" :src="'http://qn.gaoshanmall.cn/'+dialogForm.logo" class="avatar">
		        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	        </el-upload>
        </el-form-item>
    
        <el-form-item label="订单取消时间" label-width="200px" prop="orderAutoCancelTime">
          <el-input v-model="dialogForm.orderAutoCancelTime"></el-input>
          <p>
            未成功付款的订单，系统自动保留多少时间后自动取消订单，并释放库存；例如120分钟（2小时），480分钟（8小时），720分钟（12小时）等等
          </p>
        </el-form-item>

        <el-form-item label="发票方式" label-width="200px" prop="invoice">
          <el-radio-group v-model="dialogForm.invoice">
            <el-radio :label="0">不提供发票</el-radio>
            <el-radio :label="1">提供发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="运费" label-width="200px" prop="freigthFreeAmount">
          <el-radio-group v-model="dialogForm.freigthFreeAmount">
            <el-radio :label="1">全场免邮</el-radio>
            <el-radio :label="0">设置运费</el-radio>
          </el-radio-group>
        </el-form-item>
	      <el-form-item v-show="dialogForm.freigthFreeAmount == 0" label="运费金额" label-width="200px" prop="freightAmount">
		      <el-input v-model="dialogForm.freightAmount"></el-input>
	      </el-form-item>
	
	      <el-form-item label="微信支付" label-width="200px" prop="weixinPay">
		      <el-radio-group v-model="dialogForm.weixinPay">
			      <el-radio :label="0">支持</el-radio>
			      <el-radio :label="1">不支持</el-radio>
		      </el-radio-group>
	      </el-form-item>
	      <el-form-item label="支付宝支付" label-width="200px" prop="alipayPay">
		      <el-radio-group v-model="dialogForm.alipayPay">
			      <el-radio :label="0">支持</el-radio>
			      <el-radio :label="1">不支持</el-radio>
		      </el-radio-group>
	      </el-form-item>
	      <el-form-item label="货到付款" label-width="200px" prop="cashPay">
		      <el-radio-group v-model="dialogForm.cashPay">
			      <el-radio :label="0">支持</el-radio>
			      <el-radio :label="1">不支持</el-radio>
		      </el-radio-group>
	      </el-form-item>
      </el-form>
      <div style="float: right;" slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </div>
</template>

<script>
	import { getStoreConfigInfo, editStoreConfig } from '@/api/store/information/index'
	
  export default {
    name: 'parameter',
    data() {
      return {
        dialogForm: {
          logo: '',
          orderAutoCancelTime: '',
          freightAmount: ''
        },
        dialogFormRules: {
          logo: [
            {required: true,  message:'请上传logo', trigger: 'blur'}
          ],
          orderAutoCancelTime: [
            {required: true,  message:'请输入订单取消时间', trigger: 'blur'}
          ],
          freightAmount: [
            {required: true,  message:'请输入运费金额', trigger: 'blur'}
          ],
        },
        fileList: [],

        // 上传
        // 图片源
        imgSrcBasic: "",
	      
      }
    },
	  created() {
      this.imgSrcBasic = process.env.BASE_API;
      this.getData();
	  },
    methods: {
      getData() {
        getStoreConfigInfo().then(res => {
          this.dialogForm = res.result;
        })
      },
      // 上传限制
      beforeUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isGIF = file.type === "image/gif";
        const isPNG = file.type === "image/png";
        const isBMP = file.type === "image/bmp";
        const isLt2M = file.size / 1024 / 1024 < 2;
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
            message: "图片大小不超过2M",
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
          this.$notify({
            title: response.message,
            type: "success"
          });
          this.dialogForm.logo = response.result;
        }
      },
	    
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            editStoreConfig(this.dialogForm).then(res => {
              if(res.code == 200) {
                this.getData();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }else {
                this.$notify.error({
                  title: res.message,
                  offset: 100
                });
              }
            })
          }
        })
        
      },
      cancelDialog() {},
    }
  }
</script>

<style lang="sass">
	.title
		font-size: 20px
		font-weight: bold
		margin-left: 20px
		margin-bottom: 20px
		color: #333
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
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
