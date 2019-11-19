<template>
	<div class="mationEdit">
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
				<el-radio-group
						v-if="index == '0'"
						v-model="dialogForm[item.id]"
						@change="valChange(item.id)">
					<el-radio
							v-for="(childItem, childIndex) in item.modulePropertyValues"
							:label="childItem.id"
							:key="childIndex">
						{{childItem.name}}
					</el-radio>
				</el-radio-group>
				<div
						v-if="index == 1">
					<el-button
							@click="uploadFile"
							size="small"
							type="success">添加背景</el-button>
					<div class="imgBox" v-if="dialogForm[39].imgUrl">
						<el-image
								style="width: 100px; height: 100px;"
								:src="'http://qn.gaoshanmall.cn/'+dialogForm[39].imgUrl">
						</el-image>
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

  export default {
    name: 'mationEdit',
    props:  ['propertiesData', 'index', 'dialogForm'],

    data() {
      return {
        typeData: '',

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
          if(this.typeData == 2) {
            this.dialogForm[13][this.goodsIndex].goodsSelected = this.goodsSelected;
          } else if(this.typeData == 4) {
            this.goodsSelected.propertySetName = this.goodsSelected.title;
            this.dialogForm[13][this.goodsIndex].goodsSelected = this.goodsSelected;
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
        this.$refs.singleTable.setCurrentRow();
      },

      // 获取图片库选中图片
      // 图片库操作
      getSelectImage(image) {
        if(image.length > 1) {
          this.$message({
            message: '只能选取一张图片!',
            type: 'warning'
          });
        }else if (image.length <= 0) {
          this.$message({
            message: '请选择图片!',
            type: 'warning'
          });
        }else {
          this.dialogForm[39] = image[0];
        }
      },
      closeMyDialog() {
        this.imageLibraryDialog = false;
      },
      uploadFile() {
        this.imageLibraryDialog = true;
      }
    }
  }
</script>

<style lang="sass">
	.mationEdit .el-radio-group
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
			.goodsBind
				position: absolute
				left: 140px
				top: 85px
				background: #67C23A
				color: #fff
				height: 20px
				line-height: 20px
				padding: 0 5px
				font-size: 13px
</style>
