import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  plugins: [
    createPersistedState({
      paths: [],
    }),
  ],
  state() {
    return {}
  },
  getters: {},
  mutations: {},
})

export default store
