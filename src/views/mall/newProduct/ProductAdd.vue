<!-- 新建商品 -->
<template>
  <product-detail :is-edit="editFlag" :proId="productId"></product-detail>
</template>

<script>
import ProductDetail from "./components/ProductDetail";
export default {
  name: "ProductAdd1",
  components: { ProductDetail },
  data() {
    return {
      editFlag: false, //是否为编辑商品
      propertyId:""//商品ID
    };
  },
  methods: {
    
  },
  created() {
    if(this.$route.query.propertyId){
      this.productId = this.$route.query.propertyId
      this.editFlag = true
    }else{
      this.editFlag = false
      this.productId = "";
    }
    // console.log(this.editFlag);
   
  }
};
</script>
<style lang='scss' scoped>
</style>