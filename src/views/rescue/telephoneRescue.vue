<template>
	<div class="mapRescue">
		<div class="amap-page-container">
			<el-amap vid="amap" :zoom="zoom" :center="center" class="amap-demo">
				<el-amap-info-window
					:position="currentWindow.position"
					:content="currentWindow.content"
					:visible="currentWindow.visible"
					:events="currentWindow.events">
				</el-amap-info-window>
				<el-amap-marker
					v-for="(marker, index) in markers"
					:key="index"
					:content="getContentHtml(marker.content)"
					:position="marker.center"
					:events="marker.events">
				</el-amap-marker>
			</el-amap>
		</div>
		
		<div class="searchView">
			<el-input placeholder="请输入救援电话" size="medium" clearable v-model="searchInput" class="input-with-select">
				<el-button @click="searchList" slot="append" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		
		<div class="listView" v-show="rescueList.length > 0">
			<el-collapse v-model="activeNames">
				<el-collapse-item v-for="(item,index) in rescueList" :key="index" :name="index">
					<template slot="title">
						<el-tag size="small" style="margin-right: 20px;" :type="item.grade == 5 ? 'danger' : item.grade == 1 ? '' : 'info'">{{item.grade == 5 ? '联合' : item.grade == 1 ? '精品' : '普通'}}</el-tag>
						<div class="titleStyle" :class="{isOpen: item.isRest == 0}">{{item.garageName}}</div>
						<p style="width: 100px; color: red;">[{{item.distance}}]</p>
					</template>
					<div style="margin-top: 5px;">主修车型:&nbsp;{{item.majorModelsNameStr}}</div>
					<div>主营项目:&nbsp;{{item.majorProjectNameStr}}</div>
					<div>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址:&nbsp;{{item.address}}</div>
					<div>联系电话:&nbsp;{{item.contactTel}}</div>
					<el-button @click="assignOrder(item)" type="success" size="small" plain style="float: right; margin: 10px 10px;">派遣</el-button>
				</el-collapse-item>
			</el-collapse>
		</div>
		
	</div>
</template>

<script>
	import {
    getMobileOrderByMobile,
    nearAllGarage,
    findAllGarage,
    assignMobileOrder
	} from '@/api/rescue/telephoneRescue'
	
  export default {
    name: 'telephoneRescue',
    data() {
      return {
        // 搜索输入框
        searchInput: '',
	      
        
        // 默认展开
        activeNames: 0,
        
        zoom: 5,
        markers: [],
        center: [107.40, 37.42],
     
	      // 信息窗
        currentWindow: {
          position: [121.5273285, 31.21515044],
          content: 'Hi! I am here!',
          visible: false,
          events: {
            close() {
              console.log('close infowindow1');
            }
          }
        },
	      
	      // 救援单id
        rescueData: '',
	      
	      // 修配厂数据
	      rescueList: []
      }
    },
	  created() {
      this.getAllList();
	  },
    methods: {
      // 获取所有地点
      getAllList() {
        let _this = this;
        findAllGarage().then(res => {
          console.log(res);
          res.result.map((v, index) => {
            this.markers.push({
              center: [v.coordinateX, v.coordinateY],
              events: {
                click: () => {
                  _this.showRepair(v, index)
                }
              }
            })
          });
        });
        getMobileOrderByMobile({
          mobile: ''
        }).then(res => {
          if(res.result.length > 0) {
            this.rescueList = [];
            console.log(res)
            // 定位点
            res.result.map(v => {
              this.markers.push({
                center: [v.coordinateX, v.coordinateY],
	              content: 'isBad',
                events: {
                  click: () => {
                    _this.searchRescue(v)
                  }
                }
              })
            });
          }
        })
      },

      getContentHtml(content) {
        // else 是修配厂图标
        if(content == 'isBad') {
        
        }else {
	        return '<p>' +
	          '<img src="/static/img/rescue.jpg" width="19px" height="33px">' +
	          '</p>'
        }
    
       
      },
	    
      // 搜索
      searchList() {
        let _this = this;
        if(this.searchInput == '') {
          this.$message({
            message: '该输入手机号!',
            type: 'warning'
          });
          return;
        }
        getMobileOrderByMobile({
	        mobile: this.searchInput
        }).then(res => {
          if(res.result.length > 0) {
            this.rescueList = [];
            let firstPosi = [res.result[0].coordinateX, res.result[0].coordinateY];
            // 设置维修单id
	          this.rescueData = res.result[0];
            // 修配厂列表
	          this.getDetailRescue(res.result[0]);
            // 设置中心点
            this.center = firstPosi;
            // 设置信息窗
            let window = {
              position: firstPosi,
              content: `<div>订单号:<br />${res.result[0].code}</div><div>救援地址:<br />${res.result[0].address}</div><div>手机号:${res.result[0].memberMobile}</div>`,
              visible: true,
              events: {
                close() {
                  _this.currentWindow.visible = false;
                }
              }
            };
            // 改变信息窗
            this.$nextTick(() => {
              this.currentWindow = window;
              this.currentWindow.visible = true;
            });
            // 方大倍数
            this.zoom = 17;
            // 定位点
            res.result.map(v => {
              this.markers.push({
                center: [v.coordinateX, v.coordinateY],
                events: {
                  click: () => {
                    _this.searchRescue(v)
                  }
                }
              })
            });
          }else {
            this.$message({
              message: '该手机号没有救援信息!',
              type: 'warning'
            });
          }
        })
      },
	    
	    // 切换
      searchRescue(val) {
        let firstPosi = [val.coordinateX, val.coordinateY];
        this.getDetailRescue(val)
        // 设置维修单id
        this.rescueData = val;
        this.center = firstPosi;
        console.log(this.zoom)
        this.zoom = 17;
        let _this = this;
        this.currentWindow.visible = false;
        let window = {
          position: firstPosi,
          content: `<div>订单号:<br />${val.code}</div><div>救援地址:<br />${val.address}</div><div>手机号:${val.memberMobile}</div>`,
          visible: true,
          events: {
            close() {
              _this.currentWindow.visible = false;
            }
          }
        };
        this.$nextTick(() => {
          this.currentWindow = window;
          this.currentWindow.visible = true;
        });
      },
	    
	    // 获取附近修配厂
	    async getDetailRescue(val) {
        let _this = this;
        let res = await  nearAllGarage({
          pageSize: 999,
          coordinateX: val.coordinateX,
          coordinateY: val.coordinateY
        });
        this.rescueList = res.result.records;
        this.rescueList.map((v, index) => {
          this.markers.push({
            center: [v.coordinateX, v.coordinateY],
            events: {
              click: () => {
                _this.showRepair(v, index)
              }
            }
          })
        });
      },

	    // 派遣
      assignOrder(val) {
        this.$confirm(`确认把${this.rescueData.code}订单派遣给${val.garageName}吗, 是否派遣?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          assignMobileOrder({
            garageId: val.id,
            rescueId: this.rescueData.id
          }).then(res => {
            if(res.code == 200) {
              this.$message({
                showClose: true,
                message: '派遣成功',
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消派遣'
          });
        });
      
      },

      showRepair(val, index) {
        let _this = this;
        this.activeNames = index;
        let firstPosi = [val.coordinateX, val.coordinateY];
        // 设置信息窗
        let window = {
          position: firstPosi,
          content: `<div>修配厂名称:<br />${val.garageName}</div><div>修配厂地址:<br />${val.address}</div><div>手机号:${val.contactTel}</div><div>距您距离:${val.distance}</div>`,
          visible: true,
          events: {
            close() {
              _this.currentWindow.visible = false;
            }
          }
        };
        // 改变信息窗
        this.$nextTick(() => {
          this.currentWindow = window;
          this.currentWindow.visible = true;
        });
      }
    }
  }
</script>

<style lang="sass">
	.titleStyle
		width: 285px
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap
	.isOpen
		color: #ccc
	.mapRescue
		width: 100%
		position: relative
		.listView
			margin: 0
			background: rgba(0,0,0,0.7)
			padding: 10px
			width: 500px
			overflow-y: scroll
			z-index: 99
			position: absolute
			right: 10px
			top: 10px
			max-height: 600px
			.el-collapse
				border-top: 1px solid #000000
			.el-collapse-item__header
				background: rgba(0,0,0,0.1)
				border-bottom: 1px solid #000000
				color: #fff
			.el-collapse-item__wrap
				background: transparent
				border-bottom: 1px solid #000000
				color: #fff
			.el-collapse-item__content
				div
					color: #fff
		.searchView
			width: 300px
			z-index: 99
			position: absolute
			left: 50%
			top: 10px
			margin-left: -150px
		.amap-page-container
			z-index: 9
			width: 100%
			height: calc(100vh - 90px)
			.amap-demo
				width: 100%
</style>


