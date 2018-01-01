import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  lang: 'en'
}

const mutations = {
  langChange (state, currentLang) {
      state.lang = currentLang
  }
}

export default new Vuex.Store({
  state,
  mutations
})
