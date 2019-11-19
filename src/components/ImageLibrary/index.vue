<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-17 16:14:05
 * @LastEditTime: 2019-09-17 13:57:40
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="galleries">
    <el-dialog title="图片库" :visible.sync="dialogFormVisible" center @close="closeDialog">
      <!-- 新增分组模态框 -->
      <el-dialog width="70%" title="新建分组" :visible.sync="innerAddVisible" append-to-body center>
        <el-form :model="addGroupForm" status-icon :rules="addGroupFormRules" ref="addGroupForm">
          <el-form-item label="分组类型" label-width="200px" prop="type">
            <el-select v-model="addGroupForm.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组名称" label-width="200px" prop="name">
            <el-input style="width:130px;" size="small" v-model="addGroupForm.name" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveGroup(addGroupForm)">确 定</el-button>
        </div>
      </el-dialog>
      <div class="galleriesContent" v-loading="libraryLoading">
        <div class="left">
          <el-select v-model="classify" placeholder="请选择分类" @change="fetchImageList">
            <el-option
              v-for="item in classifyOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-button
            size="small"
            class="el-icon-plus"
            @click="innerAddVisible=true"
            type="primary"
          >添加分组</el-button>
        </div>
        <div class="right">
          <div>
            <el-input style="width:300px;" placeholder="请输入图片名称" v-model="imgName" clearable></el-input>
            <el-button @click="fetchImageList" type="primary">搜 索</el-button>
          </div>
          <div class="image-group" v-if="imageList.length>0">
            <div v-for="item in imageList" :key="item.id" class="image-item">
              <img
                @click="addSelectImage(item)"
                style="width: 100px; height: 100px"
                :src="`http://qn.gaoshanmall.cn/${item.imgUrl}`"
              />
              <span class="library_imgName">{{item.imgName!=null?item.imgName:''}}</span>
            </div>
          </div>
          <el-alert
            v-else
            style="min-height:210px;"
            center
            :closable="false"
            title="暂无图片"
            type="error"
          ></el-alert>
          <div class="block">
            <el-pagination
              style="float:right;"
              small
              layout="prev, pager, next"
              @current-change="handleIndexChange"
              :total="pagination.total"
            ></el-pagination>
            <el-upload
              class="avatar-uploader"
              ref="upload"
              multiple
              :action="imgSrcBasic + '/opc/auth/uploadFile'"
              :beforeUpload="beforeUpload"
              :show-file-list="false"
              :on-success="handleChange"
              list-type="picture"
            >
              <el-button size="small" class="el-icon-plus" type="primary">添加图片</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="hasSelect">
        <div>已选择的图片</div>
        <el-card class="box-card" style="min-height:130px;">
          <div
            v-for="item in selectImageList"
            :key="item.id"
            style="display:inline-block;position:relative;"
          >
            <i
              style="position:absolute;top:0;right:0;"
              class="el-icon-error"
              @click="deleteImage(item)"
            ></i>
            <img
              style="width: 100px; height: 100px"
              :src="`http://qn.gaoshanmall.cn/${item.imgUrl}`"
            />
          </div>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHandle()">取 消</el-button>
        <el-button @click="addAndGoon()">添加并继续</el-button>
        <el-button @click="addAndFinish()" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchView from "@/components/searchView/index";
import {
  getImgGroupList,
  queryImagePage,
  saveOrEditStoreImage,
  insertOrEditImageGroup
} from "@/api/resources/picture";

export default {
  name: "ImageLibrary",
  data() {
    return {
      //加载框
      libraryLoading: false,
      //商品类型
      classifyOption: [
        {
          name: "全部",
          status: ""
        },
        {
          name: "商品",
          status: 1
        },
        {
          name: "其他",
          status: 0
        }
      ],
      selectObj: {},
      imgSrcBasic: "",
      classify: "", //已选中的商品类型 默认是""
      imgName: "", //图片名称
      innerAddVisible: false, //新建分组模态框是否显示
      // 添加图片分类表单
      addGroupForm: {
        name: "",
        type: ""
      },
      addGroupFormRules: {
        type: [{ required: true, message: "请选择分组类型", trigger: "blur" }]
      },
      typeOptions: [
        {
          id: 0,
          name: "其他"
        },
        {
          id: 1,
          name: "商品"
        }
      ],
      dialogFormVisible: this.isOpen,
      imageGroupList: [],
      imageList: [],
      selectImageList: [], //已选择的图片列表
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  props: {
    isOpen: Boolean, //模态框是否打开
    closeDialog: Function //关闭模态框回调
  },
  components: {
    searchView
  },
  watch: {
    isOpen() {
      this.dialogFormVisible = this.isOpen;
      if (this.dialogFormVisible) {
        this.$alert(
          "本组件的添加图片功能可以将本地图片添加至服务器图片库中,但只是快捷录入,为了方便运营者管理图片,请添加图片后前往资源管理模块将图片备注上名称便于统一管理及复用图片",
          "温馨提示",
          {
            confirmButtonText: "确定"
          }
        );
        // this.$notify({
        //   title: "温馨提示",
        //   message:
        //     "本组件的添加图片功能可以将本地图片添加至服务器图片库中,但只是快捷录入,为了方便运营者管理图片,请添加图片后前往资源管理模块将图片备注上名称便于统一管理及复用图片",
        //   type: "warning",
        //   offset: 300
        // });
      }
    }
  },
  mounted() {
    this.imgSrcBasic = process.env.BASE_API;
  },
  methods: {
    /**
     * @上传文件之前的钩子
     */
    beforeUpload(file) {
      if (this.groupName == "") {
        this.$message("请选择图片分组后再上传图片");
      }
    },
    //上传中的钩子
    onPprogress() {},

    // 上传成功提示
    handleChange(response, file) {
      console.log(file);
      if (response.code == 200) {
        this.libraryLoading = true;
        saveOrEditStoreImage({
          groupName: this.selectObj.groupName,
          imgUrl: response.result,
          groupId: this.selectObj.groupId
        })
          .then(res => {
            this.libraryLoading = false;
            this.$notify({
              title: response.message,
              type: "success"
            });
            this.fetchImageList();
          })
          .catch(err => {
            this.libraryLoading = false;
          });
      } else {
        this.libraryLoading = false;
      }
    },
    /**
     * @新增或编辑分组
     */

    saveGroup(item) {
      this.$refs.addGroupForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, item);
          insertOrEditImageGroup(params)
            .then(res => {
              if (res.code == "200") {
                this.fetchImageGroupList();
              }
            })
            .catch(err => {});
          this.$refs["addGroupForm"].resetFields();
          this.innerAddVisible = false;
        }
      });
    },
    /**
     * @获取图片分组列表
     */
    fetchImageGroupList() {
      getImgGroupList()
        .then(res => {
          if (res.code == "200") {
            // console.log(res);
            this.imageGroupList = res.result;
            this.classifyOption = [
              {
                name: "全部",
                type: "",
                id: ""
              },
              ...res.result
            ];
            this.fetchImageList();
          }
        })
        .catch(err => {});
    },
    /**
     * @获取图片列表
     */
    fetchImageList(id) {
      this.libraryLoading = true;
      let selectArr = this.classifyOption.filter(item => {
        return item.id === this.classify;
      });
      let selectObj = Object.assign({}, selectArr[0]);

      let params = {
        imgName: this.imgName,
        pageNum: this.pagination.pageIndex
      };
      params.name = selectObj.name;
      params.groupId = selectObj.id;
      params.type = selectObj.type;
      params.name == "全部" ? (params.name = "") : params.name;
      this.selectObj = Object.assign({}, params);
      queryImagePage(params)
        .then(res => {
          this.libraryLoading = false;
          this.imageList = res.result.records;
          this.pagination.total = Number(res.result.total);
        })
        .catch(err => {
          this.libraryLoading = false;
        });
    },
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.pagination.pageSize = size;
      this.fetchImageList();
    },
    handleIndexChange(current) {
      // 切换页码
      this.pagination.pageIndex = current;
      this.fetchImageList();
    },
    //添加已选择的图片
    addSelectImage(img) {
      this.selectImageList.push(img);
      this.selectImageList = Array.from(new Set(this.selectImageList)); //数组去重
    },
    //取消选择图片
    cancelHandle() {
      this.selectImageList = [];
      this.dialogFormVisible = false;
    },
    //选择并继续
    addAndGoon() {
      this.$emit("sendImageList", this.selectImageList);
      this.selectImageList = [];
    },
    //选择并结束
    addAndFinish() {
      this.$emit("sendImageList", this.selectImageList);
      this.selectImageList = [];
      this.dialogFormVisible = false;
    },
    //删除选中的图片
    deleteImage(item) {
      this.selectImageList.splice(
        this.selectImageList.findIndex(v => v.id === item.id),
        1
      );
    },
    //打开添加模态框
    openAddClassify() {
      this.addClassifyForm = {};
      this.addClassify = true;
    }
  },
  created() {
    // console.log(this.dialogFormVisible);
    this.fetchImageGroupList();
  }
};
</script>
<style lang='scss' scoped>
.image-group {
  min-height: 210px;
  display: flex;
  flex-wrap: wrap;
  .image-item {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 10px;
    .library_imgName {
      width: 100%;
      position: absolute;
      white-space: nowrap; /*超出的空白区域不换行*/
      overflow: hidden; /*超出隐藏*/
      text-overflow: ellipsis; /*文本超出显示省略号*/
      bottom: 0;
      background: rgba($color: #000000, $alpha: 0.7);
      color: #fff;
      font-size: 12px;
      padding: 5px 0;
      text-align: center;
      min-height: 24px;
    }
  }
}

.galleriesContent {
  overflow: hidden;
}
.left {
  width: 30%;
  float: left;
}
.right {
  width: 70%;
  float: right;
}
</style>
