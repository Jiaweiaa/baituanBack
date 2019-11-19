<template>
	<div class="blackEdit">
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
				<el-slider
					:min="10"
					:max="100"
					style="float: left; width: 85%;height: 0px; margin-right: 5px;"
					v-model="dialogForm[item.id]">
				</el-slider>
				<span style="float: right; font-size: 13px;">{{dialogForm[item.id] ? dialogForm[item.id] : 0}} 像素</span>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>

  export default {
    name: 'blackEdit',
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
