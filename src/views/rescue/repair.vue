<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-16 11:25:01
 * @LastEditTime: 2019-09-16 16:38:32
 * @LastEditors: Please set LastEditors
 -->
<template>
	<div class="repairBox">
		<!--
       wjw
  
       顶部搜索
      -->
		<el-card class="filter-container" shadow="never" style="margin-top:20px;">
			<div style="margin-bottom: 10px; overflow: hidden;">
				<i class="el-icon-search"></i>
				<span>筛选搜索</span>
				<el-button
						style="float: right"
						class="filter-item"
						@click="searchBtn(searchForm)"
						type="primary"
						icon="el-icon-search"
						size="small"
				>查询</el-button>
				<el-button
						style="float: right; margin-right: 20px;"
						class="filter-item"
						@click="getSelectChange"
						type="success"
						icon="el-icon-edit"
						size="small"
				>批量审批</el-button>
			</div>
			<div style="margin-top: 15px">
				<el-form :inline="true" :model="searchForm" size="small" label-width="140px">
					<el-form-item label="地区：">
						<el-select
								@change="provinceChange(searchForm.provinceName)"
								clearable
								placeholder="请选择省"
								style="width: 190px"
								v-model="searchForm.provinceName"
								class="filter-item"
						>
							<el-option v-for="province in provinceList" :key="province" :label="province" :value="province"></el-option>
						</el-select>
						
						<el-select
								@change="cityChange(searchForm.cityName)"
								clearable
								placeholder="请选择市"
								style="width: 190px"
								v-model="searchForm.cityName"
								class="filter-item"
						>
							<el-option v-for="city in cityList" :key="city" :label="city" :value="city"></el-option>
						</el-select>
						
						<el-select
								clearable
								placeholder="请选择县"
								style="width: 190px"
								v-model="searchForm.districtName"
								class="filter-item"
						>
							<el-option v-for="district in districtList" :key="district" :label="district" :value="district"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="修理厂等级：">
						<el-select
								clearable
								placeholder="请选择修配厂"
								style="width: 190px"
								v-model="searchForm.grade"
								class="filter-item"
						>
							<el-option v-for="repairLever in repairLeverList" :key="repairLever.value" :label="repairLever.name" :value="repairLever.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="维修项目：">
						<el-select clearable v-model="searchForm.majorProject" multiple placeholder="请选择维修项目">
							<el-option
									v-for="item in repairProjectList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="车辆类型：">
						<el-select clearable v-model="searchForm.majorModels" multiple placeholder="请选择维修项目">
							<el-option
									v-for="item in vehicleTypeList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核状态：">
						<el-select clearable v-model="searchForm.auditStatus" placeholder="请选择审核状态">
							<el-option
									v-for="item in auditStatusList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="注册时间：">
						<el-date-picker
								v-model="searchForm.dateTime"
								type="datetimerange"
								value-format="yyyy-MM-dd	dd:HH:mm"
								range-separator="至"
								start-placeholder="注册开始日期"
								end-placeholder="注册结束日期"
								align="right">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="修理厂名称：">
						<el-input
								placeholder="请输入内容"
								v-model="searchForm.garageName"
								clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="联系人：">
						<el-input
								placeholder="请输入内容"
								v-model="searchForm.contacts"
								clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="联系人电话：">
						<el-input
								placeholder="请输入内容"
								v-model="searchForm.contactTel"
								clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="推荐人工号：">
						<el-input
								placeholder="请输入内容"
								v-model="searchForm.refereeNo"
								clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="服务站工号：">
						<el-input
								placeholder="服务站工号"
								v-model="searchForm.employeeNo"
								clearable>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		
		<!--
      列表组件
    -->
		<el-table
				ref="multipleTable"
				:data="tableData"
				border
				v-loading="options.loading"
				tooltip-effect="dark"
				style="width: 100%"
				@selection-change="getSelectOption">
			<el-table-column
					type="selection"
					width="55">
			</el-table-column>
			<el-table-column
					label="修配厂名称"
					align="center"
					min-width="150px"
					fixed>
				<template slot-scope="scope">
					{{ scope.row.garageName }}
				</template>
			</el-table-column>
			<el-table-column
					min-width="250px"
					label="详细地址"
					align="center">
				<template slot-scope="scope">
          {{ scope.row.provinceName }}
          {{ scope.row.cityName }}
          {{ scope.row.districtName }}
					{{ scope.row.address }}
				</template>
			</el-table-column>
			<el-table-column
					label="联系人"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.contacts }}
				</template>
			</el-table-column>
			<el-table-column
					label="联系电话"
					min-width="110px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.contactTel }}
				</template>
			</el-table-column>
			<el-table-column
					label="登录手机"
					min-width="110px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.loginMobile }}
				</template>
			</el-table-column>
			<el-table-column
					label="服务站工号"
					min-width="130px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.employeeNo }}
				</template>
			</el-table-column>
			<el-table-column
					label="推荐人工号"
					min-width="130px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.refereeNo }}
				</template>
			</el-table-column>
			<el-table-column
					label="修配厂等级"
					min-width="130px"
					align="center">
				<template slot-scope="scope">
					<span
							:style="{
              color: scope.row.grade == 0 ?'' : scope.row.grade  == 1 ? '#409EFF' : 'red'
						}">
					{{ scope.row.grade == 0 ?'普通修配厂' : scope.row.grade  == 1 ? '精品修配厂' : '联合服务站'}}
					</span>
				
				</template>
			</el-table-column>
			<el-table-column
					label="审核状态"
					min-width="170px"
					align="center">
				<template slot-scope="scope">
					<span
							:style="{
              color: scope.row.auditStatus == 0 ?'' : scope.row.auditStatus  == 1 ? 'green' :  scope.row.auditStatus  == 2 ? 'orange' : 'red'
					}">
							{{ scope.row.auditStatus == 0 ?'未提交' : scope.row.auditStatus  == 1 ? '已认证' : scope.row.auditStatus  == 2 ? '待认证': '已驳回'}}
					</span>
				</template>
			</el-table-column>
			<el-table-column
					label="是否启用"
					min-width="170px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.status == 1 ?'启用' :'停用'}}
				</template>
			</el-table-column>
			<!--<el-table-column-->
			<!--label="审核人"-->
			<!--align="center">-->
			<!--<template slot-scope="scope">-->
			<!--{{ scope.row.date }}-->
			<!--</template>-->
			<!--</el-table-column>-->
			<!--<el-table-column-->
			<!--label="审核时间"-->
			<!--align="center">-->
			<!--<template slot-scope="scope">-->
			<!--{{ scope.row.date }}-->
			<!--</template>-->
			<!--</el-table-column>-->
			<el-table-column
					label="主修项目"
					min-width="100px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.majorProjectNameStr }}
				</template>
			</el-table-column>
			<el-table-column
					label="主修车型"
					min-width="100px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.majorModelsNameStr }}
				</template>
			</el-table-column>
			<el-table-column
					label="经营时间"
					min-width="170px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.startTime }} - {{scope.row.endTime}}
				</template>
			</el-table-column>
			<el-table-column
					label="注册时间"
					min-width="170px"
					align="center">
				<template slot-scope="scope">
					{{ scope.row.createTime }}
				</template>
			</el-table-column>
			<el-table-column
					fixed="right"
					align="center"
					label="操作"
					width="220">
				<template slot-scope="scope">
					<el-button v-if="scope.row.grade == 5" @click="handleClick(scope.row, 0)" :plain="true" type="danger" size="small">退出联合服务站</el-button>
					<el-button v-else @click="handleClick(scope.row, 1)" :plain="true" type="success" size="small">加盟联合服务站</el-button>
					<el-button type="warning" @click="editClick(scope.row)" :plain="true"  size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!--
      分页
    -->
		<el-pagination
				class="paginationClass"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page.sync="pagination.pageNum"
				:page-sizes="[5, 10, 15, 20]"
				:page-size="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pagination.total">
		</el-pagination>
		
		<!--
			审批
		-->
		<el-dialog title="审批修理厂" :visible.sync="dialogApprovalVisible" :before-close="cancelApprovalDialog">
			<el-form :model="dialogApprovalForm" status-icon :rules="dialogApprovalFormRules"  ref="dialogApprovalForm">
				<el-form-item label="是否通过" label-width="200px" prop="auditStatusAfter">
					<el-radio-group v-model="dialogApprovalForm.auditStatusAfter">
						<el-radio :label="1">通过</el-radio>
						<el-radio :label="3">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" label-width="200px" :prop="dialogApprovalForm.auditStatusAfter == 1 ? '' : 'auditRemark'">
					<el-input v-model="dialogApprovalForm.auditRemark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelApprovalDialog">取 消</el-button>
				<el-button type="primary" :loading="btnLoading" @click="dialogApprovalClick">确 定</el-button>
			</div>
		</el-dialog>
		
		<!--
			编辑
		-->
		<el-dialog title="编辑修配厂" width="1000px" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
			<el-form :model="dialogForm" status-icon :rules="dialogFormRules"  ref="dialogForm">
				<el-form-item label="修配厂名称" label-width="160px" prop="garageName">
					<el-input v-model="dialogForm.garageName"></el-input>
				</el-form-item>
				<!-- 左右浮动块 -->
				<div style="overflow: hidden;">
					<div class="dialogBox" style="float: left;">
						<el-form-item label="联系人" label-width="160px" prop="contacts">
							<el-input v-model="dialogForm.contacts"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" label-width="160px" prop="contactTel">
							<el-input v-model="dialogForm.contactTel"></el-input>
						</el-form-item>
						<el-form-item label="救援范围" label-width="160px" prop="rescueRange">
							<el-input type="number" v-model="dialogForm.rescueRange"></el-input>
						</el-form-item>
					</div>
					<div class="dialogBox" style="float: right;">
						<!--<el-form-item label="接单总数" label-width="160px" prop="garageName">-->
						<!--<el-input v-model="dialogForm.garageName"></el-input>-->
						<!--</el-form-item>-->
						<!--<el-form-item label="认证日期" label-width="160px" prop="garageName">-->
						<!--<el-input v-model="dialogForm.garageName"></el-input>-->
						<!--</el-form-item>-->
						<el-form-item label="是否营业" label-width="160px" prop="isRest">
							<el-select style="width: 100%;" v-model="dialogForm.isRest" clearable placeholder="请选择">
								<el-option
										v-for="item in isOpenOrClose"
										:key="item.value"
										:label="item.label"
										:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</div>
				<el-form-item label="主修项目" label-width="160px" prop="majorProject">
					<el-select style="width: 100%;" clearable v-model="dialogForm.majorProject" multiple placeholder="请选择维修项目">
						<el-option
								v-for="item in repairProjectList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主修车型" label-width="160px" prop="majorModels">
					<el-select style="width: 100%;"  clearable v-model="dialogForm.majorModels" multiple placeholder="请选择维修项目">
						<el-option
								v-for="item in vehicleTypeList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 左右浮动块 -->
				<div style="overflow: hidden;">
					<div class="dialogBox" style="float: left;">
						<!--<el-form-item label="审核人" label-width="160px" prop="contacts">-->
						<!--<el-input v-model="dialogForm.contacts"></el-input>-->
						<!--</el-form-item>-->
						<!--<el-form-item label="审核时间" label-width="160px" prop="contactTel">-->
						<!--<el-input v-model="dialogForm.contactTel"></el-input>-->
						<!--</el-form-item>-->
						<el-form-item label="审核状态" label-width="160px" prop="auditStatus">
							<el-select
									disabled
									clearable
									style="width: 100%;"
									v-model="dialogForm.auditStatus"
									placeholder="请选择审核状态">
								<el-option
										v-for="item in auditStatusList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审核意见" label-width="160px" prop="auditRemark">
							<el-input type="textarea" v-model="dialogForm.auditRemark"></el-input>
						</el-form-item>
					</div>
					<div class="dialogBox" style="float: right;">
						<!--<el-form-item label="修配厂等级" label-width="160px" prop="garageName">-->
						<!--<el-select-->
						<!--style="width: 100%;"-->
						<!--clearable-->
						<!--placeholder="请选择修配厂"-->r-item"-->
						<!--&gt;-->
						<!--v-model="dialogForm.grade"-->
						<!--class="filte
						<el-option v-for="repairLever in repairLeverList" :key="repairLever.value" :label="repairLever.name" :value="repairLever.value"></el-option>-->
						<!--</el-select>-->
						<!--</el-form-item>-->
						<el-form-item label="推荐人工号" label-width="160px" prop="refereeNo">
							<el-input v-model="dialogForm.refereeNo"></el-input>
						</el-form-item>
					
					</div>
				</div>
				<el-form-item label="修配厂门头照" label-width="160px" prop="garageImg">
					<el-upload
							class="avatar-uploader"
							:action="imgSrcBasic + '/opc/auth/uploadFile'"
							:show-file-list="false"
							:on-success="handleChange"
							:before-upload="beforeUpload">
						<img
							v-if="dialogForm.garageImg"
							:src="`http://qn.gaoshanmall.cn/${dialogForm.garageImg}`"
							class="avatar"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="修配厂地址" label-width="160px" prop="address">
					<div>{{dialogForm.address}}</div>
				</el-form-item>
				<div class="amap-page-container">
					<el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
					<el-amap
							vid="amapDemo"
							:center="addCenter"
							:plugin="plugin"
							:zoom="addZoom"
							class="amap-demo addMap"
							:events="addEvents">
						<el-amap-marker
								v-for="(marker, index) in addMarkers"
								:key="index"
								:position="marker.position"
								:events="marker.events">
						</el-amap-marker>
					</el-amap>
				</div>
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
  import VueAMap from 'vue-amap'
  import {
    allPageQuery,
    repairProject,
    joinOrOutGaurantee,
    garageEditBySystem,
    auditGarage,
    garageInfo,
    vehicleType
  } from '@/api/rescue/repair'

  export default {
    name: 'repair',
    data() {
      var self = this;
      return {
        // 编辑修配厂
        dialogForm: {
          garageName: '',
          contacts: '',
          contactTel: '',
          beginOrEndTime: '',
          isRest: '',
          adcode: '',
          majorModels: [],
          majorProject: [],
          rescueRange: '',
          auditStatus: '',
          auditRemark: '',
          refereeNo: '',
          garageImg: '',
          address: '',
          provinceName: '',
          cityName: '',
          districtName: '',
          cityCode: '',
          coordinateX: '',
          coordinateY: ''
        },
        dialogFormRules: {
          garageName : [
            {required: true,  message: '请输入修配厂名称', trigger: 'blur'},
          ],
          contacts : [
            {required: true,  message: '请输入联系人名称', trigger: 'blur'},
          ],
          rescueRange : [
            {required: true,  message: '请输入救援范围', trigger: 'blur'},
          ],
          contactTel : [
            {required: true,  message: '请输入联系人电话', trigger: 'blur'},
          ],
          isRest : [
            {required: true,  message: '请选择是否营业', trigger: 'change'},
          ],
          beginOrEndTime : [
            {required: true,  message: '请选择营业时间', trigger: 'change'},
          ],
          majorModels : [
            {type: 'array',required: true,  message: '请选择主修车型', trigger: 'change'},
          ],
          majorProject : [
            {type: 'array',required: true,  message: '请选择主修项目', trigger: 'change'},
          ],
          address: [
            {required: true,  message: '请选择修配厂地址', trigger: 'blur'},
          ]
        },
        dialogFormVisible: false,

        isOpenOrClose: [
          {
            label: '营业',
            value: 1
          },
          {
            label: '未营业',
            value: 0
          }
        ],

        searchOption: {
          city: '全国',
          citylimit: true
        },

        addCenter: [121.59996, 31.197646],
        addAddress: '',
        addMarkers: [{
          position: [0, 0],
          visible: true
        }],
        addZoom: 12,
        markPosition: [121, 31],
        addEvents: {
          click(e) {
            let {lng, lat} = e.lnglat;
            self.addLng = lng;
            self.addLat = lat;
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });

            geocoder.getAddress([lng, lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.markPosition = [];
                  self.addMarkers = [];
                  self.markPosition.push(lng);
                  self.markPosition.push(lat);
                  let marker = {
                    position: self.markPosition,
                    visible: true
                  };
                  self.addMarkers.push(marker);
                  self.dialogForm.cityCode = result.regeocode.addressComponent.citycode;
                  self.dialogForm.adcode = result.regeocode.addressComponent.adcode;
                  self.dialogForm.address = result.regeocode.formattedAddress;
                  self.dialogForm.provinceName = result.regeocode.addressComponent.city;
                  self.dialogForm.cityName = result.regeocode.addressComponent.province;
                  self.dialogForm.districtName = result.regeocode.addressComponent.district;
                  self.dialogForm.coordinateX = result.regeocode.pois[0].location.lng;
                  self.dialogForm.coordinateY = result.regeocode.pois[0].location.lat;
                }
              }
            });
          }
        },
        plugin: [{
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 30000,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        //显示定位按钮，默认：true
          buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy:true,     //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions:'all',
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                  self.$nextTick();
                }
              });
            }
          }
        }],
        addLng: '',
        addLat: '',
        lng: '',
        lat: '',


        // 审批数据
        dialogApprovalVisible: false,
        dialogApprovalForm: {
          auditStatusAfter: 1,
          auditRemark: ''
        },
        dialogApprovalFormRules: {
          auditRemark : [
            {required: true,  message: '请输入审核意见', trigger: 'blur'},
          ]
        },

        // 搜索数据
        searchForm: {
          provinceName: '',
          cityName: '',
          districtName: '',
          grade: '',
          majorProject: [],
          majorModels: [],
          auditStatus: '',
          dateTime: [],
          garageName: '',
          contacts: '',
          contactTel: '',
          refereeNo: '',
          employeeNo: ''
        },
        // 修配厂等级
        repairLeverList: [
          {
            name: '普通修配厂',
            value: 0
          },
          {
            name: '精品修配厂',
            value: 1
          },
          {
            name: '联合服务站',
            value: 5
          }
        ],

        auditStatusList: [
          {
            id: 0,
            name: '未提交'
          },
          {
            id: 1,
            name: '已认证'
          },
          {
            id: 2,
            name: '待认证'
          },
          {
            id: 3,
            name: '已驳回'
          }
        ],
        vehicleTypeList: [],
        repairProjectList: [],
        provinceList: [],
        cityList: [],
        districtList: [],
        districtSearch: '',
        // 全选
        selection: [],
        tableData: [],
        searchData: {},
        pagination: {
          total: 0,
          pageIndex: 1 ,
          pageSize: 5
        },
        options: {
          mutiSelect: true,
          index: true, // 显示序号， 多选则 mutiSelect
          loading: false, // 表格动画
          initTable: true, // 是否一挂载就加载数据
        },

        btnLoading: false,
        imgSrcBasic: ""

      }
    },
    components: {
      searchView,
      CommonTable
    },
    created() {
      this.imgSrcBasic = process.env.BASE_API;
      // 获取高德省列表
      this.init();
      // 获取页面数据
      this.getList();
      // 获取维修类型
      vehicleType().then(res => {
        this.vehicleTypeList = res.result;
      });
      // 获取维修项目
      repairProject().then(res => {
        this.repairProjectList = res.result;
      });
    },
    methods: {
      // 高德地图获取省列表
      init: function () {
        var _this = this;
        this.districtSearch = '';
        AMap.plugin('AMap.DistrictSearch', function () {
          _this.districtSearch = new AMap.DistrictSearch({
            //  显示下级行政区级数，1表示返回下一级行政区
            subdistrict: 1
          })
          _this.districtSearch.search('中国', function (status, result) {
            var list = result.districtList[0]['districtList'];
            for (var i = 0; i < list.length; i++) {
              _this.provinceList.push(list[i].name);
            }
          })
        });
      },
      // 省市县修改
      provinceChange(e) {
        var _this = this;
        var provinceName = e;
        this.searchForm.cityName = '';
        this.searchForm.districtName = '';
        this.cityList = [];
        this.districtSearch.search(provinceName, function (status, result) {
          var list = result.districtList[0]['districtList'];
          for (var i = 0; i < list.length; i++) {
            _this.cityList.push(list[i].name);
          }
        })
      },
      cityChange(e) {
        var _this = this;
        var cityName = e;
        this.districtList = [];
        this.searchForm.districtName = '';
        this.districtSearch.search(cityName, function (status, result) {
          var list = result.districtList[0]['districtList'];
          for (var i = 0; i < list.length; i++) {
            _this.districtList.push(list[i].name);
          }
        })
      },

      // 新增地图查询
      onSearchResult(posi) {
        if (posi.length > 0) {
          this.addCenter = [posi[0].lng, posi[0].lat];
          this.addZoom = 18;
        }
      },

      // 上传限制
      beforeUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isGIF = file.type === "image/gif";
        const isPNG = file.type === "image/png";
        const isBMP = file.type === "image/bmp";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message({
            showClose: true,
            message: "只能上传jpeg,gif,png,bmp,pdf等类型的图片文件",
            type: "warning"
          });
        }
        if (!isLt2M) {
          this.$message({
            showClose: true,
            message: "图片大小不超过2M",
            type: "warning"
          });
        }
        if ((isJPG || isBMP || isGIF || isPNG) && isLt2M) {
          this.typeBok = true;
        } else {
          this.typeBok = false;
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
      // 上传成功提示
      handleChange(response, file) {
        if (response.code == 200) {
          this.dialogForm.garageImg = response.result;
          this.$notify({
            title: response.message,
            type: "success"
          });
        }
      },

      getSelectChange() {
        if(this.selection.length > 0) {
          this.dialogApprovalVisible = true;
        }else {
          this.$message({
            message: '请选择要审批的修配厂',
            type: 'warning'
          });
        }
      },

      //批量选择
      getSelectOption(option) {
        this.selection = option;
      },

      // 列表, 搜索
      getList() {
        this.options.loading = true;
        let params = Object.assign(
          {
            pageNum: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          },
          this.searchData
        );
        allPageQuery(params).then(res => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        });
      },
      searchBtn(val) {
        this.searchData = Object.assign({}, val);
        this.searchData.pageNum = 1;
        if(this.searchData.dateTime) {
          if(this.searchData.dateTime.length > 0) {
            this.searchData.startTime = this.searchData.dateTime[0];
            this.searchData.endTime = this.searchData.dateTime[1];
          }
        }
        this.getList();
      },

      // 价格
      valueValidator(value) {
        let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
        if(reg.test(value)) {
          return true;
        }else {
          return false;
        }
      },
      handleClick(val, type) {
        if(type == 1) {
          this.$prompt('请输入加盟费用', '加盟联合服务站', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: this.valueValidator,
            inputErrorMessage: '请输入正确金额'
          })
            .then(({ value }) => {
              let params = {
                garageId: val.id,
                joinPrice: value,
                operateType: type
              }
              joinOrOutGaurantee(params).then((res) => {
                if(res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "加盟成功!"
                  });
                  this.getList();
                }else {
                  this.$message({
                    type: "error",
                    message: res.message
                  });
                }
              })
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消加盟"
              });
            });
        }else {
          this.$confirm('此操作将该修理厂退出联合服务站, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              garageId: val.id,
              operateType: type
            };
            joinOrOutGaurantee(params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type: "success",
                  message: "退出加盟成功!"
                });
                this.getList();
              }else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出加盟'
            });
          });
        }
      },

      // 列表页数更改
      handleCurrentChange(val) {
        this.pagination.pageIndex = val;
        this.getList();
      },
      // 列表条数更改
      handleSizeChange(val) {
        this.pagination.pageSize = val;
        this.getList();
      },


      // 审批修理厂
      dialogApprovalClick() {
        this.$refs.dialogApprovalForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            let arr = [];
            this.selection.map(v => {
              arr.push(v.id);
            })
            let params = Object.assign({
              garageIds: arr
            }, this.dialogApprovalForm)
            auditGarage(params).then(res => {
              if(res.code == 200) {
                this.cancelApprovalDialog();
                this.getList();
                this.$refs.multipleTable.clearSelection();
                this.$notify.success({
                  title: res.message,
                  offset: 100
                });
              }else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                });
              }
              this.btnLoading = false;
            }).catch(err => {
              this.btnLoading = false;
            })
          }
        });
      },
      cancelApprovalDialog() {
        this.dialogApprovalVisible = false;
        this.dialogApprovalForm = {
          auditStatusAfter: 1,
          auditRemark: ''
        };
        this.$refs['dialogApprovalForm'].resetFields();
      },

      editClick(val) {
        garageInfo({
          garageId: val.id
        }).then(res => {
          this.dialogForm = Object.assign({}, res.result);
          // 让地图定位转移过去
          this.addCenter = [this.dialogForm.coordinateX, this.dialogForm.coordinateY];
          this.addMarkers = [{
            position: [this.dialogForm.coordinateX, this.dialogForm.coordinateY],
            visible: true
          }];

          this.dialogForm.majorModels = [];
          this.dialogForm.majorProject = [];
          // 类型变更
          this.dialogForm.majorModelsArray.map(v => {
            this.dialogForm.majorModels.push(v.id);
          });
          this.dialogForm.majorProjectArray.map(v => {
            this.dialogForm.majorProject.push(v.id);
          });
          this.addZoom = 18;

          this.dialogFormVisible = true;
        })
      },

      // 清除地图上的搜索
      clearMapSearchInput() {
        let oMapSearchBox = document.querySelector('.search-box-wrapper input');
        oMapSearchBox.value = '';
      },

      // 编辑
      dialogClick() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            garageEditBySystem(this.dialogForm).then(res => {
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
        this.clearMapSearchInput();
        this.dialogForm = {
          garageName: '',
          contacts: '',
          contactTel: '',
          beginOrEndTime: '',
          isRest: '',
          majorModels: [],
          majorProject: [],
          auditStatus: '',
          auditRemark: '',
          refereeNo: '',
          garageImg: '',
          address: '',
          provinceName: '',
          cityName: '',
          districtName: '',
          coordinateX: '',
          coordinateY: ''
        };
        this.$refs['dialogForm'].resetFields();
      },
    }
  }
</script>

<style lang="sass">
	.repairBox
		overflow: hidden
		margin: 20px 20px 0
		.amap-demo
			margin-top: 0 !important;
			position: relative;
			min-height: 320px !important;
		.addMap .el-vue-amap
			min-height: 320px !important;
		.el-vue-search-box-container
			position: absolute !important;
			top: 10px;
			left: 10px;
			width: 94% !important;
		.amap-page-container
			position: relative;
			margin: 0 0 .1rem;
			left: 10%;
			padding-right: .1rem;
			box-sizing: border-box;
			width: 100%;
			max-width: 850px;
		.paginationClass
			float: right
			margin-top: 20px
			margin-right: 20px
		.dialogBox
			width: 50%
			text-align: left
			padding-right: 10px
		.avatar
			height: 300px
			display: block
		.avatar-uploader .el-upload
			border: 1px dashed #d9d9d9
			border-radius: 6px
			cursor: pointer
			position: relative
			overflow: hidden
		.avatar-uploader .el-upload:hover
			border-color: #409EFF
		.avatar-uploader-icon
			font-size: 28px
			color: #8c939d
			width: 790px
			height: 200px
			line-height: 178px
			text-align: center
</style>
