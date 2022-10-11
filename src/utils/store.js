import { ElMessage } from "element-plus";
import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'
import router from "./router";

const store = createStore({
  state: {
    refreshTime: null,
    token: null,
    userInfo: null,
    isAlive: false,
    chatData: [],
  },
  mutations: {
    // set
    SET_REFRESH: (state, timer) => {
      state.refreshTime = timer
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    SET_CHATSTATE: (state, flag) => {
      state.isAlive = flag
    },
    SET_CHATDATA: (state, chatData) => {
      state.chatData.push(chatData)
    },
    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      state.refreshTime = null
      window.localStorage.setItem("token", '')
      window.sessionStorage.setItem("userInfo", JSON.stringify(''))
    },
    REMOVE_CHATSTATE: (state) => {
      state.isAlive = false
    }
  },
  getters: {
    // get
    getUser: state => {
      return state.userInfo
    },
    getToken: state => {
      let timer = state.refreshTime
      if (timer) {
        let requestTime = Date.now()
        // console.log('requestTime', requestTime)
        if (timer < requestTime) {
          ElMessage.warning('登录已过期，请重新登录')
          console.log('登录已过期，请重新登录')
          window.localStorage.setItem("token", '')
          window.sessionStorage.setItem("userInfo", JSON.stringify(''))
          router.push('/login')
        } else {
          return state.token
        }
      } else {
        console.log('没有登录')
      }
    },
    getChatState: state => {
      return state.isAlive
    },
    getChatData: state => {
      return state.chatData
    }
  },
  actions: {

  },
  plugins: [createPersistedState(
    //配置将vuex的状态储存到sessionStorage中（默认储存到localStorage中）
    { storage: window.sessionStorage }
  )],
  modules: {
  }
})

export default store;
