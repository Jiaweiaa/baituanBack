<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 16:09:52
 * @LastEditTime: 2019-08-22 17:19:19
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
    <div>
      <el-button  type="primary" @click="agreeWithdraw">同意提现</el-button>
    </div>
    
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
  getWithdrawPage,
  withdraw2WeChat,
  getMemberInfoByMobile,
  addFirstLevel,
  profitDistributionList,
  editRatio
} from "@/api/distribution/index";
export default {
  name: "name",
  data() {
    return {
      //用户手机号
      userMobile: "",
      userInfo: {},
      // 搜索table渲染的数据
      searchModel: [
        {
          input: [
            {
              placeholder: "请输入手机号",
              inputModel: "mobile",
              labelName: "手机号",
              model: "",
              type: "el-input"
            },
            {
              placeholder: "请输入昵称",
              inputModel: "nickname",
              labelName: "用户",
              model: "",
              type: "el-input"
            },

            {
              placeholder: "提现状态",
              inputModel: "status",
              labelName: "提现状态",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "提现中",
                  status: "1"
                },
                {
                  name: "提现成功",
                  status: "2"
                }
              ]
            },
            {
              placeholder: "提现类型",
              inputModel: "type",
              labelName: "提现类型",
              model: "",
              type: "el-select",
              options: [
                {
                  name: "微信",
                  status: "1"
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

      // table和分页的数据
      columns: [
        {
          prop: "nickname",
          label: "用户",
          render: (row, index) => {
            return <span> {row.nickname ? row.nickname : "空"}</span>;
          }
        },
        {
          prop: "mobile",
          label: "手机",
          render: (row, index) => {
            return <span> {row.mobile ? row.mobile : "空"}</span>;
          }
        },
        {
          prop: "amount",
          label: "金额",
          render: (row, index) => {
            return <span> {row.amount ? row.amount : "空"}</span>;
          }
        },
        {
          prop: "type",
          label: "提现类型",
          render: (row, index) => {
            return <span> {row.type==1 ? '微信' : "未知"}</span>;
          }
        },
        {
          prop: "status",
          label: "提现状态",
          render: (row, index) => {
            return <span> {row.status==1 ? '提现中' : "提现成功"}</span>;
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
        mutiSelect: true,
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
      articleList: []
    };
  },
  created() {},
  components: {
    searchView,
    CommonTable
  },
  methods: {
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
      this.options.pageIndex = 1;
      let params = Object.assign(
        {
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        },
        this.searchData
      );
      getWithdrawPage(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    searchBtn(val) {
      this.searchData = val;
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
