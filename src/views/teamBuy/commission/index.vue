<template>
  <div class="labberConcessionsBox">
    <!--
       wjw
  
       顶部搜索
    -->
    <div style="margin-bottom:15px;">
      <el-card class="filter-container" shadow="never" style="margin-top:20px;">
        <div style="margin-bottom: 20px; overflow: hidden; display: flex; align-items: center;">
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <div style="width: calc(100% - 100px); text-align: right; float: right;" :gutter="20"></div>
        </div>
        <el-row :gutter="20">
          <el-button size="small" @click="drawer = true" type="primary">筛选团长</el-button>
          <el-button size="small" @click="clearFiltrate" type="primary">清空筛选条件</el-button>
        </el-row>
      </el-card>
    </div>

    <!--
      列表组件
    -->
    <CommonTable
      :columns="columns"
      :dataSource="tableData"
      :options="options"
      :fetch="getList"
      :pagination="pagination"
    />
    <!-- 抽屉组件 -->
    <el-drawer
      title="筛选团长"
      :visible.sync="drawer"
      size="2000"
      direction="ttb"
      :before-close="handleClose"
      @open="getCaptainList"
    >
      <el-row :gutter="20" type="flex" class="row-bg" justify="center">
        <el-input placeholder="请输入团长姓名" v-model="captainName" clearable style="width:600px;"></el-input>
        <el-button size="small" @click="getCaptainList('seachFlag')" type="primary">搜索团长</el-button>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center" style="width:600px;margin:0 auto;margin-top:40px;">
        <el-table :data="captainList" height="250" border stripe header-align="center" align="center">
          <el-table-column prop="name" label="团长姓名" width="300" align="center"></el-table-column>
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="searchCaptain(scope.row.name)">查询此团长</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 分页 -->
      <el-pagination
        :total="drawerPagination.total"
        :page-size="drawerPagination.pageSize"
        background
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
        style="margin-top: 20px;text-align: center"
      ></el-pagination>
    </el-drawer>
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import {
  getCommissionRecordPage,
  getCaptainNamePage
} from "@/api/teamBuy/commission";

export default {
  name: "name",
  data() {
    return {
      // table和分页的数据
      columns: [
        {
          prop: "captainName",
          label: "团长姓名"
        },

        {
          prop: "commission",
          label: "佣金金额"
        },
        {
          prop: "commissionType",
          label: "佣金状态",
          render: (row, index) => {
            return (
              <span>
                {row.commissionType == 0
                  ? "未到账"
                  : row.commissionType == 1
                  ? "到账"
                  : row.commissionType == 2
                  ? "提现到账"
                  : "提现中"}
              </span>
            );
          }
        }
      ],
      // 全选
      selection: [],
      tableData: [],
      searchData: {},
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      btnLoading: false,
      //抽屉组件配置
      drawer: false,
      drawerPagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      //团长列表
      captainList: [],
      captainName: ""
    };
  },
  components: {
    searchView,
    CommonTable
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //清空筛选条件
    clearFiltrate(){
        this.drawerPagination.pageIndex = 1;
        this.searchData.captainName = "";
        this.getList();
    },
    //获取团长列表
    getCaptainList(searchFlag) {
      if (searchFlag) {
        this.drawerPagination.pageIndex = 1;
      }
      let params = Object.assign(
        {
          pageNum: this.drawerPagination.pageIndex,
          pageSize: this.drawerPagination.pageSize,
          captainName:this.captainName
        },
        
      );
      getCaptainNamePage(params)
        .then(res => {
          if (res.code == "200") {
            this.captainList = res.result.records;
            console.log(this.captainList);
            this.drawerPagination.total = Number(res.result.total);
          }
        })
        .catch(err => {});
    },

    // 列表, 搜索
    getList() {
      this.options.loading = true;
      let params = Object.assign(
        {
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          captainName:this.searchData.captainName
        },
        
      );
      getCommissionRecordPage(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    searchCaptain(captainName) {
      this.searchData.captainName = captainName;
    //   this.captainName = captainName;
      this.drawer = false;
      this.getList();
    },
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.drawerPagination.pageSize = size;
      this.getCaptainList();
    },
    handleIndexChange(current) {
      // 切换页码
      this.drawerPagination.pageIndex = current;
      this.getCaptainList();
    }
  }
};
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
