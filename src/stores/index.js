import Vuex from 'vuex'
import Vue from 'vue'
import app from './modules/app/index'
import business from './modules/business/index'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    business
  }
})
export default store
