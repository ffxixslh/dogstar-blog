import router from "./router";
import store from "./store";
import axiosInstance from "./axios"
import { ElMessage } from 'element-plus'

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requireAuth)) {
    const token = store.state.token

    // 判断当前的token是否存在 ； 登录存入的token
    if (token) {
      if (to.path === '/login') {

      }
      else if (to.path === '/admin') {
        axiosInstance({
          method: "get",
          url: "/user/toAdmin",
          headers: {
            token: store.getters.getToken
          }
        })
          .then((res) => {
            if (res.code === 403) {
              next(false)
              ElMessage({
                message: "您没有权限访问",
                type: "error"
              })
            } else {
              next()
              ElMessage({
                message: "欢迎进入管理员界面",
                type: "success"
              })
            }
          })
          .catch((err) => {
            console.log(err)
            ElMessage({
              message: "您没有权限访问",
              type: "error"
            })
            router.push('/')

          })
      }
      else {
        next()
      }
    } else {
      next({
        path: '/login',
      })
    }
  } else {
    next()
  }
})