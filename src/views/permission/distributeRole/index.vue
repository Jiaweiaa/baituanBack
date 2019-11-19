<template>
  <div class="app-container">
    <!-- searchbar -->
    <div style="margin-bottom:15px;">
      <searchView :searchModel="searchModel"></searchView>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="角色名称" width="95">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="用户" align="center">
        <template slot-scope="scope">{{ scope.row.user }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="editForm">
        <el-form-item label="商品管理员" label-width="200px">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="warning" @click="dialogFormVisible = false">暂时保存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBindUser } from "@/api/permission/distrbuteRole/index";
import searchView from "@/components/searchView/index";

const cityOptions = ["aaa", "bbb", "ccc", "ddd"];
export default {
  name: "distributeRole",
  data() {
    return {
      searchModel: [
        {
          input: [
            {
              placeholder: '请输入角色名称',
              inputModel: 'roleName',
              labelName: '角色名称',
              model: '',
              type: 'el-input'
            }
          ],
          button: [
            {
              type: 'primary',
              func: 'searchBtn',
              name: '搜索',
            }
          ]
        }
      ],


      checkAll: false,
      checkedCities: ["bbb", "ccc"],
      cities: cityOptions,
      isIndeterminate: true,
      list: [
        {
          name: "商品管理员",
          user: "aaa ,bbb,cccc,dddd"
        },
        {
          name: "商品啊啊员",
          user: "1111 ,2222,3333cccc,dd44dd"
        }
      ],
      listLoading: false,
      editForm: {},
      dialogFormVisible: false,
      searchForm: {
        name: "",
        first_name: "",
        last_name: "",
        mobile: "",
        region: ""
      }
    };
  },
  created() {
    let params = {
      roleId: '2'
    }
    getBindUser(params).then((res) => {
      console.log(res)
    })
  },
  components: {
    searchView
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    changeStutus(val) {
      // alert(1);
      val = !val;
      console.log(val);
    },
    edit(val) {
      this.dialogFormVisible = true;
      this.editForm = val;
    },
    del(val) {
      this.$confirm("此操作将永久删除" + val.name + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
