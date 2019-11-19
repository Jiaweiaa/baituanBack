<template>
	<div class="guideEdit">
		<!--
     wjw
     商品详情
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
				<el-color-picker
						style="float: right; width: 100%;height: 0px;"
						v-if="index == '0'"
						v-model="dialogForm[item.id]">
				</el-color-picker>
				<el-radio-group
						v-if="index !== '0'"
						v-model="dialogForm[item.id]"
						@change="valChange(item.id)">
					<el-radio
						v-for="(childItem, childIndex) in item.modulePropertyValues"
						:label="childItem.id"
						:key="childIndex">
						{{childItem.name}}
					</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>

  export default {
    name: 'guideEdit',
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
