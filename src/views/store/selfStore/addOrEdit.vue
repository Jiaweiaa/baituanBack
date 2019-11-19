<template>
	<div>
		<div class="templateName">
			<div class="name">模板名称:</div>
			<el-input v-model="name" class="input" size="small" placeholder="模板名称"></el-input>
		</div>
		<div class="phone">
			<vueDraggable class="wrapper" ref="wrapperRef" v-model="list">
				<transition-group>
					<div
							v-for="(item, index) in list"
							@click="itemClick($event, item, index)"
							:key="index"
							:class="{activeItem: index == itemIndex}"
							class="item">
						<div class="itemBox">
							<!--<i class="icon el-icon-circle-plus-outline"></i>-->
							<!--<i class="icon el-icon-circle-plus-outline"></i>-->
							<!--
								显示端
							-->
							<Goods :dataSource="item" v-if="item.data.id == 1"></Goods>
							<Picture :dataSource="item" v-if="item.data.id == 3"></Picture>
							<Navigation :dataSource="item" v-if="item.data.id == 5"></Navigation>
							<TextComponents :dataSource="item" v-if="item.data.id == 6"></TextComponents>
							<TitleComponents :dataSource="item" v-if="item.data.id == 8"></TitleComponents>
							<couponComponents :dataSource="item" v-if="item.data.id == 9"></couponComponents>
							<storeInformation :dataSource="item" v-if="item.data.id == 13"></storeInformation>
							<goods-search :dataSource="item" v-if="item.data.id == 15"></goods-search>
							<notice :dataSource="item" v-if="item.data.id == 16"></notice>
							<guide :dataSource="item" v-if="item.data.id == 20"></guide>
							<auxiliaryBlank :dataSource="item" v-if="item.data.id == 21"></auxiliaryBlank>
							<!--
								删除
							-->
							<i class="closeIcon el-icon-close" @click.stop="deleteComponents(index, item)"></i>
						</div>
					</div>
				</transition-group>
			</vueDraggable>
			<div class="bottom">
				<div v-for="(item, index) in typeData" :key="index" class="bottomBox">
					<div class="title">{{item.title}}</div>
					<div v-for="(childItem, childIndex) in item.data" :key="childIndex" @click="menuClick(childItem)" :style="{'color':  (storeDisabled && childItem.id == 13) ? '#e1e1e1': '' }" class="itemBox">
						{{childItem.name}}
					</div>
				</div>
			</div>
		</div>
		
		<div class="editBox" v-show="propertiesData !== ''" ref="editBox">
			<!--
				itemIndex 点击组件的下标
				dialogForm 显示层绑定的数据
				propertiesData 渲染显示的数据
				clickId 点击的id是几
			-->
			<GoodsDetail v-if="clickId === '1'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></GoodsDetail>
			<PictureEdit v-if="clickId === '3'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></PictureEdit>
			<NavigationEdit v-if="clickId === '5'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></NavigationEdit>
			<TextEdit v-if="clickId === '6'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></TextEdit>
			<TitleEdit v-if="clickId === '8'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></TitleEdit>
			<couponComponentsEdit v-if="clickId === '9'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></couponComponentsEdit>
			<storeInformationEdit v-if="clickId === '13'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></storeInformationEdit>
			<goods-search-edit v-if="clickId === '15'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></goods-search-edit>
			<notice-edit v-if="clickId === '16'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></notice-edit>
			<guideEdit v-if="clickId === '20'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></guideEdit>
			<auxiliary-blank-edit v-if="clickId === '21'" :index="itemIndex" :dialogForm="list[itemIndex].viewData" :propertiesData="propertiesData"></auxiliary-blank-edit>
		</div>
		
		<div class="fixButton">
			<el-button size="small" type="primary" @click="saveTemplate" :loading="templateLoading" round>保存模板</el-button>
		</div>
	</div>
</template>

<script>
  import vueDraggable from 'vuedraggable';
  // 商品页面
  import Goods from './components/goods'
  // 图片广告
  import Picture from './components/picture'
  // 图文导航
  import Navigation from './components/Navigation'
  // 文本
  import TextComponents from './components/text'
  // 标题
  import TitleComponents from './components/title'
  // 店铺信息
  import storeInformation from './components/storeInformation'
  // 辅助线
  import guide from './components/guide'
  // 辅助留白
  import auxiliaryBlank from './components/auxiliaryBlank'
  // 公告
  import notice from './components/notice'
  // 商品搜素
  import goodsSearch from './components/goodsSearch'
  // 优惠券
  import couponComponents from './components/coupon'


  // 商品详情
  import GoodsDetail from './editComponents/goodsDetail'
  // 图片详情
  import PictureEdit from './editComponents/pictureEdit'
  // 图片详情
  import NavigationEdit from './editComponents/navigationEdit'
  // 文本详情
  import TextEdit from './editComponents/textEdit'
  // 标题详情
  import TitleEdit from './editComponents/titleEdit'
  // 店铺信息
  import storeInformationEdit from './editComponents/storeInformationEdit'
  // 辅助线
  import guideEdit from './editComponents/guideEdit'
  // 辅助留白
  import auxiliaryBlankEdit from './editComponents/auxiliaryBlankEdit'
  // 公告
  import noticeEdit from './editComponents/noticeEdit'
  // 商品搜素
  import goodsSearchEdit from './editComponents/goodsSearchEdit'
  // 优惠券
  import couponComponentsEdit from './editComponents/couponEdit'

  import {
    getModulePropertySet,
    saveTemplate,
    getModulePropertyByPropertySetId
  } from "@/api/store/properties"

  import {
    editDetail
  } from "@/api/store/storeList/index";

  export default {
    name: 'HelloWorld',
    components: {
      vueDraggable,
      Goods,
      Picture,
      Navigation,
      TextComponents,
      TitleComponents,
      storeInformation,
      guide,
      auxiliaryBlank,
      notice,
      goodsSearch,
      couponComponents,

      GoodsDetail,
      NavigationEdit,
      PictureEdit,
      TextEdit,
      TitleEdit,
      storeInformationEdit,
      guideEdit,
      auxiliaryBlankEdit,
      noticeEdit,
      goodsSearchEdit,
      couponComponentsEdit
    },
    data() {
      return {
        // 只有一个店铺模块
        storeDisabled: false,

        // 模板名称
        name: '',
        // list架构数据
        list: [],

        // 获取所有分组数据
        typeData: [
          {
            title: '基础组件',
            data: []
          },
          {
            title: '营销组件',
            data: []
          },
          {
            title: '其他',
            data: []
          }
        ],

        // 点击模块的id
        clickId: '',
        // 组件顺序
        itemIndex: '0',

        // 绑定数据
        propertiesData: '',
	      // 编辑时当前id
        nowId: '',
	      loading: '',
        templateLoading: false
      }
    },
    updated() {
      // 排序 最后的数据
      // console.log(this.list, '组数据')
    },
    created() {
	    if(this.$route.query.id) {
        this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.nowId = this.$route.query.id;
        editDetail({
	        id: this.nowId
        }).then(res => {
          if(res.code == 200) {
            this.name = res.result.name;
            this.list = JSON.parse(res.result.template);
            this.list.map((item, index) => {
              if(item.data.id == 13) this.storeDisabled = true;
            });
          }else {
            this.$notify.error({
              title: res.message,
              offset: 100
            });
          }
          this.loading.close();
        });
	    }
	    
      // 菜单数据分类
      getModulePropertySet().then(res => {
        res.result.map(v => {
          if(v.type == 1) {
            this.typeData[0].data.push(v);
          }else if(v.type == 2) {
            this.typeData[1].data.push(v);
          }else {
            this.typeData[2].data.push(v);
          }
        });
      })
    },
    methods: {
      // 底部列表点击
      menuClick(item) {
        // 只允许有一个店铺标题的操作
        if(this.storeDisabled && item.id == 13) return;
	      
        // 默认选中数据
        let initial = null;
        if(item.id == 1) {
          // 商品
          initial = {
            1: {
              id: '1',
              data: []
            },  // 商品来源  1 2
            2: '3',  // 列表样式  3 4 5 6  7 8
            3:  0,   // 两个拖拽条
            4:  0,   // 两个拖拽条
            5: '9',  // 商品样式9 10 11 12
            6: '13', // 商品倒角 13 14
            7: '15', // 图片比例 15 16 17 18
            8: '19', // 图片填充 19 20
            9: '21', // 文本样式 21 22
            10:'23', // 文本对齐 23 24
            11: ['25', '26', '27'], // 显示内容 25 26 27
	          59: '88'
          }
        }else if(item.id == 3) {
          // 图片广告
          initial = {
            12:'28',  // 选择模板  28 29 30 31 32
            13: [],   // 添加图片
            14:  0,   // 两个拖拽条
            15:  0,   // 两个拖拽条
            16: '33',  // 图片样式 33 34
            17: '35', // 商品倒角 35 36
          }
        }else if(item.id == 5) {
          // 图文导航
          initial = {
            22: '44',  // 选择模板  44 45
            23: '46',     // 滑动设置 46 47
            24:  null,   // 颜色
            25:  null,   // 颜色
            pic: []
          }
        }else if(item.id == 6) {
          // 文本模块
          initial = {
            26: '',    // 文本
            27: '49',  // 字体大小 49 50 51
            28: '',    // 颜色
            29: '',    // 颜色
            30: '52',  // 52 53 54
            31: {
              type: '',
              goodsSelected: ''
            },   // 链接
            32: '55'  // 显示底部分割线 55 56
          }
        }else if(item.id ==  8) {
          // 标题
          initial = {
            33: '',    // 标题名
            34: '57',  // 标题模版 57
            35: '58',  // 显示位置 58 59 60
            36: '',  // 副标题
            37: '',    //
            'navigation': {
              name: '',
              type: '',
              data: ''
            }
          }
        }else if(item.id == 9) {
          // 优惠券
          initial = {
            55: {
              id: '75', // 添加优惠券方式 75手动
              data: []
            },
            56: '76',  // 样式  76 77 78 79
            57: ['rgb(231, 76, 44)'],   // 颜色
            58: '81'     // 更多设置 81 82
          }
        }else if(item.id ==  13) {
          // 店铺信息
          initial = {
            38: '61',    //  61 62 63 64 65 样式
            39: ''   // 标题模版 57
          }
        }else if(item.id ==  15) {
          // 商品搜索
          initial = {
            48: [],  // 搜索热词
            49: '71',  // 框体样式 71 72
            50: 28,  // 框体高度
            51: '',  // 背景颜色
            52: '',  // 框体颜色
            53: '74',  // 文本位置 73 74
            54: ''   // 文本颜色
          }
        }else if (item.id == 16) {
          // 公告
          initial = {
            45: '',  // 公告标题
            46: '',  // 背景颜色
            47: ''   // 文字颜色
          }

        }else if(item.id ==  20) {
          // 辅助线
          initial = {
            41: '',   // 颜色
            42: '66', // 边距  66 67
            43: '68'  // 样式 68 69 70
          }
        }else if(item.id ==  21) {
          initial = {
            44: 10   // 边距
          }
        }
        this.list.push({
          data: item,
          viewData: initial
        });
        getModulePropertyByPropertySetId({
          id: item.id
        }).then(res => {
          console.log(res);
        })
      },
      // 已经渲染的分类点击
      itemClick(e, item, index) {
        this.$refs['editBox'].style.marginTop = (e.currentTarget.offsetTop + 20) + 'px';
        this.clickId = item.data.id;
        this.itemIndex = index;
        this.propertiesData = '';
        this.getDetailData(item.data.id)
      },
      // 获取分类详情
      getDetailData(id) {
        getModulePropertyByPropertySetId({
          id: id
        }).then(res => {
          this.propertiesData = res.result;
        })
      },

      // 改变对应数值
      isChange(res) {
        this.list[res.index].viewData = res.data;
      },

      // 保存模板
      saveTemplate() {
        if(this.name) {
          let params = {
            name: this.name,
	          id: this.nowId,
            template: JSON.stringify(this.list)
          }
          this.templateLoading = true;
          saveTemplate(params).then(res => {
            if(res.code == 200) {
              this.$router.push({
                path:'/store/selfStore/selfStoreList'
              })
            }else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
            this.templateLoading = false;
          })
        }else {
          this.$message({
            message: '请输入模板名称',
            type: 'warning'
          });
        }
      },

      // 删除模块
      deleteComponents(index, item) {
        this.$confirm('此操作将删除该模块, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clickId = '';
          this.propertiesData = '';
          this.list.splice(index, 1);
          if(item.data.id == 13) this.storeDisabled = false;
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
	.phone {
		float: left;
		position: relative;
		padding-bottom: 200px;
		width: 320px;
		.bottom {
			border: 1px solid #ccc;
			width: 400px;
			margin-left: 20px;
			overflow: hidden;
			.bottomBox {
				overflow: hidden;
				margin: 10px;
				.title {
					height: 35px;
					line-height: 35px;
					font-size: 14px;
					margin-left: 5px;
				}
				.itemBox {
					width: 28%;
					color: #999;
					border: 1px dashed #ccc;
					background: #f8f8f8;
					text-align: center;
					font-size: 13px;
					line-height: 30px;
					float: left;
					margin-bottom: 5px;
					margin-left: 4%;
					cursor: pointer;
					overflow: hidden;
				}
				.itemBox:hover {
					color: #38f;
					border: 1px dashed #38f;
					background: #ebf7fc;
				}
			}
		}
	}
	.wrapper {
		display: flex;
		justify-content: center;
		width: 400px;
		margin-left: 20px;
		margin-top: 20px;
		border: 1px solid #ccc;
		position: relative;
		span {
			width: 400px;
			display: block;
			.item{
				width: 100%;
				background-color: #fff;
				position: relative;
				.closeIcon {
					position: absolute;
					right: -8px;
					top: -8px;
					background: #999;
					color: #fff;
					border-radius: 50%;
					display: none;
				}
				.icon {
					display: none;
					position: absolute;
					left: 50%;
					margin-left: -8px;
					font-size: 16px;
					background: #409eff;
					color: #fff;
					z-index: 999;
					border-radius: 50%;
					border: none;
				}
				.icon:first-child {
					top: -9px;
				}
				.icon:last-child {
					bottom: -9px;
				}
				.itemBox {
					overflow: hidden;
					cursor: pointer;
				}
			}
			.activeItem {
				border: 1px dashed #409eff;
			}
			.item:hover {
				border: 1px dashed #409eff;
				.icon {
					display: block;
				}
				.closeIcon {
					display: block;
				}
			}
		}
	}
	.editBox {
		float: right;
		margin-top: 20px;
		border: 1px solid #ccc;
		width: 600px;
		padding: 10px;
		overflow: hidden;
		margin-right: 150px;
		margin-bottom: 120px;
	}
	.templateName {
		width: 50%;
		margin-top: 10px;
		margin-left: 10px;
		overflow: hidden;
		display: flex;
		align-items: center;
		.name {
			font-size: 14px;
			float: left;
			margin-right: 10px;
		}
		.input {
			width: 250px;
			float: left;
		}
	}
	.fixButton {
		position: fixed;
		background: #fff;
		height: 100px;
		width: calc(100% - 180px);
		bottom: 0;
		border-top: 5px solid #ccc;
		text-align: center;
		z-index: 999;
		line-height: 100px;
	}
</style>
