const steps = [
  {
    element: '.tree',
    popover: {
      title: '商品分类树状表',
      description: '点击对应节点可显示操作面板对数据进行操作',
      position: 'right',
      showButtons: true,         // Do not show control buttons in footer
      closeBtnText: '关闭引导',      // Text on the close button for this step
      nextBtnText: '下一步',        // Next button text for this step
      prevBtnText: '上一步',
    }
  },
  {
    element: '.input',
    popover: {
      title: '过滤输入框',
      description: '输入内容搜索',
      position: 'bottom',
      showButtons: true,         // Do not show control buttons in footer
      closeBtnText: '关闭引导',      // Text on the close button for this step
      nextBtnText: '下一步',        // Next button text for this step
      prevBtnText: '上一步',
    }
  }
 
]

export default steps
