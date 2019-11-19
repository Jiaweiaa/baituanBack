<template>
	<div class="navigation">
		<!--
     wjw
     图文导航
    -->
		<div class="noData" v-if="dataSource.viewData['pic'].length <= 0">
			请点击此处然后在右侧选择图片导航配置
		</div>
		<!--
			内容
		-->
		<div class="content" v-else>
			<div
				class="listView"
				:style="{
					width: dataSource.viewData['23'] == '46' ? (100 / dataSource.viewData['pic'].length) +'%' : '150px',
					minWidth: dataSource.viewData['23'] == '46' ? (100 / dataSource.viewData['pic'].length) +'%' : '150px',
					maxWidth: dataSource.viewData['23'] == '46' ? (100 / dataSource.viewData['pic'].length) +'%' : '150px',
				}"
				v-for="(item, index) in dataSource.viewData['pic']">
				<el-image
					class="image"
					v-if="dataSource.viewData['22'] == '44'"
					:class="{isHidden: dataSource.viewData['22'] == '44'}"
					:src='"http://qn.gaoshanmall.cn/"+item.imgUrl'
				></el-image>
				<div
					:style="{
						background: dataSource.viewData[24],
						color: dataSource.viewData[25]
					}"
					class="name">
					{{item.name}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'navigation',
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
	.navigation
		.noData
			height: 25px
			line-height: 25px
			color: #f44
			font-size: 14px
			text-align: center
		.content
			width: 100%
			display: flex
			flex-wrap: nowrap
			.listView
				.image
					width: 100%
					height: 40px
				.name
					margin-top: -3px
					width: 100%
					height: 30px
					font-size: 13px
					line-height: 30px
					text-align: center
</style>
