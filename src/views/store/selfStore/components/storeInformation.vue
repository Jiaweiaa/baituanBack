<template>
	<div class="storeInfo">
		<!--
     wjw
     店铺信息
    -->
		<div class="noData" v-if="dataSource.viewData['39'] == ''">
			请点击此处然后在右侧选择店铺信息配置
		</div>
		
		<div
			v-else
			class="content">
			<el-image
				class="backStyle"
				:src="'https://static.ibaituan.cn/' + dataSource.viewData['39'].imgUrl"
				fit="fill"></el-image>
			<div
				:class="
					dataSource.viewData[38] == '61' ? 'type1' :
					dataSource.viewData[38] == '62' ? 'type2' :
					dataSource.viewData[38] == '63' ? 'type3' :
					dataSource.viewData[38] == '64' ? 'type4' :
					dataSource.viewData[38] == '65' ? 'type5' : ''
				"
				class="mask">
				<div class="logoImg">
					<el-image
						class="img"
						src="./../../../../../static/img/logo.png"
						fit="fill"></el-image>
				</div>
			
				<div class="title">店铺名称</div>
				<div class="desc" v-if="dataSource.viewData[38] == '61'">
					<span>满减</span>在线支付满150减30.满100减20>
				</div>
				<div v-else>
					<div class="elseStyle" v-if="dataSource.viewData[38] !== '65'"></div>
					<div class="borderLine" v-else></div>
					<div class="goodsStyle">
						<div style="border-right: 1px solid #999;">全部商品999</div>
						<div style="padding-left: 10px;">上新30</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'storeInfo',
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
	.storeInfo
		.noData
			height: 25px
			line-height: 25px
			color: #f44
			font-size: 14px
			text-align: center
		.content
			width: 100%
			height: 300px
			position: relative
			.backStyle
				-webkit-filter: blur(5px) /* Chrome, Opera */
				-moz-filter: blur(5px)
				-ms-filter: blur(5px)
				filter: blur(5px)
				position: absolute
				left: 0
				top: 0
				width: 100%
				height: 100%
				z-index: 1
			.mask
				z-index: 9
				width: 100%
				height: 100%
				position: absolute
				left: 0
				top: 0
				background: rgba(0, 0, 0 ,0.35)
				.logoImg
					width: 30px
					height: 30px
			.type1
				color: #fff
				position: relative
				.logoImg
					background: #fff
					position: absolute
					left: 15px
					bottom: 15px
					width: 70px
					height: 70px
					.img
						width: 60px
						margin: 14px 5px
				.title
					font-size: 15px
					font-weight: bold
					position: absolute
					left: 100px
					bottom: 55px
				.desc
					position: absolute
					font-size: 13px
					left: 100px
					bottom: 25px
					span
						display: inline-block
						background: red
						padding: 1px 4px
						margin-right: 4px
			.type2
				background: #fff
				height: 50px
				position: absolute
				top: 250px
				left: 0
				.logoImg
					background: #fff
					position: absolute
					left: 15px
					bottom: 15px
					width: 70px
					height: 70px
					border-radius: 50%
					z-index: 99
					.img
						width: 60px
						margin: 14px 5px
				.title
					font-size: 15px
					color: #fff
					font-weight: bold
					position: absolute
					left: 100px
					bottom: 55px
					z-index: 11
				.elseStyle
					background-color: transparent
					background-image: linear-gradient(0deg,#000,transparent)
					width: 100%
					height: 120px
					position: absolute
					top: -120px
					z-index: 9
				.goodsStyle
					overflow: hidden
					font-size: 12px
					color: #999
					position: absolute
					left: 100px
					top: 10px
					div
						float: left
						padding-right: 10px
			.type3
				height: 50px
				background: transparent
				position: absolute
				top: 250px
				left: 0
				.logoImg
					background: #fff
					position: absolute
					left: 15px
					bottom: 15px
					width: 70px
					height: 70px
					z-index: 99
					.img
						width: 60px
						margin: 14px 5px
				.title
					font-size: 15px
					color: #fff
					font-weight: bold
					position: absolute
					left: 100px
					bottom: 55px
					z-index: 11
				.elseStyle
					background-color: transparent
					background-image: linear-gradient(0deg,#000,transparent)
					width: 100%
					height: 170px
					position: absolute
					bottom: 0px
					z-index: 9
				.goodsStyle
					overflow: hidden
					font-size: 12px
					color: #fff
					position: absolute
					left: 100px
					top: 10px
					z-index: 19
					div
						float: left
						padding-right: 10px
			.type4
				height: 100px
				background: #fff
				position: absolute
				top: 200px
				left: 0
				.logoImg
					background: #fff
					position: absolute
					left: 50%
					top: -35px
					width: 70px
					height: 70px
					margin-left: -35px
					z-index: 99
					border-radius: 50%
					.img
						width: 60px
						margin: 14px 5px
				.title
					font-size: 15px
					color: #000
					font-weight: bold
					position: absolute
					text-align: center
					left: 50%
					margin-left: -40px
					bottom: 45px
					z-index: 11
					width: 80px
				.elseStyle
					background-color: transparent
					background-image: linear-gradient(0deg,#000,transparent)
					width: 100%
					height: 120px
					position: absolute
					bottom: 100px
					z-index: 9
				.goodsStyle
					overflow: hidden
					font-size: 12px
					color: #999
					position: absolute
					bottom: 10px
					left: 130px
					z-index: 19
					div
						float: left
						padding-right: 10px
			.type5
				height: 100px
				background: transparent
				position: absolute
				top: 0
				left: 0
				.logoImg
					background: #fff
					position: absolute
					left: 50%
					top: 65px
					width: 70px
					height: 70px
					margin-left: -35px
					z-index: 99
					border-radius: 50%
					.img
						width: 60px
						margin: 14px 5px
				.title
					font-size: 15px
					color: #fff
					font-weight: bold
					position: absolute
					text-align: center
					left: 50%
					margin-left: -40px
					top: 165px
					z-index: 11
					width: 80px
				.borderLine
					background: #f3f3f3
					width: 100px
					height: 1px
					left: 50%
					top: 195px
					position: absolute
					margin-left: -50px
				.goodsStyle
					overflow: hidden
					font-size: 12px
					color: #fff
					position: absolute
					top: 210px
					left: 130px
					z-index: 19
					div
						float: left
						padding-right: 10px
</style>
