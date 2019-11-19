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
          <el-form-item label="选择属性分组：">
            <el-select
              clearable
              placeholder="请选择属性分组"
              style="width: 190px"
              v-model="searchForm.groupName"
              class="filter-item"
            >
              <el-option v-for="item in groupList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择属性类型：">
            <el-select
              clearable
              placeholder="请选择属性类型"
              style="width: 190px"
              v-model="searchForm.editType"
              class="filter-item"
            >
              <el-option
                v-for="item in nameList"
                :key="item.label"
                :label="item.label"
                :value="item.editType"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择是否颜色：">
            <el-select
              clearable
              placeholder="请选择是否颜色："
              style="width: 190px"
              v-model="searchForm.isColor"
              class="filter-item"
            >
              <el-option
                v-for="item in isColorList"
                :key="item.label"
                :label="item.label"
                :value="item.isColor"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输入属性名称：">
            <el-input
              @keyup.enter.native="filterData(searchForm)"
              v-model="searchForm.name"
              clearable
              style="width: 200px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="属性名称可见值：">
            <el-input
              @keyup.enter.native="filterData(searchForm)"
              v-model="searchForm.displayName"
              clearable
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
      <CommonTable :columns="columns" :dataSource="realList" :options="options" :fetch="getData"/>
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
        <el-form-item label="属性分组" prop="groupName">
          <el-select
            clearable
            placeholder="请选择属性分组"
            style="width: 190px"
            v-model="saveForm.groupName"
            filterable
            class="filter-item"
          >
            <el-option v-for="item in groupList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span @click="innerVisible = true">
            <i class="el-icon-plus" style="cursor: pointer;">新建分组</i>
          </span>
        </el-form-item>
        <el-form-item label="属性类型" prop="editType">
          <el-radio-group v-model="saveForm.editType">
            <el-radio :label="3">普通属性</el-radio>
            <el-radio :label="5">高级属性</el-radio>
            <el-radio :label="4">无值属性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="该属性是不是颜色" prop="isColor">
          <el-tooltip :content="saveForm.isColor==true? '是':'否'" placement="top">
            <el-switch v-model="saveForm.isColor"></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="属性名称" prop="name">
          <el-input
            v-model="saveForm.name"
            @change="aysynDisplayName"
            clearable
            style="width: 200px;"
            class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="属性名称可见值" prop="displayName">
          <el-input
            v-model="saveForm.displayName"
            clearable
            style="width: 200px;"
            class="filter-item"
          ></el-input>
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
  propertyListData,
  groupNameListData,
  saveProperty,
  delProperty,
  checkPropertyName,
  checkPropertyDisplayName,
  propertyValuesListData,
  updateProperty
} from "@/api/mall/saleAttr";

export default {
  name: "saleAttr",
  components: {
    CommonTable
  },
  data() {
    let asyncName = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入属性名称"));
      } else if (value == this.finalName) {
        return callback();
      } else {
        let params = {
          name: this.saveForm.name,
          type: 2
        };
        checkPropertyName(params)
          .then(res => {
            if (res.code == "200") {
              return callback();
            } else {
              return callback(new Error(res.message));
            }
          })
          .catch(err => {});
      }
    };
    let asyncDisplayName = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入属性名可见值"));
      } else if (value == this.finalDisplayName) {
        return callback();
      } else {
        let params = {
          displayName: this.saveForm.displayName,
          groupName: this.saveForm.groupName,
          type: 2
        };
        checkPropertyDisplayName(params)
          .then(res => {
            if (res.code == "200") {
              callback();
            } else {
              callback(new Error(res.message));
            }
          })
          .catch(err => {});
      }
    };
    return {
      columns: [
        //表格列属性
        {
          prop: "groupName",
          label: "属性分组",
          width: 160
        },
        {
          prop: "type",
          label: "属性类型",
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <span style="color: blue" onClick={e => this.handleClick(e, row)}>
                {row.cnProp}
              </span>
            );
          }
        },
        {
          prop: "isColor",
          label: "是否颜色",
          render: (row, index) => {
            return (
              <span style="color: blue" onClick={e => this.handleClick(e, row)}>
                {row.isColor == true ? "是" : "否"}
              </span>
            );
          }
        },
        {
          prop: "name",
          label: "属性名称"
        },
        {
          prop: "displayName",
          label: "属性名称可见值-CN"
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
                this.finalName = row.name;
                this.finalDisplayName = row.displayName;
                console.log(this.saveForm.editType);
                this.openDialog("edit");
              }
            },
            {
              circle: true,
              type: "danger",
              icon: "el-icon-delete",
              onClick: (row, index) => {
                // 这种写法的 this 代表 group 里的对象
                // console.log(row);
                this.deleteSubmit(row.id);
              }
            },
            {
              name: "查看属性值",
              circle: true,
              type: "success",
              icon: "el-icon-view",
              onClick: row => {
                // console.log(row);
                this.$router.push({
                  path: "/mall/saleAttrDetail",
                  query: {
                    propertyId: row.id
                  }
                });
              }
            }
          ]
        }
      ],
      tableData: [], //列表数据(接口获取)
      realList: [], //实际渲染列表数据
      groupList: [], //属性分组下拉数据
      nameList: [
        //属性类型下拉表
        {
          editType: 3,
          label: "普通属性"
        },
        {
          editType: 5,
          label: "高级属性"
        },
        {
          editType: 4,
          label: "无值属性"
        }
      ],
      isColorList: [
        //是否颜色下拉表
        {
          isColor: true,
          label: "是"
        },
        {
          isColor: false,
          label: "否"
        }
      ],
      searchForm: {
        name: "", // 属性名称,
        displayName: "", //属性可见值
        editType: null, //属性类型
        groupName: null, //属性分组
        isColor: null //是否颜色
      },
      //初始表单
      initForm: {
        name: "",
        displayName: "",
        editType: 3,
        isColor: false,
        groupName: "默认分组"
      },
      //需要提交的表单
      saveForm: {
        name: "",
        displayName: "",
        editType: 3,
        isColor: false,
        groupName: ""
      }, //
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
        //添加表单校验规则
        groupName: [
          { required: true, message: "请选择属性分组", trigger: "blur" }
        ],
        editType: [
          { required: true, message: "请选择属性类型", trigger: "change" }
        ],
        isColor: [
          { required: true, message: "请选择是否颜色", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入属性名称", trigger: "change" },
          { validator: asyncName, trigger: "blur" }
        ],
        displayName: [
          {
            required: true,
            message: "请输入属性名称可见值",
            trigger: "change"
          },
          { validator: asyncDisplayName, trigger: "blur" }
        ]
      },
      finalName: "",
      finalDisplayName: "",
      newSelect: "", //新建分组本地变量
      innerVisible: false //内层模态框是否打开
    };
  },
  methods: {
    aysynDisplayName(val) {
      this.saveForm.displayName = val;
    },
    /**
     * @获取列表
     */
    getData() {
      this.options.loading = true;
      this.getPropSelect();
      propertyListData()
        .then(res => {
          // console.log(res);
          if (res.code == "200") {
            this.tableData = res.result;
            this.tableData.map(v => {
              switch (v.editType) {
                case 3:
                  return this.$set(v, "cnProp", "普通属性");
                  break;
                case 5:
                  return this.$set(v, "cnProp", "高级属性");
                  break;
                case 4:
                  return this.$set(v, "cnProp", "无值属性");
                  break;
                default:
                  return this.$set(v, "cnProp", "");
                  break;
              }
            });
          }
          // console.log(this.tableData);
          this.realList = this.tableData;
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
      console.log(this.searchForm);
      // alert(111)
      let name = this.searchForm.name;
      let displayName = this.searchForm.displayName;
      let editType = this.searchForm.editType;
      let groupName = this.searchForm.groupName;
      let isColor = this.searchForm.isColor;
      this.realList = this.tableData;
      
      if (name != "") {
        this.realList = this.tableData.filter(v => {
          if (v.name.includes(name)) {
            // console.log(name);
            return v;
          }
        });
      }
      if (displayName != "") {
        this.realList = this.tableData.filter(v => {
          if (v.displayName.includes(displayName)) {
            return v;
          }
        });
      }
      if (editType != null) {
        
        this.realList = this.tableData.filter(v => {
          if (v.editType==editType) {
            console.log(editType);
            return v;
          }
        });
      }
      if (groupName !=  null) {
        this.realList = this.tableData.filter(v => {
          if (v.groupName.includes(groupName)) {
            return v;
          }
        });
      }
      if (isColor !=  null) {
        this.realList = this.tableData.filter(v => {
          if (v.isColor==isColor) {
            return v;
          }
        });
      }
      // console.log(this.realList);
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
     * @获取属性分组下拉数据
     */
    getPropSelect() {
      groupNameListData()
        .then(res => {
          if (res.code == "200") {
            this.groupList = res.result;
          }
        })
        .catch(err => {});
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
     * @提交添加表单
     */
    SubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.from == "add") {
            saveProperty(this.saveForm)
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
            updateProperty(this.saveForm)
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
          }
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
    },
    /**
     * @删除属性
     */
    deleteSubmit(paramsId) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delProperty({ id: paramsId })
            .then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
    }
  },
  mounted() {
    // this.getData();
    // this.filterData({});
  }
};
</script>
<style>
.el-switch__input:focus ~ .el-switch__core {
  outline: none !important;
}
</style>
