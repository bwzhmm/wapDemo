import Vue from "vue"
import Router from "vue-router"
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router);
import BasicLayout from "../layout/BasicLayout"
export const constantRoutes = [
  { path: '/', name: 'login', component: () => import('@env/pages/login/index'), meta: { hidden: true } },
  {
    path: '/function',
    component: BasicLayout,
    redirect: '/dashboard',
    name: 'function',
    meta: { title: '功能中心', icon: 'iconicon-shouye' },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import('@env/pages/function/dashboard/index'),
        meta: { title: "首页", icon: 'iconicon-shouye' }
      },
      {
        path: "/report",
        name: "report",
        component: () => import('@env/pages/function/report/index'),
        meta: { title: "环保体检报告", icon: 'iconicon-baogao' }
      },
      {
        path: '/report/enterprise/details',
        name: 'enterprise-report',
        component: () => import('@env/pages/function/report/enterprise/details'),
        meta: { title: '环保体检报告', icon: 'iconicon-qiyexinxi' }
      },
      {
        path: '/report/enterprise/map',
        name: 'enterprise-map-report',
        component: () => import('@env/pages/function/report/enterprise/map'),
        meta: { title: '环保体检报告', icon: 'iconicon-qiyexinxi' }
      },
      {
        path: '/report/env-evaluate/details',
        name: 'env-evaluate-report',
        component: () => import('@env/pages/function/report/env-evaluate/details'),
        meta: { title: '环保体检报告', icon: 'iconicon-huanjingceping' }
      },
      {
        path: '/report/pollute-prevent/details',
        name: 'pollute-prevent-report',
        component: () => import('@env/pages/function/report/pollute-prevent/details'),
        meta: { title: '环保体检报告', icon: 'iconicon-wuranfangzhi' }
      },
      {
        path: '/report/other-evaluate/details',
        name: 'other-evaluate-report',
        component: () => import('@env/pages/function/report/other-evaluate/details'),
        meta: { title: '环保体检报告', icon: 'iconicon-qitaceping' }
      },

    ]
  },
  {
    path: '/manage',
    component: BasicLayout,
    redirect: '/enterprise',
    name: 'manage',
    meta: { title: '管理中心', icon: 'iconicon-qiyexinxi' },
    children: [{
      path: '/enterprise',
      name: 'enterprise',
      component: () => import('@env/pages/manage/enterprise/index'),
      meta: { title: '企业信息', icon: 'iconicon-qiyexinxi' }
    },
    {
      path: '/enterprise/map',
      name: 'enterprise-map',
      component: () => import('@env/pages/manage/enterprise/map'),
      meta: { title: '企业信息', icon: 'iconicon-qiyexinxi' }
    },
    {
      path: '/enterprise/details',
      name: 'enterprise-details',
      component: () => import('@env/pages/manage/enterprise/details'),
      meta: { title: '企业信息', icon: 'iconicon-qiyexinxi' }
    },
    {
      path: "/env-evaluate",
      name: "env-evaluate",
      component: () => import('@env/pages/manage/env-evaluate/index'),
      meta: { title: '环境测评信息', icon: 'iconicon-huanjingceping' }
    },
    {
      path: '/env-evaluate/details',
      name: 'env-evaluate-details',
      component: () => import('@env/pages/manage/env-evaluate/details'),
      meta: { title: '环境测评信息', icon: 'iconicon-huanjingceping' }
    },
    {
      path: "/pollute-prevent",
      name: "pollute-prevent",
      component: () => import('@env/pages/manage/pollute-prevent/index'),
      meta: { title: '污染防治信息', icon: 'iconicon-wuranfangzhi' }
    },
    {
      path: '/pollute-prevent/details',
      name: 'pollute-prevent-details',
      component: () => import('@env/pages/manage/pollute-prevent/details'),
      meta: { title: '污染防治信息', icon: 'iconicon-wuranfangzhi' }
    },
    {
      path: "/other-evaluate",
      name: "other-evaluate",
      component: () => import('@env/pages/manage/other-evaluate/index'),
      meta: { title: '其他测评信息', icon: 'iconicon-qitaceping' }
    },
    {
      path: '/other-evaluate/details',
      name: 'other-evaluate-details',
      component: () => import('@env/pages/manage/other-evaluate/details'),
      meta: { title: '其他测评信息', icon: 'iconicon-qitaceping' }
    },
    ]
  },
  {
    path: '/set',
    component: BasicLayout,
    redirect: '/account',
    name: 'set',
    meta: { title: '设置中心', icon: 'iconshezhi' },
    children: [{
      path: '/account',
      name: 'account',
      component: () => import('@env/pages/set/account/index'),
      meta: { title: '账号管理', icon: 'iconicon-zhanghaoguanli' }
    },
    {
      path: "/role",
      name: "role",
      component: () => import('@env/pages/set/role/index'),
      meta: { title: '角色权限', icon: 'iconicon-quanxian' }
    },

    {
      path: "/log",
      name: "log",
      component: () => import('@env/pages/set/log/index'),
      meta: { title: '运行日志', icon: 'iconicon-yunhangrizhi' }
    },
    {
      path: "/pwd",
      name: "pwd",
      component: () => import('@env/pages/set/pwd/index'),
      meta: { title: '修改密码', icon: 'iconicon-zhongzhimima' }
    },
    ]
  },
];


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router