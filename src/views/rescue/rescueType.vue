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
      新增/编辑权限
    -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="维修类型名称" label-width="200px" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="维修类型简称" label-width="200px" prop="shortName">
					<el-input v-model="dialogForm.shortName"></el-input>
				</el-form-item>
				<el-form-item label="序号" label-width="200px" prop="seq">
					<el-input-number size="small" v-model="dialogForm.seq" :min="1" label="描述文字"></el-input-number>
				</el-form-item>
				<el-form-item label="背景颜色" label-width="200px" prop="backColor">
					<el-color-picker v-model="dialogForm.backColor"></el-color-picker>
				</el-form-item>
				<el-form-item label="字体颜色" label-width="200px" prop="fontColor">
					<el-color-picker v-model="dialogForm.fontColor"></el-color-picker>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    page,
    save,
    deleteProject
  } from '@/api/rescue/rescueType/index'

  export default {
    name: 'rescueType',
    data() {
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入车辆维修分类',
                inputModel: 'name',
                labelName: '车辆维修分类',
                model: '',
                type: 'el-input'
              }
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '新增维修类型'
              },
              {
                type: 'primary',
                func: 'searchBtn',
                name: '搜索'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'name',
            label: '维修分类'
          },
          {
            prop: 'shortName',
            label: '简称'
          },
          {
            prop: "seq",
            label: "显示顺序",
            render: (row, index) => {
              return (
              <el-input-number
		            onChange={e => this.valChang(row)}
		            min = {1}
		            precision = {0}
		            size = "small"
		            v-model = {row.seq}
		            step = {1}
              ></el-input-number>
            );
            }
          },
          {
            prop: "seq",
            label: "背景颜色",
            render: (row, index) => {
              let back = {
                backgroundColor: row.backColor,
                color:'white',
                width: '80%',
	              margin: '0 auto'
              };
              return (
              <p style={back}>{row.backColor}</p>
            );
            }
          },
          {
            prop: "seq",
            label: "字体颜色",
            render: (row, index) => {
              let back = {
                backgroundColor: row.fontColor,
                color:'white',
                width: '80%',
                margin: '0 auto'
              };
              return (
                <p style={back}>{row.fontColor}</p>
            );
            }
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            button: true,
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
            }, {
              name: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              disabled: false,
              onClick: (row) => {
                this.del(row)
              }
            }]
          }
        ],
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1,
          pageSize: 5
        },
        options: {
          mutiSelect: false,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增
        dialogForm: {
          seq: 1,
          shortName: '',
          name: '',
          backColor: '',
          fontColor: ''
        },
        dialogFormRules: {
          name : [
            {required: true,  message: '请输入维修类型', trigger: 'blur'},
          ],
          shortName : [
            {required: true,  message: '请输入维修类型简称', trigger: 'blur'},
          ],
          seq : [
            {required: true,  message: '请选择排序', trigger: 'blur'},
          ],
          backColor : [
            {required: true,  message: '请选择背景颜色', trigger: 'blur'},
          ],
          fontColor : [
            {required: true,  message: '请选择字体颜色', trigger: 'blur'},
          ]
        },
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.pagination.pageIndex = 1;
        this.getList();
      },

      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          menuId: this.$route.query.menuId,
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        page(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      // 排序
      valChang(val) {
        this.options.loading = true;
        let params = {
          id: val.id,
          name: val.name,
          shortName: val.shortName,
          backColor: val.backColor,
          fontColor: val.fontColor,
          seq: val.seq
        };
        save(params)
          .then(res => {
            if (res.code == 200) {
              this.getList();
              this.$notify.success({
                title: res.message,
                offset: 100
              });
            }
            this.btnLoading = false;
            this.cancelDialog();
          })
          .catch(err => {
            this.btnLoading = false;
          });
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
        }else {
          this.dialogTitle = '编辑';
          this.dialogForm = Object.assign({}, val)
        }
        this.dialogFormVisible = true;
      },

      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            save(this.dialogForm).then(res => {
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
        this.dialogForm = {
          seq: 1,
          shortName: '',
          name: '',
          backColor: '',
          fontColor: ''
        };
        this.$refs['dialogForm'].resetFields();
      },
      // 删除
      del(val) {
        this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: val.id
          }
          deleteProject(params).then((res) => {
            if(res.code == 200) {
              this.$notify.success({
                title: res.message,
                offset: 100
              });
              let params = Object.assign({
                menuId: this.$route.query.menuId,
                pageNum: this.pagination.pageIndex,
                pageSize: this.pagination.pageSize
              }, this.searchData);
              page(params).then((res) => {
                if(res.result.records.length <= 0 && this.pagination.pageIndex  > 1) {
                  this.pagination.pageIndex --;
                  this.getList();
                }else {
                  this.getList();
                }
              })
            }
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
