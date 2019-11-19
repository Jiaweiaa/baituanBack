<template>
	<div class="noticeEdit">
		<!--
     wjw
     公告
    -->
		<el-form
				:model="dialogForm"
				style="width: 100%; margin: 0 auto;"
				status-icon ref="dialogForm">
			<el-form-item
					v-for="(item, index) in propertiesData"
					:key="index"
					:label="item.name"
					label-width="80px">
				<el-input
					size="small"
					style="float: right; width: 100%;height: 0px;"
					placeholder="请输入内容"
					v-if="index == '0'"
					v-model="dialogForm[item.id]"
					clearable>
				</el-input>
				<el-color-picker
						style="float: right; width: 100%;height: 0px;"
						v-else
						v-model="dialogForm[item.id]">
				</el-color-picker>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>

  export default {
    name: 'noticeEdit',
    props:  ['propertiesData', 'index', 'dialogForm'],

    data() {
      return {
        typeData: ''
      }
    },
    created() {
      console.log(this.dialogForm);
    },
    methods: {
      // 数据改变即时保存
      valChange() {
        this.$parent.isChange({
          data: this.dialogForm,
          index: this.index
        });
      }
    }
  }
</script>

<style lang="sass">

</style>
