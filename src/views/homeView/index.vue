<template>
  <div class="container">
	  <div class="content">
		  <el-collapse v-model="activeNames" accordion>
			  <el-collapse-item title="banner图" name="1">
				 <bannerView></bannerView>
			  </el-collapse-item>
			  <el-collapse-item title="优惠券列表" name="2">
				  <coupon></coupon>
			  </el-collapse-item>
			  <el-collapse-item title="首页热门导航" name="3">
				  <navigation></navigation>
			  </el-collapse-item>
			  <el-collapse-item title="热销商品" name="4">
				  <hotGoods></hotGoods>
			  </el-collapse-item>
			  <el-collapse-item title="推荐商品" name="5">
				  <recommendView></recommendView>
			  </el-collapse-item>
		  </el-collapse>
	  </div>
  </div>
</template>

<script>
  import bannerView from './bannerView';
  import hotGoods from './hotGoods';
  import recommendView from './recommendView';
  import navigation from './navigation';
  import coupon from './coupon';
  
	export default {
		name: "Login",
		data() {
			return {
				activeNames: ['1']
			};
		},
		components: {
      bannerView,
      hotGoods,
      recommendView,
      navigation,
      coupon
		},
		methods: {}
	 
	}
</script>
<style lang="scss">
	.content {
		padding: 20px;
	}
	
</style>
