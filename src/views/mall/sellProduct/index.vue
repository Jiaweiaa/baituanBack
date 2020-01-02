<!-- 出售中的商品 -->
<template>
  <div class="app-container" @keyup.enter="searchData()">
    <el-card class="filter-container" shadow="never" style="margin-top:20px;">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchData()"
        >查询</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="searchForm" size="small" label-width="140px">
          <el-form-item label="输入商品编码：">
            <el-input clearable v-model="searchForm.code" style="width: 200px;" class="filter-item"></el-input>
          </el-form-item>
          <!-- 空label -->
          <el-form-item></el-form-item>
          <el-form-item label="输入商品名称：">
            <el-input
              clearable
              v-model="searchForm.title"
              style="width: 200px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="选择所属分类：">
            <el-select
              clearable
              placeholder="请选择所属分类"
              style="width: 190px"
              class="filter-item"
              v-model="value1"
            >
              <el-option v-for="item in 3" :key="item" :label="item" :value="value1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择对应属性集">
            <el-select
              clearable
              placeholder="请选择对应属性集"
              style="width: 190px"
              class="filter-item"
              v-model="value2"
            >
              <el-option v-for="item in 3" :key="item" :label="item" :value="value2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输入价格：">
            <el-input clearable style="width: 200px;" class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="输入创建时间：">
            <el-input clearable style="width: 200px;" class="filter-item"></el-input>
          </el-form-item>-->
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin-top:20px;">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <!-- 列表及分页 -->
    <div style="margin-top:20px;">
      <CommonTable
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="getData"
        :pagination="pagination"
        @selection-change="getSelectOption"
      />
    </div>

    <!-- 批量定时下架 -->
    <el-dialog title="下架时间" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="下架时间" label-width="150px" prop="setWarehouseTime">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="dialogForm.setWarehouseTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量删除及上架 -->
    <div>
      <el-row>
        <el-button size="medium" @click="timeGoUp()">批量定时下架</el-button>
        <el-button size="medium" @click="batchPutaway()">批量下架</el-button>
      </el-row>
    </div>
    <!-- 每件商品的库存列表 -->
    <el-dialog title="查看库存数量" :visible.sync="repertoryDialogVisible" width="70%">
      <div>商品名称: {{productInfo.title}}</div>
      <div>商品编码: {{productInfo.code}}</div>
      <div>商品规格及对应库存:</div>
      <el-table :data="repertoryTable">
        <el-table-column
          :prop="item.property.displayName"
          :label="item.property.displayName"
          width="180"
          v-for="(item,index) in thList"
          :key="index"
        >
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.propertyValueCommands" :key="i" v-show="i==index">
              <span>{{v.propertyValue.value}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="UPC" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.extentionCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本价" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.costPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原价" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.salePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠价" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.listPrice}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/Table";
import { saleManagement, undercarriageItem } from "@/api/mall/sellProduct";
import { editItem, timingObtainedItem } from "@/api/mall/newProduct";
export default {
  name: "sellProduct1",
  components: {
    CommonTable
  },
  data() {
    return {
      columns: [
        //表格列属性
        {
          prop: "code",
          label: "商品编码",
          width: 160,
          render: (row, index) => {
            return (
              <el-tooltip
                class="item"
                effect="dark"
                content={row.id}
                placement="top"
              >
                <span>{row.code}</span>
              </el-tooltip>
            );
          }
        },
        {
          prop: "isCoverImageUrl",
          label: "图片",
          render: (row, index) => {
            return (
              <img
                style="width: 50px; height: 50px; cursor: pointer;"
                src={this.GLOBAL.imgUrl + row.isCoverImageUrl}
              />
            );
          }
        },
        {
          prop: "title",
          label: "商品名称"
        },
        {
          prop: "categoryNames",
          label: "所属分类"
        },
        {
          prop: "propertySetName",
          label: "对应属性集"
        },
        {
          prop: "salePrice",
          label: "价格"
        },
        {
          prop: "activeEndTime",
          label: "定时下架时间"
        },
        {
          prop: "createTime",
          label: "创建时间"
        },

        {
          width: 300,
          button: true,
          label: "操作",
          group: [
            // {
            //   name: "编辑",
            //   circle: true,
            //   type: "success",
            //   icon: "el-icon-view",
            //   onClick: row => {}
            // },
            {
              circle: true,
              type: "success",
              icon: "el-icon-document-copy",
              onClick: row => {
                this.copyText(row);
              }
            },
            {
              name: "查看库存",
              circle: true,
              type: "primary",
              icon: "el-icon-view",
              onClick: row => {
                this.createOrEditProduct(row);
              }
            },
            {
              name: "下架",
              circle: true,
              type: "danger",
              icon: "el-icon-view",
              onClick: row => {
                // console.log(row);
                this.selection = [];
                this.selection.push(row);
                this.batchPutaway();
              }
            }
          ]
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      options: {
        //列表配置项
        mutiSelect: true,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      selection: [],
      searchForm: {
        title: "",
        code: ""
      },
      thList: [], //表头
      productInfo: {},
      repertoryTable: [], //库存列表
      repertoryDialogVisible: false,
      btnLoading: false,
      value1: "",
      value2: "",
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        }
      },
      dialogForm: {
        setWarehouseTime: ""
      },
      dialogFormRules: {
        setWarehouseTime: [
          { required: true, message: "请选择下架时间", trigger: "blur" }
        ]
      },
      dialogFormVisible: false
    };
  },
  mounted() {},

  methods: {
    //复制文本信息
    copyText(row) {
      console.log("111");
      this.$copyText(`/pages/goods/main?id=${row.id}`).then(
        res => {
          console.log(res);

          //   this.$message({
          //   message: '已成功复制，可直接去粘贴',
          //   type: 'success'
          // });
          this.$message.success("已成功复制，可直接去粘贴");
        },
        err => {
          this.$message.error("错了哦，这是一条错误消息");
        }
      );
    },
    // 定时下架取消
    cancelDialog() {
      this.dialogForm = {
        setWarehouseTime: ""
      };
      this.dialogFormVisible = false;
    },
    // 定时下架确认
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          let params = {
            ids: [],
            setWarehouseTime: this.dialogForm.setWarehouseTime
          };
          this.selection.map(v => {
            params.ids.push(v.id);
          });
          this.btnLoading = true;
          timingObtainedItem(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "定时下架成功"
              });
              this.cancelDialog();
              this.getData();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
            this.btnLoading = false;
          });
        }
      });
    },
    // 点击定时下架
    timeGoUp() {
      if (this.selection.length > 0) {
        this.dialogFormVisible = true;
      } else {
        this.$message({
          type: "warning",
          message: "请选择上架商品"
        });
      }
    },

    /**
     * @获取列表
     */

    getData() {
      this.options.loading = true;
      let params = Object.assign({}, this.searchForm);
      params.pageNum = this.pagination.pageIndex;
      params.pageSize = this.pagination.pageSize;
      saleManagement(params).then(res => {
        this.$message(res.message);
        this.tableData = res.result.itemCommands;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },
    //查询列表
    searchData() {
      this.pageNum = 1; //初始化页码
      this.getData();
    },
    //查看库存
    createOrEditProduct(item) {
      this.productInfo = {
        title: item.title,
        code: item.code
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      editItem({ itemId: item.id })
        .then(res => {
          if (res.code == "200") {
            this.repertoryTable = res.result.resultMap.trList;
            this.repertoryTable.map(v => {
              for (const key in v.skuInventoryQtyCommand) {
                this.$set(v, key, v.skuInventoryQtyCommand[key]);
                this.$set(v, "upcDisabled", true);
              }
              v.itemProperties = [];
              console.log(v.itemProperties);
              //处理编辑BUG
              v.propertyValueCommands.map(vv => {
                if (vv.property.editType == 4) {
                  v.itemProperties.push({
                    propertyId: vv.property.id,
                    propertyValue: vv.propertyValue.value
                  });
                } else {
                  v.itemProperties.push({
                    propertyId: vv.property.id,
                    propertyValueId: vv.propertyValue.id
                  });
                }
              });
            });
            this.thList = this.repertoryTable[0].propertyValueCommands;
            this.repertoryDialogVisible = true;
            loading.close();
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    /**
     * @去新建商品页
     */

    createProduct() {
      this.$router.push({
        path: "/mall/ProductAdd",
        query: {
          propertyId: "来自新建中的商品页"
        }
      });
    },
    //批量选择
    getSelectOption(option) {
      // console.log(option);
      this.selection = option;
    },
    //批量下架
    batchPutaway() {
      let params = {
        ids: []
      };
      this.selection.map(v => {
        params.ids.push(v.id);
      });
      const loading = this.$loading({
        lock: true,
        text: "等待服务器响应",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      undercarriageItem(params)
        .then(res => {
          loading.close();
          if (res.code == "200") {
            this.getData();
          }
        })
        .catch(err => {
          loading.close();
        });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
