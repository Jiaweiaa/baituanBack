<template>
	<div class="qrCodeContent">
		<el-button size="small" type="primary" @click="getQrCode">生成二维码</el-button>
		
		<el-table
			:data="tableData"
			border
			style="width: 80%; margin-top: 30px; ">
			<el-table-column
				prop="allScore"
				align="center"
				label="余额">
			</el-table-column>
			<el-table-column
				prop="score"
				align="center"
				label="每次领取数量">
			</el-table-column>
			<el-table-column
					prop="hours"
					align="center"
					label="剩余秒数">
			</el-table-column>
		</el-table>
		
		<el-image
			class="qrCodeStyle"
			:src="qrCodeUrl"
			fit="none"></el-image>
		
		<!--
			生成二维码
		-->
		<el-dialog title="生成平台二维码" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form
					:model="dialogForm"
					style="width: 95%; margin: 0 auto;"
					status-icon
					:rules="dialogFormRules"
					ref="dialogForm"
			>
				<el-form-item label="领取数量" label-width="160px" prop="score">
					<el-input v-model="dialogForm.score"></el-input>
				</el-form-item>
				<el-form-item label="总数量" label-width="160px" prop="allScore">
					<el-input v-model="dialogForm.allScore"></el-input>
				</el-form-item>
				<el-form-item label="保存小时" label-width="160px" prop="hours">
					<el-input v-model="dialogForm.hours"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>

  import {
    genBigSendScoreQrCode,
    getBigSendScoreQrCode
  } from '@/api/distribution/index'

  export default {
    name: 'qrCode',
    created() {
      this.getQrCodeList()
    },
    data() {
      // 验证总数
      let validNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入总数量！'));
        } else {
          if(Number(this.dialogForm.allScore) < Number(this.dialogForm.score)) {
            callback(new Error('总数量不能小于领取数量！'));
          }else {
            callback();
          }
        }
      };
      
      // 领取数量
      let validScoreNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入领取数量！'));
        } else {
          if(Number(this.dialogForm.allScore) < Number(this.dialogForm.score)) {
            callback(new Error('领取数量不能大于总数量！'));
          }else {
            callback();
          }
        }
      };
      
      return {
        qrCodeUrl: '', //二维码链接
        // form
        dialogFormVisible: false,
        dialogFormRules: {
          score: {
            required: true,
            validator: validScoreNum,
            trigger: 'blur'
          },
          allScore:  {
            required: true,
	          validator: validNum,
	          trigger: 'blur'
          },
          hours: {
            required: true,
            message: "请输入总小时",
            trigger: "blur"
          }
        },
	      tableData: [],
        dialogForm: {
          score: '',
          allScore: '',
          hours: ''
        },
        btnLoading: false
      }
    },
    methods: {
      getQrCode() {
        this.dialogFormVisible = true;
      },
      getQrCodeList() {
        getBigSendScoreQrCode().then(res => {
	        this.tableData = [res.result];
          this.qrCodeUrl = res.result.ORcode;
        })
      },

      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            genBigSendScoreQrCode(this.dialogForm).then(res => {
              this.btnLoading = false;
              this.$message(res.message);
              if(res.code == 200) {
                this.getQrCodeList();
                this.cancelDialog();
              }
            })
          }
        });
      },
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {
          word: '',
          type: '',
          status: ''
        };
        this.$refs['dialogForm'].resetFields();
      },
    }
  }
</script>

<style lang="sass">
	.qrCodeContent
		overflow: hidden
		margin: 20px 20px 0
		.qrCodeStyle
			position: absolute
			width: 350px
			height: 350px
			left: 50%
			margin-left: -175px
			top: 220px
</style>
