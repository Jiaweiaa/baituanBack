<!-- 会员分组 -->
<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never" style="margin-top:20px;">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click.stop="openDialog('add')"
        size="small"
      >添加</el-button>
    </el-card>
    <!-- 列表及分页 -->
    <div style="margin-top:20px;">
      <CommonTable :columns="columns" :dataSource="listData" :options="options" :fetch="getData"/>
    </div>
    <!-- 表单模态框 -->
    <el-dialog
      :title="this.from=='edit'?'编辑':'新增'"
      :visible.sync="FormDialog"
    >
      <el-form :model="submitForm" status-icon ref="submitForm" label-width="150px" :rules="FormRules">
        <el-form-item label="分组类型" >
          <el-select v-model="submitForm.type" clearable placeholder="请选择分组类型" prop="type">
            <el-option
              v-for="item in typeOption"
              :key="item.type"
              :label="item.value"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组名称" prop="name">
          <el-input
            placeholder="请输入分组名称"
            v-model="submitForm.name"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="分组等级" v-if="submitForm.type==1" prop="level">
          <el-input
            placeholder="请输入分组等级"
            type="number"
            v-model="submitForm.level"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="分组描述" >
          <el-input
            placeholder="请输入分组描述"
            v-model="submitForm.description"
            type="textarea"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormDialog = false">取 消</el-button>
        <el-button type="primary" @click="SubmitForm(submitForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/Table";
import { getMemGroupList, deleteMemGroup,insertOrEditMemGroup,checkNameOrLevel } from "@/api/member/memberGroup";
export default {
  name: "",
  data() {
    let asyncName = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入分组名称"));
      } else if (value == this.finalName) {
        return callback();
      } else {
        // let params = Object.assign({},this.submitForm)
        let params = {
            name :this.submitForm.name
        }
        checkNameOrLevel(params)
          .then(res => {
            if (res.result == true) {
              return callback();
            } else {
              return callback(new Error('分组名称已存在!'));
            }
          })
          .catch(err => {});
      }
    };
    //检查分组等级异步方法
    let asyncLevel = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入分组名称"));
      } else if (value == this.finalLevel) {
        return callback();
      } else {
        // let params = Object.assign({},this.submitForm)
        let params = {
            level :this.submitForm.level
        }
        checkNameOrLevel(params)
          .then(res => {
            if (res.result == true) {
              return callback();
            } else {
              return callback(new Error('分组等级已存在!'));
            }
          })
          .catch(err => {});
      }
    };
    return {
      listData: [], //列表数据
      //表格列属性
      columns: [
        {
          prop: "typeName",
          label: "分组类型"
        },
       
        {
          prop: "name",
          label: "分组名称"
        },
        
        {
          prop: "description",
          label: "说明",
          width: 160
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
                this.from="编辑"
                this.finalName = row.name;
                this.finalLevel = row.level;
                this.openDialog('edit',row)
              }
            },
            {
              circle: true,
              type: "danger",
              icon: "el-icon-delete",
              onClick: (row, index) => {
                this.deleteGroup(row)
              }
            }
          ]
        }
      ],
      options: {
        //列表配置项
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      //会员类型
      typeOption:[
        {
          type:0,
          value:'普通'
        },
        {
          type:1,
          value:'等级'
        }
      ],
      FormDialog:false,//表单模态框是否开启
      from:"",//模态框标题标识
      finalName:"",
      finalLevel:"",
      submitForm:{
        description:'',
        level:'',
        name:'',
        type:''
      },
      initForm:{
        description:'',
        level:'',
        name:'',
        type:''
      },
      FormRules: {
        //添加表单校验规则
        type: [
          { required: true, message: "请选择分组类型", trigger: "blur" }
        ],
        level         : [
          { required: true, message: "请输入分组等级", trigger: "blur" },
          { validator: asyncLevel, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入分组名称", trigger: "change" },
          { validator: asyncName, trigger: "blur" }
        ]
      },
    };
  },

  components: {
    CommonTable
  },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    /**
     * @获取列表
     */
    getData() {
      getMemGroupList()
        .then(res => {
          if (res.code == "200") {
            this.listData = res.result;
            this.listData.map((v) => {
              if(v.type == 0){
                this.$set(v,'typeName','普通')
              }else{
                this.$set(v,'typeName','等级')
              }
              
            })
          } else {
            this.$message(res.message);
          }
        })
        .catch(err => {});
    },
    /**
     * @删除分组
     */

    deleteGroup(item) {
      this.$confirm("此操作将永久删除该分组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { id: item.id };
          deleteMemGroup(params)
            .then(res => {
              this.$message(res.message);
              if (res.code == "200") {
                this.getData();
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  /**
   * @打开表单模态框
   */  
   openDialog(type,item){
     if(type=='add'){
       this.from = "新增"
       this.submitForm=Object.assign({},this.initForm);
       this.FormDialog= true
     }else{
       this.submitForm=Object.assign({},item);
       this.FormDialog= true
     }
   },
  /**
   * @提交表单
   */ 
   SubmitForm(form){
     let params = Object.assign({},form);
     insertOrEditMemGroup(params).then((res) => {
       this.FormDialog = false;
       this.$message(res.message);
       if(res.code == "200"){
         this.getData()
       }
     }).catch((err) => {
       this.FormDialog = false;
     });
   }
  }
};
</script>
<style lang='scss' scoped>
</style>