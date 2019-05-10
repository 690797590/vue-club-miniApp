import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
import Util from './utils/util.js';
import API from './utils/api.js';

Vue.prototype.Util = Util;
Vue.prototype.$Api = API;
export default {

}