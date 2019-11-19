<template>
	<div class="Title">
		<!--
     wjw
     标题
    -->
		<div class="noData" v-if="dataSource.viewData['33'] == ''">
			请点击此处然后在右侧选择标题配置
		</div>
		
		<!--
			文本内容
		-->
		<div
			v-else
			class="content"
			:style="{
				backgroundColor: dataSource.viewData['37'],
				textAlign: dataSource.viewData['35'] == '58' ? 'left' :dataSource.viewData['35'] == '59' ? 'center' : 'right',
			}">
			<p style="font-size: 15px;">{{dataSource.viewData['33']}}
				<span style="margin-left: 10px;font-size: 13px; color: #409EFF;">-{{dataSource.viewData['36']}}</span>
			</p>
			<p style="font-size: 13px; color: #ccc;">{{dataSource.viewData['navigation'].name}}</p>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'Title',
    props:  ['dataSource'],

    data() {
      return {


      }
    },
    components: {


    },
    methods: {

    }
  }
</script>

<style lang="sass">
	.Title
		.noData
			height: 25px
			line-height: 25px
			color: #f44
			font-size: 14px
			text-align: center
		.content
			overflow: hidden
			align-items: center
			display: block
			padding-left: 10px
</style>
