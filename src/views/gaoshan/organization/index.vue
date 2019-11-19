<template>
	<div class="roleSetting">
		<div >
			<el-tree
				:data="treeData"
				accordion
				:expand-on-click-node="false"
				node-key="id"
				:default-expanded-keys="openTree"
				:props="defaultProps"
				:highlight-current="true"
				@node-click="handleNodeClick"
			></el-tree>
			
			<div class="controller" v-show="controllerVisible">
				<el-button type="primary" size="small"   @click="onAdd">新增</el-button>
				<el-button type="warning" size="small"  @click="onEdit">编辑</el-button>
				<el-button type="danger" size="small"  @click="onDelete">删除</el-button>
				
			
				<el-tabs style="margin-top: 20px; min-width: 800px" v-model="activeName" @tab-click="handleActiveClick">
					<el-tab-pane label="组织架构详情" name="1">
						<el-card class="box-card">
							<div class="text item">
								姓名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;{{activeData.name}}
							</div>
							<div class="text item">
								编码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.code}}
							</div>
							<div class="text item">
								英语名称&nbsp;:&nbsp;&nbsp;{{activeData.nameEng}}
							</div>
							<div class="text item">
								电话&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.mobile}}
							</div>
							<div class="text item">
								简称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.nameShort}}
							</div>
							<div class="text item">
								是否显示&nbsp;:&nbsp;&nbsp;{{activeData.displayStatus == 1 ? '显示' : '不显示'}}
							</div>
							<div class="text item">
								状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.status == 1 ? '不禁用' : '禁用'}}
							</div>
							<div class="text item">
								地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.address}}
							</div>
							<div class="text item">
								传真&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.fax}}
							</div>
							<div class="text item">
								排序&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{{activeData.sort}}
							</div>
						</el-card>
					</el-tab-pane>
					<el-tab-pane label="职位" name="2">
						<position v-bind:treeId="activeData.id"></position>
					</el-tab-pane>
				</el-tabs>
			</div>
			
			<!-- 新增/编辑模态框模态框 -->
			<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
				<el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
					<el-form-item label="名称" label-width="200px" prop="name">
						<el-input v-model="dialogForm.name"></el-input>
					</el-form-item>
					<el-form-item label="编码" label-width="200px" prop="code">
						<el-input v-model="dialogForm.code"></el-input>
					</el-form-item>
					<el-form-item label="英语名称" label-width="200px" prop="nameEng">
						<el-input v-model="dialogForm.nameEng"></el-input>
					</el-form-item>
					<el-form-item label="电话" label-width="200px" prop="mobile">
						<el-input v-model="dialogForm.mobile"></el-input>
					</el-form-item>
					<el-form-item label="简称" label-width="200px" prop="nameShort">
						<el-input v-model="dialogForm.nameShort"></el-input>
					</el-form-item>
					<el-form-item label="是否显示" label-width="200px" prop="displayStatus">
						<el-radio-group v-model="dialogForm.displayStatus">
							<el-radio :label="1">显示</el-radio>
							<el-radio :label="0">不显示</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="状态" label-width="200px" prop="status">
						<el-radio-group v-model="dialogForm.status">
							<el-radio :label="1">启用</el-radio>
							<el-radio :label="0">停用</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="地址" label-width="200px" prop="address">
						<el-input v-model="dialogForm.address"></el-input>
					</el-form-item>
					<el-form-item label="传真" label-width="200px" prop="fax">
						<el-input v-model="dialogForm.fax"></el-input>
					</el-form-item>
					<el-form-item label="排序" label-width="200px" prop="seq">
						<el-input type="number" v-model="dialogForm.seq"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancelDialog">取 消</el-button>
					<el-button type="primary" :loading="btnLoading" @click="dialogClick">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
  import {
    getOrganizationTree,
    createOrganization,
    deleteOrganization,
    updateOrganization
  } from "@/api/gaoshan/organization/index";
  
  import position from './position'
  export default {
    name: 'roleSetting',
    data() {
      //  检测菜单名称唯一性
      let validataMenuName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入菜单名称！'));
        } else if(!/^[^\s]+$/.test(value)){
          callback(new Error('菜单名称不能带有空格！'));
        } else {
          let params = '';
          if(this.dialogTitle== '新增'){
            params = {
              menuName: value,
              pid: this.activeData.id
            };
          }else {
            params = {
              menuName: value,
              id: this.dialogForm.id,
              pid: this.dialogForm.pid
            };
          }
          checkMenuName(params).then((res) => {
            if(res.result == false) {
              callback('该菜单名称已存在!');
            }else {
              callback();
            }
          })
        }
      };
      return {
	      // 选中tab
	      activeName: '1',
        
        // 默认展开的树
        openTree: [],

        // 弹层
        btnLoading: false,
        dialogTitle: '',
        dialogFormVisible: false,
        dialogForm: {
          name: '',
          code: '',
          nameEng: '',
          mobile: '',
          nameShort: '',
          seq: '',
          displayStatus: 1,
          status: 1,
	        address: '',
          fax: ''
        },
        dialogFormRules: {
          name   : [
            {required: true,  message: '请输入名称', trigger: 'blur'},
          ],
          code: [
            {required: true,  message: '请输入编码', trigger: 'blur'},
          ],
          nameEng: [
            {required: true,  message: '请输入英文名称', trigger: 'blur'},
          ],
          mobile: [
            {required: true,  message: '请输入手机号', trigger: 'blur'},
          ],
          nameShort: [
            {required: true,  message: '请输入简称', trigger: 'blur'},
          ],
          seq: [
            {required: true,  message: '请输入排序', trigger: 'blur'},
          ],
          displayStatus: [
            {required: true,  message: '请选择是否禁用', trigger: 'change'},
          ],
          status: [
            {required: true,  message: '请选择状态', trigger: 'change'},
          ],
          address: [
            {required: true,  message: '请输入地址', trigger: 'blur'},
          ]
        },

        controllerVisible: false,

        activeData: '',

        treeData: [],
        defaultProps: {
          children: 'organizationVos',
          label: 'name'
        }
      };
    },

	  components: {
      position
	  },
	  
    mounted() {
      this.getTreeList();
    },

    methods: {
      // tab切换
      handleActiveClick(val) {
      },
      
      // 获取树状数据
      getTreeList() {
        getOrganizationTree().then(res => {
          this.treeData = res.result.organizationVos;
          this.openTree.push( this.treeData[0].organizationVos[0].id);
        })
      },

      handleNodeClick(data) {
        this.controllerVisible = true;
        this.activeData = data;
      },

      onAdd() {
        this.formFun(this.activeData, 'add');
      },
      onEdit() {
        this.formFun(this.activeData, 'edit');
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

      onDelete() {
        this.$confirm(`此操作将永久删除${this.activeData.name}该数据是否继续且删除所有相关数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: this.activeData.id
          }
          deleteOrganization(params).then(res => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getTreeList();
            }else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          })
          this.controllerVisible = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },
	    
      // 编辑和新增点击
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if(this.dialogTitle == '新增') {
              let params = Object.assign({
                parentId : this.activeData.id
              }, this.dialogForm);
              createOrganization(params).then((res) => {
                if(res.code == 200) {
                  this.getTreeList();
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
              let params = Object.assign({
                id : this.activeData.id
              }, this.dialogForm);
              updateOrganization(params).then(res => {
                if(res.code == 200) {
                  this.getTreeList();
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
            this.controllerVisible = false;
          }
        });
      },
      // 编辑新增点击取消
      cancelDialog() {
        this.dialogFormVisible = false;
        this.$refs['dialogForm'].resetFields();
        this.dialogForm = {
          name: '',
          code: '',
          nameEng: '',
          mobile: '',
          nameShort: '',
          seq: '',
          displayStatus: 1,
          status: 1,
          address: '',
          fax: ''
        };

      },
    }
  };
</script>
<style lang="sass">
	.roleSetting .controller
		position: absolute
		left: 300px
		top: 20px
		padding: 30px
		border: 1px solid #eee
		overflow: hidden
		.text
			font-size: 14px
		.item
			margin-bottom: 18px
		.clearfix:before,
		.clearfix:after
			display: table
			content: ""
		.clearfix:after
			clear: both
		.box-card
			width: 100%
</style>
