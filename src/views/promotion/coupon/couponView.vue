<template>
  <div class="content">
    <!--
     wjw

     顶部搜索
    -->
    <div style="margin-bottom:15px;">
      <searchView :searchModel="searchModel"></searchView>
    </div>
  
  
    <!--
			 列表组件
		 -->
    <el-table
      class="table"
      stripe
      :data="tableData"
      v-loading="options.loading"
      border>
      <el-table-column
        label="优惠券名称"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name ? scope.row.name  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="库存 | 已发放"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inventory ? scope.row.inventory  : ''}} | {{ scope.row.inventory - scope.row.availableInventory }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="优惠券类型"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.offerCouponType == 1000 ? '微信卡券' : scope.row.offerCouponType == 2000 ? '通用卡券' : scope.row.offerCouponType == 3000 ? '专用卡券' : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品范围"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isWholeOrder == 1 ? '全部商品' : scope.row.isWholeOrder == 0  ? '指定商品' : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="有效期"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startDate}} - {{scope.row.endDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="状态"
              align="center">
        <template slot-scope="scope">
          <el-tag
                  :type="scope.row.status == 1 ? 'warning' : scope.row.status == 2 ? 'success' : 'danger'">
            {{scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : '结束'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="复制链接"
          align="center">
        <template slot-scope="scope">
          <p style="cursor:pointer;">
            <el-button type="text">复制url</el-button>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" >
        <template slot-scope="scope">
          <el-dropdown>
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-show="scope.row.offerCouponType == 3000" @click.native="goAchieve(scope.row)">查看领取清单</el-dropdown-item>
            <el-dropdown-item v-show="scope.row.status !== 1" @click.native="goUsed(scope.row)">查看使用清单</el-dropdown-item>
            <el-dropdown-item @click.native="see(scope.row)" size="small" type="success" icon="el-icon-setting">查看</el-dropdown-item>
            <el-dropdown-item v-show="scope.row.status == 0 ? false :true"  @click.native="edit(scope.row)" size="small" type="primary" icon="el-icon-edit">编辑</el-dropdown-item>
            <el-dropdown-item v-show="scope.row.status == 0 || scope.row.status == 2 ? false :true" @click.native="del(scope.row)" size="small" type="danger" icon="el-icon-delete">删除</el-dropdown-item>
            <el-dropdown-item v-show="scope.row.status == 2 ? true : false" @click.native="stop(scope.row)" size="small" type="danger" icon="el-icon-delete">强制停止</el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  
  
    <!-- 分页 -->
    <el-pagination
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
      style="margin-top: 20px;text-align: right"
    ></el-pagination>
  </div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table';
  import { couponList, deleteCoupon,stopCoupon } from '@/api/promotion/coupon';

  export default {
    name: 'coupin',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入优惠券名称',
                inputModel: 'name',
                labelName: '优惠券名称',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'offerCouponType',
                labelName: '优惠券类型',
                model: '',
                type: 'el-select',
                options: [{
                  name: '全部',
                  status: ''
                },{
                  name: '通用优惠券',
                  status: '2000'
                }, {
                  name: '专用优惠券',
                  status: '3000'
                }]
              },
              {
                inputModel: 'isWholeOrder',
                labelName: '商品范围',
                model: '',
                type: 'el-select',
                options: [{
                  name: '全部商品',
                  status: '1'
                }, {
                  name: '制定商品',
                  status: '0'
                }]
              },
              {
                inputModel: 'searchDate',
                labelName: '有效期',
                model: '',
                type: 'el-date-picker'
              },
              {
                inputModel: 'status',
                labelName: '状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '未开始',
                  status: '1'
                }, {
                  name: '进行中',
                  status: '2'
                },{
                  name: '已结束',
                  status: '0'
                }]
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新建优惠券'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ],
        
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
          initTable: true, // 是否一挂载就加载数据
        }
      }
    },
    components: {
      searchView,
      CommonTable
    },
    created() {
      this.getList();
    },
    methods: {
      // 去领取订单
      goAchieve(val) {
        this.$router.push({
          path: '/promotion/couponTemplate/achieveList',
          query: {
            id: val.offerId
          }
        });
      },
      
      // 去使用订单
      goUsed(val) {
        this.$router.push({
          path: '/promotion/couponTemplate/usedList',
          query: {
            id: val.offerId
          }
        });
      },
      
      // 列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        couponList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      // 搜索
      searchBtn(val) {
        this.searchData = val;
        if(this.searchData.searchDate) {
          this.searchData.startTime = this.searchData.searchDate[0];
          this.searchData.endTime = this.searchData.searchDate[1];
        }
        this.getList();
      },
      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.getList();
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageIndex = current;
        this.getList();
      },
      
      // 新增
      addBtn() {
        this.$router.push({
          path: '/promotion/couponTemplate/newCoupon',
          query: {
            title: '新增优惠券'
          }
        });
      },
  
      // 列表操作
      see(val) {
        this.$router.push({
          path: '/promotion/couponTemplate/newCoupon',
          query: {
            title: '查看优惠券',
            id: val.id
          }
        });
      },
      edit(val) {
        this.$router.push({
          path: '/promotion/couponTemplate/newCoupon',
          query: {
            title: '编辑优惠券',
            id: val.id
          }
        });
      },
      del(val) {
        this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            offerId: val.offerId
          }
          deleteCoupon(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              couponList(this.searchData).then((res) => {
                if(res.result.records.length <= 0 && this.searchParams.pageNum  > 1) {
                  this.searchParams.pageNum --;
                  this.getList();
                }else {
                  this.getList();
                }
              })
            }
          })
      
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },
      // 强制停止
      stop(val) {
        this.$confirm("此操作将停止优惠券活动是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            offerId: val.offerId
          };
          stopCoupon(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "强制停止成功!"
              });
              this.getList();
            }
          })
      
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消强制停止"
          });
        });
      },
    }
  }
</script>

<style lang="sass" scoped>
  .content
    overflow: hidden
    margin: 20px 20px 0
</style>
