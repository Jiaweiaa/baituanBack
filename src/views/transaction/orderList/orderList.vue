<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 20:54:42
 * @LastEditTime: 2019-10-25 15:01:19
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="orderBox">
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
          等待买家付款
          <el-tag v-show="activeIndex == 2" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="4">
        <span slot="label">
          等待商家发货
          <el-tag v-show="activeIndex == 4" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label">
          商家已发货
          <el-tag v-show="activeIndex == 3" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="5">
        <span slot="label">
          交易成功
          <el-tag v-show="activeIndex == 5" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="6">
        <span slot="label">
          交易取消
          <el-tag v-show="activeIndex == 6" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
      <el-tab-pane name="7">
        <span slot="label">
          退款成功
          <el-tag v-show="activeIndex == 7" size="small" type="success">{{pagination.total}}</el-tag>
        </span>
      </el-tab-pane>
    </el-tabs>
    
    <!--
      列表组件
    -->
    <div class="tableStyle" v-loading="options.loading">
      <div class="titleBox">
        <el-checkbox
            style="position: absolute;left: 40px;"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
        >全选</el-checkbox>
        <p style="width: 30%;min-width: 300px;">商品</p>
        <p style="width: 10%;min-width: 150px;">收货人</p>
        <p style="width: 20%;min-width: 150px;">收货地址</p>
        <p style="width: 10%;min-width: 150px;">收货人电话</p>
        <p style="width: 10%;min-width: 150px;">实付款</p>
        <p style="width: 10%;min-width: 150px;">交易状态</p>
        <p style="width: 10%;min-width: 150px;">操作</p>
      </div>
      <div class="contentBox" v-if="tableData.length > 0">
        <el-checkbox-group @change="handleCheckedGoodsChange" v-model="checkGoods">
          <div
              v-for="(item, index) in tableData"
              style="margin-bottom: 20px; border: 1px solid #ccc;"
          >
            <div class="tableHeader">
              <!--订单号: {{item.code}}-->
              <el-checkbox :label="item.code" :key="item.code" style="margin-right: 10px"></el-checkbox>
              {{item.createTime}}
            </div>
            <div v-for="(childItem, childIndex) in item.orderLines">
              <div>
                <div
                    style="width: 100%; min-width: 300px; height: 150px; line-height: 150px; position: relative;"
                    :style="childIndex == 0 ? 'z-index: 999' : 'z-index: -1'"
                >
                  <el-image
                      style="width: 100px; height: 100px; margin-left: 20px;"
                      :src="`http://qn.gaoshanmall.cn/${childItem.itemImg}`"
                      fit="fit"
                  ></el-image>
                  <div class="floatBox">
                    <p style=" top: 30px; max-width: 42%;">{{childItem.itemName}}</p>
                    <p style=" top: 85px;">{{childItem.propertiesValue}}</p>
                    <p
                        style="top: 30px;left: 20%"
                        class="childItemStyle"
                    >￥&nbsp;{{childItem.salePrice}}</p>
                    <p style=" top: 85px;left: 20%" class="childItemStyle">
                      <span style="color: red; font-size: 16px">x &nbsp;{{childItem.quantity}}</span>
                    </p>
                  </div>
                  
                  <div
                      v-show="childIndex == 0 "
                      :style="item.orderLines.length > 1 ? 'left: 30%; height:'+ item.orderLines.length + '00%;line-height:'+ item.orderLines.length * 150 + 'px;': 'left: calc(30%);'"
                      class="itemChildSt"
                  >{{item.shippingAddress? item.shippingAddress.firstName: ''}}</div>
                  <!-- 提货地址 -->
                  <div
                      v-show="childIndex == 0 "
                      style="width: 20%;"
                      :style="item.orderLines.length > 1 ? 'left: 40%; height:'+ item.orderLines.length + '00%;line-height:'+ item.orderLines.length * 150 + 'px;': 'left: calc(40%);'"
                      class="itemChildSt"
                  >{{item.shippingAddress? item.shippingAddress.address : ''}}</div>
                  <div
                      v-show="childIndex == 0 "
                      :style="item.orderLines.length > 1 ? 'left: 60%; height:'+ item.orderLines.length + '00%;line-height:'+ item.orderLines.length * 150 + 'px;': 'left: calc(60%);'"
                      class="itemChildSt"
                  >{{item.buyerMobile? item.buyerMobile: ''}}</div>
                  <div
                      v-show="childIndex == 0 "
                      :style="item.orderLines.length > 1 ? 'left: 70%; height:'+ item.orderLines.length + '00%;line-height:'+ item.orderLines.length * 150 + 'px;': 'left:  calc(70%);'"
                      class="itemChildSt"
                  >￥ {{item.totalActure}}</div>
                  <div
                      v-show="childIndex == 0 "
                      :style="item.orderLines.length > 1 ? 'left: 80%; height:'+ item.orderLines.length + '00%;line-height:'+ item.orderLines.length * 150 + 'px;': 'left:  calc(80%);'"
                      class="itemChildSt"
                  >{{item.titleType}}</div>
                  <div
                      v-show="childIndex == 0 "
                      :style="item.orderLines.length > 1 ? 'left: 90%; height:'+ item.orderLines.length + '00%;line-height:'+ item.orderLines.length * 150 + 'px;': 'left:  calc(90%);'"
                      class="itemChildSt"
                  >
                    <el-button
                        type="text"
                        style="font-size: 13px; z-index: 999;"
                        @click="detailClick(item)"
                    >查看订单详情</el-button>
                    
                    <el-button
                        v-if="(item.logisticsStatus==4 || item.logisticsStatus==5) &&item.financialStatus==3&&item.paymentType!=1"
                        type="text"
                        style="font-size: 13px; color: orange; z-index: 999;"
                        @click="sendGoods(item)"
                    >发货</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="noData" v-else>
        <img src="http://ircsstatic.cninfo.com.cn/ircs/assets/images/company-list-blank.png" />
      </div>
    </div>
    
    <!--
			发货
    -->
    <el-dialog title="发货" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="收货人" label-width="150px" v-if="clickData">
          <span>{{clickData.shippingAddress.firstName}}</span>
        </el-form-item>
        <el-form-item label="手机号" label-width="150px" v-if="clickData">
          <span>{{clickData.shippingAddress.mobile}}</span>
        </el-form-item>
        <el-form-item label="地址" label-width="150px" v-if="clickData">
          <span>
            {{clickData.shippingAddress.province}}
            {{clickData.shippingAddress.city}}
            {{clickData.shippingAddress.district}}
            {{clickData.shippingAddress.address}}
          </span>
        </el-form-item>
        <el-form-item label="物流供应商名称" label-width="150px" prop="logisticsProviderCode">
          <el-select v-model="dialogForm.logisticsProviderCode" clearable placeholder="请选择物流公司">
            <el-option
                v-for="item in logisticsOptions"
                filterable
                :key="item.no"
                :label="item.com"
                :value="item.no"
            ></el-option>
          </el-select>
          <!-- 高山版本 -->
          <!-- <el-form-item label="承运人" label-width="150px" prop="logisticsProviderName">
            <el-input v-model="dialogForm.logisticsProviderName"></el-input>
          </el-form-item>
          <el-form-item label="承运人电话" label-width="150px" prop="logisticsProviderCode">
            <el-input v-model="dialogForm.logisticsProviderCode"></el-input>
          </el-form-item> -->
        </el-form-item>
        <el-form-item label="物流单号" label-width="150px" prop="transCode">
          <el-input v-model="dialogForm.transCode"></el-input>
        </el-form-item>
        <!-- <el-form-item label="物流编号" label-width="150px" prop="logisticsProviderCode">
          <el-input v-model="dialogForm.logisticsProviderCode"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>
    
    <!-- 分页 -->
    <el-pagination
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
        style="margin-top: 20px;margin-bottom: 20px; text-align: right"
    ></el-pagination>
  </div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from "@/components/Table";
  import { channelList } from "@/api/promotion/flashSale";
  import {
    orderList,
    orderSendConfrim,
    printReceipt,
    excleOut,
    getCaptainAndSupplierList,
    findStoreNameList
  } from "@/api/transaction/order";
  
  export default {
    name: "orderList",
    data() {
      return {
        logisticsOptions: [
          {
            com: "顺丰",
            no: "sf"
          },
          {
            com: "申通",
            no: "sto"
          },
          {
            com: "圆通",
            no: "yt"
          },
          {
            com: "韵达",
            no: "yd"
          },
          {
            com: "天天",
            no: "tt"
          },
          {
            com: "EMS",
            no: "ems"
          },
          {
            com: "中通",
            no: "zto"
          },
          {
            com: "汇通（百世快递）",
            no: "ht"
          },
          {
            com: "全峰",
            no: "qf"
          },
          {
            com: "德邦",
            no: "db"
          },
          {
            com: "国通",
            no: "gt"
          },
          {
            com: "如风达",
            no: "rfd"
          },
          {
            com: "京东快递",
            no: "jd"
          },
          {
            com: "宅急送",
            no: "zjs"
          },
          {
            com: "EMS国际",
            no: "emsg"
          },
          {
            com: "Fedex国际",
            no: "fedex"
          },
          {
            com: "邮政国内（挂号信）",
            no: "yzgn"
          },
          {
            com: "UPS国际快递",
            no: "ups"
          },
          {
            com: "中铁快运",
            no: "ztky"
          },
          {
            com: "佳吉快运",
            no: "jiaji"
          },
          {
            com: "速尔快递",
            no: "suer"
          },
          {
            com: "信丰物流",
            no: "xfwl"
          },
          {
            com: "优速快递",
            no: "yousu"
          },
          {
            com: "中邮物流",
            no: "zhongyou"
          },
          {
            com: "天地华宇",
            no: "tdhy"
          },
          {
            com: "安信达快递",
            no: "axd"
          },
          {
            com: "快捷速递",
            no: "kuaijie"
          },
          {
            com: "AAE全球专递",
            no: "aae"
          },
          {
            com: "DHL",
            no: "dhl"
          },
          {
            com: "DPEX国际快递",
            no: "dpex"
          },
          {
            com: "D速物流",
            no: "ds"
          },
          {
            com: "FEDEX国内快递",
            no: "fedexcn"
          },
          {
            com: "OCS",
            no: "ocs"
          },
          {
            com: "TNT",
            no: "tnt"
          },
          {
            com: "东方快递",
            no: "coe"
          },
          {
            com: "传喜物流",
            no: "cxwl"
          },
          {
            com: "城市100",
            no: "cs"
          },
          {
            com: "城市之星物流",
            no: "cszx"
          },
          {
            com: "安捷快递",
            no: "aj"
          },
          {
            com: "百福东方",
            no: "bfdf"
          },
          {
            com: "程光快递",
            no: "chengguang"
          },
          {
            com: "递四方快递",
            no: "dsf"
          },
          {
            com: "长通物流",
            no: "ctwl"
          },
          {
            com: "飞豹快递",
            no: "feibao"
          },
          {
            com: "马来西亚（大包EMS）",
            no: "malaysiaems"
          },
          {
            com: "安能快递",
            no: "ane66"
          },
          {
            com: "中通快运",
            no: "ztoky"
          },
          {
            com: "远成物流",
            no: "ycgky"
          },
          {
            com: "远成快运",
            no: "ycky"
          },
          {
            com: "邮政快递",
            no: "youzheng"
          },
          {
            com: "百世快运",
            no: "bsky"
          },
          {
            com: "苏宁快递",
            no: "suning"
          },
          {
            com: "安能物流",
            no: "anneng"
          },
          {
            com: "九曳",
            no: "jiuye"
          },
          {
            com: "品骏快递",
            no: "pjbest"
          },
          {
            com: "壹米滴答",
            no: "ymdd"
          }
        ],
        checkAll: false,
        isIndeterminate: true,
        
        storeList: [],
        
        allGoods: [],
        checkGoods: [],
        
        serverUrl: "",
        
        activeIndex: "1",
        
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: "请输入订单号",
                inputModel: "code",
                labelName: "订单号",
                model: "",
                type: "el-input"
              },
              {
                placeholder: "请输入商品名称",
                inputModel: "itemName",
                labelName: "商品名称",
                model: "",
                type: "el-input"
              },
              {
                inputModel: "date",
                labelName: "成交时间",
                model: "",
                type: "el-date-picker"
              },
              // {
              //   inputModel: "source",
              //   labelName: "订单来源",
              //   model: "",
              //   type: "el-select",
              //   options: []
              // },
              // {
              //   inputModel: "achieveType",
              //   labelName: "付款方式",
              //   model: "",
              //   type: "el-select",
              //   options: [
              //     {
              //       name: "微信支付",
              //       status: "1"
              //     },
              //     {
              //       name: "支付支付",
              //       status: "2"
              //     }
              //   ]
              // },
              // {
              //   inputModel: 'achieveType',
              //   labelName: '物流方式',
              //   model: '',
              //   type: 'el-select',
              //   options: [{
              //     name: '领取',
              //     status: '1'
              //   }, {
              //     name: '发放',
              //     status: '0'
              //   }]
              // },
              {
                inputModel: "orderDisplayStatus",
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
                  },
                  {
                    name: "退款成功",
                    status: "7"
                  }
                ]
              },
              {
                placeholder: "请输入收货人姓名",
                inputModel: "firstName",
                labelName: "收货人姓名",
                model: "",
                type: "el-input"
              },
              {
                placeholder: "请输入收货人手机",
                inputModel: "mobile",
                labelName: "收货人手机",
                model: "",
                type: "el-input"
              },
              {
                inputModel: "storeId",
                labelName: "店铺",
                model: "",
                type: "el-select",
                options: []
              },
              {
                inputModel: "supplierId",
                labelName: "供应商列表",
                model: "",
                type: "el-select",
                options: [],
                fun: "suplerFun"
              }
            ],
            button: [
              {
                type: "primary",
                func: "searchBtn",
                name: "搜索"
              },
              {
                type: "success",
                func: "addBtn",
                name: "打印"
              },
              {
                type: "success",
                func: "toggleAllSure",
                name: "导出全部excel"
              },
              {
                type: "success",
                func: "toggleSure",
                name: "导出excel"
              }
            ]
          }
        ],
        
        // table和分页的数据
        columns: [
          {
            prop: "title",
            label: "标题"
          },
          {
            prop: "summary",
            label: "概述"
          },
          {
            prop: "content",
            label: "内容"
          },
          {
            prop: "createTime",
            label: "创建时间"
          },
          {
            button: true,
            label: "操作",
            group: [
              {
                // you can props => type size icon disabled plain
                name: "编辑",
                type: "warning",
                icon: "el-icon-edit",
                plain: true,
                onClick: (row, index) => {
                  // 箭头函数写法的 this 代表 Vue 实例
                  this.edit(row);
                }
              },
              {
                name: "删除",
                type: "danger",
                icon: "el-icon-delete",
                disabled: false,
                onClick: row => {
                  this.del(row);
                }
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
        
        btnLoading: false,
        // 编辑新增用户
        dialogForm: {
          logisticsProviderName: "",
          transCode: "",
          logisticsProviderCode: ""
        },
        dialogFormRules: {
          logisticsProviderName: [
            { required: true, message: "请输入物流名称", trigger: "blur" }
          ],
          transCode: [
            { required: true, message: "请输入物流单号", trigger: "blur" }
          ],
          logisticsProviderCode: [
            { required: true, message: "请选择物流公司", trigger: "blur" }
          ]
        },
        dialogFormVisible: false,
        clickData: "",
        
        channelListData: [],
        
        captainList: [],
        supplierList: []
      };
    },
    created() {
      this.serverUrl = process.env.BASE_API;
      this.getList();
      let arr = [];
      findStoreNameList().then(res => {
        arr = res.result;
        arr.map(v => {
          this.storeList.push({
            status: v.id,
            name: v.name
          });
        });
        this.searchModel[0].input[6].options = this.storeList;
      });
      
      getCaptainAndSupplierList().then(res => {
        let arr1 = res.result.supplierList;
        let arr2 = res.result.captainList;
        arr1.map(v => {
          this.supplierList.push({
            status: v.id,
            name: v.fullName
          });
        });
        arr2.map(v => {
          this.captainList.push({
            status: v.id,
            name: v.name
          });
        });
        
      });
      
      // channelList().then(res => {
      //   if (res.code == 200) {
      //     res.result.forEach(v => {
      //       this.channelListData.push({
      //         name: v.name,
      //         status: v.id
      //       });
      //     });
      //     this.searchModel[0].input[3].options = this.channelListData;
      //   }
      // });
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 监听变化下拉变化
      suplerFun(val) {
        this.searchData.supplierId = val;
      },
      captainFun(val) {
        this.searchData.captainId = val;
      },
      // 全选
      handleCheckAllChange(val) {
        this.checkGoods = val ? this.allGoods : [];
        this.isIndeterminate = false;
      },
      handleCheckedGoodsChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.allGoods.length;
        this.isIndeterminate =
            checkedCount > 0 && checkedCount < this.allGoods.length;
      },
      
      dialogClick() {
        this.dialogForm.orderId = this.clickData.id;
        this.dialogForm.orderCode = this.clickData.code;
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            this.btnLoading = true;
            let pramas = Object.assign({}, this.dialogForm);
            this.logisticsOptions.map(item => {
              if (item.no == this.dialogForm.logisticsProviderCode) {
                pramas.logisticsProviderName = item.com;
              }
            });
            orderSendConfrim(pramas).then(res => {
              this.btnLoading = false;
              this.cancelDialog();
              this.getList();
            });
          }
        });
      },
      cancelDialog() {
        this.dialogForm = {
          logisticsProviderName: "",
          transCode: "",
          logisticsProviderCode: ""
        };
        this.$refs["dialogForm"].resetFields();
        this.dialogFormVisible = false;
      },
      
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
              pageSize: this.pagination.pageSize,
              orderDisplayStatus: this.searchData.orderDisplayStatus
                  ? this.searchData.orderDisplayStatus
                  : 1,
              isSpread: true,
              isDefaultLoad: false
            },
            this.searchData
        );
        orderList(params).then(res => {
          this.tableData = res.result.records;
          this.allGoods = [];
          this.tableData.map(v => {
            if (v.shippingAddress.deliveryType == "1") {
              v.orderLines.map(order => {
                this.$set(order, "deliveryType", "自提");
              });
            } else {
              v.orderLines.map(order => {
                this.$set(order, "deliveryType", "送货上门");
              });
            }
            if (v.orderReVo.logisticsStatus == 6) {
              v.titleType = "商家已发货";
            } else if (v.orderReVo.logisticsStatus == 15) {
              v.titleType = "交易成功";
            } else if (
                v.orderReVo.logisticsStatus == 9 &&
                v.orderReVo.financialStatus == 3
            ) {
              v.titleType = "待退款";
            } else if (
                v.orderReVo.logisticsStatus == 9 &&
                v.orderReVo.financialStatus == 1
            ) {
              v.titleType = "交易取消";
            } else if (v.orderReVo.logisticsStatus == 11) {
              v.titleType = "退款成功";
            } else if (
                v.orderReVo.financialStatus == 1 &&
                v.orderReVo.paymentType != 1 &&
                v.orderReVo.logisticsStatus == 1
            ) {
              v.titleType = "待支付";
            } else if (
                (v.orderReVo.financialStatus != 1 &&
                    v.orderReVo.logisticsStatus == 1) ||
                v.orderReVo.logisticsStatus == 3 ||
                v.orderReVo.logisticsStatus == 4 ||
                v.orderReVo.logisticsStatus == 5
            ) {
              v.titleType = "等待商家发货";
            } else if (
                v.orderReVo.logisticsStatus == 10 &&
                v.orderReVo.financialStatus == 1
            ) {
              v.titleType = "自动取消";
            }
            this.allGoods.push(v.code);
          });
          console.log(this.tableData, "777");
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },
      
      // 搜索方法
      searchBtn(val) {
        this.searchData = Object.assign(
            {
              startTime: val.date[0],
              endTime: val.date[1]
            },
            val
        );
        if (this.searchData.captainId && this.searchData.supplierId) {
          this.$message.error("团长和供应商只能选择一个筛选!");
          return;
        }
        if (
            this.searchData.orderDisplayStatus == "" ||
            this.searchData.orderDisplayStatus == undefined ||
            this.searchData.orderDisplayStatus == null
        ) {
          this.searchData.orderDisplayStatus = 1;
        }
        
        let isDefaultLoad = "";
        if (this.activeIndex > 6) {
          isDefaultLoad = true;
        } else {
          isDefaultLoad = false;
        }
        this.searchData.isDefaultLoad = isDefaultLoad;
        this.getList();
      },
      // 表切换
      tabChange(val) {
        let isDefaultLoad = "";
        if (this.activeIndex > 6) {
          isDefaultLoad = true;
        } else {
          isDefaultLoad = false;
        }
        this.searchData.orderDisplayStatus = val.name;
        this.searchData.isDefaultLoad = isDefaultLoad;
        this.getList();
      },
      // 订单详情
      detailClick(val) {
        this.$router.push({
          path: "/transaction/orderTemplate/orderDetail",
          query: {
            title: "查看订单详情",
            id: val.id,
            memberId: val.memberId
          }
        });
      },
      
      // 发货
      sendGoods(val) {
        this.dialogFormVisible = true;
        this.clickData = val;
      },
      
      // 打印
      addBtn() {
        if (this.searchData.captainId && this.searchData.supplierId) {
          this.$message.error("团长和供应商只能选择一个筛选!");
          return;
        }
        let type = "";
        if (this.searchData.captainId) {
          type = 1;
        }
        if (this.searchData.supplierId) {
          type = 2;
        }
        if (this.checkGoods.length > 0) {
          printReceipt({
            type,
            orderCodeList: this.checkGoods
          }).then(res => {
            if (res.code == 200) {
              this.checkGoods = [];
              this.$message.success("打印成功!");
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.error("请选择要打印的商品信息!");
        }
      },
      //导出全部excel
      toggleAllSure() {
        window.open(
            `${this.serverUrl}/trade/excle/excleOut?fileName=excel`,
            "导出工友excel"
        );
        this.$message.success("导出excel成功!");
      },
      // 导出excel
      toggleSure() {
        if (this.checkGoods.length > 0) {
          window.open(
              `${this.serverUrl}/trade/excle/excleOut?orderCodes=${[
                ...this.checkGoods
              ]}&fileName=excel`,
              "导出工友excel"
          );
          this.$message.success("导出excel成功!");
          this.checkGoods = [];
        } else {
          this.$message.error("请选择要导出excel!");
        }
      }
    }
  };
</script>
<style lang="sass">
  .noData
    width: 100%
    height: 500px
    position: relative
    img
      width: 300px
      position: absolute
      left: 50%
      margin-left: -150px
      top: 50%
      margin-top: -129px
  .orderBox
    overflow: hidden
    margin: 20px 20px 0
    .tableStyle
      .titleBox
        width: 100%
        border-bottom: 1px solid #3c763d
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
          width: calc(30%)
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
          z-index: 999
        .itemChildSt
          width: 10%
          padding: 10px
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
