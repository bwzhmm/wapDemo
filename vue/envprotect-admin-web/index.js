
import Vue from 'vue';
import App from './App';
import router from './router';
import store from "./store";
import "babel-polyfill";
import AMap from "AMap"; // 引入高德地图
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
Vue.use(AMap);
Vue.config.productionTip = false;
import './style/common.scss'
import './assets/iconfont/iconfont.css'
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
