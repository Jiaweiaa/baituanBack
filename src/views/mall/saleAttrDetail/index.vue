<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="margin-top:20px;">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          class="filter-item"
          @click="filterData(searchForm)"
          type="primary"
          icon="el-icon-search"
          size="small"
        >查询</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="searchForm" size="small" label-width="140px">
          <el-form-item label="选择属性名称：">
            <el-input
              @keyup.enter.native="filterData(searchForm)"
              v-model="searchForm.value"
              clearable
              placeholder="输入搜索条件"
              style="width: 200px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin-top:20px;">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="openDialog('add')"
        size="small"
      >添加</el-button>
    </el-card>

    <!-- 列表及分页 -->
    <div style="margin-top:20px;">
      <CommonTable
        :columns="columns"
        :dataSource="realList"
        :options="options"
        :fetch="getData"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      />
    </div>
    <!-- 表单模态框 -->
    <el-dialog title="新建属性" :visible.sync="FormDialog" v-if="FormDialog">
      <el-form
        :model="saveForm"
        status-icon
        :rules="addFormRules"
        ref="saveForm"
        label-width="150px"
      >
        <el-form-item label="属性值" prop="value">
          <el-input
            @change="aysynDisplayName"
            v-model="saveForm.value"
            clearable
            style="width: 200px;"
            class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户可见值" prop="displayValue">
          <el-input
            v-model="saveForm.displayValue"
            clearable
            style="width: 200px;"
            class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="saveForm.sort" clearable style="width: 200px;" class="filter-item"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormDialog = false">取 消</el-button>
        <el-button type="primary" @click="SubmitForm('saveForm')">确 定</el-button>
      </div>
      <el-dialog width="30%" title="新建分组" :visible.sync="innerVisible" append-to-body>
        <el-input v-model="newSelect" clearable style="width: 200px;" class="filter-item"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSelect">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import CommonTable from "@/components/Table";
import {
  toSaveOrUpdate,
  propertyValuesListData,
  delPropertyValue,
  saveOrUpdatePropertyValue,
  checkPropertyValueValue,
  checkPropertyValueDisplayValue,
  checkPropertyValueSort
} from "@/api/mall/saleAttrDetail";

export default {
  name: "saleAttrDetail",
  components: {
    CommonTable
  },
  data() {
    let asyncValue = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入属性值"));
      } else if (value == this.finalValue) {
        return callback();
      } else {
        let params = {
          value: this.saveForm.value,
          propertyType: this.saveForm.propertyType,
          propertyId: this.initForm.propertyId
        };
        checkPropertyValueValue(params)
          .then(res => {
            if (res.code == "200" && res.result == true) {
              return callback();
            } else {
              return callback(new Error("属性值已存在"));
            }
          })
          .catch(err => {});
      }
    };
    let asyncDisplayValue = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入属性值可见值"));
      } else if (value == this.finalDisplayValue) {
        return callback();
      } else {
        let params = {
          displayValue: this.saveForm.displayValue,
          propertyType: this.saveForm.propertyType,
          propertyId: this.initForm.propertyId,
          groupName: this.saveForm.groupName
        };
        checkPropertyValueDisplayValue(params)
          .then(res => {
            if (res.code == "200" && res.result == true) {
              callback();
            } else {
              callback(new Error("用户可见值已存在"));
            }
          })
          .catch(err => {});
      }
    };
    let asyncSort = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入属性值排序"));
      } else if (value == this.finalSort) {
        return callback();
      } else {
        let params = {
          sort: this.saveForm.sort,
          propertyType: this.saveForm.propertyType,
          propertyId: this.initForm.propertyId
        };
        checkPropertyValueSort(params)
          .then(res => {
            if (res.code == "200" && res.result == true) {
              callback();
            } else {
              callback(new Error("排序号已存在"));
            }
          })
          .catch(err => {});
      }
    };
    return {
      //表格列属性
      columns: [
        {
          prop: "sort",
          label: "排序号",
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <span style="color: blue" onClick={e => this.handleClick(e, row)}>
                {row.sort}
              </span>
            );
          }
        },
        {
          prop: "value",
          label: "属性值"
        },
        {
          prop: "displayValue",
          label: "用户可见值-CN"
        },
        {
          button: true,
          label: "操作",
          group: [
            {
              // you can props => type size icon disabled plain
              circle: true,
              type: "primary",
              icon: "el-icon-edit",
              plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this.saveForm = Object.assign({}, row);
                this.saveForm.propertyType = this.propertyType;
                this.finalValue = row.value;
                this.finalDisplayValue = row.displayValue;
                this.finalSort = row.sort;
                // console.log(this.saveForm.editType);
                this.openDialog("edit");
              }
            },
            {
              circle: true,
              type: "danger",
              icon: "el-icon-delete",
              onClick: row => {
                // console.log(row);
                this.deleteSubmit(row.id);
              }
            }
          ]
        }
      ],

      tableData: [], //列表数据(接口获取)
      realList: [], //真实渲染数据
      groupList: [], //属性分组下拉数据

      searchForm: {
        value: ""
      },
      saveForm: {
        propertyId: "", //属性ID
        propertyType: "", //属性类型
        value: "",
        displayValue: "",
        sort: "3"
      }, //
      propertyType: "",
      //初始表单
      initForm: {
        value: "",
        displayValue: "",
        sort: "",
        propertyId: "", //属性ID
        propertyType: "" //属性类型
      },
      options: {
        //列表配置项
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      FormDialog: false, //表单模态框是否显示
      from: "", //通过哪个功能按钮打开表单
      addFormRules: {
        value: [
          {
            required: true,
            message: "请输入属性值",
            trigger: "blur"
          },
          { validator: asyncValue, trigger: "blur" }
        ],
        displayValue: [
          {
            required: true,
            message: "请输入属性值可见值",
            trigger: "blur"
          },
          { validator: asyncDisplayValue, trigger: "blur" }
        ],
        sort: [
          {
            required: true,
            message: "请输入属性值排序",
            trigger: "blur"
          },
          { validator: asyncSort, trigger: "blur" }
        ]
      },
      finalValue: "",
      finalDisplayValue: "",
      finalSort: "",
      newSelect: "", //新建分组本地变量
      innerVisible: false //内层模态框是否打开
    };
  },
  methods: {
    aysynDisplayName(val) {
      this.saveForm.displayValue = val;
    },
    /**
     * @获取列表
     */
    getData() {
      this.options.loading = true;
      let params = { propertyId: this.saveForm.propertyId };
      propertyValuesListData(params)
        .then(res => {
          // console.log(res);
          if (res.code == "200") {
            this.tableData = res.result;
            this.realList = this.tableData;
            console.log(res.result);
          }
          this.options.loading = false;
        })
        .catch(err => {
          this.options.loading = false;
        });
    },
    /**
     * @筛选
     */
    filterData(val) {
      let value = this.searchForm.value;
      // console.log(value);
      
        this.realList = this.tableData.filter(v => {
          // console.log(v.value);
          if (v.value.includes(value)) {
            // console.log(name);
            // console.log(11);
            return v;
          }
        });
        // console.log(this.tableData);
      
      
    },

    handleClick(e, row) {
      //transform-vue-jsx 的nativeOnClick 失效 , 所以采用 event.cancelBubble 控制点击事件的冒泡... 如果点击事件不影响你的点击行事件，可以不传
      e.cancelBubble = true; // 停止冒泡，否则会触发 row-click
      console.log(row);
    },
    handleRowClick(row, event, column) {
      // 点击行的事件，同理可以绑定其他事件
      console.log("click row:", row, event, column);
    },
    handleSelectionChange(selection) {
      console.log(selection);
    },
    /**
     * @新建分类
     */
    addSelect() {
      this.groupList.push(this.newSelect);
      this.groupList = Array.from(new Set(this.groupList)); //数组去重
      this.newSelect = "";
      this.innerVisible = false;
    },
    /**
     * @打开表单模态框
     */
    openDialog(from) {
      this.$nextTick(() => {
        if (from == "add") {
          this.saveForm = Object.assign({}, this.initForm);
          console.log(this.saveForm.editType);
        }
        this.from = from;
        this.FormDialog = true;
      });
    },
    /**
     * @提交添加表单
     */
    SubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.from == "add") {
            saveOrUpdatePropertyValue(this.saveForm)
              .then(res => {
                console.log(res);
                if (res.code == "200") {
                  this.$message({
                    message: res.message,
                    type: "success"
                  });
                  this.getData();
                  this.FormDialog = false;
                  this.resetForm("saveForm");
                  
                } else {
                  this.$message(res.message);
                }
              })
              .catch(err => {
                this.resetForm("saveForm");
                this.FormDialog = false;
              });
          } else {
            saveOrUpdatePropertyValue(this.saveForm)
              .then(res => {
                // console.log(res);
                if (res.code == "200") {
                  this.$message({
                    message: res.message,
                    type: "success"
                  });
                  this.getData();
                  
                  this.resetForm("saveForm");
                } else {
                  this.$message(res.message);
                }
                this.FormDialog = false;
              })
              .catch(err => {
                this.resetForm("saveForm");
                this.FormDialog = false;
              });
          }
        } else {
          alert("没通过");
        }
      });
    },
    /**
     * @删除属性
     */
    deleteSubmit(paramsId) {
      console.log(paramsId);
      this.$confirm("此操作将永久删除该属性值, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delPropertyValue({
            id: paramsId,
            propertyId: this.saveForm.propertyId
          })
            .then(res => {
              if (res.code == "200") {
                this.$message({
                  message: res.message
                });
                this.getData();
              } else {
                this.$message(res.message);
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          savePropertyValue(this.saveForm)
            .then(res => {
              console.log(res);
              if (res.code == "200") {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.getData();
                this.addFormDialog = false;
                this.resetForm("saveForm");
              } else {
                this.$message(res.message);
              }
            })
            .catch(err => {
              this.resetForm("saveForm");
              this.addFormDialog = false;
            });
        } else {
          alert("没通过");
        }
      });
    },
    /**
     * @清空表单方法
     */

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.saveForm.propertyId = this.$route.query.propertyId;
    this.initForm.propertyId = this.$route.query.propertyId;
    if (this.saveForm.propertyId != "") {
      toSaveOrUpdate({ propertyId: this.saveForm.propertyId })
        .then(res => {
          if (res.code == "200") {
            this.saveForm.propertyType = res.result.type;
            this.propertyType = res.result.type;
            this.initForm.propertyType = res.result.type;
          }
        })
        .catch(err => {});
    } else {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.el-switch__input:focus ~ .el-switch__core {
  outline: none !important;
}
</style>
