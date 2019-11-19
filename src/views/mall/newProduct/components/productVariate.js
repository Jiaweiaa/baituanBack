//商品标题异步校验
let asyncProductTitle = (rule, value, callback) => {
  if (value == "") {
    return callback(new Error("请输入商品标题"));
  } else {
    console.log(this, "666");
    if (this.isEdit && this.value.item.localTitle == value) {
      return callback();
    } else {
      let params = {
        title: this.value.item.title
      };
      checkItemTitle(params)
        .then(res => {
          if (res.result == true) {
            return callback();
          } else {
            return callback(new Error(res.message));
          }
        })
        .catch(err => {});
    }
  }
};
//商品code异步校验
let asyncProductCode = (rule, value, callback) => {
  if (value == "") {
    return callback(new Error("请输入商品编码"));
  } else {
    if (this.isEdit && this.value.item.localCode == value) {
      return callback();
    } else {
      let params = {
        code: this.value.item.code
      };
      checkItemCode(params)
        .then(res => {
          if (res.result == true) {
            return callback();
          } else {
            return callback(new Error(res.message));
          }
        })
        .catch(err => {});
    }
  }
};
//佣金数字校验
let syncRatio = (rule, value, callback) => {
  if (this.value.item.ratio == "") {
    console.log("走到我拉");
    return callback();
  } else if (regRadio(this.value.item.ratio)) {
    return callback();
  } else {
    return callback(new Error("请输入0至100之间的数字"));
  }
};
//原价校验
let syncSalePrice = (rule, value, callback) => {
  if (regPrice(this.value.item.salePrice)) {
    return callback();
  } else {
    return callback(new Error("请输入正确的商品价格"));
  }
};
//销售价校验
let syncListPrice = (rule, value, callback) => {
  if (regPrice(this.value.item.listPrice)) {
    return callback();
  } else {
    return callback(new Error("请输入正确的商品价格"));
  }
};
export const newProductRules = {
  title: [
    { required: true, message: "请输入商品标题", trigger: "blur" },
    { validator: asyncProductTitle, trigger: "blur" }
  ],
  code: [
    { required: true, message: "请输入商品编码", trigger: "blur" },
    { validator: asyncProductCode, trigger: "blur" }
  ],
  ratio: [{ validator: syncRatio, trigger: "blur" }],
  subTitle: [{ required: true, message: "请输入商品副标题", trigger: "blur" }],
  style: [{ required: true, message: "请输入商品款式", trigger: "blur" }],
  type: [{ required: true, message: "请选择商品类型", trigger: "blur" }],
  status: [{ required: true, message: "请选择商品状态", trigger: "blur" }],
  sketch: [{ required: true, message: "请输入扼要描述", trigger: "blur" }],
  keywords: [{ required: true, message: "请输入关键字", trigger: "blur" }],
  checkedList: [{ required: true, message: "请选择可用渠道", trigger: "blur" }],
  salePrice: [
    { required: true, message: "请输入原价", trigger: "blur" },
    { validator: syncSalePrice, trigger: "blur" }
  ],
  listPrice: [
    { required: true, message: "请输入优惠价", trigger: "blur" },
    { validator: syncListPrice, trigger: "blur" }
  ]
};
