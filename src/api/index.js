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
// 文章详情
export function ArticleDetails (data) {
    return request({
        url: admin_api + 'articles/details',
        method: 'get',
        params: data
    })
}
// 文章类目选择列表
export function CategorySelect () {
    return request({
        url: admin_api + 'categories/select',
        method: 'get',
    })
}
// 上传
export function Upload (data) {
    return request({
        url: admin_api + 'upload',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// 修改文章
export function EditArticle (data) {
    return request({
        url: admin_api + 'articles',
        method: 'put',
        data
    })
}
// 添加文章
export function AddArticle (data) {
    return request({
        url: admin_api + 'articles',
        method: 'post',
        data
    })
}
// 分类列表
export function CategoryList (data) {
    return request({
        url: admin_api + 'categories',
        method: 'get',
        params: data
    })
}
// 删除分类
export function DeleteCategory (data) {
    return request({
        url: admin_api + 'categories',
        method: 'delete',
        params: data
    })
}
// 修改分类
export function EditCategory (data) {
    return request({
        url: admin_api + 'categories',
        method: 'put',
        data
    })
}
// 添加分类
export function AddCategory (data) {
    return request({
        url: admin_api + 'categories',
        method: 'post',
        data
    })
}