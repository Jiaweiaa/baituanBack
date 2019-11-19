<template>
	<div class="storeGoods">
		<div class="content">
			<div v-for="(item, index) in listData" class="itemBox" @click="addBtn(item, index)">
				<el-image
					v-if="item.url"
					style="width: 100%; height: 100%"
					:src="url"
					fit="fit"></el-image>
				<i v-else class="el-icon-plus icon" />
			</div>
		</div>
		
		<!--
		  商品
		 -->
		<el-dialog title="新增推荐商品" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form
					:model="dialogForm"
					style="width: 95%; margin: 0 auto;"
					status-icon
					:rules="dialogFormRules"
					ref="dialogForm"
			>
				<el-form-item label="商品编码" label-width="160px" prop="codes">
					<el-input v-model="dialogForm.codes"></el-input>
					<el-button
							style="margin-bottom: 10px;"
							type="primary"
							size="small"
							:loading="goodsLoading"
							@click="getGoods"
					>获取商品</el-button>
				</el-form-item>
				<el-form-item v-if="goodsList!=null" label="商品信息如下" label-width="160px" prop="list">
					<el-checkbox-group ref="checkedGoods" v-model="dialogForm.list">
						<el-checkbox
							:key="goodsList.id"
							:label="goodsList.id"
							style="width: 100%; overflow: hidden;"
						>{{goodsList.code}}{{goodsList.title}}</el-checkbox>
					</el-checkbox-group>
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

  import { getItemByCode } from "@/api/homeView";
  export default {
    name: 'name',
    data() {
      return {
        listData: [{
          id:1
        },{
          id:2
        }, {
          id: 3
        }],

        // 新增
        dialogForm: {
          list: [],
          itemId: ""
        },
        dialogFormRules: {
          list: {
            type: "array",
            required: true,
            message: "请选择商品",
            trigger: "blur"
          }
        },
        goodsLoading: false,
        goodsList: null,
        dialogFormVisible: false,
        btnLoading: false
      }
    },
    methods: {
      // 新增
      addBtn() {
        this.dialogFormVisible = true;
      },

      // 取消新增
      cancelDialog() {
        this.dialogFormVisible = false;
        this.dialogForm = {
          list: [],
          itemId: ""
        };
        this.$refs["dialogForm"].resetFields();
      },
      // 新增
      dialogClick() {
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            console.log(this.dialogForm.list)
            console.log(this.goodsList)
          }
        });
      },


      // 获取商品
      getGoods() {
        this.goodsLoading = true;
        if (this.dialogForm.codes) {
          getItemByCode({
            code: this.dialogForm.codes
          }).then(res => {
            if (res.code == 200) {
              this.goodsList = res.result;
            } else {
              this.$message.error(res.message);
            }
            this.goodsLoading = false;
          });
        } else {
          this.$message.error("请输入商品编码");
          this.goodsLoading = false;
        }
      }
    }
  }
</script>

<style lang="sass">
	.storeGoods
		overflow: hidden
		margin: 20px 20px 0
		.content
			width: 100%
			margin-left: 20vw
			margin-top: 22vh
			.itemBox
				width: 250px
				height: 250px
				border: 1px solid #ccc
				float: left
				margin-right: 60px
				display: flex
				cursor: pointer
				align-items: center
				.icon
					margin: 0 auto
					font-size: 35px
</style>
