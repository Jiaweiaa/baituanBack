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
      @selection-change="handleSelectionChange"
		/>

    <!--
      图片查看
    -->
    <el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
      <div style="text-align: center;">
        <img
          width="360"
          :src="'http://qn.gaoshanmall.cn/'+photoUrl"
          alt="">
      </div>
    </el-dialog>

    <!--
				新增/编辑模态框模态框
			-->
    <el-dialog :title="dialogTitle"  :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input v-model="dialogForm.title"></el-input>
        </el-form-item>

        <el-form-item label="排序" label-width="120px" prop="seq">
          <el-input v-model="dialogForm.seq"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" label-width="120px" prop="hasShow">
          <el-radio-group v-model="dialogForm.hasShow">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="note">
          <el-input v-model="dialogForm.note"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px" prop="img">
          <el-upload
            class="avatar-uploader"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            :show-file-list="false"
            :on-success="handleChange"
            :before-upload="beforeUpload">
            <img v-if="dialogForm.img" :src="`http://qn.gaoshanmall.cn/${dialogForm.img}?imageMogr2/thumbnail/180x180`" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" label-width="120px" prop="content">
          <tinymce  width="100%" ref="tinymce" :height="300" v-model="dialogForm.content"></tinymce>
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
  import CommonTable from '@/components/Table'
  import { addBanner, changeBannersStatus, findBannerInfo, findBannerList, updateBanner } from '@/api/gskeeper/bannerManager/index';
  import Tinymce from "@/components/Tinymce/keeperIndex";

  export default {
    name: 'bannerManager',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入标题关键词',
                inputModel: 'title',
                labelName: '标题',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'warning',
                func: 'addBtn',
                name: '新增轮播图'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              },
              {
                type: 'success',
                func: 'hasShow',
                name: '批量启用'
              },
              {
                type: 'danger',
                func: 'disShow',
                name: '批量禁用'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'hasShow',
            label: '是否显示',
            render: (row, index) => {
              return (
               <div>{row.hasShow == 0 ? '不显示' :'显示'}</div>
            )}
          },
          {
            prop: 'img',
            label: '图片',
            render: (row, index) => {
              return (
              <img
                on-click={() => this.lookThis(row.img)}
                style="width: 50px; height: 50px; cursor: pointer;"
                src={"http://qn.gaoshanmall.cn/"+row.img}
              />
            )}
          },
          {
            prop: 'note',
            label: '备注'
          },
          {
            prop: 'seq',
            label: '显示顺序',
            render: (row, index) => {
              return (
                <el-input-number onChange={e => this.valChang(row)} min={1}  precision={0} size="small"  v-model={row.seq} step={1}></el-input-number>
            )}

          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'createBy',
            label: '创建人'
          },
          {
            prop: 'updateTime',
            label: '更新时间'
          },
          {
            prop: 'updateBy',
            label: '更新人'
          },
          {
            button: true,
            width: '200px',
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
            }]
          }
        ],
        checkedList: [],
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 10
        },
        imgSrcBasic: '',
        options: {
          mutiSelect: true,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          title: '',
          hasShow: 1,
          seq: '',
          content: '',
          img: ''
        },
        dialogFormRules: {
          title: {
            required: true,  message:'请输人标题', trigger: 'blur'
          },
          hasShow: {
            required: true,  message:'请选择是否显示', trigger: 'blur'
          },
          seq: [
            {required: true,  message: '请输入排序', trigger: 'blur'}
          ],
          content: [
            {required: true,  message: '请输入内容', trigger: 'blur'}
          ],
          img: [
            {required: true,  message: '请上传图片', trigger: 'blur'}
          ]
        },
        typeBok: false,
        dialogFormVisible: false,
        photoUrl: '',
        photoVisible: false
      }
    },
    created() {
      this.imgSrcBasic = process.env.BASE_API;
    },
    components: {
      searchView,
      CommonTable,
      Tinymce
    },
    methods: {
      // 查看图片
      lookThis(val) {
        this.photoUrl = val;
        this.photoVisible = true;
      },
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        findBannerList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },

      handleSelectionChange(val) {
        this.checkedList = [];
        val.map(v => {
          if(v) {
            this.checkedList.push(v.id);
          }
        })
      },
      // 批量操作
      disShow() {
        this.showFun(0);
      },
      hasShow() {
        this.showFun(1);
      },
      showFun(type) {
        let params = {
          ids: this.checkedList,
          hasShow: type
        }
        changeBannersStatus(params).then(res => {
          if(res.code == 200) {
            this.getList();
          }
        })
      },
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },

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
      handleChange(response, file) {
        if (response.code == 200) {
          this.dialogForm.img = response.result;
          this.$notify({
            title: response.message,
            type: "success"
          });
        }
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
          this.dialogFormVisible = true;
        }else {
          this.dialogTitle = '编辑';
          let params = {
            id: val.id
          }
          findBannerInfo(params).then(res => {
            this.dialogForm = Object.assign({
              id : val.id
            }, res.result);
            this.dialogFormVisible = true;
            if(this.dialogForm.content) {
              this.$nextTick(() => {
                this.$refs['tinymce'].setContent(this.dialogForm.content);
              })
            }
          })
        }

      },


      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              addBanner(this.dialogForm).then((res) => {
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
              updateBanner(this.dialogForm).then((res) => {
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
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {
          title: '',
          hasShow: 1,
          seq: '',
          content: '',
          img: '',
          note: ''
        };
        this.$refs['tinymce'].setContent('');
      },

      valChang(val) {
        this.options.loading = true;
        let params = {
          id: val.id,
          seq: val.seq
        }
        updateBanner(params).then((res) => {
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
  }
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
