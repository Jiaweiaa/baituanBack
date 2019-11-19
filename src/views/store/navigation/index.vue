<!-- 商品分类页 -->
<template  >

  <div v-loading="loding" v-if="true">
    <!-- 树表 -->
    <div class="custom-tree-container">
      <el-card class="box-card">
        <el-button type="text" @click.prevent.stop="openDriver">打开页面引导</el-button>
        <el-alert title="小提示:可以在输入框中输入搜索条件过滤数据" type="success"></el-alert>
        <div style="width:60%;margin:20px;auto;" class="input">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable class="input"></el-input>
           <el-button type="primary" @click="toEdit('createMain')">添加主菜单</el-button>
           <el-button type="primary" @click="toggleExpand()">展开/收起</el-button>
        </div>
      </el-card>
      <el-card class="box-card tree">
        <el-tree
          :data="listData"
          :props="defaultProps"
          node-key="id"

          :filter-node-method="filterNode"
          :highlight-current="true"
          :check-on-click-node="true"
          ref="tree"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
            @click="getCheckedNodes(node,data)"
            style="width: 100%;"
          >
            <i :class="node.icon"></i>
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-card>
    </div>
    <!-- 操作菜单 -->
    <div class="my-panel">
      <el-card class="box-card" style="width:100%;">
        <el-row style="margin-bottom:20px;" type="flex" justify="space-around">
          <el-col :span="8">
            <el-button style="width:200px;" @click="moveUp()">上移</el-button>
          </el-col>
          <el-col :span="8">
            <el-button style="width:200px;" @click="moveDown()">下移</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px;" type="flex" justify="space-around">
          <el-col :span="8">
            <el-button style="width:200px;" @click="upgrade">升级</el-button>
          </el-col>
          <el-col :span="8">
            <el-button style="width:200px;" @click="demotion">降级</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px;" type="flex" justify="center">
          <el-col :span="14">
            <el-button style="width:400px;" @click="toEdit('createSon')" type="primary">创建子菜单</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px;" type="flex" justify="center">
          <el-col :span="14">
            <el-button style="width:400px;" @click="toEdit('editThis')" type="primary">编辑菜单</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px;" type="flex" justify="space-around">
          <el-col :span="14">
            <el-button style="width:400px;" type="danger" @click="deleteThis">删除</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- <el-card class="box-card">
        <div class="form">
          <h3>编辑分类</h3>
          <div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="分类名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="分类编码">
                <el-input v-model="form.id"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveChange">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>-->
    </div>
  </div>
  <router-view v-else  />
</template>

<script>
import Driver from "driver.js"; // import driver.js
import "driver.js/dist/driver.min.css"; // import driver.js css
import steps from "./defineSteps";
import { PcCookie, enums } from "@/utils";
import {
  getStoreNavigationTree,
  moveNavigation,
  navigationAdjustGradeUp,
  navigationAdjustGradeDown,
  deleteNavigationById
} from "@/api/store/navigation";
export default {
  name: "mallClass",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      expandAll:false,//是否展开树节点
      driver: null,
      loding: false, //是否显示loading
      editShow: false, //是否显示操作区标识变量
      ident: "", //调用保存方法时接口标识
      filterText: "", //过滤条件
      form: {}, //表单数据
      selectdNode: {}, //被选中的节点
      listData: [], //树表数据
      //tree数据渲染配置项
      defaultProps: {
        children: "nodes",
        label: "name"
      }
    };
  },

  methods: {
    //展开/收缩所有树节点
    toggleExpand(){
     this.$refs.tree.store.defaultExpandAll = true;
     console.log( this.$refs.tree);
      // console.log(this.expandAll);
    },
    /**
     * @打开引导
     */
    openDriver() {
      this.driver.defineSteps(steps);
      this.driver.start();
    },
    /**
     * @获取树表数据
     */
    getData() {
      // this.loding = true;
      getStoreNavigationTree()
        .then(res => {
          if (res.code == "200") {
            this.listData = res.result.nodes;
            this.$nextTick(() => {
              //如果存在被选中的节点 刷新列表时默认选中 通过代码动态刷新节点信息
              if (Object.keys(this.selectdNode).length > 0) {
                this.$refs.tree.setCurrentKey(this.selectdNode.data.id);
                this.selectdNode.data = this.$refs.tree.getCurrentNode();
              }
            });
          }
          this.loding = false;
        })
        .catch(err => {
          this.loding = false;
        });
    },
    /**
     * @获取点击的节点信息
     */
    getCheckedNodes(node, data) {
      
      this.ident = "";
      this.selectdNode = node; //把获取到的node信息存储到本地
      console.log(data.name,'000');
      let dataSource = Object.assign({},data);
      // dataSource.delete('nodes');
      delete dataSource['nodes'];
      window.sessionStorage.setItem('navagation_form',JSON.stringify(dataSource));
      // PcCookie.set({
      //   key: enums.FORMS.NAVIGATION_FORM,
      //   value: dataSource
      // });
      console.log(window.sessionStorage.getItem('navagation_form'));
    //  console.log(PcCookie.get(enums.FORMS.NAVIGATION_FORM));
      // console.log(enums);
      // console.log(this.$refs.tree.getCurrentNode());
      this.form = Object.assign({}, data);
      this.editShow = true;
    },
    /**
     * @前端过滤节点
     */
    filterNode(value, data) {
      //显示符合要求的节点
      // console.log(data);
      if (!value) return true;
      return data.name.includes(value);
    },
    /**
     * @上移
     */
    moveUp() {
      let node = this.selectdNode;
      if (node.data.preId) {
        let params = {
          moveId: node.data.preId,
          moveSort: node.data.preSort,
          categoryId: node.data.id,
          categorySort: node.data.sort
        };
        moveNavigation(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
      }
    },
    /**
     * @下移
     */
    moveDown() {
      let node = this.selectdNode;
      if (node.data.nextId) {
        let params = {
          moveId: node.data.nextId,
          moveSort: node.data.nextSort,
          categoryId: node.data.id,
          categorySort: node.data.sort
        };
        moveNavigation(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
      }
    },
    /**
     * @升级
     */
    upgrade() {
      let node = this.selectdNode;
      if (node.data.parentId != "0") {
        let params = {
          parentId: node.data.parentId,
          navigationId: node.data.id
        };
        navigationAdjustGradeUp(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
      } else {
        this.$message.error("该节点不可升级");
      }
    },
    /**
     * @降级
     */
    demotion() {
      let node = this.selectdNode;
      if (node.data.preId != "" && node.data.preId != null) {
        let params = {
          preId: node.data.preId,
          navigationId: node.data.id
        };
        navigationAdjustGradeDown(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
      } else {
        this.$message.error("该节点不可降级");
      }
    },
    toEdit(val){
       switch (val) {
         case "createMain":
           this.$router.push({
             path:'/store/navigationTemplate/navigationDetail',
             query:{
               flag:'0'
             }
           })
           break;
         case "editThis":
          //  console.log(this.selectdNode)
           this.$router.push({
             path:'/store/navigationTemplate/navigationDetail',
             query:{
               flag:'1'
             }
           })
           break;
        case "createSon":
          //  console.log(this.selectdNode)
           this.$router.push({
             path:'/store/navigationTemplate/navigationDetail',
             query:{
               flag:'2'
             }
           })
           break;   
         default:
           break;
       }
    },
    /**
     * @删除节点
     */

    deleteThis() {
      this.$confirm("此操作将永久删除该节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: this.form.id
          };
          deleteNavigationById(params)
            .then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getData();
              } else {
                this.$message({
                  message: res.message
                });
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
    }
  },
  mounted() {
    // console.log(this);
    // alert(111)
    this.getData();
    this.driver = new Driver({ doneBtnText: "结束引导" });
    // this.openDriver();
  }
};
</script>
<style lang='scss' scoped>
.input {
  width: 50%;
}
.custom-tree-container {
  width: 40%;
  min-height: 90vh;
  margin-top: 5vh;
  margin-left: 10vw;
  float: left;
}
.custom-tree-container .tree {
  max-height: 60vh;
  overflow: auto;
}
.my-panel {
  float: right;
  width: 40%;
  // height: 90vh;
  margin-top: 17vh;
  margin-right: 7vw;
  display: flex;
  background: #fff;

  & .operate {
    padding: 20px;
    & .el-row {
      display: flex;
      justify-content: center;
      & .el-button {
        margin: 10px;
      }
    }
  }

  & .form {
    padding: 20px;
    border-left: none;

    & h3 {
      margin: 0;
      padding: 10px;
      font-size: 16px;
    }
  }
}
</style>