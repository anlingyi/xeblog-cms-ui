import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页 必须 name:index
      {
        path: 'index',
        name: 'index',
        meta,
        component: () => import('@/pages/index')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: {
          beforeRouteEnter (to, from, next) {
            next(vm => vm.$router.replace(from.fullPath))
          },
          render: h => h()
        }
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: {
          beforeRouteEnter (to, from, next) {
            next(vm => vm.$router.replace(JSON.parse(from.params.route)))
          },
          render: h => h()
        }
      },
      // 文章列表
      {
          path: '/articles-list',
          name: 'articles-list',
          component: () => import('@/pages/articles/list'),
          meta: {meta, title: '文章列表'}
      },
      // 文章发布
      {
          path: '/articles-release',
          name: 'articles-release',
          component: () => import('@/pages/articles/release'),
          meta: {meta, title: '文章发布', cache: true}
      },
      // 文章编辑
      {
          path: '/articles-edit',
          name: 'articles-edit',
          component: () => import('@/pages/articles/edit'),
          meta: {meta, title: '文章编辑', cache: true}
      },
      // 分类列表
      {
          path: '/category-list',
          name: 'category-list',
          component: () => import('@/pages/category/list'),
          meta: {meta, title: '分类列表'}
      },
      // 标签列表
      {
          path: '/tags-list',
          name: 'tags-list',
          component: () => import('@/pages/tags/list'),
          meta: {meta, title: '标签列表'}
      },
      // 菜单列表
      {
          path: '/menu-list',
          name: 'menu-list',
          component: () => import('@/pages/menu/list'),
          meta: {meta, title: '菜单列表'}
      },
        // 网站信息修改
        {
            path: '/website/info-edit',
            name: 'website-info-edit',
            component: () => import('@/pages/website/info/edit'),
            meta: {meta, title: '网站信息修改', cache: true}
        },
        // 博主信息修改
        {
            path: '/website/blogger-edit',
            name: 'website-blogger-edit',
            component: () => import('@/pages/website/blogger/edit'),
            meta: {meta, title: '博主信息修改', cache: true}
        },
        // 密码修改
        {
            path: '/website/password-edit',
            name: 'website-password-edit',
            component: () => import('@/pages/website/password/edit'),
            meta: {meta, title: '密码修改', cache: true}
        },
        // 站点地图
        {
            path: '/website/sitemap-config-edit',
            name: 'sitemap-config-edit',
            component: () => import('@/pages/website/sitemap/edit'),
            meta: {meta, title: '站点地图', cache: true}
        },
        // 订阅列表
        {
            path: '/subscriber-list',
            name: 'subscriber-list',
            component: () => import('@/pages/subscriber/list'),
            meta: {meta, title: '订阅列表'}
        }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/error-page-404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
