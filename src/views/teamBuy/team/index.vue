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
					label="ID"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.id ? scope.row.id  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="团长地址"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.address ? scope.row.address  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="所属城市"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.city ? scope.row.city  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="所在小区"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.community ? scope.row.community  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="用户"
					align="center">
				<template slot-scope="scope" style="text-align: center;">
					<el-popover trigger="hover"  placement="top">
						<el-image
							style="width: 100px; height: 100px;"
							:src="'https:'+ (scope.row.user == null ?  '' : scope.row.user.avatar)"
							fit="fit"></el-image>
						<div slot="reference" class="name-wrapper">
							{{ scope.row.user == null ?  '' : scope.row.user.nickname }}
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column
					label="提货地址"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.deliveryAddress ? scope.row.deliveryAddress  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="团长姓名"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.name ? scope.row.name  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="手机号"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.mobile ? scope.row.mobile  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="经度"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.longitude ? scope.row.longitude  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="纬度"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.latitude ? scope.row.latitude  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="申请时间"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime ? scope.row.createTime  : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="审核"
					width="200"
					align="center">
				<template slot-scope="scope">
					<el-switch
						@change="approvalStatusChange(scope.row)"
						v-model="scope.row.approvalStatus"
						:activeValue="1"
						:inactiveValue="0"
						active-text="通过"
						inactive-text="未通过">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column
					label="是否锁定"
					width="200"
					align="center">
				<template slot-scope="scope">
					<el-switch
						@change="statusChange(scope.row)"
						v-model="scope.row.status"
						active-color="#13ce66"
						:activeValue="1"
						:inactiveValue="0"
						inactive-color="#ff4949"
						active-text="解锁"
						inactive-text="锁定">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column width="200px" fixed="right" align="center" prop="created_at" label="操作" >
				<template slot-scope="scope">
					<el-button  @click="edit(scope.row)" size="small" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button  @click="del(scope.row)" size="small" type="danger" icon="el-icon-edit">删除</el-button>
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
		
		<!--  编辑 -->
		<el-dialog :title="dialogTitle"  :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" style="width: 95%; margin: 0 auto;" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="团长姓名" label-width="200px" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="地址" label-width="200px" prop="address">
					<el-input v-model="dialogForm.address"></el-input>
				</el-form-item>
				<el-form-item label="提货地址" label-width="200px" prop="deliveryAddress">
					<el-input v-model="dialogForm.deliveryAddress"></el-input>
				</el-form-item>
				<el-form-item  label="小区" label-width="200px" prop="community">
					<el-input v-model="dialogForm.community"></el-input>
				</el-form-item>
				<el-form-item  label="手机号" label-width="200px" prop="mobile">
					<el-input v-model="dialogForm.mobile"></el-input>
				</el-form-item>
				<el-form-item  label="经度" label-width="200px" prop="longitude">
					<el-input v-model="dialogForm.longitude"></el-input>
				</el-form-item>
				<el-form-item  label="纬度" label-width="200px" prop="latitude">
					<el-input v-model="dialogForm.latitude"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import {
    findCaptainWithPage,
    editApprovalStatus,
    editCaptainStatus,
    captainDetile,
    saveOrEditCaptain,
    deleteCaptain
  } from '@/api/teamBuy/index'

  export default {
    name: 'name',
    data() {
      // 验证账号
      let validateNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空！'));
        } else if(!/^\d+(\.\d+)?$/.test(value)){
          callback(new Error('请输入数字！'));
        } else {
          callback()
        }
      };
      return {
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入团长姓名',
                inputModel: 'name',
                labelName: '团长姓名',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入团长地址',
                inputModel: 'address',
                labelName: '团长地址',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入所在小区',
                inputModel: 'community',
                labelName: '所在小区',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入手机号',
                inputModel: 'mobile',
                labelName: '手机号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入提货地址',
                inputModel: 'deliveryAddress',
                labelName: '提货地址',
                model: '',
                type: 'el-input'
              },
              {
                inputModel: 'approvalStatus',
                labelName: '审核状态',
                model: '',
                type: 'el-select',
                options: [{
                  name: '通过',
                  status: '1'
                }, {
                  name: '未通过',
                  status: '0'
                }]
              },
            ],
            button: [
              {
                type: 'success',
                func: 'addBtn',
                name: '添加团长'
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
        tableData: [],
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
          initTable: true, // 是否一挂载就加载数据
        },

        btnLoading: false,
        dialogTitle: '',
        // 编辑新增用户
        dialogForm: {
          name: '',
          address: '',
          deliveryAddress: '',
          community: '',
          mobile: '',
          longitude: '',
          latitude: ''
        },
        dialogFormRules: {
          name:[
            {required: true,  message: '请输入团长名称', trigger: 'change'}
          ],
          address:[
            {required: true,  message: '请输入团长地址', trigger: 'change'}
          ],
          deliveryAddress:[
            {required: true,  message: '请输入提货地址', trigger: 'change'}
          ],
          community:[
            {required: true,  message: '请输入小区名称', trigger: 'change'}
          ],
          mobile:[
            {required: true,  message: '请输入手机号', trigger: 'change'}
          ],
          longitude:[
            {required: true,  validator: validateNum, trigger: 'change'}
          ],
          latitude:[
            {required: true, validator: validateNum, trigger: 'change'}
          ]
        },
        dialogFormVisible: false,
      }
    },
    components: {
      searchView
    },
	  created() {
      this.getList();
	  },
    methods: {
      // 列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        findCaptainWithPage(params).then((res) => {
          this.tableData =  res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },
      // 搜索
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },
      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.getList();
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageIndex = current;
        this.getList();
      },
	    
	    // 审核状态
      approvalStatusChange(row) {
        this.options.loading = true;
        let status = null;
        if(row.approvalStatus) {
          status = 1;
        }else {
          status = 0;
        }
	      let params = {
          captainId: row.id,
          approvalStatus: status
        }
        editApprovalStatus(params).then(res => {
          if(res.code == 200) {
            this.getList();
          }else {
            this.$notify({
              title: res.message,
              type: 'success'
            });
          }
        });
      },
	    // 锁定状态
	    statusChange(row) {
        this.options.loading = true;
        let status = null;
        if(row.status) {
          status = 1;
        }else {
          status = 0;
        }
        let params = {
          captainId: row.id,
          status
        }
        editCaptainStatus(params).then(res => {
          console.log(res);
          if(res.code == 200) {
            this.getList();
          }else {
            this.$notify({
              title: res.message,
              type: 'success'
            });
          }
        });
	    },

      addBtn() {
        this.$router.push({
          path: '/teamBuy/teamTemplate/newTeam'
        });
      },
	    edit(row) {
        captainDetile({
          id: row.id
        }).then(res => {
          this.dialogForm = Object.assign({
            userId: row.id
          }, res.result);
          this.dialogFormVisible = true;
        })
	    },
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            saveOrEditCaptain(this.dialogForm).then(res => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: '修改成功'
                });
                this.getList();
                this.cancelDialog();
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            })
          }
        });
        
      },
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {
          name: '',
          address: '',
          deliveryAddress: '',
          community: '',
          mobile: '',
          longitude: '',
          latitude: ''
        }
      },
      del(val) {
        console.log(val);
        this.$confirm("此操作将永久删除该数据是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: val.id
          }
          deleteCaptain(params).then((res) => {
            if(res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              let paramsC = Object.assign({
                pageNum: this.pagination.pageIndex,
                pageSize: this.pagination.pageSize
              }, this.searchData);
              this.options.loading = true;
              findCaptainWithPage(paramsC).then((res) => {
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
