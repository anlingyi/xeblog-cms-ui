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
// 设置文章推荐
export function SetRecommend(data) {
    return request({
        url: admin_api + 'articles/recommend',
        method: 'put',
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
// 标签列表
export function TagList (data) {
    return request({
        url: admin_api + 'tags',
        method: 'get',
        params: data
    })
}
// 删除标签
export function DeleteTag (data) {
    return request({
        url: admin_api + 'tags',
        method: 'delete',
        params: data
    })
}
// 修改菜单
export function EditMenu (data) {
    return request({
        url: admin_api + 'menu',
        method: 'put',
        data
    })
}
// 添加菜单
export function AddMenu (data) {
    return request({
        url: admin_api + 'menu',
        method: 'post',
        data
    })
}
// 菜单列表
export function MenuList (data) {
    return request({
        url: admin_api + 'menu',
        method: 'get',
        params: data
    })
}
// 删除菜单
export function DeleteMenu (data) {
    return request({
        url: admin_api + 'menu',
        method: 'delete',
        params: data
    })
}
// 修改网站信息
export function EditWebsiteInfo (data) {
    return request({
        url: admin_api + 'website_info',
        method: 'put',
        data
    })
}
// 获取网站信息
export function GetWebsiteInfo (data) {
    return request({
        url: admin_api + 'website_info',
        method: 'get',
        data
    })
}
// 修改用户信息
export function EditUserInfo (data) {
    return request({
        url: admin_api + 'user_info',
        method: 'put',
        data
    })
}
// 获取用户信息
export function GetUserInfo (data) {
    return request({
        url: admin_api + 'user_info',
        method: 'get',
        data
    })
}
// 修改用户密码
export function EditPassword (data) {
    return request({
        url: admin_api + 'user_info/password',
        method: 'put',
        data
    })
}

// 上传图片
export function UploadImage(data) {
    return request({
        url: admin_api + 'upload/image',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 订阅用户列表
export function SubscriberList(data) {
    return request({
        url: admin_api + 'subscriber',
        method: 'get',
        params: data
    })
}

// 文章推送统计
export function ArticlePushStatistics(data) {
    return request({
        url: admin_api + 'push/articlePushStatistics',
        method: 'get',
        params: data
    })
}

// 文章推送
export function ArticlePush(data) {
    return request({
        url: admin_api + 'push',
        method: 'post',
        params: data
    })
}

// 模糊查询标签
export function BlurryQueryTags(data) {
    return request({
        url: admin_api + 'tags/blurry',
        method: 'get',
        params: {
            tag: data
        }
    })
}

// 站点地图配置
export function UpdateSitemapConfig(data) {
    return request({
        url: admin_api + 'sitemap/config',
        method: 'post',
        data
    })
}

// 站点地图生成
export function SitemapGenerate(data) {
    return request({
        url: admin_api + 'sitemap/generate',
        method: 'post',
        data
    })
}

// 获取站点地图配置信息
export function GetSitemapConfig() {
    return request({
        url: admin_api + 'sitemap',
        method: 'get'
    })
}