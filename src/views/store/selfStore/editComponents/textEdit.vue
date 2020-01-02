<template>
	<div class="textEdit">
		<!--
     wjw
     商品详情
    -->
		<el-form
				:model="dialogForm"
				style="width: 100%; margin: 0 auto;"
				status-icon ref="dialogForm">
			<el-form-item
					v-for="(item, index) in propertiesData"
					:key="index"
					:label="item.name"
					label-width="80px">
				<el-input
					size="small"
					style="float: right; width: 100%;height: 0px;"
					placeholder="请输入内容"
					v-if="index == '0'"
					v-model="dialogForm[item.id]"
					clearable>
				</el-input>
				<el-radio-group
					v-if="index !== '2' || index !== '3' || index !== '1'|| index !== '5'"
					v-model="dialogForm[item.id]"
					@change="valChange(item.id)">
					<el-radio
						v-for="(childItem, childIndex) in item.modulePropertyValues"
						:label="childItem.id"
						:key="childIndex">
						{{childItem.name}}
					</el-radio>
				</el-radio-group>
				<el-color-picker
					style="float: right; width: 100%;height: 0px;"
					v-if="index == '2' || index == '3'"
					v-model="dialogForm[item.id]">
				</el-color-picker>
				<div
					class="requireBox"
					v-if="index == 5">
					<el-select
						size="small"
						@change="goodsChange(item.id)"
						v-model="dialogForm[item.id].type"
						clearable
						placeholder="请选择">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
					<div class="goodsBind" v-show="dialogForm[item.id].goodsSelected.propertySetName || dialogForm[item.id].goodsSelected.name ">
						{{dialogForm[item.id].goodsSelected.title}} {{dialogForm[item.id].goodsSelected.subTitle}}{{dialogForm[item.id].goodsSelected.name}}
					</div>
				</div>
			</el-form-item>
		</el-form>
		
		<!-- 图片库组件 -->
		<imageLibrary
				@sendImageList="getSelectImage"
				:closeDialog="closeMyDialog"
				:isOpen="imageLibraryDialog"
		></imageLibrary>
		
		<!--
		  详情
		-->
		<el-dialog title="选择关联" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<!--
				导航
			-->
			<el-tree
					v-if="typeData == 1"
					:data="catoryTree"
					show-checkbox
					ref="tree"
					:loading="loading"
					node-key="id"
					:check-strictly="true"
					:default-checked-keys="[defaultSelect]"
					@check-change="checkChange"
					:props="defaultProps"
			></el-tree>
			<el-table
					v-if="typeData == 2"
					v-loading="tableLoading"
					ref="singleTable"
					:data="tableData"
					highlight-current-row
					@current-change="handleCurrentChange"
					style="width: 100%">
				<el-table-column
						type="index"
						width="50">
				</el-table-column>
				<el-table-column
						align="center"
						property="code"
						label="商品编码"
						width="120">
				</el-table-column>
				<el-table-column
						align="center"
						property="title"
						label="商品名称">
				</el-table-column>
				<el-table-column
						align="center"
						property="categoryNames"
						label="所属分类">
				</el-table-column>
				<el-table-column
						align="center"
						property="propertySetName"
						label="对应属性集">
				</el-table-column>
				<el-table-column
						align="center"
						property="salePrice"
						label="价格">
				</el-table-column>
				<el-table-column
						align="center"
						property="createTime"
						label="创建时间">
				</el-table-column>
			</el-table>
			<el-table
					v-if="typeData == 4"
					v-loading="tableLoading"
					ref="singleTable"
					:data="tableData"
					highlight-current-row
					@current-change="handleCurrentChange"
					style="width: 100%">
				<el-table-column
						type="index"
						width="50">
				</el-table-column>
				<el-table-column
						label="标题"
						align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.title ? scope.row.title  : ''}}</span>
					</template>
				</el-table-column>
				<el-table-column
						label="图片"
						align="center">
					<template slot-scope="scope">
						<img
								style="width: 50px; height: 50px; cursor: pointer;"
								:src='this.GLOBAL.imgUrl+scope.row.img' />
					</template>
				</el-table-column>
				<el-table-column
						label="修改时间"
						align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.updateTime ? scope.row.updateTime  : ''}}</span>
					</template>
				</el-table-column>
			
			</el-table>
			<el-pagination
					v-if="typeData !== 1"
					:total="pagination.total"
					:page-size="pagination.pageSize"
					:page-sizes="[5, 10, 20]"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleIndexChange"
					style="margin-top: 20px;text-align: right"
			></el-pagination>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button :loading="btnLoading" type="primary" @click="dialogClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import ImageLibrary from "@/components/ImageLibrary";
  import {
    saleManagement
  } from "@/api/mall/sellProduct";
  import {
    getNewsPage
  } from '@/api/homeView/article/index';
  import {
    getStoreNavigationTree
  } from "@/api/homeView/index";

  export default {
    name: 'goodsEdit',
    props:  ['propertiesData', 'index', 'dialogForm'],

    data() {
      return {
        // 树节点数据 导航
        catoryTree: [],
        selectOrg: {
          orgsid: []
        },
        typeData: '',
        //树节点配置
        defaultProps: {
          children: "nodes",
          label: "name"
        },
        loading: false,
        defaultSelect:"", //回显时默认选中的节点

        tableData: [],
        tableLoading: false,
        dialogFormVisible: false,
        pagination: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        goodsIndex: '',
        btnLoading: false,
        imageLibraryDialog: false,
        options: [
          {
            label: '导航',
            value: 1
          },
          {
            label: '商品',
            value: 2
          },
          {
            label: '优惠券',
            value: 3
          },
          {
            label: '专题',
            value: 4
          }
        ]
      }
    },
    components: {
      ImageLibrary
    },
    methods: {
      //节点选中状态发生变化方法
      checkChange(data, checked, indeterminate) {
        // 获取当前选择的id在数组中的索引
        const indexs = this.selectOrg.orgsid.indexOf(data.id);
        this.goodsSelected = data;
        // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
        if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
          this.$message({
            message: "切换选中节点成功",
            type: "success",
            showClose: true
          });
          // 设置之前已选择的节点为false 很重要
          this.$refs.tree.setChecked(this.selectOrg.orgsid[0], false);
          this.selectOrg.orgsid = [];
          this.goodsSelected = data;
          this.selectOrg.orgsid.push(data.id);
        } else if (this.selectOrg.orgsid.length === 0 && checked) {
          // 发现数组为空 并且是已选择
          // 防止数组有值，首先清空，再push
          this.selectOrg.orgsid = [];
          this.goodsSelected = data;
          this.selectOrg.orgsid.push(data.id);
        } else if (
          indexs >= 0 &&
          this.selectOrg.orgsid.length === 1 &&
          !checked
        ) {
          this.goodsSelected = '';
          // 再次直接进行赋值为空操作
          this.selectOrg.orgsid = [];
        }
      },
      
      // 数据改变即时保存
      valChange() {
        this.$parent.isChange({
          data: this.dialogForm,
          index: this.index
        });
      },

      // 选中取消
      dialogClick() {
        if(this.goodsSelected){
          if(this.typeData == 1) {
            this.dialogForm[this.goodsIndex].goodsSelected = this.goodsSelected;
          } else if(this.typeData == 2) {
            this.dialogForm[this.goodsIndex].goodsSelected = this.goodsSelected;
          } else if(this.typeData == 4) {
            this.goodsSelected.propertySetName = this.goodsSelected.title;
            this.dialogForm[this.goodsIndex].goodsSelected = this.goodsSelected;
          }

          this.cancelDialog();
        }else {
          this.$message({
            message: '请选择关联跳转',
            type: 'warning'
          });
        }
      },
      cancelDialog() {
        this.dialogFormVisible = false;
        if(this.typeData !== 1) {
          this.$refs.singleTable.setCurrentRow();
        }
      },

      // 获取图片库选中图片
      // 图片库操作
      getSelectImage(image) {
        image.map(v => {
          v.goodsSelected = {};
        })
        this.dialogForm[13] = this.dialogForm[13].concat(image);
        let newArray = Array.from(new Set(this.dialogForm[13]));
        this.dialogForm[13] = newArray;
      },
      closeMyDialog() {
        this.imageLibraryDialog = false;
      },
      uploadFile() {
        this.imageLibraryDialog = true;
      },
      deleteGoodsItem(index) {
        this.dialogForm[13].splice(index, 1);
      },

      // 图片关联变化
      goodsChange(goodsIndex) {
        this.pagination = {
          total: 0,
          pageNum: 1,
          pageSize: 10
        };
        this.goodsIndex = goodsIndex;
        this.tableLoading = true;
        this.typeData = '';
        this.dialogForm[this.goodsIndex].goodsSelected = {};

        if(this.dialogForm[31].type == 1) {
          this.typeData = 1;
          this.dialogFormVisible = true;
          this.loading = true;
          getStoreNavigationTree()
            .then(res => {
              this.loading = false;
              if (res.code == "200") {
                this.catoryTree = res.result.nodes;
              } else {
                this.$message(res.message);
                this.dialogFormVisible = false;
              }
            })
            .catch(err => {
              this.$message("网络错误");
              this.dialogFormVisible = false;
              this.loading = false;
            });
        }
        if(this.dialogForm[31].type == 2) {
          this.typeData = 2;
          this.dialogFormVisible = true;
          saleManagement(this.pagination).then(res => {
            this.tableData = res.result.itemCommands;
            this.pagination.total = Number(res.result.total);
            this.tableLoading = false;
          })
        }
        if(this.dialogForm[31].type == 4) {
          this.typeData = 4;
          this.dialogFormVisible = true;
          getNewsPage(this.pagination).then(res => {
            this.tableData = res.result.records;
            this.pagination.total = Number(res.result.total);
            this.tableLoading = false;
          })
        }

      },

      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        if(this.dialogForm[13][goodsIndex].imgType == 2) {
          this.typeData = 2;
          this.dialogFormVisible = true;
          saleManagement(this.pagination).then(res => {
            this.tableData = res.result.itemCommands;
            this.pagination.total = Number(res.result.total);
            this.tableLoading = false;
          })
        }
        if(this.dialogForm[13][goodsIndex].imgType == 4) {
          this.typeData = 4;
          this.dialogFormVisible = true;
          getNewsPage(this.pagination).then(res => {
            this.tableData = res.result.records;
            this.pagination.total = Number(res.result.total);
            this.tableLoading = false;
          })
        }
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageNum = current;
        if(this.dialogForm[13][goodsIndex].imgType == 2) {
          this.typeData = 2;
          this.dialogFormVisible = true;
          saleManagement(this.pagination).then(res => {
            this.tableData = res.result.itemCommands;
            this.pagination.total = Number(res.result.total);
            this.tableLoading = false;
          })
        }
        if(this.dialogForm[13][goodsIndex].imgType == 4) {
          this.typeData = 4;
          this.dialogFormVisible = true;
          getNewsPage(this.pagination).then(res => {
            this.tableData = res.result.records;
            this.pagination.total = Number(res.result.total);
            this.tableLoading = false;
          })
        }
      },
      handleCurrentChange(val) {
        this.goodsSelected = val;
      }
    }
  }
</script>

<style lang="sass">
	.textEdit
		.el-radio-group
			height: 30px
			line-height: 33px
			.imgBox
				border: 1px solid #ccc
				margin-bottom: 10px
				align-items: center
				display: flex
				padding: 10px
				position: relative
				.closeIcon
					font-size: 20px
					position: absolute
					right: 10px
					top: 5px
					cursor: pointer
				.input
					width: 30%
					margin-left: 30px
				.select
					width: 30%
					margin-left: 30px
		.requireBox
			position: relative
			float: right
			width: 100%
			height: 10px
			.goodsBind
				position: absolute
				left: 0px
				top: 45px
				background: #67C23A
				color: #fff
				height: 20px
				line-height: 20px
				padding: 0 5px
				font-size: 13px
</style>
