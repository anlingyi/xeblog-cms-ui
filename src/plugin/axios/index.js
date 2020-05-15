import store from '@/store'
import { Message } from 'element-ui'
import util from '@/libs/util'
import axios from "axios"
import Cookies from 'js-cookie'
import router from '@/router'

const api_url = process.env.VUE_APP_API_URL

// 记录和显示错误
function addLog (type, err) {
  // 添加到日志
  store.dispatch('d2admin/log/add', {
    type: type,
    err,
    info: '数据请求异常'
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(err)
  }
  // 显示提示
  Message({
    message: err.message,
    type: type,
    duration: 5 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: api_url,
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(function (config) {
    if (config.method === 'get' || config.method === 'post' || config.method === 'patch' || config.method === 'put' || config.method === 'delete' ) {
        if (!config.headers) {
            config.headers = {};
        }

        config.headers['token'] = Cookies.get('token')
        config.headers['uid'] = Cookies.get('uid');

        if (config.headers['Content-Type'] === "" || config.headers['Content-Type'] === undefined) {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            config.transformRequest = [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]

        }
    }
    return config
})

// 响应拦截（配置请求回来的信息）
service.interceptors.response.use(function (response) {
    let data = response.data
    switch (data.code) {
        case 200:
          return response
        case 502:
            addLog('warning',data)
            // 跳转到登陆页
            router.push({
                name: 'login'
            })
            break
        default:
            addLog('warning', data)
          break
    }
}, function (error) {
    // 处理响应失败
    addLog('error', error)
    return Promise.reject(error)
})

export default service
