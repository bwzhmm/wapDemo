import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import user from './modules/user';
import menu from './modules/menu';
export default new Vuex.Store({
    modules: {
        user,
        menu
    }
});

