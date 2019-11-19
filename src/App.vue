<template>
  <div id="app">
    <router-view/>
    <!-- <ImageLibrary></ImageLibrary> -->
  </div>
</template>

<script>
  import ImageLibrary from '@/components/ImageLibrary'
  export default {
    name: "App",
    components: {ImageLibrary}
  };
</script>
<style>
  body .el-table th.gutter {
    display: table-cell !important;
  }

  body .el-table colgroup.gutter {
    display: table-cell !important;
  }
</style>


