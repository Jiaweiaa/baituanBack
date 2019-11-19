import drag from './drag'

const install = function(Vue) {
  Vue.directive('my-drag-panel', drag)
}

if (window.Vue) {
  alert(111)
  window['my-drag-panel'] = drag
  Vue.use(install); // eslint-disable-line
}

drag.install = install
export default drag
