<!-- 新建商品 -->
<template> 
  <product-detail :is-edit='true'></product-detail>
</template>

<script>
import ProductDetail from "./components/ProductDetail";
export default {
  name: "ProductAdd",
  components: { ProductDetail }
};
</script>
<style lang='scss' scoped>
.main {
  width: 1000px;
  margin: 50px auto;
  border: 1px solid #ebeef5;
  background-color: #fff;
  & .content {
    padding: 80px;
  }
}
</style>