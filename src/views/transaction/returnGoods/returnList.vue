<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-01 15:25:23
 * @LastEditTime: 2019-08-21 11:02:12
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="labberConcessionsBox">
    <!--
     wjw

     顶部搜索
    -->
    <div style="margin-bottom:15px;">
      <searchView :searchModel="searchModel"></searchView>
    </div>

    <!--
		  顶部拦
    -->
    <el-tabs
      style="padding-top: 30px; padding-left: 15px;"
      v-model="activeIndex"
      @tab-click="tabChange"
    >
      <el-tab-pane name="1">
        <span slot="label">
          全部订单
          <el-tag v-show="activeIndex == 1" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label">
          申请取消订单
          <el-tag v-show="activeIndex ==2" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label">
          退货退款申请审核
          <el-tag v-show="activeIndex == 3" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="4">
        <span slot="label">
          退货待入库
          <el-tag v-show="activeIndex == 4" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="5">
        <span slot="label">
          退货待退款
          <el-tag v-show="activeIndex == 5" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
    </el-tabs>

    <!--
      列表组件
    -->
    <el-table class="table" stripe :data="tableData" v-loading="options.loading" border>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode ? scope.row.orderCode : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consigneeName ? scope.row.consigneeName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reCreateTime ? scope.row.reCreateTime : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.logisticName ? scope.row.logisticName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="售后类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.reTypeName ? scope.row.reTypeName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退/换货状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.reName ? scope.row.reName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="300px" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            v-show="scope.row.reType == 1 && scope.row.reStatus == 6 "
            @click="returnMoney(scope.row)"
          >退款</el-button>
          <el-button
            type="success"
            size="small"
            v-show="pagination.orderDisplayStatus == 2"
            @click="approve(scope.row)"
          >审批</el-button>
          <el-button
            type="success"
            size="small"
            v-show="pagination.orderDisplayStatus == 3"
            @click="approveLast(scope.row)"
          >审批</el-button>
          <el-button
            type="success"
            size="small"
            v-show="scope.row.reType == 1 && (scope.row.reStatus == 1 ||  scope.row.reStatus == 3)"
            @click="sureGet(scope.row)"
          >确认收货</el-button>
          <el-button type="primary" size="small" @click="goToDetail(scope.row)">订单详情</el-button>
          <el-button
            type="warning"
            size="small"
            v-show="scope.row.reType == 1 && scope.row.reStatus == 0"
            @click="cancelRetype(scope.row)"
          >放弃退换货</el-button>
          <el-button
            type="warning"
            size="small"
            v-show="scope.row.logisticsStatus == 6 && scope.row.logisticName == '商家已发货' && pagination.orderDisplayStatus == 1 && ( (scope.row.reStatus == '' && scope.row.reStatus !== 0 )||  scope.row.reStatus == null || (scope.row.reType == 3 && scope.row.reStatus == 2)) "
            @click="returnDetail(scope.row)"
          >申请退换货</el-button>
          <el-button
            type="danger"
            v-show="scope.row.showCancel && scope.row.showCancelStatus == 0"
            size="small"
            @click="cancelGoods(scope.row)"
          >取消订单</el-button>
          <el-button
            type="danger"
            v-show="scope.row.showCancel && scope.row.showCancelStatus == 1 && (scope.row.reType == null || (scope.row.reType == 3 && scope.row.reStatus == 2))"
            size="small"
            @click="cancelGoods(scope.row)"
          >申请取消订单</el-button>
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
      style="margin-top: 20px; margin-bottom: 20px;text-align: right"
    ></el-pagination>

    <!-- 取消订单 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form
        :model="dialogForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dialogFormRules"
        ref="dialogForm"
      >
        <el-form-item label="取消原因" label-width="200px" prop="refundReason">
          <el-select style="width: 100%;" v-model="dialogForm.refundReason" placeholder="请选择">
            <el-option
              v-for="item in refundList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="200px" prop="remark">
          <el-input v-model="dialogForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 审批 -->
    <el-dialog title="审批申请取消" :visible.sync="dataFormVisible" :before-close="cancelDataDialog">
      <el-form
        :model="dataForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dataFormRules"
        ref="dataForm"
      >
        <el-form-item label="审批状态" label-width="120px" prop="status">
          <el-radio-group size="small" v-model="dataForm.status">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="opRemark" label-width="120px">
          <el-input
            size="small"
            class="textareaOverflow"
            :autosize="true"
            type="textarea"
            v-model="dataForm.opRemark"
            resize="none"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDataDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogDataClick">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批审核" :visible.sync="approveFormVisible" :before-close="cancelApproveDialog">
      <el-form
        :model="approveForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dataFormRules"
        ref="approveForm"
      >
        <el-form-item label="审批状态" label-width="120px" prop="isApprove">
          <el-radio-group size="small" v-model="approveForm.isApprove">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="opRemark" label-width="120px">
          <el-input
            size="small"
            class="textareaOverflow"
            :autosize="true"
            type="approveRemark"
            v-model="approveForm.approveRemark"
            resize="none"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelApproveDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogApproveClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 确认收货 -->
    <el-dialog title="确认收货" :visible.sync="sureFormVisible" :before-close="cancelSureDialog">
      <el-form
        :model="sureForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="sureFormRules"
        ref="sureForm"
      >
        <el-form-item :label="'订单号:  '+ sureData.orderCode" label-width="260px"></el-form-item>
        <el-card
          v-show="item.status == 1 || item.status == 3"
          class="box-card"
          v-for="(item, index) in sureData.orderReApplyVos"
          :key="index"
        >
          <div slot="header" class="clearfix">
            <span>退货单号: {{item.code}}</span>
            <el-button
              @click="sureGetGoods(item)"
              style="float: right; padding: 3px 0"
              type="text"
            >确认收货</el-button>
          </div>
          <el-table :data="item.orderReApplyLines" style="width: 100%">
            <el-table-column prop="itemName" label="商品名" align="center"></el-table-column>
            <el-table-column prop="quantity" label="退货数量" align="center"></el-table-column>
            <el-table-column prop="subTotal" label="退货金额" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSureDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 确认退款 -->
    <el-dialog title="确认收货" :visible.sync="moneyFormVisible" :before-close="cancelMoneyDialog">
      <el-form :model="moneyForm" style="width: 95%; margin: 0 auto;" status-icon ref="moneyForm">
        <el-form-item :label="'订单号:  '+ sureData.orderCode" label-width="260px"></el-form-item>
        <el-card
          v-show="item.status == 6"
          class="box-card"
          v-for="(item, index) in sureData.orderReApplyVos"
          :key="index"
        >
          <div slot="header" class="clearfix">
            <span>退货单号: {{item.code}}</span>
            <el-button
              @click="sureMoney(item)"
              style="float: right; padding: 3px 0"
              type="text"
            >确认退款</el-button>
          </div>
          <el-table :data="item.orderReApplyLines" style="width: 100%">
            <el-table-column prop="itemName" label="商品名" align="center"></el-table-column>
            <el-table-column prop="quantity" label="退货数量" align="center"></el-table-column>
            <el-table-column prop="subTotal" label="退货金额" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMoneyDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import { channelList } from "@/api/promotion/flashSale";
import {
  pageList,
  checkApplyPageList,
  applyCanclePageList,
  cancleOrderBeforePay,
  cancleOrderAfterPay,
  applyCancleOrderSH,
  applyReview,
  customPayReturn,
  customConfirmReceive,
  giveUpRefund
} from "@/api/transaction/returnGoods";

export default {
  name: "orderList",
  data() {
    return {
      activeIndex: "1",

      // 搜索table渲染的数据
      searchModel: [
        {
          input: [
            {
              placeholder: "请输入订单号",
              inputModel: "orderCode",
              labelName: "订单号",
              model: "",
              type: "el-input"
            },
            {
              placeholder: "请输入收货人",
              inputModel: "consigneeName",
              labelName: "收货人",
              model: "",
              type: "el-input"
            },
            {
              inputModel: "orderStatus",
              labelName: "订单状态",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "等待买家付款",
                  status: "2"
                },
                {
                  name: "等待商家发货",
                  status: "4"
                },
                {
                  name: "商家已发货",
                  status: "3"
                },
                {
                  name: "交易成功",
                  status: "5"
                },
                {
                  name: "交易取消",
                  status: "6"
                }
              ]
            },
            {
              inputModel: "reType",
              labelName: "售后类型",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "退货",
                  status: "1"
                },
                {
                  name: "换货",
                  status: "2"
                }
              ]
            },
            {
              inputModel: "reStatus",
              labelName: "退/换货状态",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "正在处理申请",
                  status: "1"
                },
                {
                  name: "申请已受理",
                  status: "2"
                },
                {
                  name: "退/换货商品已入库",
                  status: "3"
                },
                {
                  name: "退款已发出",
                  status: "4"
                },
                {
                  name: "新商品已发出",
                  status: "5"
                },
                {
                  name: "放弃退/换货处理中",
                  status: "6"
                }
              ]
            }
          ],
          button: [
            {
              type: "primary",
              func: "searchBtn",
              name: "搜索"
            }
          ]
        }
      ],
      tableData: [],
      searchData: {},
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        orderDisplayStatus: 1
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },

      refundList: [
        {
          name: "顾客原因要求取消"
        },
        {
          name: "联系不上顾客"
        },
        {
          name: "订单商品缺货"
        },
        {
          name: "价格错标，商家要求取消订单"
        },
        {
          name: "地址无法送达"
        },
        {
          name: "其他原因"
        }
      ],

      btnLoading: false,
      dialogTitle: "",

      // 取消订单
      selectVal: "",
      dialogForm: {
        refundReason: "",
        remark: ""
      },
      dialogFormRules: {
        refundReason: [
          { required: true, message: "请选择取消原因", trigger: "change" }
        ]
      },
      dialogFormVisible: false,
      approveData: [],

      // 申请取消审批
      dataForm: {
        status: "1",
        opRemark: ""
      },
      dataFormVisible: false,
      dataFormRules: {},

      // 审核审批
      approveForm: {
        isApprove: "1",
        approveRemark: ""
      },
      approveFormVisible: false,
      approveFormRules: {},

      //确认收获
      sureFormVisible: false,
      sureForm: {},
      sureFormRules: {},
      sureData: {},

      // 退款
      moneyFormVisible: false,
      moneyForm: {},
      returnNowMoney: {},

      channelListData: [],
      funName: ""
    };
  },
  created() {
    this.getList();
  },
  components: {
    searchView,
    CommonTable
  },
  methods: {
    // 数据切换
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.pagination.pageSize = size;
      this.getList();
    },
    handleIndexChange(current) {
      // 切换页码
      this.pagination.pageIndex = current;
      this.getList();
    },
    getList() {
      this.options.loading = true;
      let params = Object.assign(
        {
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        },
        this.searchData
      );
      this.funName = "";
      if (this.pagination.orderDisplayStatus == 1) {
        this.funName = pageList;
      } else if (this.pagination.orderDisplayStatus == 2) {
        this.funName = applyCanclePageList;
      } else if (this.pagination.orderDisplayStatus == 4) {
        this.funName = checkApplyPageList;
        params.reStatus = 2;
      } else if (this.pagination.orderDisplayStatus == 5) {
        this.funName = checkApplyPageList;
        params.reStatus = 3;
      } else {
        this.funName = checkApplyPageList;
      }
      this.funName(params).then(res => {
        this.tableData = res.result.records;
        this.tableData.map(v => {
          if (v.logisticsStatus == 6) {
            v.logisticName = "商家已发货";
          } else if (v.logisticsStatus == 15) {
            v.logisticName = "交易成功";
          } else if (v.logisticsStatus == 9 || v.logisticsStatus == 10) {
            v.logisticName = "交易取消";
          } else if (v.logisticsStatus == 11) {
            v.logisticName = "退款成功";
          } else if (v.financialStatus == 1 && v.paymentType !== 1) {
            v.logisticName = "等待买家付款";
            v.showCancel = true;
            v.showCancelStatus = 0;
          } else if (
            v.logisticsStatus == 1 ||
            v.logisticsStatus == 3 ||
            v.logisticsStatus == 4 ||
            v.logisticsStatus == 5
          ) {
            v.logisticName = "等待商家发货";
            v.showCancel = true;
            v.showCancelStatus = 1;
          }

          if (v.reType == 1) {
            v.reTypeName = "退货";
          } else if (v.reType == 2) {
            v.reTypeName = "换货";
          } else if (v.reType == 3) {
            v.reTypeName = "申请取消";
          }

          if (v.reStatus == 0) {
            v.reName = "正在处理申请";
          } else if (v.reStatus == 1 || v.reStatus == 3) {
            v.reName = "申请已受理";
          } else if (v.reStatus == 6 && v.reType == 1) {
            v.reName = "退货商品已入库";
          } else if (
            v.reStatus == 8 &&
            v.reType == 1 &&
            v.reFinancialStatus == 1
          ) {
            v.reName = "退款已发出";
          } else if (v.reStatus == 6 && v.reType == 2) {
            v.reName = "换货商品已入库";
          } else if (v.reStatus == 7) {
            v.reName = "新商品已发出";
          } else if (v.reStatus == 2 && v.reType == 3) {
            v.reName = "取消订单驳回";
          } else if (v.reStatus == 5 && v.reType == 1) {
            v.reName = "放弃退货处理中";
          } else if (v.reStatus == 5 && v.reType == 2) {
            v.reName = "放弃换货处理中";
          }
        });
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },

    // 搜索方法
    searchBtn(val) {
      this.pageNum = 1;
      this.searchData = Object.assign({}, val);
      this.getList();
    },
    // 表切换
    tabChange(val) {
      this.pagination.orderDisplayStatus = val.name;
      this.pagination.pageIndex = 1;
      this.getList();
    },
    // 订单详情
    goToDetail(val) {
      this.$router.push({
        path: "/transaction/orderTemplate/orderDetail",
        query: {
          title: "查看订单详情",
          id: val.orderId,
          memberId: val.memberId
        }
      });
    },

    // 取消订单
    cancelGoods(val) {
      this.selectVal = val;
      if (val.showCancelStatus == 0) {
        this.dialogTitle = "取消订单";
      } else {
        this.dialogTitle = "申请取消订单";
      }
      this.dialogFormVisible = true;
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogForm = {
        refundReason: "",
        remark: ""
      };
      this.$refs["dialogForm"].resetFields();
    },
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          let params = {
            orderId: this.selectVal.orderId,
            orderCode: this.selectVal.orderCode,
            remark: this.dialogForm.remark,
            refundReason: this.dialogForm.refundReason
          };
          if (this.selectVal.showCancelStatus == 0) {
            cancleOrderBeforePay(params)
              .then(res => {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.cancelDialog();
                this.getList();
                this.btnLoading = false;
              })
              .catch(err => {
                this.btnLoading = false;
              });
          } else {
            params.refundType = 3;
            cancleOrderAfterPay(params)
              .then(res => {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.cancelDialog();
                this.getList();
                this.btnLoading = false;
              })
              .catch(err => {
                this.btnLoading = false;
              });
          }
        }
      });
    },

    // 取消退换货
    returnDetail(val) {
      this.$router.push({
        path: "/transaction/returnGoodsTemplate/returnDetail",
        query: {
          id: val.orderId,
          memberId: val.memberId
        }
      });
    },

    // 审批
    approve(val) {
      this.dataFormVisible = true;
      this.approveData = val;
    },
    dialogDataClick() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          let params = Object.assign(
            {
              code: this.approveData.reCode
            },
            this.dataForm
          );
          applyCancleOrderSH(params)
            .then(res => {
              if (res.code == "200") {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.getList();
              } else {
                this.$notify.error({
                  title: res.message,
                  offset: 100
                });
              }

              this.cancelDataDialog();

              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    cancelDataDialog() {
      this.dataFormVisible = false;
      this.dataForm = {
        status: "1",
        opRemark: ""
      };
      this.$refs["dataForm"].resetFields();
    },

    // 审批
    approveLast(val) {
      this.approveFormVisible = true;
      this.approveData = val;
    },
    dialogApproveClick() {
      this.$refs.approveForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          let params = Object.assign(
            {
              code: this.approveData.reCode
            },
            this.approveForm
          );
          applyReview(params)
            .then(res => {
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              this.cancelApproveDialog();
              this.getList();
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    cancelApproveDialog() {
      this.approveFormVisible = false;
      this.approveForm = {
        isApprove: "1",
        approveRemark: ""
      };
      this.$refs["approveForm"].resetFields();
    },

    // 取消退换货
    cancelRetype(val) {
      this.$confirm("此操作将取消退换货是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            code: val.reCode,
            refundType: 1
          };
          giveUpRefund(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "取消取消退换货成功!"
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },

    // 确认收货
    sureGet(val) {
      this.sureData = val;
      this.sureFormVisible = true;
    },
    sureGetGoods(item) {
      this.$confirm("确认收货吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            reCode: item.code
          };
          customConfirmReceive(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "收货成功!"
              });
              this.getList();
              this.sureFormVisible = false;
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消收货"
          });
        });
    },
    cancelSureDialog() {
      this.sureFormVisible = false;
    },

    // 退款
    returnMoney(val) {
      this.sureData = val;
      this.moneyFormVisible = true;
    },
    // 价格
    valueValidator(value) {
      let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (reg.test(value)) {
        if (this.returnNowMoney.applyRefundAmount < value) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    sureMoney(item) {
      this.returnNowMoney = item;
      this.$prompt("请输入实际退款金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: this.valueValidator,
        inputErrorMessage: "请输入正确金额"
      })
        .then(({ value }) => {
          let params = {
            reCode: item.code,
            actualRefundAmount: value
          };
          customPayReturn(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "退款成功!"
              });
              this.getList();
              this.moneyFormVisible = false;
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退款"
          });
        });
    },
    cancelMoneyDialog() {
      this.moneyFormVisible = false;
    }
  }
};
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
		.tableStyle
			.titleBox
				border-bottom: 1px solid #3c763d
				overflow: hidden
				height: 35px
				line-height: 35px
				font-size: 13px
				margin-top: 10px
				margin-bottom: 10px
				p
					float: left
					padding: 0
					margin: 0
					text-align: center
			.contentBox
				.tableHeader
					height: 30px
					line-height: 30px
					font-size: 13px
					background: #e1e1e1
					padding-left: 20px
				.floatBox
					width: calc(100% - 130px)
					position: absolute
					left: 150px
					height: 150px
					top: 0
					p
						width: 55%
						position: absolute
						height: 50px
						line-height: 20px
						font-size: 13px
						left: 10px
				.childItemStyle
					width: 20%
					height: 100%
					position: absolute
					left: 0
					top: 0
					text-align: center
					line-height: 150px
				.itemChildSt
					width: 167px
					height: 100%
					position: absolute
					top: 0
					border-left: 1px solid #ccc
					text-align: center
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap
					font-size: 13px
</style>
