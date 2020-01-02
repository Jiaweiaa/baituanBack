<template>
	<div class="goodsEdit">
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
				<div v-if="index == '2' || index == '3'">
					<el-slider
						:max="30"
						style="float: left; width: 85%;height: 0px; margin-right: 5px;"
						v-model="dialogForm[item.id]">
					</el-slider>
					<span style="float: right; font-size: 13px;">{{dialogForm[item.id] ? dialogForm[item.id] : 0}} 像素</span>
				</div>
				<div v-else-if="index == '10'">
					<el-checkbox-group
						v-model="dialogForm[item.id]">
						<el-checkbox v-for="childCheckItem in item.modulePropertyValues" :label="childCheckItem.id" :key="childCheckItem.id">{{childCheckItem.name}}</el-checkbox>
					</el-checkbox-group>
				</div>
				<el-radio-group
						:class="{'height0': (index == '2' || index == '3')}"
						v-else
						v-model="item.id == 1 ? dialogForm[item.id].id : dialogForm[item.id]"
						@change="valChange(item.id)">
					<el-radio
							:disabled="childItem.name == '商品分组'"
							v-for="(childItem, childIndex) in item.modulePropertyValues"
							:label="childItem.id"
							:key="childIndex">
						{{childItem.name}}
					</el-radio>
				</el-radio-group>
				<!--
					商品来源
				-->
				<div style="overflow: hidden;" v-show="index == 0">
					<div class="addBox" :key="goodsIndex" v-for="(goodsChild, goodsIndex) in dialogForm[1].data">
						<i @click="deleteGoods(goodsIndex)" class="el-icon-circle-close" style="position: absolute; right: 0; top: 0; z-index: 999; color: #ccc; font-size: 17px; cursor: pointer;"></i>
						<el-image
							style="width: 100%; height: 100%"
							:src='this.GLOBAL.imgUrl+goodsChild.isCoverImageUrl'>
						</el-image>
					
					</div>
					<div class="addBox" @click="addGoods" >
						+
					</div>
				</div>
			</el-form-item>
		</el-form>
		
		<!--
			关联商品
		-->
		<el-dialog title="选择关联" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-table
					v-loading="tableLoading"
					ref="multipleTable"
					:data="tableData"
					@selection-change="handleCurrentChange"
					style="width: 100%">
				<el-table-column
						type="selection"
						width="55">
				</el-table-column>
				<el-table-column
						align="center"
						prop="code"
						label="商品编码"
						width="120">
				</el-table-column>
				<el-table-column
						align="center"
						prop="title"
						label="商品名称">
				</el-table-column>
				<el-table-column
						align="center"
						prop="categoryNames"
						label="所属分类">
				</el-table-column>
				<el-table-column
						align="center"
						prop="propertySetName"
						label="对应属性集">
				</el-table-column>
				<el-table-column
						align="center"
						prop="salePrice"
						label="价格">
				</el-table-column>
				<el-table-column
						align="center"
						prop="createTime"
						label="创建时间">
				</el-table-column>
			</el-table>
			<el-pagination
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
  import {
    saleManagement
  } from "@/api/mall/sellProduct";
	
  export default {
    name: 'goodsEdit',
    props:  ['propertiesData', 'index', 'dialogForm'],

    data() {
      return {
        tableData: [],
        tableLoading: false,
        dialogFormVisible: false,
        pagination: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        btnLoading: false,
        selectedData: []
      }
    },
    methods: {
      // 即使改变数据
      valChange() {
        this.$parent.isChange( {
          data: this.dialogForm,
          index: this.index
        });
      },

      // 选中取消
      dialogClick() {
        if(this.selectedData.length > 0){
          this.dialogForm[1].data.push(...this.selectedData);
          console.log(this.dialogForm[1].data)
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
        this.$refs.multipleTable.clearSelection();
      },

      deleteGoods(index) {
        this.dialogForm[1].data.splice(index, 1)
      },

      // 切换每页显示的数量
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.getList();
      },
      // 切换页码
      handleIndexChange(current) {
        this.pagination.pageNum = current;
        this.getList();
      },
	    
      handleCurrentChange(val) {
        this.selectedData = val;
      },

      addGoods() {
        this.dialogFormVisible = true;
        this.pagination = {
          total: 0,
          pageNum: 1,
          pageSize: 10
        };
        this.selectedData = [];
        this.getList();
      },
	    
	    getList() {
        this.tableLoading = true;
        saleManagement(this.pagination).then(res => {
          this.tableData = res.result.itemCommands;
          this.pagination.total = Number(res.result.total);
          this.tableLoading = false;
        })
	    }
    }
  }
</script>

<style lang="sass">
	.goodsEdit .height0
		height: 0px!important
		display: block
	.goodsEdit .el-radio-group
		height: 30px
		line-height: 33px
	.addBox
		position: relative
		border: 1px dashed #ccc
		width: 60px
		height: 75px
		line-height: 75px
		text-align: center
		font-size: 22px
		font-weight: bold
		color: #38f
		float: left
		margin-right: 20px
		cursor: pointer
</style>
