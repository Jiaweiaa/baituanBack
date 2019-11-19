<template>
	<div class="labberConcessionsBox">
    <div class="title">{{this.$route.query.title ? this.$route.query.title : ''}}</div>
    <el-form :model="dialogForm" status-icon :rules="dialogFormRules" ref="dialogForm">
      <el-form-item label="筛选项类型" label-width="120px" prop="type">
        <el-select style="width: 80%;" :disabled="editDisabled" v-model="dialogForm.type" @change="typeChange" placeholder="请选择筛选项类型">
          <el-option
            v-for="item in options"
            :key="item.status"
            :label="item.name"
            :value="item.status"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择筛选项" label-width="120px" prop="propertyId">
        <el-select style="width: 80%;" :disabled="editDisabled" v-model="dialogForm.propertyId" @change="propertyChildFun" placeholder="请选择筛选项">
          <el-option
            v-for="item in propertyChildList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="筛选显示名称" label-width="120px" prop="displayName">
        <el-input style="width: 80%;" placeholder="请输入筛选显示名称" v-model="dialogForm.displayName"></el-input>
      </el-form-item>
      <el-form-item label="筛选类型" label-width="120px" prop="optionType">
        <el-radio-group v-model="dialogForm.optionType">
          <el-radio :label="1">单选</el-radio>
          <el-radio :label="2">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可用渠道" label-width="120px" prop="checkList">
        <el-checkbox-group v-model="dialogForm.checkList">
          <el-checkbox v-for="(item, index) in channelList" :key="index" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="排序号" label-width="120px" prop="sortNo">
        <el-input style="width: 80%;" v-model="dialogForm.sortNo"></el-input>
      </el-form-item>
      <el-form-item label="编辑筛选值" label-width="120px" prop="valueCommands">
        <el-tag
          :key="tag.id"
          v-for="(tag, index) in dialogForm.valueCommands"
          closable
          :disable-transitions="false"
          @click.native="handleClick(tag, index)"
          @close="handleClose(tag)"
        >{{tag.value}}</el-tag>
        <el-button class="button-new-tag" size="small" @click="addNew">+ 添加筛选值</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="pageFooter dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="dialogClick">确 定</el-button>
    </div>

    <!--
      筛选值
    -->
    <el-dialog
      :title="typeTitle"
      :visible.sync="dialogVisible"
      :before-close="cancelPropertyDialog">
      <el-form :model="dialogPropertyForm" status-icon :rules="dialogPropertyFormRules"  ref="dialogPropertyForm">
        <el-form-item label="筛选值显示名称" label-width="120px" prop="displayName">
          <el-input placeholder="请输入筛选值显示名称" v-model="dialogPropertyForm.displayName" clearable>
          </el-input>
        </el-form-item>
        <div class="area" v-if="this.dialogForm.type == 1">
          <el-form-item label="区间最小值" label-width="120px" prop="regionStart">
            <el-input placeholder="请输入区间最小值" v-model="dialogPropertyForm.regionStart" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="区间最大值" label-width="120px" prop="regionEnd">
            <el-input placeholder="请输入区间最大值" v-model="dialogPropertyForm.regionEnd" clearable>
            </el-input>
          </el-form-item>
        </div>
        <div v-else>
          <!--<el-form-item label="筛选值类型" label-width="120px" prop="dialogPropertyForm">-->
          <!--<el-radio-group v-model="dialogPropertyForm" disabled size="small">-->
          <!--<el-radio label="1" border>勾选已有值</el-radio>-->
          <!--<el-radio label="2" border disabled>区间范围</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <el-form-item label="筛选范围" label-width="120px" prop="dynamicTags">
	          <!--
	          :label="$route.query.title == '新增' ? item.id :item.propertyValueIds" :key="$route.query.title == '新增' ? item.id :item.propertyValueIds"
	          -->
            <el-checkbox-group
              v-model="dialogPropertyForm.propertyValueIds">
              <el-checkbox v-for="item in dynamicTags" :label="item.id" :key="item.id" >{{item.displayValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPropertyDialog">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogPropertyClick">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
  import {
    getFilterOptionList,
    getPropertyList,
    getAllStoreChannel,
    getSortNo,
    getPropertyValueList,
    checkAttributes,
    insertFilterOptionValue,
    getEditFilterOption,
    insertOrEditFilterOption
  } from "@/api/gskeeper/filterOptionManage/index";

  export default {
    name: 'filterOptionManageDetail',
    data() {
      //  检查区间最小值
      let validRegionStart = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入区间最小值！'));
        } else if(!/^[0-9]*$/.test(value)){
          callback(new Error('请输入正确的区间最小值！'));
        }else {
          callback();
        }
      };

      //  检查区间
      let validRegionEnd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入区间最小值！'));
        } else if(!/^[0-9]*$/.test(value)){
          callback(new Error('请输入正确的区间最小值！'));
        }else {
          if(this.dialogPropertyForm.regionEnd < this.dialogPropertyForm.regionStart ) {
            callback(new Error('区间最大值不能小于区间最小值'));
          }else {
            callback();
          }
        }
      };

      //  检测筛选显示名称是否已存在
      let validDisplayName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入检测筛选显示名称！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('检测筛选显示名称不能带有空格！'));
        } else {
          let params = '';
          if(this.$route.query.title == '新增'){
            params = {
              filterOptionName: value
            };
          }else {
            params = {
              filterOptionName: value,
              id: this.dialogForm.id
            };
          }
          checkAttributes(params).then((res) => {
            if(res.result == false) {
              callback('筛选显示名称已存在!');
            }else {
              callback();
            }
          })
        }
      };

      // 检测排序号
      let validSortNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入排序号！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('排序号不能带有空格！'));
        } else {
          let params = '';
          if(this.$route.query.title == '新增'){
            params = {
              sortNo: value
            };
          }else {
            params = {
              sortNo: value,
              id: this.dialogForm.id
            };
          }
          checkAttributes(params).then((res) => {
            if(res.result == false) {
              callback('排序号已存在!');
            }else {
              callback();
            }
          })
        }
      };

      //  检测筛选显示名称是否已存在
      let validOptionName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入筛选项值显示名称！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('筛选项值显示名称不能带有空格！'));
        } else {
          let params = '';
          if(this.$route.query.title == '新增'){
            params = {
              filterOptionValueName: value
            };
          }else {
            params = {
              filterOptionValueName: value,
              id: this.dialogForm.id
            };
          }
          checkAttributes(params).then((res) => {
            if(res.result == false) {
              callback('筛选项值显示名称已存在!');
            }else {
              callback();
            }
          })
        }
      };
      return {
        editDisabled: false,

        btnLoading: false,
        options: [
          {
            name: "系统内置",
            status: 1
          },
          {
            name: "销售属性",
            status: 2
          },
          {
            name: "功能属性",
            status: 3
          }
        ],

        // 新增/编辑数据
        dialogForm: {
          type: '',
          propertyId: '',
          displayName: '',
          checkList: [],
          sortNo: '',
          optionType: 1,
          valueCommands: []
        },
        dialogFormRules: {
          type: {
            required: true,  message:'请选择筛选项类型', trigger: 'change'
          },
          propertyId: {
            required: true,  message:'请选择筛选项', trigger: 'change'
          },
          displayName: {
            required: true,  validator: validDisplayName, trigger: 'blur'
          },
          optionType: {
            required: true,  message:'请选择筛选类型', trigger: 'blur'
          },
          checkList: {
            required: true,  message:'请选择可用渠道', trigger: 'blur'
          },
          sortNo: {
            required: true,  validator: validSortNo, trigger: 'blur'
          },
          valueCommands: {
            required: true,  message:'请编辑筛选项', trigger: 'change'
          }
        },


        // 销售属性数据
        propertyList: [],
        // 新增/修改表选择筛选项管理
        propertyChildList: [],
        // 渠道列表数据
        channelList: [],
        // 筛选值的
        dynamicTags: [],

        // 筛选项表单
        dialogVisible: false,
        dialogPropertyForm: {
          displayName: '',
          propertyValueIds: [],
          regionStart: '',
          regionEnd: ''
        },
        typeTitle: '',
        dialogPropertyFormRules: {
          displayName: {
            required: true,  validator: validOptionName, trigger: 'blur'
          },
          regionStart: [
            {required: true,  validator: validRegionStart, trigger: 'blur'},
          ],
          regionEnd: [
            {required: true,  validator: validRegionEnd, trigger: 'blur'},
          ],
          propertyValueIds: [
            { required: true,  message:'请选择筛选范围', trigger: 'change'}
          ]
        },
        // 编辑筛选的下标
        dynamicIndex: ''

      }
    },

    created() {
      this.propertyListFun();
      // 获取所有筛选项
      getAllStoreChannel().then(res => {
        if(res.code == 200) {
          this.channelList = res.result;
          getSortNo().then(res => {
            this.dialogForm.sortNo = res.result;
            if(this.$route.query.title=='编辑') {
              this.editDisabled = true;
              getEditFilterOption({
                id: this.$route.query.id
              }).then(res => {
                let sortNo = this.dialogForm.sortNo;
                this.dialogForm = Object.assign({
                  sortNo,
                  checkList: [],
                  valueCommands: []
                }, res.result);
                if(this.dialogForm.type == 1) {
                  this.propertyChildList = this.propertyList.systemPropertyList;
                  this.dialogForm.propertyId = 1;
                }else if(this.dialogForm.type == 2) {
                  this.propertyChildList = this.propertyList.salePropertyList;
                }else {
                  this.propertyChildList = this.propertyList.functionPropertyList;
                }
                this.dialogForm.sysType = Number(this.dialogForm.sysType);
                this.dialogForm.channelIds = this.dialogForm.channelIds.split(',');
                this.dialogForm.channelIds.forEach(v => {
                  // this.dialogForm.checkList.push(parseInt(v));
                  this.dialogForm.checkList.push(v);
                })
                this.dialogForm.filterOptionValueList.map(v => {
                  let data = Object.assign({
                    value: v.displayName,
                    displayValue: v.displayName
                  }, v);
                  this.dialogForm.valueCommands.push(data)
                })
                this.dynamicTags = Object.assign({}, this.dialogForm.propertyValueList);
              })
            }
          })
        }
      })
    },

    methods: {
      // 获取筛选项数据
      propertyListFun() {
        getPropertyList().then(res => {
          if(res.code == 200) {
            this.propertyList = Object.assign({
              systemPropertyList: [{
                name: '价格',
                id: 1
              }]},
            res.result);
          }
        })
      },

      // 获取筛选项
      propertyChildFun(val) {
        let params = {
          propertyId: val
        };
        getPropertyValueList(params).then(res => {
          if(this.$route.query.title == '新增' && this.dialogForm.type == 1) {
            this.dialogForm.valueCommands = [
              {
                value: '0-299',
                regionStart: '0',
                regionEnd: '299'
              },
              {
                value: '300-599',
                regionStart: '300',
                regionEnd: '599'
              },
              {
                value: '600-999',
                regionStart: '600',
                regionEnd: '999'
              },
              {
                value: '1000-2499',
                regionStart: '1000',
                regionEnd: '2499'
              },
              {
                value: '2500以上',
                regionStart: '2500',
                regionEnd: ''
              }
            ];
          }else {
            this.dialogForm.valueCommands = res.result;
            console.log(this.dialogForm.valueCommands)
          }
          this.dynamicTags = Object.assign({},  this.dialogForm.valueCommands)
        })
      },

      // 筛选项变化
      typeChange(val) {
        this.dialogForm.propertyId = '';
        this.propertyChildList = [];
        this.dialogForm.valueCommands = [];
        if(val == 1) {
          this.propertyChildList = this.propertyList.systemPropertyList;
        }else if(val == 2) {
          this.propertyChildList = this.propertyList.salePropertyList;
        }else {
          this.propertyChildList = this.propertyList.functionPropertyList;
        }
      },

      // 筛选值的函数  编辑和新增
      handleClick(tag,index) {
        this.dynamicIndex = index;
        this.sameType('编辑', tag);
      },
      addNew() {
        this.sameType('新增')
      },
      sameType(title, tag) {
        if(this.dialogForm.propertyId == '') {
          this.$message({
            message: '请选择筛选项！',
            type: 'warning'
          });
        }else {
          this.dialogVisible = true;
          this.typeTitle = title;
          if(this.typeTitle == '编辑') {
            if(this.dialogForm.type == 1) {
              this.dialogPropertyForm = Object.assign({
                displayName : tag.value,
                regionStart : tag.regionStart,
                regionEnd : tag.regionEnd
              })
            }else{
              this.dialogPropertyForm.displayName = tag.value;
              if(this.dialogPropertyForm.values) {
               
                this.dialogPropertyForm.values.map(val => {
                  this.dialogPropertyForm.propertyValueIds.push(val);
                })
              }else {
                if(this.dynamicTags[this.dynamicIndex])  {
                  if(this.dynamicTags[this.dynamicIndex].propertyValueIds) {
                    this.dialogPropertyForm.propertyValueIds = this.dynamicTags[this.dynamicIndex].propertyValueIds.split(',');
                  }else {
                    this.dialogPropertyForm.propertyValueIds = [this.dynamicTags[this.dynamicIndex].id];
                  }
								}else {
                  if(tag.values) {
                    this.dialogPropertyForm.propertyValueIds = tag.values;
                  }else {
                    this.dialogPropertyForm.propertyValueIds = tag.propertyValueIds.split(',');
                  }
								}
              }
            }
          }
        }
      },

      // tag删除
      handleClose(tag) {
        this.dialogForm.valueCommands.splice(this.dialogForm.valueCommands.indexOf(tag), 1);
      },
      // tag属性编辑新增
      dialogPropertyClick() {
        this.$refs.dialogPropertyForm.validate((valid) => {
          if(valid) {
            if(this.typeTitle == '编辑') {
              if(this.dialogForm.type == 1) {
                this.$set(this.dialogForm.valueCommands[this.dynamicIndex], 'value', this.dialogPropertyForm.displayName);
                this.$set(this.dialogForm.valueCommands[this.dynamicIndex], 'regionStart', this.dialogPropertyForm.regionStart);
                this.$set(this.dialogForm.valueCommands[this.dynamicIndex], 'regionEnd', this.dialogPropertyForm.regionEnd);
              }else {
                this.dialogForm.valueCommands[this.dynamicIndex].value = this.dialogPropertyForm.displayName;
                this.dialogForm.valueCommands[this.dynamicIndex].values = [];
                console.log(this.dialogPropertyForm.propertyValueIds);
                this.dialogPropertyForm.propertyValueIds.map(val => {
                  this.dialogForm.valueCommands[this.dynamicIndex].values.push(val);
                })
              }
            }else {
              if(this.dialogForm.type == 1) {
                this.dialogForm.valueCommands.push({
                  value: this.dialogPropertyForm.displayName,
                  regionStart: this.dialogPropertyForm.regionStart,
                  regionEnd: this.dialogPropertyForm.regionEnd
                })
              }else {
                let data = {
                  value: this.dialogPropertyForm.displayName,
                  values: []
                }
                this.dialogPropertyForm.propertyValueIds.map(val => {
                  data.values.push(val);
                })
                this.dialogForm.valueCommands.push(data)
              }

            }
            this.cancelPropertyDialog();
          }
        });
      },
      cancelPropertyDialog() {
        this.$refs['dialogPropertyForm'].resetFields();
        this.dialogVisible = false;
        this.dialogPropertyForm = {
          displayName: '',
          propertyValueIds: [],
          regionStart: '',
          regionEnd: ''
        }
      },

      // 新增/编辑
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.dialogForm.channelIds = '';
            this.dialogForm.checkList.forEach(v => {
              this.dialogForm.channelIds += v + ',';
            });
            this.dialogForm.channelIds = this.dialogForm.channelIds.substr(0, this.dialogForm.channelIds.length - 1);
            if(this.dialogForm.type == 1) {
              this.dialogForm.sysType = 1;
              this.dialogForm.valueCommands.map(val => {
                val.type = '2';
                val.displayName = val.value;
              });
              let params = Object.assign({}, this.dialogForm);
              params.propertyId = '';
              insertOrEditFilterOption(params).then(res => {
                if(res.code == 200) {
                  this.$notify({
                    title: res.message,
                    type: "success"
                  });
                  this.$router.push({
                    path: '/mall/filterOptionTemplate/filterOptionManage'
                  });
                }
              })
            }else {
              let params = Object.assign({}, this.dialogForm);
              params.valueCommands.map(v => {
                if(v.values) {
                  v.displayName = v.value;
                  v.propertyValueIds = [];
                  v.values.map(vv => {
                    v.propertyValueIds += vv + ',';
                  })
                  v.propertyValueIds = v.propertyValueIds.substr(0, v.propertyValueIds.length - 1);
                }
              });
              insertOrEditFilterOption(params).then(res => {
                if(res.code == 200) {
                  this.$notify({
                    title: res.message,
                    type: "success"
                  });
                  this.$router.push({
                    path: '/mall/filterOptionTemplate/filterOptionManage'
                  });
                }
              })
            }
          }
        })
      },
      cancelDialog() {
        this.$router.push({
          path: '/mall/filterOptionTemplate/filterOptionManage'
        });
      }


    }
  }
</script>

<style lang="sass">
  .labberConcessionsBox
    overflow: hidden
    margin: 20px 20px 0
    .el-tag
      margin-left: 10px
      cursor: pointer
    .button-new-tag
      margin-left: 10px
      height: 32px
      line-height: 30px
      padding-top: 0
      padding-bottom: 0
    .input-new-tag
      width: 90px
      margin-left: 10px
      vertical-align: bottom
  .title
    font-size: 20px
    font-weight: bold
    font-weight: bold
    margin-left: 20px
    margin-bottom: 20px
    color: #333
  .pageFooter
    float: right
    margin-right: 20px
</style>
