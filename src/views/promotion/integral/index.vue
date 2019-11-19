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
		<el-table
				class="table"
				stripe
				:data="tableData"
				v-loading="options.loading"
				border>
			<el-table-column
					label="活动名称"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.name ? scope.row.name  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="描述"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.description}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="创建时间"
					align="center">
				<template slot-scope="scope">
					<span>{{scope.row.createTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="操作" >
				<template slot-scope="scope">
					<el-button @click="look(scope.row)" size="small" type="success" icon="el-icon-setting">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<el-pagination
				:total="pagination.total"
				:page-size="pagination.pageSize"
				:page-sizes="[5, 10, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleIndexChange"
				style="margin-top: 20px;text-align: right"
		></el-pagination>
		
		
		<!--
			新增弹层
		-->
		<el-dialog title="新建活动" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form style="width: 95%; margin: 0 auto;" :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="名称" label-width="120px" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="描述" label-width="120px" prop="description">
					<el-input type="textarea" v-model="dialogForm.description"></el-input>
				</el-form-item>
				<el-form-item label="面值" label-width="120px" prop="score">
					<el-input type="text" v-model="dialogForm.score"></el-input>
				</el-form-item>
				<el-form-item label="数量" label-width="120px" prop="num">
					<el-input-number v-model="dialogForm.num" :min="1" :max="5000"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button :loading="btnLoading" type="primary" @click="dialogClick">提 交</el-button>
				<el-button  @click="cancelDialog">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
	import {
    activeList,
    saveActive,
    codeList
	} from '@/api/promotion/integrai/index'
  
  export default {
    name: 'name',
    data() {
      // 验证额度
      let validMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入额度！'));
        } else if(!/^[0-9]*[1-9][0-9]*$/.test(value)){
          callback(new Error('请输入正整数额度！'));
        } else {
          callback();
        }
      };
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入名称',
                inputModel: 'name',
                labelName: '名称',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增活动'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ],
	      
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
	        name: ''
        },
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          num: '',
	        name: '',
	        description: '',
	        score: ''
        },
        dialogFormRules: {
          name   : [
            {required: true,  message: '请输入活动名称', trigger: 'blur'},
          ],
          description   : [
            {required: true,  message: '请输入活动描述', trigger: 'blur'},
          ],
          score   : [
            {required: true,  validator: validMoney, trigger: 'blur'},
          ],
          num   : [
            {required: true,  message: '请输入数量', trigger: 'blur'},
          ]
        },
        dialogFormVisible: false
      }
    },
    components: {
      searchView,
      CommonTable
    },
	  created() {
      this.getList();
	  },
    methods: {
      getList() {
        activeList(this.pagination).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
        })
      },

      // 搜索方法
      searchBtn(val) {
        this.pagination.name = val.name;
        this.getList();
      },

      // 新增调取方法
      addBtn() {
        this.dialogFormVisible = true;
      },

      handleSizeChange(size) {
        // 切换每页显示的数量
        this.pagination.pageSize = size;
        this.getList();
      },
      handleIndexChange(current) {
        // 切换页码
        this.pagination.pageIndex = current;
        this.getList();
      },
	    

	    // 提交活动
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            saveActive(this.dialogForm).then(res => {
              if(res.code == 200) {
                this.cancelDialog();
                this.getList();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }
              this.btnLoading = false;
            }).catch(err => {
              this.btnLoading = false;
            })
          }
        });
      },
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs['dialogForm'].resetFields();
      },

	    // 查看
      look(val) {
        this.$router.push({
          path: '/promotion/integralTemplate/lookIntegral',
          query: {
            id: val.id
          }
        });
      },
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
