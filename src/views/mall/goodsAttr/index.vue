<!--商品属性集页面 -->
<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="margin-top:20px;">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          class="filter-item"
          @click.stop="filterData(searchForm)"
          type="primary"
          icon="el-icon-search"
          size="small"
        >查询</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="searchForm" size="small" label-width="140px">
          <el-form-item label="搜索属性集名称：">
            <el-input
              @keyup.enter.native="filterData(searchForm)"
              v-model="searchForm.name"
              placeholder="请输入属性集名称"
              clearable
              style="width: 200px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="搜索销售属性：">
            <el-input
              @keyup.enter.native="filterData(searchForm)"
              placeholder="请输入销售属性"
              v-model="searchForm.salePropertyNames"
              clearable
              style="width: 200px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="搜索功能属性：">
            <el-input
              @keyup.enter.native="filterData(searchForm)"
              placeholder="请输入功能属性"
              v-model="searchForm.funcPropertyNames"
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
        @click.stop="from='add'; openDialog()"
        size="small"
      >添加</el-button>
    </el-card>

    <!-- 列表及分页 -->
    <div style="margin-top:20px;">
      <CommonTable :columns="columns" :dataSource="realList" :options="options" :fetch="getData"/>
    </div>

    <!-- 表单模态框 -->
    <el-dialog
      :title="this.from=='edit'?'编辑属性集':'新建属性集'"
      :visible.sync="FormDialog"
      v-if="FormDialog"
    >
      <el-form :model="saveForm" status-icon ref="saveForm" label-width="150px">
        <el-form-item label="商品分类" v-if="this.from=='edit'?true:false">
          <el-cascader
            expand-trigger="click"
            :options="data"
            :props="cascaderSet"
            @change="pushSelect"
          ></el-cascader>
          <div>
            <el-tag
              v-for="tag in saveForm.cateporys"
              :key="tag.id"
              closable
              @close="deleteSelect(tag)"
              type="success"
            >{{tag.name}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="属性集名称">
          <el-input
            v-model="saveForm.name"
            style="width: calc(60% - 5px);"
            placeholder="属性集名称"
            clearable
          ></el-input>
        </el-form-item>
        <div v-if="Object.keys(func).length>0">
          <el-form-item label="含功能属性">
            <el-select
              style="width:350px;"
              multiple
              v-model="saveForm.funcListIdGroup"
              filterable
              @change="funcChange"
              placeholder="请选择"
            >
              <el-option-group v-for="group in funcOptions" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="功能属性排序">
            <div id="func">
              <div v-for="item in saveForm.funcList" :key="item.id">
                <i class="el-icon-rank"></i>
                {{item.name}}
              </div>
            </div>
          </el-form-item>
        </div>
        <div v-if="Object.keys(sale).length>0">
          <el-form-item label="含销售属性">
            <el-select
              style="width:350px;"
              multiple
              v-model="saveForm.saleListIdGroup"
              filterable
              @change="saleChange"
              placeholder="请选择"
            >
              <el-option-group v-for="group in saleOptions" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.displayName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">({{ item.typeName }})</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="销售属性排序">
            <div id="sale">
              <div v-for="item in saveForm.saleList" :key="item.id">
                <i class="el-icon-rank"></i>
                {{item.name}}
              </div>
            </div>
          </el-form-item>
          <el-form-item label="所属品牌">
            <el-select
              v-model="saveForm.brandListIdGroup"
              multiple
              filterable
              placeholder="请选择"
              @change="brandChange"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormDialog = false">取 消</el-button>
        <el-button type="primary" @click="SubmitForm('saveForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/Table";
import {
  propertySetList,
  toPropertySetEdit,
  createOrUpdatePropertySet,
  delPropertySet
} from "@/api/mall/goodsAttr";
import { getCategoryTreeData, findCategoryById } from "@/api/mall/mallClass";
import { queryStoreBrandList } from "@/api/store/brand";
import Sortable from "sortablejs";
export default {
  name: "goodsAttr",
  components: {
    CommonTable
  },
  data() {
    return {
      cascaderSet: {
        value: "id",
        label: "text",
        children: "children"
      },
      //树表数据
      data: [],
      checkList: [], //已选择的树表数据
      //表格列属性
      columns: [
        {
          prop: "name",
          label: "属性集名称",
          width: 160
        },
        {
          prop: "salePropertyNames",
          label: "销售属性"
        },
        {
          prop: "funcPropertyNames",
          label: "功能属性"
        },
        {
          button: true,
          label: "操作",
          group: [
            {
              isShow: true,
              circle: true,
              type: "primary",
              icon: "el-icon-edit",
              plain: true,
              onClick: (row, index) => {
                this.from = "edit";
                this.openDialog(row.id);
              }
            },
            {
              circle: true,
              type: "danger",
              icon: "el-icon-delete",
              onClick: (row, index) => {
                this.deleteSubmit(row.id);
              }
            }
          ]
        }
      ],
      tableData: [], //列表数据(接口获取)
      realList: [], //实际渲染列表数据
      func: {}, //功能属性备选对象
      sale: {}, //销售属性备选对象
      funcOptions: [],
      saleOptions: [],
      brandOptions: [], //品牌备选项
      brandLoading: false, //品牌loading
      sortable: null,
      //搜索条件
      searchForm: {
        name: "", // 属性集名称,
        salePropertyNames: "", //销售属性
        funcPropertyNames: "" //功能属性
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
        saleList: [],
        funcList: [],
        brandList: []
      }, //
      options: {
        //列表配置项
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      FormDialog: false, //表单模态框是否显示
      from: "", //通过哪个功能按钮打开表单
      //表单校验规则
      FormRules: {},
      finalName: "",
      finalSalePropertyNames: "",
      finalFuncPropertyNames: "",
      newSelect: "", //新建分组本地变量
      innerVisible: false //内层模态框是否打开
    };
  },
  methods: {
    /**
     * @关联商品分类
     */
    pushSelect(item) {
      console.log(item);
      let selectId = item[item.length-1];
      
      findCategoryById({ id: selectId })
        .then(res => {
          // console.log(res);
          this.saveForm.cateporys.push(res.result);
          let tmp = new Set(
            this.saveForm.cateporys.map(item => JSON.stringify(item))
          );
          this.saveForm.cateporys = Array.from(tmp).map(item =>
            JSON.parse(item)
          );
          this.saveForm.cateporys = Array.from(
            new Set(this.saveForm.cateporys)
          ); //数组去重
          this.$message("关联商品分类成功");
        })
        .catch(err => {});
    },
    /**
     * @删除关联的商品分类
     */
    deleteSelect(item) {
      console.log(item);
      this.saveForm.cateporys.splice(
        this.checkList.findIndex(v => v.id === item),
        1
      );
      this.$message("取消关联商品分类成功");
    },
    /**
     * @搜索品牌
     */
    remoteMethod(query) {
      let params = {
        name: query,
        pageSize: 1000
      };
      this.brandLoading = true;
      queryStoreBrandList(params)
        .then(res => {
          if (res.code == "200") {
            this.brandOptions = res.result.records;
            console.log(this.brandOptions);
          }
          this.brandLoading = false;
        })
        .catch(err => {
          this.brandLoading = false;
        });
    },
    /**
     * @功能属性多选状态变化事件
     */
    funcChange(val) {
      this.saveForm.funcList = []; //清空实际被选择的功能属性对象数组
      let jointArr = []; //将for循环后的数据整合为一个数组
      for (let item in this.func) {
        this.func[item].map(v => {
          return jointArr.push(v);
        });
      }
      for (let i = 0; i < val.length; i++) {
        jointArr.filter(vv => {
          if (vv.id == val[i]) {
            return this.saveForm.funcList.push(vv);
          }
        });
      }
    },
    /**
     * @销售属性多选状态变化事件
     */
    saleChange(val) {
      this.saveForm.saleList = []; //清空实际被选择的销售属性对象数组
      this.saveForm.saleListIdGroup = []; //清空多选标识
      let jointArr = []; //将for循环后的数据整合为一个数组
      for (let item in this.sale) {
        this.sale[item].map(v => {
          return jointArr.push(v);
        });
      }
      for (let i = 0; i < val.length; i++) {
        jointArr.filter(vv => {
          if (vv.id == val[i]) {
            return this.saveForm.saleList.push(vv);
          }
        });
      }
      let flag = false;
      this.saveForm.saleList.forEach(v => {
        if (flag == true) {
          if (v.editType == 5) {
            // console.log(v.displayName);
            this.$message("只能选择一个高级属性");
            this.saveForm.saleList.splice(
              this.saveForm.saleList.findIndex(item => item.id === v.id),
              1
            );
            // console.log(this.saveForm.saleList);
            // alert(111)
          }
        }
        if (v.editType == 4) {
          flag = true;
        }
      });
      this.saveForm.saleList.map(v => {
        this.saveForm.saleListIdGroup.push(v.id);
      });
      // console.log(this.saveForm.saleList);
    },
    /**
     * @品牌多选状态变化事件
     */
    brandChange(val) {
      //  this.saveForm.brandList = [];//清空实际被选择的销售属性对象数组
      //  for (let i = 0; i < val.length; i++) {
      //     this.brandOptions.filter(v => {
      //       if (v.id == val[i]) {
      //         return this.saveForm.brandList.push(v);
      //       }
      //     });
      //  }
    },
    /**
     * @功能属性排序
     */
    funcSort() {
      if (document.querySelectorAll("#func")[0]) {
        const el = document.querySelectorAll("#func")[0];
        this.sortable = Sortable.create(el, {
          ghostClass: "sortable-ghost", // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData("Text", "");
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.saveForm.funcList.splice(evt.oldIndex, 1)[0];
            const funcListIdGroupRow = this.saveForm.funcListIdGroup.splice(
              evt.oldIndex,
              1
            )[0];
            this.saveForm.funcList.splice(evt.newIndex, 0, targetRow);
            this.saveForm.funcListIdGroup.splice(
              evt.newIndex,
              0,
              funcListIdGroupRow
            );
          }
        });
      }
    },
    /**
     * @销售属性排序
     */
    saleSort() {
      if (document.querySelectorAll("#sale")[0]) {
        const el = document.querySelectorAll("#sale")[0];
        this.sortable = Sortable.create(el, {
          ghostClass: "sortable-ghost", // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData("Text", "");
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.saveForm.saleList.splice(evt.oldIndex, 1)[0];
            const saleListIdGroupRow = this.saveForm.saleListIdGroup.splice(
              evt.oldIndex,
              1
            )[0];
            this.saveForm.saleList.splice(evt.newIndex, 0, targetRow);
            this.saveForm.saleListIdGroup.splice(
              evt.newIndex,
              0,
              saleListIdGroupRow
            );
          }
        });
      }
    },
    /**
     * @获取列表
     */
    getData() {
      this.options.loading = true;
      propertySetList()
        .then(res => {
          if (res.code == "200") {
            this.tableData = res.result.propertySetList;
            const funcPropertyNames = res.result.funcPropertyNames;
            const salePropertyNames = res.result.salePropertyNames;
            this.tableData.map(v => {
              // console.log(object);
              for (const key in funcPropertyNames) {
                if (key == v.id) {
                  this.$set(v, "funcPropertyNames", funcPropertyNames[key]);
                  break;
                }
              }
              for (const key in salePropertyNames) {
                if (key == v.id) {
                  this.$set(v, "salePropertyNames", salePropertyNames[key]);
                  break;
                }
              }
              return v;
            });
            this.realList = this.tableData;
            // console.log(this.realList);
          } else {
            this.realList = [];
          }
          this.options.loading = false;
        })
        .catch(err => {
          this.options.loading = false;
        });
    },
    /**
     * @筛选数据
     */
    filterData(val) {
      let name = this.searchForm.name;
      let salePropertyNames = this.searchForm.salePropertyNames;
      let funcPropertyNames = this.searchForm.funcPropertyNames;
      this.realList = this.tableData;
      if (name != "") {
        this.realList = this.tableData.filter(v => {
          if (v.name.includes(name)) {
            return v;
          }
        });
      }
      if (salePropertyNames != "") {
        this.realList = this.tableData.filter(v => {
          if (v.salePropertyNames.includes(salePropertyNames)) {
            return v;
          }
        });
      }
      if (funcPropertyNames != "") {
        this.realList = this.tableData.filter(v => {
          if (v.funcPropertyNames.includes(funcPropertyNames)) {
            return v;
          }
        });
      }
    },
    /**
     * @打开表单模态框
     */
    openDialog(rowId) {
      //  编辑
      if (this.from == "edit" && rowId) {
        toPropertySetEdit({ id: rowId })
          .then(res => {
            if (res.code == "200") {
              const source = res.result;
              if (source.resMap.func) {
                this.func = source.resMap.func; //功能属性备选对象
              }
              if (source.resMap.sale) {
                this.sale = source.resMap.sale; //销售属性备选对象
              }
              this.funcOptions = [];
              for (const key in this.func) {
                this.funcOptions.push({ label: key, options: this.func[key] });
              }
              this.saleOptions = [];
              for (const key in this.sale) {
                this.saleOptions.push({ label: key, options: this.sale[key] });
              }
              for (const key in this.saleOptions) {
                this.saleOptions[key].options.map(v => {
                  switch (v.editType) {
                    case 3:
                      this.$set(v, "typeName", "普通属性");
                      break;
                    case 4:
                      this.$set(v, "typeName", "无值属性");
                      break;
                    case 5:
                      this.$set(v, "typeName", "高级属性");
                      break;
                  }
                });
              }

              // this.brandOptions = source.brandList;
              this.saveForm = {
                propertysetId: rowId,
                funcList: source.funcList, //已选择功能属性对象数组
                saleList: source.saleList, //已选择销售属性对象数组
                brandList: source.brandList,
                cateporys: source.cateporys, //已关联的商品分类
                ...source.propertyset,
                funcListIdGroup: [], //功能属性Id数组 作为多选标识
                saleListIdGroup: [], //销售属性Id数组 作为多选标识
                brandListIdGroup: [] //品牌ID数组 作为多选标识
              };
              console.log(this.saveForm);
              if (source.brandList == null) {
                this.saveForm.brandList = [];
              }
              this.saveForm.funcList.map(v => {
                this.saveForm.funcListIdGroup.push(v.id);
              });
              this.saveForm.saleList.map(v => {
                this.saveForm.saleListIdGroup.push(v.id);
              });
              this.saveForm.brandList.map(v => {
                this.saveForm.brandListIdGroup.push(v.id);
              });

              this.FormDialog = true;
              this.$nextTick(() => {
                this.funcSort();
                this.saleSort();
              });
            }
          })
          .catch(err => {});
      } else if (this.from == "add") {
        toPropertySetEdit()
          .then(res => {
            if (res.code == "200") {
              console.log(111);
              const source = res.result;
              if (source.resMap.func) {
                this.func = source.resMap.func; //功能属性备选对象
              }
              if (source.resMap.sale) {
                this.sale = source.resMap.sale; //销售属性备选对象
              }

              this.funcOptions = [];
              for (const key in this.func) {
                this.funcOptions.push({ label: key, options: this.func[key] });
              }
              this.saleOptions = [];
              for (const key in this.sale) {
                this.saleOptions.push({ label: key, options: this.sale[key] });
              }
              for (const key in this.saleOptions) {
                this.saleOptions[key].options.map(v => {
                  switch (v.editType) {
                    case 3:
                      this.$set(v, "typeName", "普通属性");
                      break;
                    case 4:
                      this.$set(v, "typeName", "无值属性");
                      break;
                    case 5:
                      this.$set(v, "typeName", "高级属性");
                      break;
                  }
                });
              }
              this.saveForm = {
                funcList: source.funcList, //已选择功能属性对象数组
                saleList: source.saleList, //已选择销售属性对象数组
                brandList: source.brandList,
                ...source.propertyset,
                funcListIdGroup: [], //功能属性Id数组 作为多选标识
                saleListIdGroup: [], //销售属性Id数组 作为多选标识
                brandListIdGroup: [] //品牌ID数组 作为多选标识
              };
              if (source.brandList == null) {
                this.saveForm.brandList = [];
              }
              this.saveForm.funcList.map(v => {
                this.saveForm.funcListIdGroup.push(v.id);
              });
              this.saveForm.saleList.map(v => {
                this.saveForm.saleListIdGroup.push(v.id);
              });
              this.saveForm.brandList.map(v => {
                this.saveForm.brandListIdGroup.push(v.id);
              });

              this.FormDialog = true;
              this.$nextTick(() => {
                this.funcSort();
                this.saleSort();
              });
            }
          })
          .catch(err => {});
      }
    },
    /**
     * @提交表单
     */
    SubmitForm(formName) {
      let params = {};
      params.propertyset = Object.assign({}, this.saveForm);
      params.saleIds = params.propertyset.saleListIdGroup.join(",");
      params.funcIds = params.propertyset.funcListIdGroup.join(",");
      params.brandIds = params.propertyset.brandListIdGroup.join(",");
      params.categoryIds = [];
      if (params.propertyset.cateporys) {
        params.propertyset.cateporys.map(v => {
          params.categoryIds.push(v.id);
        });
      }

      // params.categoryIds = selectIdGroup;
      createOrUpdatePropertySet(params)
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
          delPropertySet({ propertySetId: paramsId })
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
        .catch(err => {
          console.log(err);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },

  mounted() {
    this.remoteMethod("");
    getCategoryTreeData()
      .then(res => {
        this.data = res.result;
      })
      .catch(err => {});
  },
  updated() {}
};
</script>
<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #409eff !important;
}
</style>

<style>
.el-switch__input:focus ~ .el-switch__core {
  outline: none !important;
}
</style>
