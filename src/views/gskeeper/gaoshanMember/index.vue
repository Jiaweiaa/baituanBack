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
        <CommonTable
          :columns="columns"
          :dataSource="tableData"
          :options="options"
          :fetch="getList"
          :pagination="pagination"
        />

      <!--图片查看-->
      <el-dialog id="photoSee" title="照片" :visible.sync="photoVisible">
        <div style="text-align: center;">
          <img
            width="360"
            :src="this.GLOBAL.imgUrl+photoUrl"
            alt="">
        </div>

      </el-dialog>
    </div>
</template>

<script>
  import searchView from "@/components/searchView/index";
  import CommonTable from '@/components/Table'
  import {
    gsMemList
  } from '@/api/gskeeper/gaoshanMember/index'
  export default {
    name: 'gaoshanMember',
    data() {
      return {
        // 图片是否显示
        photoVisible: false,
        photoUrl: '',
        // 搜索table渲染的数据
        searchModel: [
          {
            input: [
              {
                placeholder: '请输入车辆车牌号',
                inputModel: 'carNo',
                labelName: '车辆车牌号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入会员注册手机号',
                inputModel: 'memberMobile',
                labelName: '会员注册手机号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入会员编号',
                inputModel: 'memberNo',
                labelName: '会员编号',
                model: '',
                type: 'el-input'
              },
              {
                placeholder: '请输入会员名称',
                inputModel: 'memberName',
                labelName: '会员名称',
                model: '',
                type: 'el-input'
              }
            ],
            button: [{
              type: 'primary',
              func: 'searchBtn',
              name: '搜索'
              }
            ]
          }
        ],

        // table和分页的数据
        columns: [
          {
            prop: 'memberNo',
            label: '会员编号'
          },
          {
            prop: 'carNo',
            label: '车辆车牌号'
          },
          {
            prop: 'memberMobile',
            label: '会员电话'
          },
          {
            prop: 'memberName',
            label: '会员名称'
          },
          {
            prop: 'carType',
            label: '车辆类型'
          },
          {
            prop: 'mileage',
            label: '当前里程'
          },
          {
            prop: 'monthMileage',
            label: '月均里程'
          },
          {
            prop: 'nextUpkeepDate',
            label: '下一次保养日期'
          },
          {
            prop: 'createTime',
            label: '审核时间'
          },
          {
            showLabel: true,
            prop: 'carPosImg',
            label: '车辆正面照片',
            // render 可以根据你想要渲染的方式渲染
            // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
            // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
            render: (row, index) => {
              return (
                <img
                  on-click={() => this.lookThis(row.carPosImg)}
                  style="width: 50px; height: 50px; cursor: pointer;"
                  src={ this.GLOBAL.imgUrl +row.carPosImg }
                />
              )
            }
          },
          {
            showLabel: true,
            prop: 'carNegImg',
            label: '车辆反面照片',
            // render 可以根据你想要渲染的方式渲染
            // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
            // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
            render: (row, index) => {
              return (
                <img
                on-click={() => this.lookThis(row.carNegImg)}
                style="width: 50px; height: 50px; cursor: pointer;"
                src={this.GLOBAL.imgUrl+row.carNegImg}
                />
              )
            }
          }
        ],
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
        dialogForm: {},
        dialogFormRules: {},
        dialogFormVisible: false,
      }
    },
    components: {
      searchView,
      CommonTable
    },
    methods: {
      // 获取列表
      getList() {
        this.options.loading = true;
        let params = Object.assign({
          pageNum: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }, this.searchData);
        gsMemList(params).then((res) => {
          this.tableData = res.result.records;
          this.pagination.total = Number(res.result.total);
          this.current = Number(res.result.current);
          this.options.loading = false;
        })
      },

      // 搜索方法
      searchBtn(val) {
        this.searchData = val;
        this.getList();
      },
      lookThis(val) {
        this.photoUrl = val;
        this.photoVisible = true;
      }
    }
  }
</script>

<style lang="sass">
    .labberConcessionsBox
        overflow: hidden
        margin: 20px 20px 0
</style>
