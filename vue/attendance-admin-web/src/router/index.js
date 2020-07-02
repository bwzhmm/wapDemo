import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  { path: '/login', name: 'login', component: () => import('@/page/login'), meta: { keepAlive: false }, hidden: true },
  { path: '/404', component: () => import('@/page/errorPage/404'), meta: { keepAlive: false }, hidden: true },
  { path: '/401', component: () => import('@/page/errorPage/401'), meta: { keepAlive: false }, hidden: true },
  {
    path: "/home",
    name: "Home",
    component: () => import('@/page/home/index.vue'),
    meta: { keepAlive: true }
  },
  {
    path: "/approve",
    name: "Approve",
    component: () =>
      import("@/page/approveList/index.vue"),
    meta: { keepAlive: true }
  },
  {
    path: "/employee",
    name: "Employee",
    component: () =>
      import("@/page/employeeManage/index.vue"),
    meta: { keepAlive: true }
  },
  {
    path: "/report",
    name: "Report",
    component: () =>
      import("@/page/statisticalReport/index.vue"),
    meta: { keepAlive: true }
  },
  {
    path: "/set",
    name: "Set",
    component: () =>
      import("@/page/set/index.vue"),
    meta: { keepAlive: true }
  }
];

const router = new VueRouter({
  routes
});

export default router;
