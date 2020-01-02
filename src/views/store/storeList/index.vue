<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-17 16:14:05
 * @LastEditTime: 2019-09-17 14:11:12
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
        新增编辑
    -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
      <el-form
        :model="dialogForm"
        style="width: 90%;margin: 0 auto;"
        status-icon
        :rules="dialogFormRules"
        ref="dialogForm"
      >
        <div class="formTitle">店铺信息</div>
        <el-form-item label="店铺SCM编码" label-width="200px" prop="scmCode">
          <el-input v-model="dialogForm.scmCode"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称" label-width="200px" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="客服电话" label-width="200px" prop="name">
          <el-input v-model="dialogForm.serviceTel"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" label-width="200px">
          <el-cascader
            clearable
            style="width:450px;"
            v-model="dialogForm.code"
            :props="optionProps"
            :options="areaData"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="店铺图片" label-width="200px">
          <el-upload
            :file-list="dialogForm.storePic"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            list-type="picture-card"
            drag
            :limit="3"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="StoreImghandleChange"
            :on-change="StoreImgChange"
            :class="{hide:hideUpload}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="经营许可证" label-width="200px">
          <el-upload
            :file-list="dialogForm.cert"
            :action="imgSrcBasic + '/opc/auth/uploadFile'"
            list-type="picture-card"
            drag
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleCertRemove"
            :on-success="CerthandleChange"
            :on-change="CertChange"
            :class="{hide:CertHideUpload}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="发布渠道" label-width="200px" prop="storeChannels">
          <el-checkbox-group v-model="dialogForm.storeChannels">
            <el-checkbox
              v-for="channel in storeData.channels"
              :label="channel.id"
              :key="channel.id"
            >{{channel.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="使用语言" label-width="200px" prop="storeLangs">
          <el-checkbox-group v-model="dialogForm.storeLangs">
            <el-checkbox
              v-for="lang in storeData.langs"
              :label="lang.id"
              :key="lang.id"
            >{{lang.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-if="this.dialogTitle== '新增'">
          <div class="formTitle">管理员信息</div>
          <el-form-item label="管理员姓名" label-width="200px" prop="userName">
            <el-input v-model="dialogForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="管理员账号" label-width="200px" prop="loginName">
            <el-input v-model="dialogForm.loginName"></el-input>
          </el-form-item>
          <el-form-item label="账号密码" label-width="200px" prop="password">
            <el-input v-model="dialogForm.password"></el-input>
          </el-form-item>
          <el-form-item label="管理员邮箱" label-width="200px" prop="email">
            <el-input v-model="dialogForm.email"></el-input>
          </el-form-item>
        </div>
        <div class="formTitle">域名服务</div>
        <el-form-item label="二级域名" label-width="200px" prop="weiStoreSubdomain">
          <el-input v-model="dialogForm.weiStoreSubdomain">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="dialogClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchView from "@/components/searchView/index";
import CommonTable from "@/components/Table";
import axios from "axios";
import {
  storeList,
  toSaveStore,
  saveOrUpdateStore,
  checkScmCode,
  toUpdateStore,
  checkStoreName,
  checkSubdomain
} from "@/api/store/storeList/index";

export default {
  name: "storeList",
  data() {
    // 验证账号
    let validateScmCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入scm编码！"));
      } else if (!/^[^\s]+$/.test(value)) {
        callback(new Error("scm编码不能带有空格！"));
      } else {
        let params = "";
        if (this.dialogTitle == "新增") {
          params = {
            scmCode: this.dialogForm.scmCode
          };
          checkScmCode(params).then(res => {
            if (res.result == false) {
              callback();
            } else {
              callback("scm编码已存在!");
            }
          });
        } else {
          params = {
            scmCode: this.dialogForm.scmCode
          };
          if (this.dialogForm.scmCode == this.objectAss.scmCode) {
            callback();
          } else {
            checkScmCode(params).then(res => {
              if (res.result == false) {
                callback();
              } else {
                callback("scm编码已存在!");
              }
            });
          }
        }
      }
    };

    // 验证店名
    let validateStoreName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入店名！"));
      } else if (!/^[^\s]+$/.test(value)) {
        callback(new Error("店名不能带有空格！"));
      } else {
        let params = "";
        if (this.dialogTitle == "新增") {
          params = {
            storeName: this.dialogForm.name
          };
          checkStoreName(params).then(res => {
            if (res.result == false) {
              callback();
            } else {
              callback("店名已存在!");
            }
          });
        } else {
          params = {
            id: this.dialogForm.storeId,
            storeName: this.dialogForm.name
          };
          if (this.dialogForm.name == this.objectAss.name) {
            callback();
          } else {
            checkStoreName(params).then(res => {
              if (res.result == false) {
                callback();
              } else {
                callback("店名已存在!");
              }
            });
          }
        }
      }
    };
    // 验证二级域名
    let validateSubdomain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入二级域名！"));
      } else if (!/^[^\s]+$/.test(value)) {
        callback(new Error("二级域名不能带有空格！"));
      } else {
        let params = "";
        if (this.dialogTitle == "新增") {
          params = {
            subdomain: this.dialogForm.weiStoreSubdomain
          };
          checkSubdomain(params).then(res => {
            if (res.result == false) {
              callback();
            } else {
              callback("二级域名已存在!");
            }
          });
        } else {
          params = {
            subdomain: this.dialogForm.weiStoreSubdomain
          };
          if (
            this.objectAss.weiStoreSubdomain ==
            this.dialogForm.weiStoreSubdomain
          ) {
            callback();
          } else {
            checkSubdomain(params).then(res => {
              if (res.result == false) {
                callback();
              } else {
                callback("二级域名已存在!");
              }
            });
          }
        }
      }
    };

    return {
      // 发布渠道, 使用语言
      storeData: "",
      areaData: [], //地区数据
      // 拷贝数据
      objectAss: "",

      // 搜索table渲染的数据
      searchModel: [
        {
          input: [
            {
              placeholder: "请输入店铺名称",
              inputModel: "storeName",
              labelName: "店铺名称",
              model: "",
              type: "el-input"
            }
          ],
          button: [
            {
              type: "success",
              func: "addBtn",
              name: "新增店铺"
            },
            {
              type: "primary",
              func: "searchBtn",
              name: "搜索"
            }
          ]
        }
      ],

      // table和分页的数据
      columns: [
        {
          prop: "name",
          label: "店铺名称"
        },
        {
          prop: "description",
          label: "描述"
        },
        {
          prop: "createTime",
          label: "创建时间"
        },
        {
          width: "300px",
          button: true,
          label: "操作",
          group: [
            {
              // you can props => type size icon disabled plain
              name: "编辑",
              type: "warning",
              icon: "el-icon-edit",
              plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this.edit(row);
              }
            }
          ]
        }
      ],
      tableData: [],
      hideUpload: false,
      CertHideUpload: false,
      searchData: {},
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      options: {
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      optionProps: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true
      },
      provinceId: "",
      province: "",
      cityId: "",
      city: "",
      areaId: "",
      area: "",
      townId: "",
      town: "",
      dialogVisible: false,
      dialogImageUrl: "",
      imgSrcBasic: "",
      // 数据表
      dialogForm: {
        scmCode: "",
        name: "",
        storeChannels: [],
        storeLangs: [],
        loginName: "",
        userName: "",
        password: "",
        email: "",
        code: [],
        weiStoreSubdomain: "",
        serviceTel: "",
        storePic: [],
        cert: []
      },
      dialogFormRules: {
        scmCode: [
          { required: true, validator: validateScmCode, trigger: "blur" }
        ],

        name: [
          { required: true, validator: validateStoreName, trigger: "blur" }
        ],
        storeChannels: [
          {
            required: true,
            type: "array",
            message: "请选择发布渠道",
            trigger: "blur"
          }
        ],
        storeLangs: [
          {
            required: true,
            type: "array",
            message: "请选择使用语言",
            trigger: "blur"
          }
        ],
        loginName: [
          { required: true, message: "请输入管理员账号", trigger: "blur" }
        ],
        serviceTel: [
          { required: true, message: "请输入客服电话", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入管理员密码", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入管理员邮箱", trigger: "blur" }
        ],
        weiStoreSubdomain: [
          { required: true, validator: validateSubdomain, trigger: "blur" }
        ]
      },
  
      fileList: [],
      dialogFormVisible: false,
      dialogTitle: ""
    };
  },
  components: {
    searchView,
    CommonTable
  },
  created() {
    this.imgSrcBasic = process.env.BASE_API;
    if (this.areaData.length == 0) {
      axios.get("static/area.json").then(res => {
        // console.log(res.data);
        //乡镇列表
        let townsData = res.data.filter(item => {
          return item.parentid.length == 6;
        });
        //县级列表
        let countyData = res.data.filter(item => {
          return item.parentid.length == 4;
        });
        //市级列表
        let cityData = res.data.filter(item => {
          return item.parentid.length == 2;
        });
        //省份列表
        let provinceData = res.data.filter(item => {
          return item.parentid == "0";
        });
        provinceData.map(province => {
          this.$set(province, "children", []);
        });
        cityData.map(city => {
          this.$set(city, "children", []);
        });
        countyData.map(county => {
          this.$set(county, "children", []);
        });

        townsData.map(town => {
          countyData.map((county, index) => {
            if (town.parentid == county.id) {
              county.children.push(town);
            }
          });
        });

        countyData.map(county => {
          cityData.map(city => {
            if (county.parentid == city.id) {
              city.children.push(county);
            }
          });
        });

        cityData.map(city => {
          provinceData.map(province => {
            if (city.parentid == province.id) {
              province.children.push(city);
            }
          });
        });

        // console.log(provinceData, "省份");
        this.areaData = provinceData;

        // console.log(cityData, "市级");
        // console.log(countyData, "县级");
        // console.log(townsData, "乡镇");
      });
    }
    this.getStore();
  },
  methods: {
    //商品图片改变
    StoreImgChange(file, fileList) {
      if (fileList.length >= 3) {
        this.hideUpload = true;
      } else {
        this.hideUpload = false;
      }
    },
    //删除图片
    handleRemove(file, fileList) {
      this.dialogForm.storePic = fileList;
      if (fileList.length >= 3) {
        this.hideUpload = true;
      } else {
        this.hideUpload = false;
      }
    },
    //预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功提示
    StoreImghandleChange(response, file) {
      file.url = `http://static.ibaituan.cn/${file.response.result}`;
      if (response.code == 200) {
        this.dialogForm.storePic.push(file);
        this.$notify({
          title: response.message,
          type: "success"
        });
      }
    },
    //证书图片改变
    CertChange(file, fileList) {
      if (fileList.length >= 1) {
        this.CertHideUpload = true;
      } else {
        this.CertHideUpload = false;
      }
    },
    //删除图片
    handleCertRemove(file, fileList) {
      this.dialogForm.cert = fileList;
      if (fileList.length >= 1) {
        this.CertHideUpload = true;
      } else {
        this.CertHideUpload = false;
      }
    },
    // 证书上传成功提示
    CerthandleChange(response, file) {
      file.url = `http://static.ibaituan.cn/${file.response.result}`;
      if (response.code == 200) {
        this.dialogForm.cert.push(file);
        this.$notify({
          title: response.message,
          type: "success"
        });
      }
    },
    handleChange(value) {
      if (value) {
        this.provinceId = "";
        this.province = "";
        this.cityId = "";
        this.city = "";
        this.countyId = "";
        this.county = "";
        this.townId = "";
        this.town = "";
        this.areaData.map(province => {
          if (value[0] == province.id) {
            this.provinceId = province.id;
            this.province = province.name;
            province.children.map(city => {
              if (value[1] == city.id) {
                this.cityId = city.id;
                this.city = city.name;
              }
              if (city.children) {
                city.children.map(county => {
                  if (value[2] == county.id) {
                    this.areaId = county.id;
                    this.area = county.name;
                  }
                  if (county.children) {
                    county.children.map(town => {
                      if (value[3] == town.id) {
                        this.townId = town.id;
                        this.town = town.name;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    },
    // 获取发布渠道, 使用语言
    getStore() {
      toSaveStore().then(res => {
        this.storeData = res.result;
      });
    },

    // 获取列表
    getList() {
      this.options.loading = true;
      let params = Object.assign(
        {
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        },
        this.searchData
      );
      storeList(params).then(res => {
        this.tableData = res.result.records;
        this.pagination.total = Number(res.result.total);
        this.current = Number(res.result.current);
        this.options.loading = false;
      });
    },

    // 搜索方法
    searchBtn(val) {
      this.searchData = val;
      this.getList();
    },

    // 编辑调取方法
    edit(val) {
      let params = {
        id: val.id
      };
      toUpdateStore(params).then(res => {
        this.dialogForm.code = [];
        let code = [];
        if (!res.result.currentStoreInfo.storeInfo.storePic) {
          this.dialogForm.storePic = [];
        } else {
          this.dialogForm.storePic = [];
          let arr = res.result.currentStoreInfo.storeInfo.storePic.split(",");
          arr.map((item, index) => {
            this.dialogForm.storePic.push({
              name: `第${index}张图片`,
              url: item
            });
          });
        }
        if (!res.result.currentStoreInfo.storeInfo.cert) {
          this.dialogForm.cert = [];
        } else {
          this.dialogForm.cert = [];
          let arr = res.result.currentStoreInfo.storeInfo.cert.split(",");
          arr.map((item, index) => {
            this.dialogForm.cert.push({
              name: `第${index}张图片`,
              url: item
            });
          });
        }
        if (res.result.currentStoreInfo.storeInfo.id) {
          this.dialogForm.storeId = res.result.currentStoreInfo.id;
        }
        if (res.result.currentStoreInfo.storeInfo.provinceId) {
          code.push(res.result.currentStoreInfo.storeInfo.provinceId);
        }
        if (res.result.currentStoreInfo.storeInfo.cityId) {
          code.push(res.result.currentStoreInfo.storeInfo.cityId);
        }
        if (res.result.currentStoreInfo.storeInfo.areaId) {
          code.push(res.result.currentStoreInfo.storeInfo.areaId);
        }
        if (res.result.currentStoreInfo.storeInfo.townId) {
          code.push(res.result.currentStoreInfo.storeInfo.townId);
        }
        this.dialogForm.code = code;
        this.dialogForm.scmCode = res.result.currentStoreInfo.storeInfo.scmCode;
        if (res.result.currentStoreInfo.storeInfo.serviceTel) {
          this.dialogForm.serviceTel =
            res.result.currentStoreInfo.storeInfo.serviceTel;
        }

        this.dialogForm.weiStoreSubdomain =
          res.result.currentStoreInfo.storeInfo.weiStoreSubdomain;
        this.dialogForm.name = res.result.currentStoreInfo.name;
        this.objectAss = Object.assign({}, this.dialogForm);
        res.result.currentStoreInfo.storeChannels.forEach(item => {
          this.dialogForm.storeChannels.push(item.channelId);
        });
        res.result.currentStoreInfo.storeLangs.forEach(item => {
          this.dialogForm.storeLangs.push(item.langId);
        });

        this.formFun(val, "edit");
      });
    },
    // 新增调取方法
    addBtn() {
      this.dialogForm.storeId = "";
      this.formFun("", "add");
    },
    // 编辑新增公共函数
    formFun(val, type) {
      if (type == "add") {
        this.dialogTitle = "新增";
      } else {
        this.dialogTitle = "编辑";
      }
      this.dialogFormVisible = true;
    },

    dialogClick() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.dialogForm);
          params.provinceId = this.provinceId;
          params.province = this.province;
          params.cityId = this.cityId;
          params.city = this.city;
          params.areaId = this.areaId;
          params.area = this.area;
          params.townId = this.townId;
          params.town = this.town;
          let storeImgArr = [];
          let certArr = [];
          if(params.storePic) {
            if (params.storePic.length > 0) {
              console.log(1)
              params.storePic.map(picture => {
                storeImgArr.push(picture.url);
              });
              params.storePic = storeImgArr.toString();
            }else {
              params.storePic = ""
            }
          }
          if(params.cert) {
            if (params.cert.length > 0) {
              console.log(2)
              params.cert.map(picture => {
                certArr.push(picture.url);
              });
              params.cert = certArr.toString();
            }else {
              params.cert = [];
            }
          }
          saveOrUpdateStore(params)
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                this.cancelDialog();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
                this.getList();
              } else {
                this.$message(res.message);
              }
            })
            .catch(err => {
              this.$message(err.response);
            });
        }
      });
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogForm = {
        scmCode: "",
        name: "",
        storeChannels: [],
        storeLangs: [],
        loginName: "",
        userName: "",
        password: "",
        email: "",
        weiStoreSubdomain: ""
      };
      this.$refs["dialogForm"].resetFields();
    }
  }
};
</script>

<style lang="sass">
  .labberConcessionsBox
    overflow: hidden
    margin: 20px 20px 0
  .formTitle
    height: 40px
    line-height: 40px
    border-bottom: 1px solid #ccc
    margin-bottom: 20px
  
</style>
<style>
.hide .el-upload--picture-card {
  display: none;
}
.el-upload-dragger {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200px;
  height: 147px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
</style>
