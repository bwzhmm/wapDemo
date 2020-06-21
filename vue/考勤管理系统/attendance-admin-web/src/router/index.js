import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {path: '/',
  redirect: '/login'},
  { path: '/login',name: 'login',component:() => import('@/page/login'),meta: {keepAlive: false},hidden: true},
	{ path: '/404', component: () => import('@/page/errorPage/404'),meta: {keepAlive: false}, hidden: true },
  { path: '/401', component: () => import('@/page/errorPage/401'),meta: {keepAlive: false}, hidden: true },
  {
    path: "/home",
    name: "Home",
    component: () => import('@/page/index/index.vue'),
    meta: {keepAlive: true}
  },
  {
    path: "/approve",
    name: "Approve",
    component: () =>
      import("@/page/approveList/index.vue"),
    meta: {keepAlive: true}
  },
  {
    path: "/employee",
    name: "Employee",
    component: () =>
      import("@/page/employeeManage/index.vue"),
    meta: {keepAlive: true}
  },
  {
    path: "/report",
    name: "Report",
    component: () =>
      import("@/page/statisticalReport/index.vue"),
    meta: {keepAlive: true}
  },
  {
    path: "/set",
    name: "Set",
    component: () =>
      import("@/page/set/index.vue"),
    meta: {keepAlive: true}
  }
];

const router = new VueRouter({
  routes
});

export default router;
