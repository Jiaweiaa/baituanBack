<template>
  <div>
    <el-table
      v-loading="options.loading"
      :data="dataSource"
      :stripe="options.stripe"
      :border="options.border"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      header-row-class-name="table-header-row"
    >
      <!--selection选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width:50px" align="center"></el-table-column>

      <!--序号-->
      <el-table-column v-if="options.index" label="序号" type="index" width="50" align="center"></el-table-column>

      <!--数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align||'center'"
          :width="column.width"
          :fixed="column.fixed"
          v-if="column.label == '操作'&& column.showLabel == false? false : column.label == '状态' && column.showLabel == false? false : true">
          <template slot-scope="scope">
            <template v-if="!column.render">{{scope.row[column.prop]}}</template>

            <!-- render -->
            <template v-else>
              <RenderDom :row="scope.row" :index="index" :render="column.render"/>
            </template>

            <!-- render button -->
            <template v-if="column.button">
              <template v-for="(btn, i) in column.group" >
                <el-button
                  
                  v-if="btn.hasPerm? hasPerm(btn.hasPerm): true"
                  :key="i"
                  :type="btn.type"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  :plain="btn.plain"
                  @click.stop="btn.onClick(scope.row, scope.$index)"
                >{{btn.name}}</el-button>
              </template>
            </template>

            <!-- slot 你可以其他常用项 -->
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      background
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
      style="margin-top: 20px;text-align: center"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  components: {
    RenderDom: {
      functional: true, // 函数式组件 - 无 data 和 this 上下文 => better render
      props: {
        row: Object,
        index: Number,
        render: Function
      },
      /**
       * @param {Function} createElement - 原生创建dom元素的方法， 弃用，推荐使用 jsx
       * @param {Object} ctx - 渲染的节点的this对象
       * @argument 传递参数 row index
       */
      render(createElement, ctx) {
        const { row, index } = ctx.props;
        return ctx.props.render(row, index);
      }
    }
  },
  props: {
    roleBtnList: Array, // 权限菜单按钮
    dataSource: Array,
    options: Object, // 表格参数控制 maxHeight、stripe 等等...
    columns: Array,
    fetch: Function, // 获取数据的函数
    pagination: Object // 分页，不传则不显示
  },
  created() {
    // 传入的options覆盖默认设置
    this.$parent.options = Object.assign(
      {
        stripe: true, // 是否为斑马纹
        border: true
      },
      this.options
    );

    this.options.initTable && this.fetch();
  },
  methods: {
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.pagination.pageSize = size;
      this.fetch();
    },
    handleIndexChange(current) {
      // 切换页码
      this.pagination.pageIndex = current;
      this.fetch();
    },
    handleSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    handleRowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    }
  }
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
