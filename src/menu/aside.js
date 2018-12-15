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
  }
]
