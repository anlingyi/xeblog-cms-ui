// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
      title: '文章管理',
      icon: 'newspaper-o',
      children: [
          { path: '/articles-list', title: '文章列表', icon: 'list' },
          { path: '/articles-release', title: '文章发布', icon: 'send' }
      ]
  },
    {
        title: '分类管理',
        icon: 'archive',
        children: [
            { path: '/category-list', title: '分类列表', icon: 'list' },
        ]
    },
    {
        title: '标签管理',
        icon: 'tags',
        children: [
            { path: '/tags-list', title: '标签列表', icon: 'list' },
        ]
    },
    {
        title: '菜单管理',
        icon: 'navicon',
        children: [
            { path: '/menu-list', title: '菜单列表', icon: 'list' },
        ]
    },
    {
        title: '网站管理',
        icon: 'edge',
        children: [
            { path: '/website/info-edit', title: '网站信息修改', icon: 'edit' },
            { path: '/website/blogger-edit', title: '博主信息修改', icon: 'id-card-o' },
            { path: '/website/password-edit', title: '密码修改', icon: 'lock' },
        ]
    }
]
