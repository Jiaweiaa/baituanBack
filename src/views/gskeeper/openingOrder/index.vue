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
      列表组件
    -->
    <CommonTable
      :columns="columns"
      :dataSource="tableData"
      :options="options"
      :fetch="getList"
      :pagination="pagination"
    />

    <!--
      审核弹框
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="订单号"   label-width="150px" prop="repairBillNo">
          <el-input disabled v-model="dialogForm.repairBillNo"></el-input>
        </el-form-item>
        <el-form-item label="车牌号"   label-width="150px" prop="carNo">
          <el-input disabled v-model="dialogForm.carNo"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号"   label-width="150px" prop="mobile">
          <el-input disabled v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名"   label-width="150px" prop="memberName">
          <el-input disabled v-model="dialogForm.memberName"></el-input>
        </el-form-item>
        <el-form-item label="修配厂名称"   label-width="150px" prop="garageName">
          <el-input disabled v-model="dialogForm.garageName"></el-input>
        </el-form-item>
        <el-form-item label="开单人"   label-width="150px" prop="drawer">
          <el-input disabled v-model="dialogForm.drawer"></el-input>
        </el-form-item>
        <el-form-item label="开单日期"   label-width="150px" prop="createTime">
          <el-input disabled v-model="dialogForm.createTime"></el-input>
        </el-form-item>
        <el-form-item label="单据类型"   label-width="150px" prop="billType">
          <el-input disabled v-model="dialogForm.billTypeList"></el-input>
        </el-form-item>
        <div style="border: 1px solid #ccc; padding: 10px;margin-bottom: 10px;" v-show="dialogForm.showList.repairBok" class="repair">
          <el-form-item label="维修方案"   label-width="150px" prop="repairPlan">
            <el-input disabled v-model="dialogForm.repairPlan"></el-input>
          </el-form-item>
          <el-form-item label="配件明细"  label-width="150px">
            <el-table
              :data="dialogForm.showListData.repair"
              style="width: 100%"
              height="250">
              <el-table-column
                fixed
                prop="pdName"
                label="配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pdDesc"
                label="描述"
                width="120">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="维修工时费"   label-width="150px" prop="repairManHourFee">
            <el-input disabled v-model="dialogForm.repairManHourFee"></el-input>
          </el-form-item>
          <el-form-item label="维修费用"   label-width="150px" prop="repairFee">
            <el-input disabled v-model="dialogForm.repairFee"></el-input>
          </el-form-item>
          <el-form-item label="维修负责人"   label-width="150px" prop="repairHandleMan">
            <el-input disabled v-model="dialogForm.repairHandleMan"></el-input>
          </el-form-item>
          <el-form-item label="维修照片"  label-width="150px">
            <el-image style="width: 45%; float: left" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.repairImgOne" lazy></el-image>
            <el-image style="width: 45%; float: right" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.repairImgOne" lazy></el-image>
          </el-form-item>

          <!--<el-form-item label="维修配件费"   label-width="150px" prop="repairPdFee">-->
            <!--<el-input disabled v-model="dialogForm.repairPdFee"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="维修单状态"   label-width="150px" prop="status">-->
            <!--<el-input disabled v-model="dialogForm.status"></el-input>-->
          <!--</el-form-item>-->

        </div>

        <div style="border: 1px solid #ccc; padding: 10px;margin-bottom: 10px;" v-show="dialogForm.showList.rescueBok" class="rescue">
          <el-form-item label="地图定位的救援地址"   label-width="150px" prop="rcMapAddr">
            <el-input disabled v-model="dialogForm.rcMapAddr"></el-input>
          </el-form-item>
          <el-form-item label="救援地址"   label-width="150px" prop="rcAddr">
            <el-input disabled v-model="dialogForm.rcAddr"></el-input>
          </el-form-item>
          <el-form-item label="救援时间"   label-width="150px" prop="rcTime">
            <el-input disabled v-model="dialogForm.rcTime"></el-input>
          </el-form-item>
          <el-form-item label="预计救援里程"   label-width="150px" prop="rcMileage">
            <el-input disabled v-model="dialogForm.rcMileage"></el-input>
          </el-form-item>
          <el-form-item label="救援方案"   label-width="150px" prop="rcPlan">
            <el-input disabled v-model="dialogForm.rcPlan"></el-input>
          </el-form-item>
          <el-form-item label="配件明细"   label-width="150px" prop="billDetailListVo">
            <el-table
              :data="dialogForm.showListData.rescue"
              style="width: 100%"
              height="250">
              <el-table-column
                fixed
                prop="pdName"
                label="配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pdDesc"
                label="描述"
                width="120">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="救援配件费"   label-width="150px" prop="rcPdFee">
            <el-input disabled v-model="dialogForm.rcPdFee"></el-input>
          </el-form-item>
          <el-form-item label="救援工时费"   label-width="150px" prop="rcManHourFee">
            <el-input disabled v-model="dialogForm.rcManHourFee"></el-input>
          </el-form-item>
          <el-form-item label="救援费用"   label-width="150px" prop="rcFee">
            <el-input disabled v-model="dialogForm.rcFee"></el-input>
          </el-form-item>
          <el-form-item label="救援处理人"   label-width="150px" prop="rcHandleMan">
            <el-input disabled v-model="dialogForm.rcHandleMan"></el-input>
          </el-form-item>
          <el-form-item label="救援图片"   label-width="150px" prop="rcImgOne">
            <el-image style="width: 45%; float: left" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.rcImgOne" lazy></el-image>
            <el-image style="width: 45%; float: right" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.rcImgTwo" lazy></el-image>
          </el-form-item>

          <!--<el-form-item label="救援发生省份"   label-width="150px" prop="rcProvince">-->
            <!--<el-input disabled v-model="dialogForm.rcProvince"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="救援发生市"   label-width="150px" prop="rcCity">-->
            <!--<el-input disabled v-model="dialogForm.rcCity"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="救援发生县"   label-width="150px" prop="rcTown">-->
            <!--<el-input disabled v-model="dialogForm.rcTown"></el-input>-->
          <!--</el-form-item>-->
        </div>

        <div style="border: 1px solid #ccc; padding: 10px;margin-bottom: 10px;" v-show="dialogForm.showList.maintainBok" class="maintain">
          <el-form-item label="保养里程"   label-width="150px" prop="upkeepMileage">
            <el-input disabled v-model="dialogForm.upkeepMileage"></el-input>
          </el-form-item>
          <el-form-item label="保养方案"   label-width="150px" prop="upkeepPlan">
            <el-input disabled v-model="dialogForm.upkeepPlan"></el-input>
          </el-form-item>
          <el-form-item label="配件明细"  label-width="150px">
            <el-table
              :data="dialogForm.showListData.maintain"
              style="width: 100%"
              height="250">
              <el-table-column
                fixed
                prop="pdName"
                label="配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pdDesc"
                label="描述"
                width="120">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="保养配件费"   label-width="150px" prop="upkeepPdFee">
            <el-input disabled v-model="dialogForm.upkeepPdFee"></el-input>
          </el-form-item>
          <el-form-item label="保养工时费"   label-width="150px" prop="upkeepManHourFee">
            <el-input disabled v-model="dialogForm.upkeepManHourFee"></el-input>
          </el-form-item>
          <el-form-item label="保养费用"   label-width="150px" prop="upkeepFee">
            <el-input disabled v-model="dialogForm.upkeepFee"></el-input>
          </el-form-item>
          <el-form-item label="保养处理人"   label-width="150px" prop="upkeepHandleMan">
            <el-input disabled v-model="dialogForm.upkeepHandleMan"></el-input>
          </el-form-item>
          <el-form-item label="保养照片"  label-width="150px">
            <el-image style="width: 45%; float: left" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.upkeepImgOne" lazy></el-image>
            <el-image style="width: 45%; float: right" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.upkeepImgTwo" lazy></el-image>
          </el-form-item>
        </div>
        <el-form-item label="单据总费用"   label-width="150px" prop="billFee">
          <el-input disabled placeholder="请输入单据总费用" v-model="dialogForm.billFee"></el-input>
        </el-form-item>
        <el-form-item label="单据审核"   label-width="150px" prop="hasAuth">
          <el-radio-group v-model="dialogForm.hasAuth" size="small">
            <el-radio :label="1" border>通过</el-radio>
            <el-radio :label="0" border>不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      查看弹框
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormLookVisible" :before-close="cancelLookDialog">
      <el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="订单号"   label-width="150px" prop="repairBillNo">
          <el-input disabled v-model="dialogForm.repairBillNo"></el-input>
        </el-form-item>
        <el-form-item label="车牌号"   label-width="150px" prop="carNo">
          <el-input disabled v-model="dialogForm.carNo"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号"   label-width="150px" prop="mobile">
          <el-input disabled v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名"   label-width="150px" prop="memberName">
          <el-input disabled v-model="dialogForm.memberName"></el-input>
        </el-form-item>
        <el-form-item label="修配厂名称"   label-width="150px" prop="garageName">
          <el-input disabled v-model="dialogForm.garageName"></el-input>
        </el-form-item>
        <el-form-item label="开单人"   label-width="150px" prop="drawer">
          <el-input disabled v-model="dialogForm.drawer"></el-input>
        </el-form-item>
        <el-form-item label="开单日期"   label-width="150px" prop="createTime">
          <el-input disabled v-model="dialogForm.createTime"></el-input>
        </el-form-item>
        <el-form-item label="单据类型"   label-width="150px" prop="billType">
          <el-input disabled v-model="dialogForm.billTypeList"></el-input>
        </el-form-item>
        <div style="border: 1px solid #ccc; padding: 10px;margin-bottom: 10px;" v-show="dialogForm.showList.repairBok" class="repair">
          <el-form-item label="维修方案"   label-width="150px" prop="repairPlan">
            <el-input disabled v-model="dialogForm.repairPlan"></el-input>
          </el-form-item>
          <el-form-item label="配件明细"  label-width="150px">
            <el-table
              :data="dialogForm.showListData.repair"
              style="width: 100%"
              height="250">
              <el-table-column
                fixed
                prop="pdName"
                label="配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pdDesc"
                label="描述"
                width="120">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="维修工时费"   label-width="150px" prop="repairManHourFee">
            <el-input disabled v-model="dialogForm.repairManHourFee"></el-input>
          </el-form-item>
          <el-form-item label="维修费用"   label-width="150px" prop="repairFee">
            <el-input disabled v-model="dialogForm.repairFee"></el-input>
          </el-form-item>
          <el-form-item label="维修负责人"   label-width="150px" prop="repairHandleMan">
            <el-input disabled v-model="dialogForm.repairHandleMan"></el-input>
          </el-form-item>
          <el-form-item label="维修照片"  label-width="150px">
            <el-image style="width: 45%; float: left" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.repairImgOne" lazy></el-image>
            <el-image style="width: 45%; float: right" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.repairImgOne" lazy></el-image>
          </el-form-item>

          <!--<el-form-item label="维修配件费"   label-width="150px" prop="repairPdFee">-->
          <!--<el-input disabled v-model="dialogForm.repairPdFee"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="维修单状态"   label-width="150px" prop="status">-->
          <!--<el-input disabled v-model="dialogForm.status"></el-input>-->
          <!--</el-form-item>-->

        </div>

        <div style="border: 1px solid #ccc; padding: 10px;margin-bottom: 10px;" v-show="dialogForm.showList.rescueBok" class="rescue">
          <el-form-item label="地图定位的救援地址"   label-width="150px" prop="rcMapAddr">
            <el-input disabled v-model="dialogForm.rcMapAddr"></el-input>
          </el-form-item>
          <el-form-item label="救援地址"   label-width="150px" prop="rcAddr">
            <el-input disabled v-model="dialogForm.rcAddr"></el-input>
          </el-form-item>
          <el-form-item label="救援时间"   label-width="150px" prop="rcTime">
            <el-input disabled v-model="dialogForm.rcTime"></el-input>
          </el-form-item>
          <el-form-item label="预计救援里程"   label-width="150px" prop="rcMileage">
            <el-input disabled v-model="dialogForm.rcMileage"></el-input>
          </el-form-item>
          <el-form-item label="救援方案"   label-width="150px" prop="rcPlan">
            <el-input disabled v-model="dialogForm.rcPlan"></el-input>
          </el-form-item>
          <el-form-item label="配件明细"   label-width="150px" prop="billDetailListVo">
            <el-table
              :data="dialogForm.showListData.rescue"
              style="width: 100%"
              height="250">
              <el-table-column
                fixed
                prop="pdName"
                label="配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pdDesc"
                label="描述"
                width="120">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="救援配件费"   label-width="150px" prop="rcPdFee">
            <el-input disabled v-model="dialogForm.rcPdFee"></el-input>
          </el-form-item>
          <el-form-item label="救援工时费"   label-width="150px" prop="rcManHourFee">
            <el-input disabled v-model="dialogForm.rcManHourFee"></el-input>
          </el-form-item>
          <el-form-item label="救援费用"   label-width="150px" prop="rcFee">
            <el-input disabled v-model="dialogForm.rcFee"></el-input>
          </el-form-item>
          <el-form-item label="救援处理人"   label-width="150px" prop="rcHandleMan">
            <el-input disabled v-model="dialogForm.rcHandleMan"></el-input>
          </el-form-item>
          <el-form-item label="救援图片"   label-width="150px" prop="rcImgOne">
            <el-image style="width: 45%; float: left" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.rcImgOne" lazy></el-image>
            <el-image style="width: 45%; float: right" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.rcImgTwo" lazy></el-image>
          </el-form-item>

          <!--<el-form-item label="救援发生省份"   label-width="150px" prop="rcProvince">-->
          <!--<el-input disabled v-model="dialogForm.rcProvince"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="救援发生市"   label-width="150px" prop="rcCity">-->
          <!--<el-input disabled v-model="dialogForm.rcCity"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="救援发生县"   label-width="150px" prop="rcTown">-->
          <!--<el-input disabled v-model="dialogForm.rcTown"></el-input>-->
          <!--</el-form-item>-->
        </div>

        <div style="border: 1px solid #ccc; padding: 10px;margin-bottom: 10px;" v-show="dialogForm.showList.maintainBok" class="maintain">
          <el-form-item label="保养里程"   label-width="150px" prop="upkeepMileage">
            <el-input disabled v-model="dialogForm.upkeepMileage"></el-input>
          </el-form-item>
          <el-form-item label="保养方案"   label-width="150px" prop="upkeepPlan">
            <el-input disabled v-model="dialogForm.upkeepPlan"></el-input>
          </el-form-item>
          <el-form-item label="配件明细"  label-width="150px">
            <el-table
              :data="dialogForm.showListData.maintain"
              style="width: 100%"
              height="250">
              <el-table-column
                fixed
                prop="pdName"
                label="配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                width="120">
              </el-table-column>
              <el-table-column
                prop="pdDesc"
                label="描述"
                width="120">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="保养配件费"   label-width="150px" prop="upkeepPdFee">
            <el-input disabled v-model="dialogForm.upkeepPdFee"></el-input>
          </el-form-item>
          <el-form-item label="保养工时费"   label-width="150px" prop="upkeepManHourFee">
            <el-input disabled v-model="dialogForm.upkeepManHourFee"></el-input>
          </el-form-item>
          <el-form-item label="保养费用"   label-width="150px" prop="upkeepFee">
            <el-input disabled v-model="dialogForm.upkeepFee"></el-input>
          </el-form-item>
          <el-form-item label="保养处理人"   label-width="150px" prop="upkeepHandleMan">
            <el-input disabled v-model="dialogForm.upkeepHandleMan"></el-input>
          </el-form-item>
          <el-form-item label="保养照片"  label-width="150px">
            <el-image style="width: 45%; float: left" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.upkeepImgOne" lazy></el-image>
            <el-image style="width: 45%; float: right" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.upkeepImgTwo" lazy></el-image>
          </el-form-item>
        </div>
        <el-form-item label="单据总费用"   label-width="150px" prop="billFee">
          <el-input disabled placeholder="请输入单据总费用" v-model="dialogForm.billFee"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLookDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    billList,
    auditBill,
    billInfo
  } from '@/api/gskeeper/openingOrder/index'

  export default {
    name: 'openingOrder',
    data() {
      return {

        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入修配厂名称',
                inputModel: 'garageName',
                labelName: '修配厂名称',
                type: 'el-input',
                model: ''
              },
              {
                placeholder: '请输入车牌号',
                inputModel: 'carNo',
                labelName: '车牌号',
                model: '',
                type: 'el-input'
              },
              {
                width: '120px',
                placeholder: '请输入客户手机号',
                inputModel: 'mobile',
                labelName: '客户手机号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入客户名称',
                inputModel: 'memberName',
                labelName: '客户名称',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入单号',
                inputModel: 'repairBillNo',
                labelName: '单号',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'hasAuth',
                labelName: '是否是高山认证',
                model: '',
                type: 'el-select',
                options: [{
                  name: '全部',
                  status: ''
                },{
                  name: '是',
                  status: '1'
                },{
                  name: '不是',
                  status: '0'
                }]
              },
              {
                inputModel: 'billTypeList',
                labelName: '单据类型',
                model: '',
                multiple: true,
                type: 'el-select',
                options: [{
                  name: '维修',
                  status: '1'
                },{
                  name: '救援',
                  status: '2'
                },{
                  name: '保养',
                  status: '3'
                }]
              }
            ],
            button: [
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'repairBillNo',
            label: '单号'
          },
          {
            prop: 'carNo',
            label: '车牌号'
          },
          {
            prop: 'mobile',
            label: '客户手机'
          },
          {
            prop: 'memberName',
            label: '客户姓名'
          },
          {
            prop: 'garageName',
            label: '修配厂名称'
          },
          {
            prop: 'hasAuth',
            label: '高山认证',
            render: (row, index) => {
              return (
                <div>{row.hasAuth == 1 ? '是' :  '不是'}</div>
            )
            }
          },
          {
            prop: 'billFee',
            label: '单据总费用'
          },
          {
            prop: 'billType',
            label: '单据类型'
          },
          {
            prop: 'createTime',
            label: '开单时间'
          },
          // {
          //   prop: 'hasGua',
          //   label: '联保联服',
          //   render: (row, index) => {
          //     return (
          //       <div>{row.hasGua == 1 ? '是' : '不是'}</div>
          //     )
          //   }
          // },
          {
            button: true,
            label: '操作',
            width: '200px',
            group: [{
              // you can props => type size icon disabled plain
              name: '查看',
              type: 'info',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.look(row);
              }
            }, {
              // you can props => type size icon disabled plain
              name: '审核',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            }]
          }
        ],
        tableData: [],
        searchData: {
          billTypeList: [],
          garageName: ""
        },
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
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          showList: {
            repairBok: false,
            rescueBok: false,
            maintainBok: false
          },
          showListData: {
            repair: [],
            rescue: [],
            maintain: []
          }
        },
        dialogFormRules: {},
        dialogFormVisible: false,
        dialogFormLookVisible: false
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          },
          this.searchData
        );
        billList(params).then(res => {
          this.tableData = res.result.records;
          this.tableData.forEach(item => {
            let data = item.billType.split(',');
            let billTypeList = '';
            data.forEach(item => {
              if(item  == 1) {
                billTypeList += '维修,';
              }else if(item  == 2) {
                billTypeList += '救援,';
              }else if(item == 3) {
                billTypeList += '保养,';
              }
            })
            billTypeList = billTypeList.substring(0, billTypeList.length - 1);
            item.billType = billTypeList;
          });
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },

      // 审核
      dialogClick() {
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            this.btnLoading = true;
            let params = {
              id: this.dialogForm.id,
              hasAuth: this.dialogForm.hasAuth
            }
            auditBill(params)
              .then(res => {
                this.btnLoading = false;
                if (res.code == 200) {
                  this.cancelDialog();
                  this.getList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
              })
              .catch(err => {
                this.btnLoading = false;
              });
          }
        });
      },
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs["dialogForm"].resetFields();
      },
      cancelLookDialog() {
        this.dialogFormLookVisible = false;
        this.$refs['dialogForm'].resetFields();
      },

      // 列表页数更改
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getList();
      },
      // 列表条数更改
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList();
      },

      // 编辑调取方法
      edit(val) {
        this.formFun(val, "edit");
      },
      look(val) {
        this.formFun(val, "look");
      },

      // 编辑新增公共函数
      formFun(val, type) {
        let params = {
          id: val.id
        };

        billInfo(params).then(res => {
         this.dialogForm.id = val.id;
         this.dialogForm = Object.assign({
           showList: {
             repairBok: false,
             rescueBok: false,
             maintainBok: false
           },
           showListData: {
             repair: [],
             rescue: [],
             maintain: []
           }
         }, res.result);

         this.dialogForm.billDetailListVo.forEach(item  => {
           if(item.billType  == 1) {
             this.dialogForm.showListData.repair.push(item)
           }else if(item.billType  == 2){
             this.dialogForm.showListData.rescue.push(item)
           }else if(item.billType == 3) {
             this.dialogForm.showListData.maintain.push(item);
           }
         })
         if(type == 'edit') {
           this.dialogTitle = "审核";
           if(this.dialogForm.hasAuth == 1) {
             this.$notify.success({
               title: '该单据已经审核完成！',
               offset: 100
             });
           }else {
             this.dialogForm.hasAuth = 1;
             let data = this.dialogForm.billType.split(',');
             let billTypeList = '';
             data.forEach(item => {
               if(item  == 1) {
                 billTypeList += '维修,';
                 this.dialogForm.showList.repairBok = true;
               }else if(item  == 2) {
                 billTypeList += '救援,';
                 this.dialogForm.showList.rescueBok = true;
               }else if(item == 3) {
                 billTypeList += '保养,';
                 this.dialogForm.showList.maintainBok = true;
               }
             });
             this.dialogForm.billTypeList = billTypeList.substring(0, billTypeList.length - 1);
             this.dialogFormVisible = true;
           }
         }
         else {
           this.dialogTitle = "查看";
           let data = this.dialogForm.billType.split(',');
           let billTypeList = '';
           data.forEach(item => {
             if (item == 1) {
               billTypeList += '维修,';
               this.dialogForm.showList.repairBok = true;
             } else if (item == 2) {
               billTypeList += '救援,';
               this.dialogForm.showList.rescueBok = true;
             } else if (item == 3) {
               billTypeList += '保养,';
               this.dialogForm.showList.maintainBok = true;
             }

             this.dialogForm.billTypeList = billTypeList.substring(0, billTypeList.length - 1);
             this.dialogFormLookVisible = true;
           });
         }
        })
      },

      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      }
    }
  }
</script>

<style lang="sass">
  .labberConcessionsBox
    overflow: hidden
    margin: 20px 20px 0
</style>
