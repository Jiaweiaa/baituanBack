<template>
	<div class="Text">
		<!--
     wjw
      文本
    -->
		<div class="noData" v-if="dataSource.viewData['26'] == ''">
			请点击此处然后在右侧选择文本配置
		</div>
	
		<!--
			文本内容
		-->
		<div
			v-else
			class="content"
			:style="{
				fontSize: dataSource.viewData['27'] == '49' ?  '18px' :  dataSource.viewData['27'] == '50' ? '16px' : '14px',
				color: dataSource.viewData['28'],
				backgroundColor: dataSource.viewData['29'],
				textAlign: dataSource.viewData['30'] == '52' ? 'left' :dataSource.viewData['30'] == '53' ? 'center' : 'right',
				borderBottom: dataSource.viewData['32'] == '55' ? '1px solid #ccc' : ''
			}">
				{{dataSource.viewData['26']}}
		</div>
	</div>
</template>

<script>
  export default {
    name: 'textComponents',
    props:  ['dataSource'],

    data() {
      return {


      }
    },
    methods: {

    }
  }
</script>

<style lang="sass">
	.Text
		.noData
			height: 25px
			line-height: 25px
			color: #f44
			font-size: 14px
			text-align: center
		.content
			display: block
			height: 25px
			line-height: 25px
			padding: 0 0 0 10px
</style>
