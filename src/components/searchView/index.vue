<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-17 16:14:05
 * @LastEditTime: 2019-08-20 17:09:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="searchModel">
    <!--
     公共头封装:
      方法:
        addFun  新增
        searchFun 查询

      传参: searchModel
            searchModel.input 输入框,
              lableName: 表头名
              placeholder: 描述词
              model: vue数据绑定对象
            searchModel.button 操作按钮
              传入数据先增后搜
              type: 输入框类型

              type: 按钮类型
              method: 按钮触发事件
              name: 按钮名称
    -->
	  <el-card class="filter-container" shadow="never" style="margin-top:20px;">
		  <div style="margin-bottom: 20px; overflow: hidden; display: flex; align-items: center;">
			  <i class="el-icon-search"></i>
			  <span>筛选搜索</span>
			  <div
					  style="width: calc(100% - 100px); text-align: right; float: right;"
					  :gutter="20"
					  v-show="this.searchModel[0].button.length > 0 || this.searchModel[0].button.length <2 ">
				  <div style="float: right;margin-right: 10px;" v-for="(item, key) in this.searchModel[0].button" :key="key">
					  <el-button
							  size="small"
							  :type="item.type"
							  v-if="item.hasPerm? hasPerm(item.hasPerm): true"
							  @click="clickBtn(item.func)">{{item.name}}</el-button>
				  </div>
			  </div>
		  </div>
	    <el-row :gutter="20" >
	      <el-form :inline="true" class="demo-form-inline">
	        <el-col
	          :span="item.type == 'el-date-picker'? 8 : 6"
	          justify="left"
	          v-for="(item, key) in this.searchModel[0].input"
	          :key="key">
	          <el-form-item  :label="item.labelName" :labelWidth="item.width ? item.width : '120px'">
	            <el-input
	              v-if="item.type == 'el-input'"
	              :placeholder="item.placeholder"
	              v-model="item.model"
	              clearable>
	            </el-input>
	            <el-select
	              v-model="item.model"
	              @change="changeBtn(item)"
	              :multiple="item.multiple"
	              clearable
	              v-else-if="item.type == 'el-select'"
	              placeholder="请选择">
	              <el-option
	                v-for="childItem in item.options"
	                :key="childItem.status"
	                :label="childItem.name"
	                :value="childItem.status">
	              </el-option>
	            </el-select>
	            <el-date-picker
	              v-else-if="item.type == 'el-date-picker'"
	              v-model="item.model"
	              type="datetimerange"
	              align="right"
	              start-placeholder="开始日期"
	              value-format="yyyy-MM-dd HH:mm:ss"
	              end-placeholder="结束日期"
	              :default-time="['12:00:00', '08:00:00']">
	            </el-date-picker>
	            <el-cascader
	              v-else-if="item.type == 'el-cascader'"
	              v-model="item.model"
	              placeholder="请选择车辆类型"
	              :options="item.listOptions"
	              clearable
	              :props="item.props"
	              change-on-select
	            ></el-cascader>
	          </el-form-item>
	        </el-col>
	      </el-form>
	    </el-row>
	  </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      searchModel: [Array]
    },
    methods: {
      clickBtn(item) {
        let params = {};
        this.searchModel[0].input.forEach((item, index) => {
          let key = item.inputModel;
          let val = item.model;
          params[key] = val;
        })
        if( item == 'addBtn') {
          this.$parent.addBtn();
        }else if(item == 'searchBtn') {
          this.$parent.searchBtn(params);
        }else if(item == 'disShow'){
          this.$parent.disShow();
        }else if(item == 'hasShow') {
          this.$parent.hasShow();
        }else if(item == 'toggleSure') {
          this.$parent.toggleSure();
        }else if(item == 'toggleAllSure') {
          this.$parent.toggleAllSure();
        }else {
          console.log('其他事件');
        }
      },
      changeBtn(item) {
        if(item.fun == 'suplerFun'){
          this.$parent.suplerFun(item.model);
        }else if(item.fun == 'captainFun'){
          this.$parent.captainFun(item.model);
        }else {
        
        }
      }
    }
  }
</script>

<style lang="sass">
  .searchModel
    .el-form-item
      width: 100%
      .el-form-item__content
        width: calc(100% - 120px)
    .el-select
      width: 100%
</style>
