<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-18 17:04:46
 * @LastEditTime: 2019-10-06 15:26:47
 * @LastEditors: Please set LastEditors
 -->
<!-- 销售单元 -->
<template>
  <div style="margin-top: 50px" class="product_unit">
    <div v-if="skuTableData.length>0&&isEdit==false">
      <el-alert
        title="敏捷录入功能:填写完第一行的所有表格信息之后 可以点击敏捷录入实现剩下所有行的数据一次性录入,
          UPC是商品规格的唯一标识 不可重复 输入重复的UPC会导致商品无法被创建"
        type="warning"
        center
        show-icon
      ></el-alert>
    </div>
    <div class="sku_handle">
      <el-button type="success" @click="openSaleUnit()">打开商品销售单元生成器</el-button>
      <el-button type="primary" v-if="skuTableData.length>0&&isEdit==false" @click="quickImp()">敏捷录入</el-button>
    </div>

    <!-- SKU表格 -->
    <div class="sku_table">
      <el-table :data="skuTableData" border fit style="width: 100%; margin-top: 20px">
        <el-table-column
          :prop="item.property.displayName"
          :label="item.property.displayName"
          align="center"
          header-align="center"
          v-for="(item,index) in thList"
          :key="index"
        >
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.propertyValueCommands" :key="i" v-show="i==index">
              <span>{{v.propertyValue.value}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="UPC" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input
              :disabled="scope.row.upcDisabled"
              @change="scope.row.extentionCode=scope.row.extentionCode.replace(/[\u4E00-\u9FA5]/g,'')"
              v-model="scope.row.extentionCode"
              clearable
              @blur="verifyUpc(scope)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input
              :disabled="scope.row.upcIsabled"
              v-model="scope.row.quantity"
              type="number"
              min="0"
              suffix-icon="el-icon-receiving"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="成本价" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.costPrice" type="number" min="0" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="原价" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.salePrice" type="number" min="0" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="购物豆价格" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.peasPrice" type="number" min="0" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="优惠价" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.listPrice" type="number" min="0" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="积分价" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scorePrice"
              type="number"
              min="0"
              clearable
            >
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="混合现金价" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mixCashPrice"  type="number" min="0" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="混合积分价" align="center" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mixScorePrice" type="number" min="0" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="medium">我是操作</el-button>
            </template>
        </el-table-column>-->
      </el-table>
    </div>

    <!-- 模态框   -->
    <el-dialog title="销售单元生成器" :visible.sync="dialogVisible" width="60%" center>
      <el-dialog width="30%" title="添加自定义属性值" :visible.sync="customValueVisible" append-to-body>
        <span>输入自定义属性值</span>
        <el-input type="textarea" placeholder="请输入内容后按下回车编辑下一行" v-model="customValue"></el-input>

        <span slot="footer" class="dialog-footer">
          <el-button @click="customValueVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCustomValue">确 定</el-button>
        </span>
      </el-dialog>
      <div style="width:80%;margin:0 auto;">
        <el-card class="box-card">
          <div style="font-size:18px;color:#000;">
            <el-alert
              title="小提示"
              type="warning"
              description="点击属性前面的方框选择属性然后再点击中间的箭头使选择项进行穿梭,每个穿梭框都必须选择至少一项属性,如果有多个分组可以选择然后选择对应分组下的数据"
              show-icon
            ></el-alert>

            <div style="display:flex;justify-content: center;">
              <div>
                属性集名称:
                <el-tag>{{unitTitile}}</el-tag>
              </div>
            </div>
          </div>

          <div class="center" v-for="(item,index) in unitData" :key="index">
            <div>
              <div
                style="display:flex; justify-content: space-between;align-items:center;margin:20px 0;"
              >
                <div style="font-size:18px;color:#000;">{{item.property.name}}</div>

                <div>
                  <el-select
                    v-if="item.property.editType!=4"
                    v-model="selectArr[index]"
                    @change="selectChange(index)"
                    filterable
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="items in item.objValues"
                      :key="items.groupName"
                      :label="items.groupName"
                      :value="items.groupName"
                    ></el-option>
                  </el-select>
                  <!-- 新增自定义值 -->
                  <el-button
                    @click="openCustomValue(item)"
                    v-else
                    type="primary"
                    size="mini"
                    round
                  >新增自定义值</el-button>
                </div>
              </div>

              <el-transfer
                filterable
                :titles="['未选择', '已选择']"
                :filter-method="filterMethod"
                :data="item.changeValues"
                :ref="`transfer${index}`"
                :button-texts="['到左边', '到右边']"
                v-model="transferObj[`transferValue${index}`]"
                :props="{
                  key: 'value',
                  label: 'value'
                }"
              ></el-transfer>
            </div>
          </div>
        </el-card>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSku()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//value.item.itemProperties的值为穿梭框所选的属性ID及属性值ID对应出来的关系集合
import CommonTable from "@/components/Table";
import {
  toCreateItem,
  drawSkuTable,
  readyCreateItemData,
  createOrUpdateItem,
  checkExtentionCode
} from "@/api/mall/newProduct";
export default {
  name: "ProductSaleUnit",
  components: {
    CommonTable
  },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    },
    //列表数据
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      flagId: "", //自定义属性标识ID 用于在UnitData中定位自定义属性值穿梭框的数据源
      customValueVisible: false, //编辑自定义属性模态框
      customValue: "", //文本域双向绑定的自定义属性值
      thList: [], //表头
      skuTableData: this.tableData,
      hasEditCreated: false,
      //列表配置项
      tableOptions: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },

      //销售单元生成器模态框
      dialogVisible: false,
      unitTitile: "", //标题
      unitData: [], //销售单元生成器数据源
      selectArr: [],
      transferObj: {}, //穿梭框数据对象
      //与后台交互的数据模型↓↓
      saveForm: {
        makeItemProperties: [], //商品属性集合
        makePropertyIds: [], //属性id集合
        makePropertysetId: "", //属性集id
        makeItemId: "", //商品ID
        makeIStatus: "" //商品状态
      }
    };
  },
  mounted() {
    if (this.isEdit) {
      this.thList = this.skuTableData[0].propertyValueCommands;
    }
    if (this.value.item.defaultItemCategoryId != "") {
      readyCreateItemData({ categoryId: this.value.item.defaultItemCategoryId })
        .then(res => {
          if (res.code == "200") {
            this.unitTitile = res.result.propertyset.name;
            this.value.item.propertysetId = res.result.propertyset.id;
            this.value.item.propertysetName = res.result.propertyset.name;
            this.value.item.propertyset = res.result.propertyset;
            this.saveForm.makeIStatus = res.result.istatus;
            this.saveForm.makePropertysetId = res.result.propertyset.id;
            let sourceData = res.result.salePropertyMap.thList;
            this.unitData = sourceData.filter(v => {
              if (v.property.editType != 4) {
                if (v.objValues != null) {
                  this.$set(v, "changeValues", v.objValues[0].propertyValue);
                }
              } else {
                this.$set(v, "changeValues", []);
              }
              return v;
            });
            //循环数据源 动态建立每个穿梭框起始数据
            let i = 0;
            this.unitData.map(v => {
              this.selectArr.push(v.objValues[0].groupName);
              this.$set(this.transferObj, `transferValue${i}`, []);
              i++;
            });
          }
        })
        .catch(err => {});
    }
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    }
  },
  watch: {
    productId: function(newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    }
  },
  methods: {
    //计算价格
    countPrice(row) {
      //scorePrice积分价  costPrice成本价
      
      let costPrice = Number(row.costPrice);
      let scorePrice = Number(row.scorePrice);
      if (costPrice && scorePrice) {
        if (scorePrice > costPrice) {
          row.mixCashPrice = costPrice;
          row.mixScorePrice = scorePrice - costPrice;
        } else {
          alert("积分价必须大于成本价,请重新输入");
          row.mixScorePrice = 0;
          row.mixCashPrice = 0;
        }
      }
    },
    //快速同步SKU表格第一行数据到所有表格中
    quickImp() {
      this.skuTableData.map((item, index) => {
        if (index != 0) {
          item.extentionCode = this.skuTableData[0].extentionCode + index;
          item.quantity = this.skuTableData[0].quantity;
          item.salePrice = this.skuTableData[0].salePrice;
          item.costPrice = this.skuTableData[0].costPrice;
          item.listPrice = this.skuTableData[0].listPrice;
          item.status = this.skuTableData[0].status;
          item.isDefault = this.skuTableData[0].isDefault;
        }
      });
    },
    submitCustomValue() {
      //将文本域中的值以回车为标识分割成数组
      let customValueArr = this.customValue.split("\n");
      this.unitData.map(v => {
        if (v.property.id == this.flagId) {
          customValueArr.map(vv => {
            v.changeValues.push({
              displayValue: vv,
              value: vv
            });
          });
          let hash = {};
          v.changeValues = v.changeValues.reduceRight((item, next) => {
            hash[next.value]
              ? ""
              : (hash[next.value] = true && item.push(next));
            return item;
          }, []); //对象数组去重
        }
        console.log(this.unitData);
      });

      //清空文本域 关闭模态框
      this.customValue = "";
      this.customValueVisible = false;
    },
    /**
     * @打开添加自定义属性值模态框
     */
    openCustomValue(item) {
      this.flagId = item.property.id;
      this.customValueVisible = true;
    },
    //校验UPC是否可用
    verifyUpc(item) {
      let params = {
        extentionCode: item.row.extentionCode,
        itemId: item.row.id
      };
      let upcFlag = false;
      this.skuTableData.map((v, ind) => {
        if (ind != item.$index) {
          if (v.extentionCode == item.row.extentionCode) {
            upcFlag = true;
            item.row.upcIsabled = true;
          }
        }
      });
      if (!upcFlag) {
        checkExtentionCode(params)
          .then(res => {
            if (res.result == true && item.row.extentionCode != "") {
              item.row.upcIsabled = false;
            } else {
              item.row.upcIsabled = true;
            }
          })
          .catch(err => {});
      }
    },
    /**
     * @打开模态框获取销售单元数据
     */
    openSaleUnit() {
      this.dialogVisible = true;
    },
    /**
     * @选择器发生变化触发的事件
     */
    selectChange(code, val) {
      this.unitData[code].objValues.map(v => {
        if (v.groupName == this.selectArr[code]) {
          this.$nextTick(() => {
            const data = v.propertyValue;
            this.unitData[code].changeValues = data;
          });
        }
      });
    },
    /**
     * @提交生成销售单元SKU表格
     */
    submitSku() {
      this.saveForm.makeItemProperties = [];
      //提交时  所有的穿梭框都必须选择到值
      let flag = true;
      //transferObj是已选择的穿梭框内容集合
      for (const key in this.transferObj) {
        if (this.transferObj[key].length == 0) {
          flag = false;
        }
      }
      this.unitData.map(v => {
        this.saveForm.makePropertyIds.push(v.property.id);
        this.saveForm.makePropertyIds = Array.from(
          new Set(this.saveForm.makePropertyIds)
        ); //数组去重
      });
      if (flag) {
        // console.log(this.transferObj);
        this.unitData.map((v, index) => {
          // console.log(v);
          //循环销售单元备选项数据 如果是无值属性 直接将已选择的值添加到表单数组中
          if (v.property.editType == 4) {
            for (const key in this.transferObj) {
              if (key == `transferValue${index}`) {
                this.transferObj[key].map(vv => {
                  this.saveForm.makeItemProperties.push({
                    propertyId: v.property.id, //对应属性ID
                    propertyValue: vv
                  });
                });
              }
            }
          } else {
            //如果不是无值属性 迭代备选项中的propertyValue数组 查找出匹配的值 循环添加进表单数组中
            for (const key in this.transferObj) {
              if (key == `transferValue${index}`) {
                this.transferObj[key].map(vv => {
                  v.objValues.map(vvv => {
                    vvv.propertyValue.map(vvvv => {
                      if (vvvv.value == vv) {
                        this.saveForm.makeItemProperties.push({
                          propertyValueId: vvvv.id,
                          propertyValue: vvvv.value,
                          propertyId: v.property.id
                        });
                      }
                    });
                  });
                });
              }
            }
          }
        });
        //itemProperties赋值
        this.value.item.itemProperties = [];
        this.value.item.itemProperties = this.saveForm.makeItemProperties;
        drawSkuTable(this.saveForm)
          .then(res => {
            if (res.code == "200") {
              this.dialogVisible = false;
              this.skuTableData = res.result.trList;
              this.skuTableData.map(v => {
                //为value.item.skuInventoryQtyDtos所需要的数据做准备
                this.$set(v, "itemProperties", []);
                this.$set(v, "upcIsabled", true);
                v.propertyValueCommands.map(vv => {
                  if (vv.property.editType == 4) {
                    v.itemProperties.push({
                      propertyId: vv.property.id,
                      propertyValue: vv.propertyValue.value
                    });
                  } else {
                    v.itemProperties.push({
                      propertyId: vv.property.id,
                      propertyValueId: vv.propertyValue.id
                    });
                  }
                });
                this.$set(v, "extentionCode", "");
                this.$set(v, "quantity", "");
                this.$set(v, "salePrice", "");
                this.$set(v, "costPrice", ""); // 成本价
                this.$set(v, "peasPrice", ""); // 购物豆价格
                this.$set(v, "listPrice", "");
                this.$set(v, "scorePrice", ""); // 积分价
                this.$set(v, "mixScorePrice", ""); // 混合积分价
                this.$set(v, "mixCashPrice", ""); // 混合现金价
                this.$set(v, "status", 1);
                this.$set(v, "isDefault", false);
                
              });
              //这个值有用
              this.thList = this.skuTableData[0].propertyValueCommands;
              this.$emit("emitSkuTableData", this.skuTableData, this.thList);
            } else {
              this.$message(res.message);
            }
          })
          .catch(err => {});
      } else {
        this.$message.error("存在没有被选取的分组数据");
      }
    },
    //筛选穿梭框数据
    filterMethod(query, item) {
      return item.value.includes(query);
    }
  }
};
</script>

<style scoped>
.sku_handle,
.sku_table {
  display: flex;
  justify-content: center;
}

.product_unit /deep/ .el-transfer-panel {
  width: 300px;
}
.product_unit /deep/ .el-transfer-panel .el-checkbox__inner {
  height: 16px;
  width: 16px;
}
.product_unit /deep/ .el-checkbox__label {
  font-size: 16px;
}
/* .el-table__header-wrapper {
  display: flex!important;
  justify-content: center!important;
}
.el-table__body-wrapper {
  display: flex!important;
  justify-content: center!important;
} */
.product_form .el-input {
  width: 150px;
}
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
.center {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
