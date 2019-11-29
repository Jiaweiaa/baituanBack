<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 16:09:52
 * @LastEditTime: 2019-10-18 14:02:38
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
              <el-button
                  size="small"
                  type="success"
                  @click="addBtn()">新增代理</el-button>
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
                <el-input clearable v-model="searchData.realName" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="级别"   labelWidth="100px">
                <el-select v-model="searchData.level" clearable placeholder="请选择级别">
                  <el-option
                      v-for="item in levelOptions"
                      :key="item.status"
                      :label="item.name"
                      :value="item.status">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态"   labelWidth="100px">
                <el-select v-model="searchData.status" clearable placeholder="请选择状态">
                  <el-option
                    v-for="item in statusOptions"
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
                <el-select v-model="searchData.agentId" filterable clearable placeholder="请选择人员">
                  <el-option
                    v-for="item in centerPeople"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id">
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
    />
    <!--
      新增代理
    -->
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <div style="display:flex;justify-content: center;">
        <el-input style="width:300px;" placeholder="请输入手机号" v-model="userMobile" clearable></el-input>
        <el-button type="primary" @click="searchUser">查询</el-button>
      </div>
      <el-form
        :model="dialogForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dialogFormRules"
        ref="dialogForm"
        v-if="dialogForm.memberId!=''"
      >
        <el-form-item label="分销等级" label-width="160px">
          <span>{{leave==1?'代理':'VIP'}}</span>
        </el-form-item>
        <el-form-item label="手机号" label-width="160px" prop="mobile">
          <span>{{dialogForm.mobile ? dialogForm.mobile : ''}}</span>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="160px" prop="realName">
          <span>{{dialogForm.realName ? dialogForm.realName: ''}}</span>
        </el-form-item>
        <el-form-item label="状态" label-width="160px" prop="status">
          <span v-if="dialogForm.status==1">可用</span>
          <span v-else>已被删除</span>
        </el-form-item>
	      <el-form-item label="选择运营中心" v-if="addTitle == '新增代理'" label-width="160px" prop="operationCenterId">
		      <el-select v-model="dialogForm.operationCenterId" filterable placeholder="请选择运营中心">
			      <el-option
				      v-for="center in centerList"
				      :key="center.id"
				      :label="center.name"
				      :value="center.id">
			      </el-option>
		      </el-select>
	      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加积分 -->
    <el-dialog title="发放补贴金" :visible.sync="addScoreDialog">
      <div style="display:flex;justify-content: center;">
        <el-input style="width:300px;" placeholder="输入补贴金金额" v-model="memberScore" clearable></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addScoreDialog=false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="submitAddScore">发放</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/Table";
import {
  getRelationShipListPage,
  getMemberInfoByMobile,
  addFirstLevel,
  updateRelationshipType,
  addOtherLevel,
  updateBStoreScore,
  getOperationCenterList,
  getListByOperationCenterId
} from "@/api/distribution/index";
export default {
  name: "name",
  data() {
    return {
      //用户手机号
      userMobile: "",
      userInfo: {},
      leave: 1,
      
      levelOptions: [
        {
          name: "代理",
          status: "1"
        },
        {
          name: "VIP",
          status: "2"
        }
      ],
  
      statusOptions: [
        {
          name: "可用",
          status: "1"
        },
        {
          name: "不可用",
          status: "3"
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "realName",
          label: "姓名",
          render: (row, index) => {
            return <span> {row.realName ? row.realName : "空"}</span>;
          }
        },
        {
          prop: "code",
          label: "工号",
          render: (row, index) => {
            return <span> {row.code ? row.code : "空"}</span>;
          }
        },
        {
          prop: "level",
          label: "级别",
          render: (row, index) => {
            return (
              <span>
                {" "}
                {row.level == 1
                  ? "代理"
                  : row.level == 2
                  ? "VIP"
                  : row.level == 3
                  ? "区代理"
                  : row.level == 4
                  ? "团代理"
                  : ""}
              </span>
            );
          }
        },
        {
          prop: "mobile",
          label: "手机号",
          render: (row, index) => {
            return <span> {row.mobile ? row.mobile : "空"}</span>;
          }
        },
        {
          prop: "score",
          label: "可用积分",
          render: (row, index) => {
            return <span> {row.score ? row.score : "0"}</span>;
          }
        },
        {
          prop: "status",
          label: "状态",
          render: (row, index) => {
            return <span> {row.status == 1 ? "可用" : "不可用"}</span>;
          }
        },
        {
          prop: "parentMemName",
          label: "上级名称",
          render: (row, index) => {
            return <span> {row.parentMemName}</span>;
          }
        },
        {
          prop: "parentMemMobile",
          label: "上级电话",
          render: (row, index) => {
            return <span> {row.parentMemMobile}</span>;
          }
        },
        {
          showLabel: true,
          prop: 'type',
          label: '爆品街开关',
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <p onClick={e => this.openStatus(e, row)}>
                 <el-switch activeValue={1} inactiveValue={0} v-model={row.type} active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </p>
            )
          }
        },
        {
          button: true,
          width: "330px",
          label: "操作",
          group: [
            {
              name: "新增商家",
              type: "success",
              icon: "el-icon-edit",
              disabled: false,
              onClick: row => {
                this.add(row);
              }
            },
            {
              name: "发放补贴金",
              type: "success",
              icon: "el-icon-edit",
              disabled: false,
              onClick: row => {
                this.addScore(row);
              }
            }
          ]
        }
      ],
      tableData: [],

      photoVisible: false,
      photoUrl: "",

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
      // 编辑新增代理
      dialogForm: {
        level: "1",
        memberId: "",
        realName: "",
        status: "1",
        operationCenterId: ''
      },
      dialogFormRules: {
        mobile: {
          required: true,
          message: "请输入手机号",
          trigger: "blur"
        },
        realName: {
          required: true,
          message: "该用户信息未完善,请完善后再进行操作",
          trigger: "blur"
        },
        code: {
          required: true,
          message: "请输入工号",
          trigger: "blur"
        },
        operationCenterId: {
          required: true,
          message: "请选择城市运营中心",
          trigger: "change"
        }
      },

	    // 新增标题
      addTitle: '',
	    // 城市中心列表
      centerList: [],
	    centerPeople: [],
	    
      // 类型
      parentData: "",
      addType: "",
      dialogFormVisible: false,
      goodsLoading: false,
      goodsList: null,
      memberId: "", //
      memberScore: "",
      addScoreDialog: false,
      imgSrcBasic: "",
      articleList: [],
  
      searchData: {
        mobile: '',
        realName: '',
        level: '',
        status: '',
        operationCenterId: '',
        agentId: ''
      }
    };
  },
  components: {
    CommonTable
  },
	created() {
    this.getCenterList();
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
      this.centerPeople = [];
      if(this.searchData.operationCenterId) {
        getListByOperationCenterId({
          operationCenterId: this.searchData.operationCenterId
        }).then(res => {
          this.centerPeople = res.result;
        })
      }
    },
    clearOperation() {
      this.centerPeople = [];
	    this.searchData.agentId = '';
    },
    // 编辑新增公共函数
    formFun(val, type) {
      if (type == "add") {
        this.dialogTitle = "新增";
      } else {
        this.dialogTitle = "编辑";
        this.dialogForm.id = val.id;
        this.dialogForm.imgName = val.imgName;
        this.dialogForm = Object.assign({}, val);
      }
      this.dialogFormVisible = true;
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
      getRelationShipListPage(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    openStatus(e, row) {
      let inBok = Object.assign({}, row);
      console.log(inBok)
      let params = {
        memberId: inBok.memberId,
        type: inBok.type
      }
      updateRelationshipType(params).then((res) => {
        if(res.code == 200) {
          this.$notify({
            title: res.message,
            type: 'success'
          });
        }else {
          this.getList();
        }
      });
      e.cancelBubble = true // 停止冒泡，否则会触发 row-click
    },
    searchBtn() {
      this.getList();
    },

    //根据手机号查询平台用户
    async searchUser() {
      let params = {
        mobile: this.userMobile
      };
      const res = await getMemberInfoByMobile(params);
      if (res.result[0]) {
        this.dialogForm.mobile = res.result[0].mobile;
        this.dialogForm.realName = res.result[0].lastName;
        this.dialogForm.memberId = res.result[0].memberId;
      } else {
        this.$notify.error({
          title: "暂无相关数据",
          offset: 100
        });
      }
    },
    // 新增
    addBtn() {
      this.leave = 1;
      this.addType = 1;
      this.dialogFormVisible = true;
      this.addTitle = '新增代理';
    },

    // 取消新增
    cancelDialog() {
      this.goodsList = null;
      this.userMobile = "";
      this.dialogFormVisible = false;
      this.dialogForm = {
        level: "1",
        memberId: "",
        realName: "",
        status: "1"
      };
    },
    // 新增
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          let funName = "";
          if (this.addType == 1) {
            funName = addFirstLevel;
          } else {
            funName = addOtherLevel;
            this.dialogForm.parentMemberId = this.parentData.memberId;
            this.dialogForm.parentMemName = this.parentData.realName;
            this.dialogForm.parentMemMobile = this.parentData.mobile;
            this.dialogForm.level = Number(this.parentData.level) + 1;
          }
          funName(this.dialogForm)
            .then(res => {
              if (res.code == 200) {
                this.cancelDialog();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.goodsList = null;
                this.getList();
              } else {
                this.$notify.error({
                  title: res.message,
                  offset: 100
                });
              }
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },

    // 新增子代理
    add(val) {
      this.addTitle = '新增商家';
      // this.leave =1;
      if (val.level == 2) {
        this.$message.error("该店铺无法添加下级!");
        return;
      }
      if (val) {
        this.leave = 2;
      }
      this.addType = 2;
      this.parentData = val;
      this.dialogFormVisible = true;
    },
    addScore(val) {
      this.memberId = "";
      this.memberScore = "";
      this.memberId = val.memberId;
      this.addScoreDialog = true;
    },
    submitAddScore() {
      if (this.memberScore == "") return;
      let params = {
        memberId: this.memberId,
        score: this.memberScore
      };
      this.btnLoading = true;
      updateBStoreScore(params)
        .then(res => {
          if (res.code == 200) {
            this.$message(res.message);
            this.addScoreDialog = false;
            this.btnLoading = false;
            this.getList();
          }
        })
        .catch(err => {});
    },

    // 单选改变
    radioChange(val) {
      this.dialogForm.codes = "";
      this.goodsList = null;
    }
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
