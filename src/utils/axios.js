import axios from "axios/dist/axios";
import router from './router'
import store from './store'

const axiosInstance = axios.create()

// axiosInstance.defaults.baseURL = "http://localhost:8080"
axiosInstance.defaults.baseURL = "http://43.138.201.202:8080"

// 前置拦截
axiosInstance.interceptors.request
  .use(config => {
    console.log('请求拦截器', config);
    return config
  }, error => {
    // console.log('请求拦截器错误', error);
    return Promise.reject(error)
  })

axiosInstance.interceptors.response
  .use(response => {
    const res = response.data;

    if (res.code === 200) {
      return response
    } else if (res.code === 401) {
      store.commit("REMOVE_INFO")
      router.push("/login")
      return Promise.reject(res)
    } else {
      if (response.headers['content-type'].search('application/x-msdownload') > -1) {
        return response;
      }
      return Promise.reject(res)
    }
  }, error => {
    // console.log("error:", error)
    if (error.response.data) {
      error.message = error.response.data.msg
    }
    return Promise.reject(error)
  })

export default axiosInstance