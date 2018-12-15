import request from '@/plugin/axios'

const api = 'api/'
const admin_api = 'admin/api/'

// 登陆
export function AccountLogin (data) {
  return request({
    url: api + 'login',
    method: 'post',
    data
  })
}
// 登出
export function Logout (data) {
    return request({
        url: admin_api + 'logout',
        method: 'put',
        data
    })
}
// 文章列表
export function ArticlesList (data) {
  return request({
    url: admin_api + 'articles',
    method: 'get',
    data
  })
}
