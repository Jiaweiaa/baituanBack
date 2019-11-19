<template>
	<div class="search">
		<!--
     wjw
     商品
    -->
		<div
			class="searchBox"
			:style="{
				background: dataSource.viewData['51']
			}"
		>
			<div
				class="content"
				:style="{
					borderRadius: dataSource.viewData['49'] == 72 ? '20px' : '',
					height: dataSource.viewData['50'] + 'px',
					background: dataSource.viewData['52']
				}"
			>
				<i
					class="el-icon-search searchIcon"
					:style="{
						color: dataSource.viewData['54'],
						marginLeft: dataSource.viewData['53'] == 73 ? '125px' : '0'
					}"
				></i>
				<div
					class="body"
					:style="{
						color: dataSource.viewData['54']
					}"
				>搜索商品</div>
			</div>
		</div>
	
	</div>
</template>

<script>
  export default {
    name: 'goodsSearch',
    components: {},

    props:  ['dataSource'],
    data() {
      return {
      }
    },
    methods: {}
  }
</script>

<style lang="sass">
	.search
		.searchBox
			background: #eee
			padding: 5px 10px
			.content
				background: #fff
				overflow: hidden
				height: 30px
				line-height: 30px
				display: flex
				align-items: center
				.searchIcon
					float: left
					color: #999
					font-size: 13px
					padding: 0 10px
				.body
					font-size: 13px
					color: #999
</style>
