<template>
	<div class="picture">
		<!--
     wjw
     图片广告
    -->
		<div class="noData" v-if="dataSource.viewData[13].length <= 0">
			请点击此处然后在右侧选择图片广告配置
		</div>
		
		<!--
			一行一个
		-->
		<div
			:style="{
				margin: '0 '+dataSource.viewData[14]+'px'
			}"
			v-if="dataSource.viewData[12] == 28 && dataSource.viewData[13].length > 0"
		>
			<div
				:style="{
					marginTop: dataSource.viewData[15] + 'px',
					border: dataSource.viewData[16] == '33' ? '' :  dataSource.viewData[5] == '34' ? '1px solid #ccc' : '',
					boxShadow: dataSource.viewData[16] == '34' ? '3px 3px 5px #ccc' : '' ,
				}"
				v-for="(item, index) in dataSource.viewData[13]">
				<el-image
					:style="{
						borderRadius: dataSource.viewData[17] == '36' ? '5px' : ''
					}"
					style="width: 100%; height: 100%"
					:src='"http://qn.gaoshanmall.cn/"+item.imgUrl'>
				</el-image>
			</div>
		</div>
		
		<!--
			轮播图
		-->
		<div
			v-else-if="dataSource.viewData[12] == 29 && dataSource.viewData[13].length > 0"
			:style="{
				margin: '0 '+dataSource.viewData[14]+'px'
			}"
		>
			<el-carousel :interval="2000" arrow="always">
				<el-carousel-item v-for="(item, index) in dataSource.viewData[13]" :key="item.id">
					<el-image
						:style="{
							boxShadow: dataSource.viewData[16] == '34' ? '10px 10px 20px #ccc' : '' ,
							borderRadius: dataSource.viewData[17] == '36' ? '5px' : ''
						}"
						style="width: 100%; height: 100%"
						:src='"http://qn.gaoshanmall.cn/"+item.imgUrl'>
					</el-image>
				</el-carousel-item>
			</el-carousel>
		</div>
		
		<!--
			横向滑动
		-->
		<div
			:style="{
				margin: '0 '+dataSource.viewData[14]+'px'
			}"
			v-else-if="dataSource.viewData[13].length > 0"
			:class="dataSource.viewData[12] == 30 ? 'rowList' : dataSource.viewData[12] == 31 ? 'middleList' : 'smallList'">
			<div
				class="listView"
				:style="{
					marginLeft: dataSource.viewData[15] + 'px',
					border: dataSource.viewData[16] == '33' ? '' :  dataSource.viewData[5] == '34' ? '1px solid #ccc' : '',
					boxShadow: dataSource.viewData[16] == '34' ? '3px 3px 5px #ccc' : '' ,
				}"
					v-for="(item, index) in dataSource.viewData[13]">
				<el-image
						:style="{
						borderRadius: dataSource.viewData[17] == '36' ? '5px' : ''
					}"
						style="width: 100%; height: 100%"
						:src='"http://qn.gaoshanmall.cn/"+item.imgUrl'>
				</el-image>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'pictures',
    props:  ['dataSource'],

    data() {
      return {


      }
    },
	  created() {
      console.log(this.dataSource);
    },
    components: {


    },
    methods: {

    }
  }
</script>

<style lang="sass">
	.picture
		.noData
			height: 25px
			line-height: 25px
			color: #f44
			font-size: 14px
			text-align: center
		.rowList
			display: flex
			flex-wrap: nowrap
			.listView
				flex: 1
				width: 180px
				min-width: 180px
				max-width: 180px
				height: 260px
				min-height: 260px
				max-height: 260px
				float: left
			.listView:first-child
				margin-left: 0!important
		.middleList
			display: flex
			flex-wrap: nowrap
			.listView
				flex: 1
				width: 120px
				min-width: 120px
				max-width: 120px
				height: 180px
				min-height: 180px
				max-height: 180px
				float: left
			.listView:first-child
				margin-left: 0!important
		.smallList
			display: flex
			flex-wrap: nowrap
			.listView
				flex: 1
				width: 60px
				min-width: 60px
				max-width: 60px
				height: 90px
				min-height: 90px
				max-height: 90px
				float: left
			.listView:first-child
				margin-left: 0!important
</style>
