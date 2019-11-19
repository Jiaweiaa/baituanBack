<template>
	<div class="goods">
		<!--
     wjw
     商品
    -->
		<div class="noData" v-if="dataSource.viewData[1].data.length <= 0">
			请点击此处然后在右侧选择商品配置
		</div>
		
		<div v-else>
			<!--
				大图模式/一行两个/一行三个
			-->
			<div
				v-if="dataSource.viewData[2] == 3 || dataSource.viewData[2] == 4 || dataSource.viewData[2] == 5"
				:style="{
					margin: '0 '+dataSource.viewData[3]+'px'
				}"
				:class="dataSource.viewData[2] == 3 ? 'listOne' : dataSource.viewData[2] == 4 ? 'listTwo' : 'listThree'">
				<div
					v-for="(item, index) in dataSource.viewData[1].data"
					class="listView"
					:style="{
						marginTop: dataSource.viewData[4] + 'px',
						border: dataSource.viewData[5] == '9' ? '' :  dataSource.viewData[5] == '10' ? '1px solid #ccc' : dataSource.viewData[5] == '11' ? '1px solid #fff' : ''  ,
						boxShadow: dataSource.viewData[5] == '10' ? '3px 3px 5px #ccc' : '',
						borderRadius: dataSource.viewData[6] == '14' ? '5px' : ''
					}">
					<el-image
						class="image"
						:style="{
							width: dataSource.viewData[7] == '15' && dataSource.viewData[2] == 3 ? '375px':
										 dataSource.viewData[7] == '15' && dataSource.viewData[2] == 4 ? '188px':
									   dataSource.viewData[7] == '15' && dataSource.viewData[2] == 5 ? '125px':
										 dataSource.viewData[7] == '16' && dataSource.viewData[2] == 3 ? '375px':
										 dataSource.viewData[7] == '16' && dataSource.viewData[2] == 4 ? '188px':
									   dataSource.viewData[7] == '16' && dataSource.viewData[2] == 5 ? '125px':
								     dataSource.viewData[7] == '17' && dataSource.viewData[2] == 3 ? '282px':
										 dataSource.viewData[7] == '17' && dataSource.viewData[2] == 4 ? '141px':
									   dataSource.viewData[7] == '17' && dataSource.viewData[2] == 5 ? '94px':
								     dataSource.viewData[7] == '18' && dataSource.viewData[2] == 3 ? '375px':
										 dataSource.viewData[7] == '18' && dataSource.viewData[2] == 4 ? '188px':
									   dataSource.viewData[7] == '18' && dataSource.viewData[2] == 5 ? '125px': '',
									   
							height:dataSource.viewData[7] == '15' && dataSource.viewData[2] == 3 ? '375px':
										 dataSource.viewData[7] == '15' && dataSource.viewData[2] == 4 ? '188px':
									   dataSource.viewData[7] == '15' && dataSource.viewData[2] == 5 ? '125px':
										 dataSource.viewData[7] == '16' && dataSource.viewData[2] == 3 ? '375px':
										 dataSource.viewData[7] == '16' && dataSource.viewData[2] == 4 ? '188px':
									   dataSource.viewData[7] == '16' && dataSource.viewData[2] == 5 ? '125px':
								     dataSource.viewData[7] == '17' && dataSource.viewData[2] == 3 ? '375px':
										 dataSource.viewData[7] == '17' && dataSource.viewData[2] == 4 ? '188px':
									   dataSource.viewData[7] == '17' && dataSource.viewData[2] == 5 ? '125px':
										 dataSource.viewData[7] == '18' && dataSource.viewData[2] == 3 ? '210px':
										 dataSource.viewData[7] == '18' && dataSource.viewData[2] == 4 ? '106px':
									   dataSource.viewData[7] == '18' && dataSource.viewData[2] == 5 ? '70px': '',
						}"
						:fit="dataSource.viewData[8] == '19' ? 'fill' : 'scale-down'"
						:src='"http://qn.gaoshanmall.cn/"+item.isCoverImageUrl'>
					</el-image>
					<div
						class="title"
						v-show="dataSource.viewData[11].includes('25')"
						:style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
					}"
					>
						{{item.propertySetName}}
						<span >{{item.categoryNames}}</span>
					</div>
					<div
					 class="desc"
					 v-show="dataSource.viewData[11].includes('26')"
			     :style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
					}">
						{{item.subTitle}}
					</div>
					<div
						class="price"
						v-show="dataSource.viewData[11].includes('27')"
						:style="{
							fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
							textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						<div class="vipPrice" v-show="dataSource.viewData[59] !== '88'">
							<img class="vip_img" src="/static/img/vip.png" alt />
							<span>
                ￥{{item.skuInventoryQtyDtos[0].mixCashPrice}} +
	              <img class="money_img" src="/static/img/money.png" alt />
								{{item.skuInventoryQtyDtos[0].mixScorePrice}}补贴金
		          </span>
						</div>
						<div>
							￥{{item.salePrice}}
							<span
								style="text-decoration: line-through; font-size: 12px; color: #ccc;"
							>￥{{item.salePrice}}</span>
						</div>
						<div style="font-size: 12px; color: #999;">
							<span v-show="dataSource.viewData[59] == '90'">
								{{item.skuInventoryQtyDtos[0].peasPrice}}购物豆
							</span>
							<i class="el-icon-shopping-cart-1 cart"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!--
				详细列表
			-->
			<div
				v-else-if="dataSource.viewData[2] == 6"
				class="listData"
				:style="{
					margin: '0 '+dataSource.viewData[3]+'px'
				}">
				<div
					v-for="(item, index) in dataSource.viewData[1].data"
					class="listView"
					:style="{
						marginTop: dataSource.viewData[4] + 'px',
						border: dataSource.viewData[5] == '9' ? '' :  dataSource.viewData[5] == '10' ? '1px solid #ccc' : dataSource.viewData[5] == '11' ? '1px solid #fff' : ''  ,
						boxShadow: dataSource.viewData[5] == '10' ? '3px 3px 5px #ccc' : '',
						borderRadius: dataSource.viewData[6] == '14' ? '5px' : ''
					}">
					<el-image
						class="image"
						:fit="dataSource.viewData[8] == '19' ? 'fill' : 'scale-down'"
						:style="{
							width: dataSource.viewData[7] == '15' ? '180px':
										 dataSource.viewData[7] == '16' ? '120px':
								     dataSource.viewData[7] == '17' ? '90px':
								     dataSource.viewData[7] == '18' ? '214px': '' ,
							height:dataSource.viewData[7] == '15' ? '120px':
										 dataSource.viewData[7] == '16' ? '120px':
								     dataSource.viewData[7] == '17' ? '120px':
								     dataSource.viewData[7] == '18' ? '120px': ''
						 }"
						:src='"http://qn.gaoshanmall.cn/"+item.isCoverImageUrl'></el-image>
					<div
						class="title"
						v-show="dataSource.viewData[11].includes('25')"
						:style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
					}"
					>
						{{item.propertySetName}}
						<span >{{item.categoryNames}}</span>
					</div>
					<div
					class="desc"
					v-show="dataSource.viewData[11].includes('26')"
					:style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
					}">
						{{item.subTitle}}
					</div>
					<div class="price"
			     v-show="dataSource.viewData[11].includes('27')"
			     :style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						marginTop: dataSource.viewData[59] == '88' ? '20px': ''
					}">
						<div class="vipPrice" v-show="dataSource.viewData[59] !== '88'">
							<img class="vip_img" src="/static/img/vip.png" alt />
							<span>
                ￥{{item.skuInventoryQtyDtos[0].mixCashPrice}} +
	              <img class="money_img" src="/static/img/money.png" alt />
								{{item.skuInventoryQtyDtos[0].mixScorePrice}}补贴金
		          </span>
						</div>
						<div>
							￥{{item.salePrice}}
							<span
								style="text-decoration: line-through; font-size: 12px; color: #ccc;"
							>￥{{item.salePrice}}</span>
						</div>
						<div style="font-size: 12px; color: #999;">
							<span v-show="dataSource.viewData[59] == '90'">
								{{item.skuInventoryQtyDtos[0].peasPrice}}购物豆
							</span>
							<i class="el-icon-shopping-cart-1 cart"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!--
				一大两小
			-->
			<div
				v-else-if="dataSource.viewData[2] == 7"
				class="smallData"
	      :style="{
				 margin: '0 '+dataSource.viewData[3]+'px'
				}">
				<div
					v-for="(item, index) in dataSource.viewData[1].data"
					class="listView"
					:style="{
						marginTop: dataSource.viewData[4] + 'px',
						border: dataSource.viewData[5] == '9' ? '' :  dataSource.viewData[5] == '10' ? '1px solid #ccc' : dataSource.viewData[5] == '11' ? '1px solid #fff' : ''  ,
						boxShadow: dataSource.viewData[5] == '10' ? '3px 3px 5px #ccc' : '',
						borderRadius: dataSource.viewData[6] == '14' ? '5px' : ''
					}">
					<el-image
						class="image"
						:style="{
							width: dataSource.viewData[7] == '15' && ((index%3 +1) !== 1) ? '188px':
										 dataSource.viewData[7] == '15' && ((index%3 +1) == 1) ? '375px':
										 dataSource.viewData[7] == '16' && ((index%3 +1) !== 1) ? '188px':
										 dataSource.viewData[7] == '16' && ((index%3 +1) == 1) ? '375px':
										 
								     dataSource.viewData[7] == '17' && ((index%3 +1) !== 1) ? '141px':
										 dataSource.viewData[7] == '17' && ((index%3 +1) == 1) ? '282px':
								     dataSource.viewData[7] == '18' && ((index%3 +1) !== 1) ? '188px':
								     dataSource.viewData[7] == '18' && (index%3 +1) == 1 ? '375px': '' ,
							height:dataSource.viewData[7] == '15' && ((index%3 +1) !== 1) ? '106px':
										 dataSource.viewData[7] == '15' && ((index%3 +1) == 1) ? '210px':
										 dataSource.viewData[7] == '16' && ((index%3 +1) !== 1) ? '188px':
										 dataSource.viewData[7] == '16' && ((index%3 +1) == 1) ? '375px':
										 
								     dataSource.viewData[7] == '17' && ((index%3 +1) !== 1) ? '188px':
										 dataSource.viewData[7] == '17' && ((index%3 +1) == 1) ? '375px':
								     dataSource.viewData[7] == '18' && ((index%3 +1) !== 1) ? '105px':
								     dataSource.viewData[7] == '18' && (index%3 +1) == 1 ? '210px': '' ,
						 }"
						:fit="dataSource.viewData[8] == '19' ? 'fill' : 'scale-down'"
						:src='"http://qn.gaoshanmall.cn/"+item.isCoverImageUrl'></el-image>
					<div class="title"
					     v-show="dataSource.viewData[11].includes('25')"
					     :style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						{{item.propertySetName}}
						<span >{{item.categoryNames}}</span>
					</div>
					<div
						class="desc"
						v-show="dataSource.viewData[11].includes('26')"
			      :style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						{{item.subTitle}}
					</div>
					<div
						v-show="dataSource.viewData[11].includes('27')"
						class="price"
						:style="{
						fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
						textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						<div class="vipPrice" v-show="dataSource.viewData[59] !== '88'">
							<img class="vip_img" src="/static/img/vip.png" alt />
							<span>
                ￥{{item.skuInventoryQtyDtos[0].mixCashPrice}} +
	              <img class="money_img" src="/static/img/money.png" alt />
								{{item.skuInventoryQtyDtos[0].mixScorePrice}}补贴金
		          </span>
						</div>
						<div>
							￥{{item.salePrice}}
							<span
									style="text-decoration: line-through; font-size: 12px; color: #ccc;"
							>￥{{item.salePrice}}</span>
						</div>
						<div style="font-size: 12px; color: #999;">
							<span v-show="dataSource.viewData[59] == '90'">
								{{item.skuInventoryQtyDtos[0].peasPrice}}购物豆
							</span>
							<i class="el-icon-shopping-cart-1 cart"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!--
				横向滑动
			-->
			<div v-else class="rowList"
			     :style="{
						margin: '0 '+dataSource.viewData[3]+'px'
				}">
				<div
					v-for="(item, index) in dataSource.viewData[1].data"
					class="listView"
					:style="{
					marginTop: dataSource.viewData[4] + 'px',
					border: dataSource.viewData[5] == '9' ? '' :  dataSource.viewData[5] == '10' ? '1px solid #ccc' : dataSource.viewData[5] == '11' ? '1px solid #fff' : ''  ,
					boxShadow: dataSource.viewData[5] == '10' ? '3px 3px 5px #ccc' : '',
					borderRadius: dataSource.viewData[6] == '14' ? '5px' : '',
					}">
					<el-image
						class="image"
						:fit="dataSource.viewData[8] == '19' ? 'fill' : 'scale-down'"
						:style="{
							width: dataSource.viewData[7] == '15' ? '126px':
										 dataSource.viewData[7] == '16' ? '126px':
								     dataSource.viewData[7] == '17' ? '126px':
								     dataSource.viewData[7] == '18' ? '126px': '' ,
							height:dataSource.viewData[7] == '15' ? '84px':
										 dataSource.viewData[7] == '16' ? '126px':
								     dataSource.viewData[7] == '17' ? '168px':
								     dataSource.viewData[7] == '18' ? '71px': ''
						 }"
						:src='"http://qn.gaoshanmall.cn/"+item.isCoverImageUrl'></el-image>
					<div
							class="title"
							v-show="dataSource.viewData[11].includes('25')"
							:style="{
							fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
							textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						{{item.propertySetName}}
						<span >{{item.categoryNames}}</span>
					</div>
					<div
							class="desc"
							v-show="dataSource.viewData[11].includes('26')"
							:style="{
							fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
							textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						{{item.subTitle}}
					</div>
					<div class="price"
					     v-show="dataSource.viewData[11].includes('27')"
					     :style="{
							fontWeight: dataSource.viewData[9] == '21'? '': 'bold',
							textAlign: dataSource.viewData[10] == '23'? 'left': 'center',
						}">
						<div class="vipPrice" v-show="dataSource.viewData[59] !== '88'">
							<img class="vip_img" src="/static/img/vip.png" alt />
							<span>
                ￥{{item.skuInventoryQtyDtos[0].mixCashPrice}} +
	              <img class="money_img" src="/static/img/money.png" alt />
								{{item.skuInventoryQtyDtos[0].mixScorePrice}}补贴金
		          </span>
						</div>
						<div>
							￥{{item.salePrice}}
							<span
									style="text-decoration: line-through; font-size: 12px; color: #ccc;"
							>￥{{item.salePrice}}</span>
						</div>
						<div style="font-size: 12px; color: #999;">
							<span v-show="dataSource.viewData[59] == '90'">
								{{item.skuInventoryQtyDtos[0].peasPrice}}购物豆
							</span>
							<i class="el-icon-shopping-cart-1 cart"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'goods',
    props:  ['dataSource'],
    created() {
      console.log(this.dataSource)
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="sass">
	.goods
		.vipPrice
			margin-top: 5px
			align-items: center
			overflow: hidden
			margin-bottom: 5px
			.vip_img
				width: 20px
				height: 16px
				float: left
			span
				padding: 2px
				max-width: calc(95% - 20px)
				line-height: 16px
				float: left
				display: flex
				white-space: nowrap
				height: 16px
				font-size: 12px
				color: #fff
				background: rgba(217, 34, 49, 1)
				border-radius: 0 8px 8px 0
				vertical-align: center
				align-items: center
				.money_img
					margin: 0 3px
					width: 13px
					height: 13px
		.listView
			text-align: center
			overflow: hidden
		.image
			width: 100%
			text-align: center
			margin: 0 auto
		.noData
			height: 25px
			line-height: 25px
			color: #f44
			font-size: 14px
			text-align: center
		.listOne
			flex-wrap: nowrap
			overflow: hidden
			.listView
				padding: 10px
				overflow: hidden
				.title
					font-size: 14px
					margin-left: 10px
					height: 20px
					line-height: 20px
				.desc
					height: 20px
					line-height: 20px
					margin-left: 10px
					text-overflow: ellipsis
					white-space: nowrap
					overflow: hidden
					font-size: 13px
					color: #999
				.price
					line-height: 20px
					margin-left: 10px
					color: #f44
					font-size: 15px
					width: 100%
					float: left
				.cart
					color: #f44
					float: right
					margin-right: 10px
					margin-top: 5px
					font-size: 14px
					text-align: right
		.listTwo
			display: block
			overflow: hidden
			.listView
				float: left
				width: 49%
				margin-right: 1%
				position: relative
				.title
					font-size: 14px
					margin-left: 10px
					height: 20px
					line-height: 20px
				.desc
					height: 20px
					line-height: 20px
					text-overflow: ellipsis
					white-space: nowrap
					overflow: hidden
					margin-left: 10px
					font-size: 13px
					color: #999
				.price
					line-height: 20px
					margin-left: 10px
					color: #f44
					font-size: 15px
					width: 100%
					float: left
				.cart
					font-size: 14px
					color: #f44
					float: right
					position: absolute
					right: 10px
					bottom: 5px
					text-align: right
		.listThree
			overflow: hidden
			.listView
				margin-left: 1%
				width: 32%
				float: left
				.vip_img
					width: 16px
					height: 16px
					float: left
				.money_img
					margin: 0
				.title
					font-size: 14px
					margin-left: 10px
					height: 20px
					line-height: 20px
				.desc
					height: 20px
					line-height: 20px
					margin-left: 10px
					text-overflow: ellipsis
					white-space: nowrap
					overflow: hidden
					font-size: 13px
					color: #999
				.price
					line-height: 20px
					margin-left: 10px
					color: #f44
					font-size: 15px
					float: left
				.cart
					margin-top: 3px
					font-size: 13px
					color: #f44
					float: right
					margin-right: 10px
					text-align: right
		.listData
			.listView
				overflow: hidden
				.image
					width: 120px
					height: 120px
					margin-right: 10px
					float: left
				.title
					font-size: 14px
					height: 20px
					line-height: 20px
					margin-top: 8px
				.desc
					height: 20px
					line-height: 20px
					margin-left: 10px
					text-overflow: ellipsis
					white-space: nowrap
					overflow: hidden
					margin-top: 5px
					font-size: 13px
					color: #999
				.price
					line-height: 20px
					margin-left: 10px
					color: #f44
					font-size: 15px
				.cart
					color: #f44
					float: right
					margin-top: 3px
					font-size: 14px
					margin-right: 10px
					text-align: right
		.rowList
			display: flex
			align-items: flex-start
			flex-wrap: nowrap
			.listView
				min-width: 120px
				flex: content
				margin-right: 1.5%
				float: left
				.title
					font-size: 13px
					margin-left: 10px
					height: 20px
					line-height: 20px
				.desc
					height: 20px
					line-height: 20px
					margin-left: 10px
					font-size: 13px
					text-overflow: ellipsis
					white-space: nowrap
					overflow: hidden
					color: #999
				.price
					line-height: 20px
					margin-left: 10px
					color: #f44
					font-size: 15px
					float: left
					width: 90%
				.cart
					color: #f44
					float: right
					font-size: 13px
					margin-top: 2px
					margin-right: 5px
					text-align: right
		.smallData
			overflow: hidden
			.listView:nth-child(3n + 1)
				width: 100%
				float: left
			.listView
				width: 48%
				float: left
				.title
					font-size: 14px
					margin-left: 10px
					height: 20px
					line-height: 20px
				.desc
					height: 20px
					line-height: 20px
					margin-left: 10px
					text-overflow: ellipsis
					white-space: nowrap
					overflow: hidden
					font-size: 13px
					color: #999
				.price
					width: 100%
					line-height: 20px
					margin-left: 8px
					color: #f44
					font-size: 15px
					float: left
				.cart
					color: #f44
					float: right
					font-size: 15px
					margin-right: 10px
					text-align: right
</style>
