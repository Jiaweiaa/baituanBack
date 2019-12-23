<!-- 新建中的商品 -->
<template>
  <div class="app-container" @keyup.enter="searchData()">
    <el-card class="filter-container" shadow="never" style="margin-top:20px;">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchData()"
        >查询</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="searchForm" size="small" label-width="140px">
          <el-form-item label="输入商品编码：">
            <el-input  clearable v-model="searchForm.code" style="width: 200px;" class="filter-item"></el-input>
          </el-form-item>
          <!-- 空label -->
          <el-form-item></el-form-item>
          <el-form-item label="输入商品名称：">
            <el-input  clearable v-model="searchForm.title" style="width: 200px;" class="filter-item"></el-input>
          </el-form-item>
          <!-- <el-form-item label="选择所属分类：">
            <el-select
              clearable
              placeholder="请选择所属分类"
              style="width: 190px"
              class="filter-item"
              v-model="value1"
            >
              <el-option v-for="item in 3" :key="item" :label="item" :value="value1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择对应属性集">
            <el-select
              clearable
              placeholder="请选择对应属性集"
              style="width: 190px"
              class="filter-item"
              v-model="value2"
            >
              <el-option v-for="item in 3" :key="item" :label="item" :value="value2"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="输入价格：">
            <el-input clearable style="width: 200px;" class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="输入创建时间：">
            <el-input clearable style="width: 200px;" class="filter-item"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin-top:20px;">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="createOrEditProduct()"
        size="small"
      >添加</el-button>
    </el-card>

    <!-- 列表及分页 -->
    <div style="margin-top:20px;">
      <CommonTable
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="getData"
        :pagination="pagination"
        @selection-change="getSelectOption"
      />
    </div>
    <!-- 批量删除及上架 -->
    <div>
      <el-row>
        <el-button size="medium" @click="batchDetele();">批量删除</el-button>
        <el-button size="medium" @click="batchPutaway()">批量入库</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import CommonTable from "@/components/Table";
import busVue from "@/utils/busVue";
import {
  creatingManagement,
  groundingByTimeItem,
  depotItem
} from "@/api/mall/newProduct";
import { delItem } from "@/api/mall/warehouseProduct";
export default {
  name: "newProduct1",
  components: {
    CommonTable
  },
  data() {
    return {
      columns: [
        //表格列属性
        {
          prop: "code",
          label: "商品编码",
          width: 160
        },
        {
          prop: "isCoverImageUrl",
          label: "图片",
          render: (row, index) => {
            return (
              <img
                style="width: 50px; height: 50px; cursor: pointer;"
                src={"http://qn.gaoshanmall.cn/" + row.isCoverImageUrl}
              />
            );
          }
        },
        {
          prop: "title",
          label: "商品名称"
        },
        {
          prop: "categoryNames",
          label: "所属分类"
        },
        {
          prop: "propertySetName",
          label: "对应属性集"
        },
        {
          prop: "salePrice",
          label: "价格"
        },
        {
          prop: "createTime",
          label: "创建时间"
        },

        {
          width: 300,
          button: true,
          label: "操作",
          group: [
            {
              name: "入库",
              circle: true,
              type: "success",
              icon: "el-icon-view",
              onClick: row => {
                // console.log(row);
                this.selection = [];
                this.selection.push(row);
                this.batchPutaway();
              }
            },
            {
              name: "编辑",
              circle: true,
              type: "primary",
              icon: "el-icon-view",
              onClick: row => {
                this.createOrEditProduct(row);
              }
            },
            {
              name: "删除",
              circle: true,
              type: "danger",
              icon: "el-icon-view",
              onClick: row => {
                // console.log(row);
                this.selection = [];
                this.selection.push(row);
                this.batchDetele();
              }
            }
          ]
        }
      ],
      tableData: [],
      options: {
        //列表配置项
        mutiSelect: true,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      selection: [],
      searchForm: {
        title:"",
        code:""
      },
      value1: "",
      value2: ""
    };
  },
  mounted() {},

  methods: {
    /**
     * @获取列表
     */

    getData() {
      this.options.loading = true;
      let params = Object.assign({},this.searchForm);
      params.pageNum = this.pagination.pageIndex;
      params.pageSize = this.pagination.pageSize;
      // let params = Object.assign({
      //   pageNum: this.pagination.pageIndex,
      //   pageSize: this.pagination.pageSize
      // });
      creatingManagement(params).then(res => {
        this.$message(res.message);
        this.tableData = res.result.itemCommands;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    //查询列表
    searchData(){
      this.pageNum = 1;//初始化页码
      this.getData();
    },
    //批量删除
    batchDetele() {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            ids: [],
            itemType: 1
          };
          const loading = this.$loading({
            lock: true,
            text: "等待服务器响应",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.selection.map(v => {
            params.ids.push(v.id);
          });
          delItem(params)
            .then(res => {
              loading.close();
              if (res.code == "200") {
                this.getData();
              }
            })
            .catch(err => {
              loading.close();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @新建商品
     */

    createOrEditProduct(item) {
      //如果传入item则是编辑 否则新增 参数中的productStatus是区分商品状态的标识
      if (item) {
        this.$router.push({
          path: "/mall/ProductAdd",
          query: {
            propertyId: item.id,
            productStatus: 2
          }
        });
      } else {
        this.$router.push({
          path: "/mall/ProductAdd"
        });
      }
    },
    //批量选择
    getSelectOption(option) {
      console.log(option);
      this.selection = option;
    },
    //批量入库
    batchPutaway() {
      const loading = this.$loading({
        lock: true,
        text: "等待服务器响应",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = {
        ids: []
      };
      this.selection.map(v => {
        params.ids.push(v.id);
      });
      depotItem(params)
        .then(res => {
          loading.close();

          if (res.code == "200") {
            this.getData();
          }
        })
        .catch(err => {
          loading.close();
        });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>