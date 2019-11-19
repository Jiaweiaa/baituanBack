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
        审批框
      -->
      <el-dialog :title="dialogTitle"  :visible.sync="dialogFormVisible" :before-close="cancelDialog">
        <el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
          <el-form-item label="车辆车牌号" label-width="200px" prop="carNo">
            <el-input disabled v-model="dialogForm.carNo"></el-input>
          </el-form-item>
          <el-form-item label="会员手机号" label-width="200px" prop="memberMobile">
            <el-input disabled v-model="dialogForm.memberMobile"></el-input>
          </el-form-item>
          <el-form-item label="会员名称" label-width="200px" prop="memberName">
            <el-input disabled v-model="dialogForm.memberName"></el-input>
          </el-form-item>
          <el-form-item label="修配厂名称" label-width="200px" prop="garageName">
            <el-input disabled v-model="dialogForm.garageName"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型" label-width="200px" prop="carType">
            <el-input disabled v-model="dialogForm.carType"></el-input>
          </el-form-item>
          <el-form-item label="当前公里数" label-width="200px" prop="mileage">
            <el-input disabled v-model="dialogForm.mileage"></el-input>
          </el-form-item>
          <el-form-item label="月均里程" label-width="200px" prop="monthMileage">
            <el-input disabled v-model="dialogForm.monthMileage"></el-input>
          </el-form-item>
          <el-form-item  label="下次保养时间" label-width="200px" prop="nextUpkeepDate">
            <el-input disabled v-model="dialogForm.nextUpkeepDate"></el-input>
          </el-form-item>
          <el-form-item  label="新增会员时间" label-width="200px" prop="createTime">
            <el-input disabled v-model="dialogForm.createTime"></el-input>
          </el-form-item>
          <el-form-item  label="车辆照片1" label-width="200px" prop="carPosImg">
            <el-image
              style="width: 90%;"
              :src="'http://qn.gaoshanmall.cn/'+ dialogForm.carNegImg">
            </el-image>
          </el-form-item>
          <el-form-item  label="车辆照片2" label-width="200px" prop="carPosImg">
            <el-image
              style="width: 90%;"
              :src="'http://qn.gaoshanmall.cn/'+ dialogForm.carPosImg"
            ></el-image>
          </el-form-item>
          <div style="width: 100%; background: #ccc; height: 1px;"></div>
          <el-form-item label="高山会员" label-width="200px" prop="isPass">
            <el-radio-group v-model="dialogForm.isPass" size="small">
              <el-radio :label="1" border>通过</el-radio>
              <el-radio :label="0" border>不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  label="驳回原因" label-width="200px" prop="rejectReason">
            <el-input v-model="dialogForm.rejectReason"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
        </div>
      </el-dialog>


      <!--
        查看
      -->
      <el-dialog :title="dialogTitle"  :visible.sync="dialogFormLookVisible" :before-close="cancelLookDialog">
        <el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
          <el-form-item label="车辆车牌号" label-width="200px" prop="carNo">
            <el-input disabled v-model="dialogForm.carNo"></el-input>
          </el-form-item>
          <el-form-item label="会员手机号" label-width="200px" prop="memberMobile">
            <el-input disabled v-model="dialogForm.memberMobile"></el-input>
          </el-form-item>
          <el-form-item label="会员名称" label-width="200px" prop="memberName">
            <el-input disabled v-model="dialogForm.memberName"></el-input>
          </el-form-item>
          <el-form-item label="修配厂名称" label-width="200px" prop="garageName">
            <el-input disabled v-model="dialogForm.garageName"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型" label-width="200px" prop="carType">
            <el-input disabled v-model="dialogForm.carType"></el-input>
          </el-form-item>
          <el-form-item label="当前公里数" label-width="200px" prop="mileage">
            <el-input disabled v-model="dialogForm.mileage"></el-input>
          </el-form-item>
          <el-form-item label="月均里程" label-width="200px" prop="monthMileage">
            <el-input disabled v-model="dialogForm.monthMileage"></el-input>
          </el-form-item>
          <el-form-item  label="下次保养时间" label-width="200px" prop="nextUpkeepDate">
            <el-input disabled v-model="dialogForm.nextUpkeepDate"></el-input>
          </el-form-item>
          <el-form-item  label="新增会员时间" label-width="200px" prop="createTime">
            <el-input disabled v-model="dialogForm.createTime"></el-input>
          </el-form-item>
          <el-form-item  label="车辆照片1" label-width="200px" prop="carPosImg">
            <el-image style="width: 90%;" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.carNegImg" lazy></el-image>
          </el-form-item>
          <el-form-item  label="车辆照片2" label-width="200px" prop="carPosImg">
            <el-image style="width: 90%;" :src="'http://qn.gaoshanmall.cn/'+ dialogForm.carPosImg" lazy></el-image>
          </el-form-item>
          <div v-if="dialogForm.hasGs == 0">
            <el-form-item label="高山会员" label-width="200px" prop="isPass">
              <el-radio-group disabled v-model="dialogForm.hasGs" size="small">
                <el-radio :label="1" border>通过</el-radio>
                <el-radio :label="0" border>不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item  label="驳回原因" label-width="200px" prop="rejectReason">
              <el-input disabled v-model="dialogForm.rejectReason"></el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item  label="审核时间" label-width="200px" prop="auditDate">
              <el-input disabled v-model="dialogForm.auditDate"></el-input>
            </el-form-item>
          </div>
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
    comMemList,
    auditGsMem,
    comMemPage
  } from '@/api/gskeeper/ordinaryMember/index'

  export default {
    name: 'ordinaryMember',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入车辆车牌号',
                inputModel: 'carNo',
                labelName: '车辆车牌号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入修配厂名称',
                inputModel: 'garageName',
                labelName: '修配厂名称',
                model: '',
                type: 'el-input'
              },
              {
                width: '120px',
                placeholder: '请输入会员注册手机号',
                inputModel: 'memberMobile',
                labelName: '会员注册手机号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入会员名称',
                inputModel: 'memberName',
                labelName: '会员名称',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'hasGs',
                labelName: '是否是高山会员',
                model: '',
                type: 'el-select',
                options: [{
                  name: '全部',
                  status: ''
                },{
                  name: '是',
                  status: 1
                }, {
                  name: '不是',
                  status: 0
                }]
              }
            ],

            button: [{
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
            prop: 'carNo',
            label: '车辆车牌号'
          },
          {
            prop: 'memberMobile',
            label: '会员手机号'
          },
          {
            prop: 'memberName',
            label: '会员名称'
          },
          {
            prop: 'garageName',
            label: '所属修配厂名称 '
          },
          {
            showLabel: true,
            prop: 'hasGs',
            label: '会员类型',
            // render 可以根据你想要渲染的方式渲染
            // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
            // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
            render: (row, index) => {
              return (
                <div>{row.hasGs == 0 ? '普通会员' : '高山会员'}</div>
            )
            }
          },
          {
            prop: 'carType',
            label: '车辆类型'
          },
          {
            prop: 'mileage',
            label: '车辆当前里程'
          },
          {
            prop: 'monthMileage',
            label: '月均里程'
          },
          {
            prop: 'nextUpkeepDate',
            label: '下一次保养日期'
          },
          {
            prop: 'createTime',
            label: '新增会员日期'
          },
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
              name: '审批',
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
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          memberName: '',
          memberMobile: '',
          carNo: '',
          carType: '',
          garageName: '',
          mileage: '',
          lastUpkeepDate: '',
          hasGs: '',
          rejectReason: ''
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
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        comMemList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },

      look(val) {
        this.dialogTitle = '查看';
        let params = {
          id: val.id
        }
        comMemPage(params).then(res => {
          this.dialogForm = Object.assign({
            id : val.id
          }, res.result);
          this.dialogFormLookVisible = true;
        });
      },
      cancelLookDialog() {
        this.dialogFormLookVisible = false;
        this.$refs['dialogForm'].resetFields();
      },
      // 编辑调取方法
      edit(val) {
        this.dialogTitle = '审批';
        let params = {
          id: val.id
        }
        comMemPage(params).then(res => {
          this.dialogForm = Object.assign({
            id : val.id,
            isPass: 1
          }, res.result);
          if(this.dialogForm.hasGs == 0) {
            this.dialogFormVisible = true;
          }else {
            this.$notify.success({
              title: '该用户已经是高山会员',
              offset: 100
            });
          }
        });
      },

      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },

      // 审批
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            auditGsMem(this.dialogForm).then((res) => {
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              this.cancelDialog();
              this.getList();
              this.btnLoading = false;
            }).catch(err => {
              this.btnLoading = false;
            })

          }
        });
      },
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs['dialogForm'].resetFields();
      }
    }
  }
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
