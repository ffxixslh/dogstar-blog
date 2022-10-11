import axios from 'axios'

service.interceptors.response.use(
  response => {
    if (response.data.code === 409) {
      return refreshToken({
        refreshToken: localStorage.getItem('refreshToken'),
        token: getToken()
      }).then(res => {
        const { token } = res.data
        setToken(token)
        response.headers.Authorization = `${token}`
      }).catch(err => {
        removeToken()
        router.push('/login')
        return Promise.reject(err)
      })
    }
    return response && response.data
  },
  (error) => {
    Message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)
