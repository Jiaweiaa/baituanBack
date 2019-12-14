<template>
	<div class="dialogView">
		<el-form
				:model="dialogForm"
				style="width: 95%; margin: 0 auto;"
				status-icon
				:rules="dialogFormRules"
				ref="dialogForm"
		>
			<el-form-item label="通知标题" label-width="160px" prop="title">
				<el-input v-model="dialogForm.title" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="通知内容" label-width="160px" prop="content">
				<el-input v-model="dialogForm.content"  type="textarea" resize="none" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="是否开启通知" label-width="160px" prop="status">
				<el-switch
						v-model="dialogForm.status"
						:activeValue="true"
						:inactiveValue="false"
						active-color="#13ce66"
						inactive-color="#ff4949">
				</el-switch>
			</el-form-item>
		</el-form>
		<div slot="footer" style="position: fixed; bottom: 50px; right: 30px;" class="dialog-footer">
			<el-button :loading="btnLoading" type="primary" @click="dialogClick">发布</el-button>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'dialogView',
    data() {
      return {
        dialogForm: {
          status: false,
	        title: '',
	        content: ''
        },
        dialogFormRules: {
          title: [
            {required: true,  message:'请输入标题', trigger: 'blur'}
          ],
	        content: [
            {required: true,  message:'请输入内容', trigger: 'blur'}
	        ]
        },
        btnLoading: false,
	      
      }
    },
    components: {
    
    },
    methods: {
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
          }
        });
      }
    }
  }
</script>

<style lang="sass">
	.dialogView
		overflow: hidden
		margin: 60px 20px 0
</style>
