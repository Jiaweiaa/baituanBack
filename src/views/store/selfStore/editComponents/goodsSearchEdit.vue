<template>
	<div class="searchEdit">
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
				<div 	v-if="index == '0'">
					<el-button size="small" type="primary" @click="addWords" round>添加热词</el-button>
					<div v-for="(wordItem, wordIndex) in dialogForm[48]" :key="wordIndex">
						<div class="hoverBox">
							<el-input
								size="small"
								class='inputWord'
								placeholder="请输入内容"
								v-model="dialogForm[48][wordIndex]"
								clearable>
							</el-input>
							<i @click="deleteWords(wordIndex)" class="el-icon-circle-close deleted"></i>
						</div>
					</div>
				</div>
			
				<el-radio-group
						v-else-if="index == '1' || index == '5'"
						v-model="dialogForm[item.id]"
						@change="valChange(item.id)">
					<el-radio
							v-for="(childItem, childIndex) in item.modulePropertyValues"
							:label="childItem.id"
							:key="childIndex">
						{{childItem.name}}
					</el-radio>
				</el-radio-group>
				<div 	v-else-if="index == '2'">
					<el-slider
						:min="28"
						:max="40"
						style="float: left; width: 85%;height: 0px; margin-right: 5px;"
						v-model="dialogForm[item.id]">
					</el-slider>
					<span style="float: right; font-size: 13px;">{{dialogForm[item.id] ? dialogForm[item.id] : 0}} 像素</span>
				</div>
			
				<el-color-picker
						v-else-if="index == '3' || index == '4' || index == '6'  "
						style="float: right; width: 100%;height: 0px;"
						v-model="dialogForm[item.id]">
				</el-color-picker>
				
			</el-form-item>
		</el-form>
	</div>
</template>

<script>

  export default {
    name: 'searchEdit',
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
      },

      addWords() {
        this.dialogForm[48].push('');
      },
      deleteWords(index) {
        this.dialogForm[48].splice(index, 1)
      }
    }
  }
</script>

<style lang="sass">
	.searchEdit
		.hoverBox
			display: flex
			align-items: center
			overflow: hidden
			.inputWord
				margin-top: 10px
				float: left
				width: 80%
				height: 100%
			.deleted
				font-size: 18px
				margin-left: 10px
				display: none
				cursor: pointer
		.hoverBox:hover
			.deleted
				display: block
</style>
