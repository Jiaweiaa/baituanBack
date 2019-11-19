<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-12 16:57:30
 * @LastEditTime: 2019-10-23 14:51:06
 * @LastEditors: Please set LastEditors
 -->
<!-- 仓库中的商品 -->
<template>
  <div class="app-container">
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
        <el-button
            style="float: right;margin-right:20px;"
            class="filter-item"
            type="primary"
            icon="el-icon-copy-document"
            size="small"
            :loading="copyLoading"
            @click="copyData()"
        >copy</el-button>
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
          <el-form-item label="选择商品类型：">
            <el-select
                clearable
                placeholder="请选择商品类型"
                style="width: 190px"
                class="filter-item"
                v-model="searchForm.sellType"
            >
              <el-option v-for="item in typeOptions" :key="item" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
          </el-form-item>-->
          <!-- <el-form-item label="输入价格：">
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
    
    <!--
     定时上架
    -->
    <el-dialog title="上架时间" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" status-icon :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="上架时间" label-width="150px" prop="setWarehouseTime">
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
    <!-- 日期事件选择器模态框 -->
    <!-- <el-dialog title="定时上架商品" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-date-picker v-model="putawayTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
    <!-- 批量删除及上架 -->
    <div>
      <el-row>
        <el-button size="medium" @click="timeGoUp()">批量定时上架</el-button>
        <el-button size="medium" @click="batchDetele()">批量删除</el-button>
        <el-button size="medium" @click="batchPutaway()">批量上架</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import CommonTable from "@/components/Table";
  import {
    repertoryManagem,
    groundingItem,
    groundingByTimeItem,
    delItem,
    copyPlatformStoreProduct
  } from "@/api/mall/warehouseProduct";
  export default {
    name: "warehouseProduct1",
    components: {
      CommonTable
    },
    data() {
      return {
        typeOptions: [
          {
            value: 1,
            label: "普通商品"
          },
          {
            value: 2,
            label: "采购商品"
          },
        
        ],
        copyLoading: false,
        dialogFormVisible: false,
        btnLoading: false,
        columns: [
          //表格列属性
          {
            prop: "code",
            label: "商品编码",
            width: 160
          },
          {
            prop: "isCoverImageUrl",
            label: "图片",
            render: (row, index) => {
              return (
                  <img
              style="width: 50px; height: 50px; cursor: pointer;"
              src={"http://qn.gaoshanmall.cn/" + row.isCoverImageUrl}
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
            prop: "activeStartTime",
            label: "定时上架时间"
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
              {
                name: "上架",
                circle: true,
                type: "success",
                icon: "el-icon-view",
                hasPerm: false,
                onClick: row => {
                  // console.log(row);
                  this.selection = [];
                  this.selection.push(row);
                  this.batchPutaway();
                }
              },
              {
                name: "定时上架",
                circle: true,
                type: "success",
                icon: "el-icon-view",
                hasPerm: false,
                onClick: row => {
                  this.timingPutaway(row.id);
                }
              },
              {
                name: "编辑",
                circle: true,
                type: "primary",
                icon: "el-icon-view",
                onClick: row => {
                  this.createOrEditProduct(row);
                }
              },
              {
                name: "删除",
                circle: true,
                type: "danger",
                icon: "el-icon-view",
                onClick: row => {
                  // console.log(row);
                  this.selection = [];
                  this.selection.push(row);
                  this.batchDetele();
                }
              }
            ]
          }
        ],
        tableData: [],
        options: {
          //列表配置项
          mutiSelect: true,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true // 是否一挂载就加载数据
        },
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 10
        },
        putawayTime: "", //日期事件选择器绑定的值
        selection: [],
        searchForm: {
          title: "",
          code: "",
          sellType:""
        },
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
            { required: true, message: "请选择上架时间", trigger: "blur" }
          ]
        }
      };
    },
    mounted() {
      let params = {
        pageSize: 10,
        pageNum: 1
      };
      repertoryManagem(params)
          .then(res => {
            this.tableData = res.result.itemCommands;
            // console.log(this.tableData);
          })
          .catch(err => {});
    },
    
    methods: {
      validatorCopy(val) {
        if (val == "iwantcopy") {
          return true;
        } else {
          return false;
        }
      },
      copyData() {
        this.copyLoading = true;
        
        this.$prompt("请输入操作密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "password",
          inputErrorMessage: "密码不正确"
        })
            .then(({ value }) => {
              if (value == "iwantcopy") {
                copyPlatformStoreProduct()
                    .then(res => {
                      this.copyLoading = false;
                    })
                    .catch(err => {
                      this.copyLoading = false;
                    });
                // this.$message({
                //   type: "error",
                //   message: "aaaa"
                // });
              } else {
                this.$message({
                  type: "error",
                  message: "你输入的密码不正确"
                });
              }
              
              this.copyLoading = false;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消复制"
              });
              this.copyLoading = false;
            });
        
        ///
        // this.$confirm("此操作将执行打印操作用, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {
        //     copyPlatformStoreProduct()
        //       .then(res => {
        //         this.copyLoading = false;
        //       })
        //       .catch(err => {
        //         this.copyLoading = false;
        //       });
        //   })
        //   .catch(() => {
        //     this.copyLoading = false;
        //     this.$message({
        //       type: "info",
        //       message: "已取消打印"
        //     });
        //   });
      },
      // 定时上架取消
      cancelDialog() {
        this.dialogForm = {
          setWarehouseTime: ""
        };
        this.dialogFormVisible = false;
      },
      // 定时上架确认
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
            groundingByTimeItem(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "定时上架成功"
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
      // 点击定时上架
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
        repertoryManagem(params).then(res => {
          this.$message(res.message);
          this.tableData = res.result.itemCommands;
          if (this.tableData.length > 0) {
            this.tableData.map((good, index) => {
              if (good.activeEndTime) {
              }
            });
          }
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
      
      /**
       * @去新建商品页
       */
      
      createOrEditProduct(item) {
        //如果传入item则是编辑 否则新增 参数中的productStatus是区分商品状态的标识
        if (item) {
          this.$router.push({
            path: "/mall/ProductAdd",
            query: {
              propertyId: item.id,
              productStatus: 2
            }
          });
        } else {
          this.$router.push({
            path: "/mall/ProductAdd"
          });
        }
      },
      //批量选择
      getSelectOption(option) {
        this.selection = option;
      },
      //批量上架
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
        groundingItem(params)
            .then(res => {
              loading.close();
              if (res.code == "200") {
                this.getData();
              }
            })
            .catch(err => {
              loading.close();
            });
      },
      //定时上架
      timingPutaway(id) {
        let params = { itemId: id };
        
        groundingByTimeItem(params)
            .then(res => {
              if (res.code == "200") {
                this.getData();
              }
            })
            .catch(err => {});
      },
      //批量删除
      batchDetele() {
        this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
            .then(() => {
              let params = {
                ids: [],
                itemType: 2
              };
              const loading = this.$loading({
                lock: true,
                text: "等待服务器响应",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              this.selection.map(v => {
                params.ids.push(v.id);
              });
              delItem(params)
                  .then(res => {
                    loading.close();
                    if (res.code == "200") {
                      this.getData();
                    }
                  })
                  .catch(err => {
                    loading.close();
                  });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
      }
    }
  };
</script>
<style lang='scss' scoped>
</style>
