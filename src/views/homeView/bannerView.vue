<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-12 16:57:30
 * @LastEditTime: 2019-12-19 15:58:54
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
			图片查看
    -->
    <el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
      <div style="text-align: center;">
        <img width="360" :src="'https://static.ibaituan.cn/'+photoUrl" alt />
      </div>
    </el-dialog>

    <!--
			新增banner
    -->
    <el-dialog title="新增banner" :visible.sync="dialogFormVisible" :before-close="cancelDialog" >
      <el-form
        :model="dialogForm"
        style="width: 95%; margin: 0 auto;"
        status-icon
        :rules="dialogFormRules"
        ref="dialogForm"
        
      >
        <el-form-item label="banner图" label-width="160px" prop="banner">
          <el-upload
            class="avatar-uploader"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :show-file-list="false"
            :on-success="(event) => { handleChange(event, 0)}"
            :before-upload="beforeUpload"
          >
            <img
              v-if="dialogForm.banner"
              :src="`https://static.ibaituan.cn/${dialogForm.banner}?imageMogr2/thumbnail/180x180`"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型" label-width="160px" prop="status">
          <el-radio-group @change="radioChange" v-model="dialogForm.status">
            <el-radio :label="0">商品</el-radio>
            <el-radio :label="1">专题</el-radio>
            <el-radio :label="2">页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="dialogForm.status == 0 || dialogForm.status == 2">
          <el-form-item
            v-if="dialogForm.status == 2"
            label="标题"
            label-width="160px"
            prop="secondaryName"
          >
            <el-input v-model="dialogForm.secondaryName"></el-input>
          </el-form-item>
          <el-form-item
            v-if="dialogForm.status == 2"
            label="页面顶部图"
            label-width="160px"
            prop="banners"
          >
            <el-upload
              class="avatar-uploader"
              :action="imgSrcBasic + '/opc/auth/uploadFile'"
              :show-file-list="false"
              :on-success="(event) => { handleChange(event, 1)}"
              :before-upload="beforeUpload"
            >
              <img
                v-if="dialogForm.banners"
                :src="`https://static.ibaituan.cn/${dialogForm.banners}?imageMogr2/thumbnail/180x180`"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item
              v-if="dialogForm.status == 2"
              label="活动规则图"
              label-width="160px"
              prop="imgOne"
          >
            <el-upload
                class="avatar-uploader"
                :action="imgSrcBasic + '/opc/auth/uploadFile'"
                :show-file-list="false"
                :on-success="(event) => { handleChange(event, 2)}"
                :before-upload="beforeUpload"
            >
              <img
                v-if="dialogForm.imgOne"
                :src="`https://static.ibaituan.cn/${dialogForm.imgOne}?imageMogr2/thumbnail/180x180`"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品编码" label-width="160px" prop="codes">
            <el-input @keyup.enter.native="getGoods" v-model="dialogForm.codes"></el-input>
            <el-button
              style="margin-bottom: 10px;"
              type="primary"
              size="small"
              :loading="goodsLoading"
              @click="getGoods"
            >获取商品</el-button>
          </el-form-item>
          <el-form-item v-if="goodsList.length > 0" label="商品信息如下" label-width="160px" prop="list">
            <el-checkbox-group ref="checkedGoods" v-model="dialogForm.list">
              <el-checkbox
                v-for="(item, index) in goodsList"
                :key="item.id"
                :label="item.id"
                style="width: 100%; overflow: hidden;"
              >{{item.code}}{{item.title}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <!--
	        关联
        -->
        <div v-else>
          <el-form-item label="选择关联专题" label-width="160px" prop="itemId">
            <el-radio-group v-model="dialogForm.itemId">
              <el-radio
                style="width: 100%; margin-top: 12px"
                v-for="(article, index) in articleList"
                :key="index"
                :label="article.id"
              >{{article.title}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      列表组件
    -->
    <CommonTable :columns="columns" :dataSource="tableData" :options="options" :fetch="getList" />
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import {
  getIndexBanner,
  saveOrEditBanner,
  deleteBanner
} from "@/api/homeView/index";
import { getNewsPage } from "@/api/homeView/article/index";

import { getItemByCode } from "@/api/homeView";
import { findProductByCodes } from "@/api/promotion/flashSale";
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
              name: "新增banner"
            }
          ]
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "title",
          label: "名称",
          render: (row, index) => {
            return (
              <span>
                {" "}
                {row.itemDto
                  ? row.itemDto.title
                  : row.news
                  ? row.news.title
                  : "二级活动页面"}
              </span>
            );
          }
        },
        // {
        //   prop: "content",
        //   label: "价格",
        //   render: (row, index) => {
        //     return <span> {row.itemDto.salePrice}</span>;
        //   }
        // },
        {
          prop: "status",
          label: "类型",
          render: (row, index) => {
            return (
              <span>
                {" "}
                {row.status == 0 ? "商品" : row.status == 1 ? "专题" : "页面"}
              </span>
            );
          }
        },
        {
          prop: "img",
          label: "图片",
          render: (row, index) => {
            return (
              <img
                on-click={() => this.lookThis(row.banner)}
                style="width: 50px; height: 50px; cursor: pointer;"
                src={"https://static.ibaituan.cn/" + row.banner}
              />
            );
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
          prop: "createTime",
          label: "创建时间"
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

      photoVisible: false,
      photoUrl: "",

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
        banner: "",
        list: [],
        itemId: "",
        codes: "",
        banners: "",
        imgOne: "",
        status: 0,
        secondaryName: "",
        type: 1
      },
      dialogFormRules: {
        banner: {
          required: true,
          message: "请上传商品图",
          trigger: "blur"
        },
        banners: {
          required: true,
          message: "请上传页面图片",
          trigger: "blur"
        },
        imgOne: {
          required: true,
          message: "请上传活动规则图",
          trigger: "blur"
        },
        secondaryName: {
          required: true,
          message: "请输入标题",
          trigger: "blur"
        },
        status: {
          required: true,
          message: "请选择类型",
          trigger: "change"
        },
        list: {
          type: "array",
          required: true,
          message: "请选择商品",
          trigger: "change"
        }
      },
      dialogFormVisible: false,
      goodsLoading: false,
      goodsList: [],

      imgSrcBasic: "",
      articleList: []
    };
  },
  created() {
    getNewsPage({
      pageSize: 999
    }).then(res => {
      this.articleList = res.result.records;
    });
    this.imgSrcBasic = process.env.BASE_API;
  },
  components: {
    searchView,
    CommonTable
  },
  methods: {
    // 上传限制
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message({
          showClose: true,
          message: "只能上传jpeg,gif,png,bmp,pdf等类型的图片文件",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          showClose: true,
          message: "图片大小不超过2M",
          type: "warning"
        });
      }
      if ((isJPG || isBMP || isGIF || isPNG) && isLt2M) {
        this.typeBok = true;
      } else {
        this.typeBok = false;
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
    // 上传成功提示
    handleChange(response, type) {
      if (response.code == 200) {
        if (type == 0) {
          this.dialogForm.banner = response.result;
        } else if(type == 1){
          this.dialogForm.banners = response.result;
        } else {
          this.dialogForm.imgOne = response.result;
        }
        this.$notify({
          title: response.message,
          type: "success"
        });
      }
    },

    // 数据列表
    getList() {
      this.options.loading = true;
      getIndexBanner({
        type: 1
      }).then(res => {
        this.tableData = res.result;
        this.options.loading = false;
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
            if (this.dialogForm.status == 0) {
              this.goodsList = [];
            }
            this.goodsList.push(res.result);
          } else {
            this.$message.error(res.message);
          }
          this.goodsLoading = false;
        });
      } else {
        this.$message.error("请输入商品编码");
        this.goodsLoading = false;
      }
    },

    // 查看图片
    lookThis(val) {
      this.photoUrl = val;
      this.photoVisible = true;
    },

    // 排序问题
    valChang(val) {
      this.options.loading = true;
      let params = {
        id: val.id,
        type: 1,
        sort: val.sort
      };
      saveOrEditBanner(params)
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
      this.goodsList = [];
      this.dialogFormVisible = false;
      this.$refs["dialogForm"].resetFields();
    },
    // 新增
    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.dialogForm.status == 0) {
            if (this.dialogForm.list.length > 0) {
              this.dialogForm.itemId = this.dialogForm.list[0];
            } else {
              this.$notify.error({
                title: "请输入商品编码选择商品",
                offset: 100
              });
              return;
            }
          } else if (this.dialogForm.status == 1) {
            if (this.dialogForm.itemId == "") {
              this.$notify.error({
                title: "请选择关联专题",
                offset: 100
              });
              return;
            }
          } else {
            if (this.dialogForm.list.length > 0) {
              this.dialogForm.itemIds = this.dialogForm.list;
            } else {
              this.$notify.error({
                title: "请输入商品编码选择商品",
                offset: 100
              });
              return;
            }
          }
          this.btnLoading = true;
          saveOrEditBanner(this.dialogForm)
            .then(res => {
              this.btnLoading = false;
              if (res.code == 200) {
                this.cancelDialog();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.goodsList = [];
                this.getList();
              } else {
                this.$notify.error({
                  title: res.message,
                  offset: 100
                });
              }
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },

    // 删除
    del(val) {
      this.$confirm("此操作将永久删除该banner是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: val.id
          };
          deleteBanner(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 单选改变
    radioChange() {
      this.dialogForm.imgOne = "";
      this.dialogForm.banners = "";
      this.dialogForm.secondaryName = "";
      this.dialogForm.codes = "";
      this.dialogForm.list = [];
      this.dialogForm.itemIds = [];
      this.dialogForm.itemId = "";
      this.goodsList = [];
      this.$refs["dialogForm"].clearValidate();
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
