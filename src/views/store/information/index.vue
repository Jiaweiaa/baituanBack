<template>
  <div class="information">
    <div class="title">店铺信息</div>
    <el-form :model="dialogForm" style="width: 80%;margin: 0 auto;" class="formStyle" status-icon :rules="dialogFormRules"  ref="dialogForm">
      <div class="formTitle">
        店铺
      </div>
      <el-form-item label="店铺名称" label-width="200px" prop="roleName">
        {{pageData.store ?  pageData.store.name : ''}}
      </el-form-item>
      <el-form-item label="店铺ID" label-width="200px" prop="roleName">
        {{pageData.store ? pageData.store.id: ''}}
      </el-form-item>
      <div class="formTitle">
        店铺信息
      </div>
      <el-form-item :label="itemChannels.name" label-width="200px" v-for="itemChannels in dialogForm.channelsStatus" :key="itemChannels.id">
        <el-radio-group v-model="itemChannels.status">
          <el-radio :label="2">发布(所有用户均能访问)</el-radio>
          <el-radio :label="1">未发布(所有用户均不能访问)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="itemLangs.name" label-width="200px" v-for="itemLangs in dialogForm.langsStatus" :key="itemLangs.id">
        <el-radio-group v-model="itemLangs.status">
          <el-radio :label="2">发布(前台网站可切换到该语言)</el-radio>
          <el-radio :label="1">下线(不能访问到该语言)</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="formTitle">
        店铺SEO信息
      </div>
      <el-form-item label="Meta title" label-width="200px" prop="seoTitle">
        <el-input v-model="dialogForm.seoTitle"></el-input>
      </el-form-item>
      <el-form-item label="Meta keywords" label-width="200px" prop="seoKeywords">
        <el-input v-model="dialogForm.seoKeywords"></el-input>
      </el-form-item>
      <el-form-item label="Meta description" label-width="200px" prop="seoDescription">
        <el-input v-model="dialogForm.seoDescription"></el-input>
      </el-form-item>
    </el-form>
    <div style="float: right;margin-right: 10%;" slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="dialogClick">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import {
    editStoreInfo,
    updateStoreInfo
  } from "@/api/store/information/index";

  export default {
    name: 'information',
    data() {
      return {
        pageData: '',

        dialogForm: {
          seoTitle: '',
          seoKeywords: '',
          seoDescription: '',
          langStatus: [],
          channelStatus: []
        },
        dialogFormRules: {
          seoTitle:[
            {required: true,  message: '请输入SEO搜索标题', trigger: 'blur'}
          ],
          seoKeywords:[
            {required: true,  message: '请输入SEO搜索关键词', trigger: 'blur'}
          ],
          seoDescription:[
            {required: true,  message: '请输入SEO搜索描述', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      editStoreInfo().then(res => {
        console.log(res);
        this.pageData = res.result;
        this.dialogForm = this.pageData.store.storeInfo;
        this.dialogForm.langsStatus = this.pageData.store.storeLangs;
        this.dialogForm.channelsStatus = this.pageData.store.storeChannels;
      })
    },
    methods: {
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({
              storeName: this.pageData.store.name,
              updateStoreChannelDtos: [],
              updateStoreLangDtos: []
            }, this.dialogForm);

            this.dialogForm.langsStatus.forEach((item, index) =>  {
              params.updateStoreLangDtos.push({
                id: item.id,
                status: item.status
              })
            })
            this.dialogForm.channelsStatus.forEach((item, index) =>  {
              params.updateStoreChannelDtos.push({
                id: item.id,
                status: item.status
              })
            })
            updateStoreInfo(params).then((res) => {
              if(res.code == 200) {
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }
            })
          }
        });
      },
      cancelDialog() {

      }
    }
  }
</script>

<style lang="sass">
  .title
    font-size: 20px
    font-weight: bold
    margin-left: 20px
    margin-bottom: 20px
    color: #333
  .information
    overflow: hidden
    margin: 20px 20px 0
  .formTitle
    height: 40px
    line-height: 40px
    border-bottom: 1px solid #ccc
    margin-bottom: 20px
</style>
