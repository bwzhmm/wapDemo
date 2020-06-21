import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import '../theme/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI, { size: 'mini'});
// import '@/mockjs'; // mock数据
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
