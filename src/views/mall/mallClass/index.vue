<!-- 商品分类页 -->
<template  >
  <div>
    <!-- 树表 -->
    <div class="custom-tree-container">
      <el-card class="box-card">
        <el-button type="text" @click.prevent.stop="openDriver">打开页面引导</el-button>
        <el-alert title="小提示:可以在输入框中输入搜索条件过滤数据" type="success"></el-alert>
        <div style="width:60%;margin:20px;auto;" class="input">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable class="input"></el-input>
        </div>
      </el-card>
      <el-card class="box-card tree">
        <el-tree
          :data="listData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
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
      <el-card class="box-card">
        <el-row style="margin-bottom:20px;">
          <el-button size="mini" @click="moveUp()">上移</el-button>
          <el-button size="mini" @click="moveDown()">下移</el-button>
        </el-row>
        <el-row style="margin-bottom:20px;">
          <el-button size="mini" @click="upgrade">升级</el-button>
          <el-button size="mini" @click="demotion">降级</el-button>
        </el-row>
        <el-row style="margin-bottom:20px;">
          <el-button size="mini" @click="addSibling">插入同级分类</el-button>
        </el-row>
        <el-row style="margin-bottom:20px;">
          <el-button size="mini" @click="addSub">插入子分类</el-button>
        </el-row>
        <el-row style="margin-bottom:20px;">
          <el-button size="mini" type="danger" @click="deleteThis">删除</el-button>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div class="form">
          <h3>编辑分类</h3>
          <div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="分类名称">
                <el-input v-model="form.text"></el-input>
              </el-form-item>
              <el-form-item label="分类编码">
                <el-input v-model="form.code"></el-input>
              </el-form-item>
              <el-form-item label="关联的属性集">
                <el-select v-model="form.propertyId" clearable placeholder="请选择" filterable>
                  <el-option
                    v-for="item in categoryOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveChange">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Driver from "driver.js"; // import driver.js
import "driver.js/dist/driver.min.css"; // import driver.js css
import steps from "./defineSteps";
import {
  getCategoryTreeData,
  updateCategory,
  saveSubCategory,
  saveSiblingCategory,
  deleteCategory,
  categoryMove,
  categoryAdjustGradeUp,
  categoryAdjustGradeDown,
  findPropertysetByCategoryId,
  relateCategoryAndPropertyset
} from "@/api/mall/mallClass";
import { propertySetList } from "@/api/mall/goodsAttr";
export default {
  name: "mallClass",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      categoryOption: [], //属性集备选项
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
        children: "children",
        label: "text"
      }
    };
  },

  methods: {
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
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getCategoryTreeData()
        .then(res => {
          loading.close();
          if (res.code == "200") {
            this.listData = res.result;
            this.$nextTick(() => {
              //如果存在被选中的节点 刷新列表时默认选中 通过代码动态刷新节点信息
              if (Object.keys(this.selectdNode).length > 0) {
                this.$refs.tree.setCurrentKey(this.selectdNode.data.id);
                this.selectdNode.data = this.$refs.tree.getCurrentNode();
              }
            });
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    /**
     * @获取点击的节点信息
     */
    getCheckedNodes(node, data) {
      this.ident = "";
      this.selectdNode = node; //把获取到的node信息存储到本地
      this.form = Object.assign({}, data);
      findPropertysetByCategoryId({ id: data.id })
        .then(res => {
          console.log(res);
          this.$set(this.form, "propertyId", res.result[0].id);
          console.log(this.form);
        })
        .catch(err => {});
      // console.log(this.$refs.tree.getCurrentNode());

      this.editShow = true;
    },
    /**
     * @前端过滤节点
     */
    filterNode(value, data) {
      //显示符合要求的节点
      // console.log(data);
      if (!value) return true;
      return data.text.includes(value);
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
        categoryMove(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
      }

      // if(node.previousSibling){
      //   this.$refs.tree.insertAfter(node.previousSibling.data,node);
      //   this.$refs.tree.remove(node.previousSibling);
      // }else{
      //   alert('前面没有节点了');
      // }
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
        categoryMove(params)
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
      if (node.data.parent != "0") {
        let params = {
          parentId: node.data.parent,
          categoryId: node.data.id
        };
        categoryAdjustGradeUp(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
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
          categoryId: node.data.id
        };
        categoryAdjustGradeDown(params)
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
    /**
     * @添加同级节点
     */
    addSibling() {
      //添加同级分类重置其他所有值保存父级id,如果父级id为null
      //赋值为0 添加标识符sibling便于"保存"方法识别调用哪个接口
      this.ident = "Sibling";
      for (let key in this.form) {
        if (key == "parent") {
          if (this.form[key] == null) {
            this.form[key] = 0;
          } else {
          }
        } else {
          this.form[key] = "";
        }
      }
      console.log(this.form);
    },
    /**
     * @添加子节点
     */
    addSub() {
      //添加同级分类重置其他所有值保存父级id,如果父级id为null
      //赋值为0 添加标识符sibling便于"保存"方法识别调用哪个接口
      this.ident = "Sub";
      for (let key in this.form) {
        if (key == "id") {
        } else {
          this.form[key] = "";
        }
      }
      console.log(this.form);
    },
    /**
     * @保存操作
     */
    saveChange() {
      //判断标识符 选择调用的接口方法
      if (this.ident == "") {
        //relateCategoryAndPropertyset
        let params = Object.assign({}, this.form);

        params.name = params.text;
        params.parentId = params.parent;
        params.status = params.state;
        updateCategory(params)
          .then(res => {
            if (res.code == "200") {
              this.$message({
                type: "success",
                message: res.message
              });
              this.getData();
            }
          })
          .catch(err => {});
      } else if (this.ident == "Sibling") {
        let params = {
          name: this.form.text,
          code: this.form.code,
          parentId: this.form.parent==null?0:this.form.parent,
          sort: 1
        };
        saveSiblingCategory(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
      } else if (this.ident == "Sub") {
        let params = {
          name: this.form.text,
          code: this.form.code,
          parentId: this.form.id
        };
        saveSubCategory(params)
          .then(res => {
            if (res.code == "200") {
              this.getData();
            }
          })
          .catch(err => {});
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
            categoryId: this.form.id
          };
          deleteCategory(params)
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
    this.getData();
    propertySetList()
      .then(res => {
        this.categoryOption = res.result.propertySetList;
      })
      .catch(err => {});
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