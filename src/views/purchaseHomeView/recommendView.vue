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
			图片查看
    -->
    <el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
      <div style="text-align: center;">
        <img width="360" :src="'http://qn.gaoshanmall.cn/'+photoUrl" alt />
      </div>
    </el-dialog>

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
			新增推荐
    -->
    <el-dialog title="新增推荐商品" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form
        :model="dialogForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dialogFormRules"
        ref="dialogForm"
      >
        <el-form-item label="商品编码" label-width="160px" prop="codes">
          <el-input v-model="dialogForm.codes"></el-input>
          <el-button
            style="margin-bottom: 10px;"
            type="primary"
            size="small"
            :loading="goodsLoading"
            @click="getGoods"
          >获取商品</el-button>
        </el-form-item>
        <el-form-item v-if="goodsList!=null" label="商品信息如下" label-width="160px" prop="list">
          <el-checkbox-group ref="checkedGoods" v-model="dialogForm.list">
            <el-checkbox
              :key="goodsList.id"
              :label="goodsList.id"
              style="width: 100%; overflow: hidden;"
            >{{goodsList.code}}{{goodsList.title}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import {
  getRecommendedList,
  saveOrUpdateRecommended,
  deleteRecommended
} from "@/api/homeView/index";

import { getItemByCode } from "@/api/homeView";
export default {
  name: "name",
  data() {
    return {
      // 搜索table渲染的数据
      searchModel: [
        {
          input: [],
          button: [
            {
              type: "success",
              func: "addBtn",
              name: "新增推荐商品"
            }
          ]
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "title",
          label: "标题",
          render: (row, index) => {
            return <span> {row.itemDto != null ? row.itemDto.title : ""}</span>;
          }
        },
        {
          prop: "seq",
          label: "显示顺序",
          render: (row, index) => {
            return (
              <el-input-number
            onChange={e => this.valChang(row)}
            min={1}
            precision={0}
            size="small"
            v-model={row.sort}
            step={1}
              ></el-input-number>
          );
          }
        },
        {
          prop: "img",
          label: "图片",
          render: (row, index) => {
            return (
              <img
                on-click={() => this.lookThis(row)}
                style="width: 50px; height: 50px; cursor: pointer;"
                src={
                  row.itemDto != null
                    ? "http://qn.gaoshanmall.cn/" +
                      row.itemDto.itemImages[0].picUrl
                    : ""
                }
              />
            );
          }
        },
        {
          button: true,
          label: "操作",
          group: [
            {
              name: "删除",
              type: "danger",
              icon: "el-icon-delete",
              disabled: false,
              onClick: row => {
                this.del(row);
              }
            }
          ]
        }
      ],
      tableData: [],
      searchData: {},
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
      // 编辑新增用户
      dialogForm: {
        list: [],
        itemId: "",
        type: 2
      },
      dialogFormRules: {
        list: {
          type: "array",
          required: true,
          message: "请选择商品",
          trigger: "blur"
        }
      },
      dialogFormVisible: false,

      photoVisible: false,
      photoUrl: "",
      goodsLoading: false,
      goodsList: null
    };
  },
  components: {
    searchView,
    CommonTable
  },
  methods: {
    // 获取列表
    getList() {
      this.options.loading = true;
      let params = Object.assign(
        {
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          type: 2
        },
        this.searchData
      );
      getRecommendedList(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },

    // 查看图片
    lookThis(val) {
      if (val.itemDto != null) {
        this.photoUrl = val;
        this.photoVisible = true;
      } else {
        this.$message("该商品已失效,请删除");
      }
    },
    // 排序问题
    valChang(val) {
      this.options.loading = true;
      let params = {
        id: val.id,
        sort: val.sort,
        type: 2
      };
      saveOrUpdateRecommended(params)
        .then(res => {
          if (res.code == 200) {
            this.getList();
            this.$notify.success({
              title: res.message,
              offset: 100
            });
          }
          this.btnLoading = false;
          this.cancelDialog();
        })
        .catch(err => {
          this.btnLoading = false;
        });
    },
    // 新增
    addBtn() {
      this.dialogFormVisible = true;
    },

    // 取消新增
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogForm = {
        list: [],
        itemId: "",
        type: 2
      };
      this.goodsList =  null;
      this.$refs["dialogForm"].resetFields();
    },
    // 新增
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          // this.btnLoading = true;
          this.dialogForm.itemId = this.dialogForm.list[0];
          saveOrUpdateRecommended(this.dialogForm).then(res => {
            if (res.code == 200) {
              this.cancelDialog();
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              this.getList();
            } else {
              this.$notify.error({
                title: res.message,
                offset: 100
              });
            }
          });
        }
      });
    },

    // 删除
    del(val) {
      this.$confirm("此操作将永久删除该热销商品是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: val.id
          };
          deleteRecommended(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              let params = Object.assign(
                {
                  pageNum: this.pagination.pageIndex,
                  pageSize: this.pagination.pageSize,
                  type: 2
                },
                this.searchData
              );
              getRecommendedList(params).then(res => {
                if (
                  res.result.records.length <= 0 &&
                  this.pagination.pageIndex > 1
                ) {
                  this.pagination.pageIndex--;
                  this.getList();
                } else {
                  this.getList();
                }
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取商品
    getGoods() {
      this.goodsLoading = true;
      if (this.dialogForm.codes) {
        getItemByCode({
          code: this.dialogForm.codes
        }).then(res => {
          if (res.code == 200) {
            this.goodsList = res.result;
          } else {
            this.$message.error(res.message);
          }
          this.goodsLoading = false;
        });
      } else {
        this.$message.error("请输入商品编码");
        this.goodsLoading = false;
      }
    }
  }
};
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
