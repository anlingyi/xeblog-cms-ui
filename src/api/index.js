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
export function Logout () {
    return request({
        url: admin_api + 'logout',
        method: 'put',
    })
}
// 文章列表
export function ArticlesList (data) {
  return request({
    url: admin_api + 'articles',
    method: 'get',
    params: data
  })
}
// 删除文章
export function DeleteArticle (data) {
    return request({
        url: admin_api + 'articles',
        method: 'delete',
        params: data
    })
}