import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/public/home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/public/home.vue'),
    meta: {
      title: '首页'
    },
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../views/public/tags.vue'),
    meta: {
      title: '标签',
      requireAuth: true
    }
  },
  {
    path: '/tags/:tagId/:tagName',
    name: 'TagDetail',
    component: () => import('../views/blog/tagblogs.vue'),
    meta: {
      title: '标签详情'
    }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/public/friends.vue'),
    meta: {
      title: '圈子',
      requireAuth: true
    }
  },
  {
    path: '/resource',
    name: 'Resource',
    component: () => import('../views/public/resource.vue'),
    meta: {
      title: '资源',
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/public/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/logup',
    name: 'Logup',
    component: () => import('../views/public/logup.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/public/search.vue'),
    meta: {
      title: '搜索'
    }
  },
  {
    path: '/blogs',
    name: 'Blog',
    component: () => import('../views/blog/Blogs.vue'),
    meta: {
      title: '所有博客',
    },
  },
  {
    path: '/blogs/add',
    name: 'BlogAdd',
    component: () => import('../views/blog/BlogEdit.vue'),
    meta: {
      title: '发布博客',
      requireAuth: true
    }
  },
  {
    path: '/blogs/:blogId',
    name: 'BlogDetail',
    component: () => import('../views/blog/BlogDetail.vue'),
    meta: {
      title: '博客详情',
    }
  },
  {
    path: '/blogs/edit/:blogId',
    name: 'BlogEdit',
    component: () => import('../views/blog/BlogEdit.vue'),
    meta: {
      title: '编辑博客',
      requireAuth: true
    }
  },
  {
    path: '/blogs/user/:userId',
    name: 'UserBlogs',
    component: () => import('../views/blog/BlogsUser.vue'),
    meta: {
      title: '用户文章'
    }
  },
  {
    path: '/self',
    name: 'SelfCenter',
    component: () => import('../views/user/selfcenter.vue'),
    meta: {
      title: '个人中心',
      requireAuth: true
    },
  }, {
    path: '/self/:toUserId',
    name: 'UserCenter',
    component: () => import('../views/user/selfcenter.vue'),
    meta: {
      title: '用户中心',
      requireAuth: true
    }
  },
  {
    path: '/self/setting',
    name: 'Setting',
    component: () => import('../views/user/setting.vue'),
    meta: {
      title: '设置',
      requireAuth: true
    }
  },
  {
    path: '/chat',
    name: 'ChatRoom',
    component: () => import('../views/user/chat.vue'),
    meta: {
      title: '聊天室',
      requireAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/admin-index.vue'),
    meta: {
      title: '后台管理界面',
      requireAuth: true
    }
  },
  {
    path: '/404',
    name: 'PageNotFound',
    component: () => import('../views/notfound/404.vue'),
    meta: {
      title: '不存在的页面'
    },
  },
  // 所有未定义路由，全部重定向到404页，必须放在最后
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
  routes,
  // 页面跳转后自动滚动到最上面
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

export default router
