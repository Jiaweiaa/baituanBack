<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 16:09:52
 * @LastEditTime: 2019-08-22 17:20:35
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="labberConcessionsBox">
    <!--
      wjw
    
      顶部搜索
     -->
    <div>
      <el-card class="filter-container" shadow="never" style="margin-top:20px;">
        <div style="margin-bottom: 20px; overflow: hidden; display: flex; align-items: center;">
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <div
              style="width: calc(100% - 100px); text-align: right; float: right;"
              :gutter="20">
            <div style="float: right;margin-right: 10px;">
              <el-button
                  size="small"
                  type="primary"
                  @click="searchBtn()">搜索</el-button>
            </div>
          </div>
        </div>
        <el-row :gutter="20" >
          <el-form :inline="true" class="demo-form-inline">
            <el-col>
              <el-form-item label="手机号"   labelWidth="100px">
                <el-input clearable v-model="searchData.mobile" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="姓名"   labelWidth="100px">
                <el-input clearable v-model="searchData.nickname" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="佣金类型"   labelWidth="100px">
                <el-select v-model="searchData.type" clearable placeholder="请选择级别">
                  <el-option
                      v-for="item in typeOption"
                      :key="item.status"
                      :label="item.name"
                      :value="item.status">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="城市中心"   labelWidth="100px">
                <el-select v-model="searchData.operationCenterId" @clear="clearOperation" @change="operationChange" filterable clearable placeholder="请选择城市中心">
                  <el-option
                      v-for="item in centerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="searchData.agentId"  @clear="clearAgent" @change="agentChange" filterable clearable placeholder="请选择人员">
                  <el-option
                      v-for="item in centerPeople"
                      :key="item.memberId"
                      :label="item.realName"
                      :value="item.memberId">
                  </el-option>
                </el-select>
                <el-select v-model="searchData.vipId" filterable clearable placeholder="请选择代理">
                  <el-option
                      v-for="item in memberList"
                      :key="item.memberId"
                      :label="item.realName"
                      :value="item.memberId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
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
      @selection-change="handleSelectionChange"
    />
    <!-- <div>
      <el-button  type="primary" @click="agreeWithdraw">同意提现</el-button>
    </div> -->
    
    <!--
			新增代理
    -->
    <el-dialog title="新增代理" :visible.sync="ratioVisible" :before-close="cancelDialog">
      <div style="display:flex;justify-content: center;">
        <el-input
          style="width:300px;"
          placeholder="请输入佣金比例"
          v-model="ratioObj.commissionRatio"
          clearable
        ></el-input>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="submitChangeRadio">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import {
  getCommisionLogPage,
  withdraw2WeChat,
  getMemberInfoByMobile,
  addFirstLevel,
  profitDistributionList,
  editRatio,
  getOperationCenterList,
  getListByOperationCenterId,
  getListByParentMemberId
} from "@/api/distribution/index";


export default {
  name: "name",
  data() {
    return {
      //用户手机号
      userMobile: "",
      userInfo: {},
  
      // 城市中心列表
      centerList: [],
      centerPeople: [],
      memberList: [],
      
      typeOption: [
        {
          name: "已到账",
          status: "1"
        },
        {
          name: "未到账",
          status: "2"
        },
        {
          name: "未结算",
          status: "3"
        }
      ],
      searchData: {
        mobile: '',
        nickname: '',
        type: '',
        operationCenterId: '',
        agentId: '',
        vipId: ''
      },

      // table和分页的数据
      columns: [
        {
          prop: "orderCode",
          label: "订单号",
          render: (row, index) => {
            return <span> {row.orderCode ? row.orderCode : "空"}</span>;
          }
        },
        {
          prop: "backMemberName",
          label: "一级返润",
          render: (row, index) => {
            return <span> {row.backMemberName ? row.backMemberName : "空"}</span>;
          }
        },
        {
          prop: "memberMobile",
          label: "电话",
          render: (row, index) => {
            return <span> {row.memberMobile ? row.memberMobile : "空"}</span>;
          }
        },
        {
          prop: "commision",
          label: "佣金",
          render: (row, index) => {
            return <span> {row.commision ? row.commision : 0}</span>;
          }
        },
        {
          prop: "backParentName",
          label: "二级返润",
          render: (row, index) => {
            return <span> {row.backParentName ? row.backParentName : "空"}</span>;
          }
        },
        {
          prop: "parentMobile",
          label: "电话",
          render: (row, index) => {
            return <span> {row.parentMobile ? row.parentMobile : "空"}</span>;
          }
        },
        {
          prop: "parentCommision",
          label: "佣金",
          render: (row, index) => {
            return <span> {row.parentCommision ? row.parentCommision : 0}</span>;
          }
        },
        {
          prop: "type",
          label: "是否到账",
          render: (row, index) => {
            return <span> {row.type ? row.type==1?"已到账" : row.type == 2 ? "未到账": '未结算' : '未知'}</span>;
          }
        },
        // {
        //   prop: "level",
        //   label: "级别",
        //   render: (row, index) => {
        //     return (
        //       <span>
        //         {" "}
        //         {row.level == 1
        //           ? "省代理"
        //           : row.level == 2
        //           ? "市代理"
        //           : row.level == 3
        //           ? "区代理"
        //           : "团代理"}
        //       </span>
        //     );
        //   }
        // },
        // {
        //   prop: "commissionRatio",
        //   label: "佣金比例"
        // },
        // {
        //   button: true,
        //   label: "操作",
        //   group: [
        //     {
        //       name: "同意提现",
        //       type: "primary",
        //       disabled: false,
        //       onClick: row => {
        //         this.editRate(row);
        //       }
        //     }
        //   ]
        // }
      ],
      ratioObj: {}, //佣金对象
      ratioVisible: false, //模态框是否显示
      tableData: [],

      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 5
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },

      btnLoading: false,
      dialogTitle: "",
      selectionArr:[],//已选择的数据
      // 编辑新增代理
      dialogForm: {
        level: "1",
        memberId: "",
        realName: "",
        status: "1"
      },
      dialogFormRules: {
        mobile: {
          required: true,
          message: "请输入手机号",
          trigger: "blur"
        },
        realName: {
          required: true,
          message: "请输入真实姓名",
          trigger: "blur"
        },
        code: {
          required: true,
          message: "请输入工号",
          trigger: "blur"
        }
      },
      dialogFormVisible: false,
      goodsLoading: false,
      goodsList: null,

      imgSrcBasic: "",
      articleList: [],
    };
  },
  created() {
    this.getCenterList();
  },
  components: {
    searchView,
    CommonTable
  },
  methods: {
    // 获取城市运营中心列表
    getCenterList() {
      getOperationCenterList().then(res => {
        this.centerList = res.result;
      })
    },
    // 城市运营中心改变
    operationChange() {
      this.clearOperation();
      if(this.searchData.operationCenterId) {
        getListByOperationCenterId({
          operationCenterId: this.searchData.operationCenterId
        }).then(res => {
          this.centerPeople = res.result;
        })
      }
    },
    // 根据运营中心改变
    agentChange() {
      this.clearAgent();
      this.searchData.vipId = '';
      if(this.searchData.agentId) {
        getListByParentMemberId({
          parentMemberId: this.searchData.agentId
        }).then(res => {
          this.memberList = res.result;
        })
      }
    },
  
    clearAgent() {
      this.memberList = [];
      this.searchData.vipId = '';
    },
    clearOperation() {
      this.centerPeople = [];
      this.memberList = [];
      this.searchData.vipId = '';
      this.searchData.agentId = '';
    },
    
    //一键同意提现
    agreeWithdraw(){
      let Ids = [];
      if(this.selectionArr.length>0){
        this.selectionArr.map((item) => {
          Ids.push(item.id)
        })
        let params = {
          ids:Ids
        }
        withdraw2WeChat(params).then((res) => {
        
        }).catch((err) => {
        
        });
      }
    },
    //编辑佣金比例
    editRate(row) {
      this.ratioObj = Object.assign({}, row);
      this.ratioVisible = true;
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
      getCommisionLogPage(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.options.loading = false;
      });
    },
    searchBtn() {
      this.pagination.pageIndex = 1;
      this.getList();
    },

    //确认修改佣金比例
    submitChangeRadio() {
      let params = {
        id: this.ratioObj.id,
        ratio: this.ratioObj.commissionRatio
      };
      editRatio(params)
        .then(res => {
          if (res.code == 200) {
            this.$alert(res.message, "结果", {
              confirmButtonText: "确定",
              callback: action => {
                this.ratioVisible = false;
              }
            });
          }
        })
        .catch(err => {});
    },

    // 取消修改佣金比例
    cancelDialog() {
      this.ratioObj = {};
      this.ratioVisible = false;
    },
    //多选
    handleSelectionChange(selection) {
      this.selectionArr = selection;
      // console.log(selection);
    },
  }
};
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
<style lang="sass">
	.avatar
		width: 178px
		height: 178px
		display: block
	.avatar-uploader .el-upload
		border: 1px dashed #d9d9d9
		border-radius: 6px
		cursor: pointer
		position: relative
		overflow: hidden
	.avatar-uploader .el-upload:hover
		border-color: #409EFF
	.avatar-uploader-icon
		font-size: 28px
		color: #8c939d
		width: 178px
		height: 178px
		line-height: 178px
		text-align: center
</style>
