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
        新增/编辑弹框
      -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
        <el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
          <el-form-item label="车辆类型" label-width="150px" prop="typeId">
            <el-cascader
              style="width: 100%;"
              v-model="dialogForm.typeId"
              placeholder="请选择车辆类型"
              :options="searchModel[0].input[0].listOptions"
              clearable
              :props="searchModel[0].input[0].props"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <!--<el-form-item label="车型名称" label-width="150px" prop="typeName">-->
            <!--<el-input placeholder="请输入车型名称" v-model="dialogForm.typeName"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="车型编码"  label-width="150px" prop="typeCode">-->
            <!--<el-input placeholder="请输入车型编码" v-model="dialogForm.typeCode"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="保养里程" label-width="150px" prop="upkeepMileage">
            <el-input placeholder="请输入保养里程"  v-model="dialogForm.upkeepMileage"></el-input>
          </el-form-item>
          <el-form-item label="保养时限" label-width="150px" prop="upkeepTimeLimit">
            <el-input placeholder="请输入保养时限"  v-model="dialogForm.upkeepTimeLimit"></el-input>
          </el-form-item>
          <!--<el-form-item label="车型描述"   label-width="150px" prop="typeDesc">-->
            <!--<el-input placeholder="请输入车型描述" v-model="dialogForm.typeDesc"></el-input>-->
          <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    getVehicleTypeTree
  } from "@/api/gskeeper/vehicleType/index";
  import {
    selectVehicleTypeUpKeep,
    addVehicleTypeUpKeep,
    updateVehicleTypeUpKeep,
    getVehicleTypeUpKeepDetail,
    delVehicleTypeUpkeep
  } from "@/api/gskeeper/maintain/index";

  export default {
    name: 'maintain',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入车辆类型',
                inputModel: 'id',
                labelName: '车辆类型',
                model: [],
                props: {
                  children: 'childList',
                  label: 'typeName',
                  value: 'id'
                },
                listOptions: [],
                type: 'el-cascader'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '保养新增'
              },
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
            prop: 'typeCode',
            label: '车型编码'
          },
          {
            prop: 'typeName',
            label: '车型名称'
          },
          {
            prop: 'typeDesc',
            label: '车型描述'
          },
          {
            prop: 'upkeepTimeLimit',
            label: '保养时限'
          },
          {
            prop: 'upkeepMileage',
            label: '行驶里程'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            button: true,
            label: '操作',
            group: [{
              // you can props => type size icon disabled plain
              name: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            }, {
              name: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              hasPerm: 'sys:user:deleteUser',
              disabled: false,
              onClick: (row) => {
                this.del(row)
              }
            }]
          }
        ],
        tableData: [],
        searchData: {
          id: ''
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
          typeId: [],
          typeName: '',
          typeCode: '',
          typeDesc: '',
          upkeepMileage: '',
          upkeepTimeLimit: ''
        },
        dialogFormRules: {
          typeId: [
            {required: true,  message: '请选择车辆类型', trigger: 'blur'}
          ],
          typeName: [
            {required: true,  message: '请输入车型名称', trigger: 'blur'}
          ],
          typeCode: [
            {required: true,  message: '请输入车型编码', trigger: 'blur'}
          ],
          typeDesc: [
            {required: true,   message: '请输入车型描述', trigger: 'blur'}
          ],
          upkeepMileage: [
            {required: true,   message: '请输入保养里程', trigger: 'blur'}
          ],
          upkeepTimeLimit: [
            {required: true,  message: '请输入保养时限', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
    mounted() {
      // 筛选条件
      getVehicleTypeTree().then(res => {
        this.searchModel[0].input[0].listOptions = res.result.childList;
      })
    },
    methods: {
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        selectVehicleTypeUpKeep(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      // 搜索方法
      searchBtn(val) {
        if(val.id.length > 0) {
          this.searchData = {
            id: val.id[val.id.length - 1]
          };
        }else {
          this.searchData = {
            id: ''
          };
        }
        this.getList();
      },

      // 编辑调取方法
      edit(val) {
        this.formFun(val, 'edit')
      },
      // 新增调取方法
      addBtn() {
        this.formFun('', 'add')
      },
      // 编辑新增公共函数
      formFun(val, type) {
        if(type == 'add') {
          this.dialogTitle = '新增';
        }else {
          this.dialogTitle = '编辑';
          let params = {
            id: val.id
          };
          getVehicleTypeUpKeepDetail(params).then(res => {
            this.dialogForm = Object.assign({
              id: val.id,
              typeId: res.result.typeIdList
            }, res.result);
          })
        }
        this.dialogFormVisible = true;
      },

      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            let params = Object.assign({}, this.dialogForm);
            params.typeId = this.dialogForm.typeId[this.dialogForm.typeId.length - 1];
            if(this.dialogTitle == '新增') {
              addVehicleTypeUpKeep(params).then((res) => {
                if(res.code == 200) {
                  this.getList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
                this.btnLoading = false;
                this.cancelDialog();
              }).catch(err => {
                this.btnLoading = false;
              })
            }else {
              updateVehicleTypeUpKeep(params).then(res => {
                if(res.code == 200) {
                  this.getList();
                  this.$notify.success({
                    title: res.message,
                    offset: 100
                  });
                }
                this.btnLoading = false;
                this.cancelDialog();
              }).catch(err => {
                this.btnLoading = false;
              })
            }
          }
        });
      },
      // 取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs['dialogForm'].resetFields();
      },
      // 删除操作
      del(val) {
        this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              id: val.id
            }
            delVehicleTypeUpkeep(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                let params = Object.assign({
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize
                }, this.searchData);
                this.options.loading = true;
                selectVehicleTypeUpKeep(params).then((res) => {
                  if(res.result.records.length <= 0 && this.pagination.pageIndex  > 1) {
                    this.pagination.pageIndex --;
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
    }
  }
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
