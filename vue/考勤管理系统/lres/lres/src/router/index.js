import Vue from 'vue'
import Router from 'vue-router'
import index from "../pages/index"
import exam from "../pages/exam/exam"
import examing from "../pages/exam/examing"
import errlog from "../pages/exam/errlog"
import person from "../pages/person/person"
import study from "../pages/study/study"
import shouye from "../pages/shouye/index"
import bind from "../pages/bind/bind"
import campus from "../pages/bind/campus"

Vue.use(Router)



export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect:'campus',
      children:[{
        path: 'campus',
        name: 'campus',
        component: campus,
      },{
        path: 'bind',
        name: 'bind',
        component: bind,
      },{
        path: 'exam',
        name: 'exam',
        component: exam,
      },{
        path: 'examing',
        name: 'examing',
        component: examing,
      },{
        path: 'errlog',
        name: 'errlog',
        component: errlog,
      },{
        path: 'person',
        name: 'person',
        component: person,
      },{
        path: 'study',
        name: 'study',
        component: study,
      },{
        path: 'vediodetail',
        name: 'vediodetail',
        // component: vediodetail,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/vediodetail"),
          props: (route) => ({
            id: route.query.id
        }),
      },{
        path: 'docdetail',
        name: 'docdetail',
        // component: docdetail,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/docdetail"),
          props: (route) => ({
            id: route.query.id
        }),
      },{
        path: 'arcdetail',
        name: 'arcdetail',
        // component: arcdetail,
        component: () =>
          import( /* webpackChunkName: "memberInfo" */ "@/pages/study/arcdetail"),
          props: (route) => ({
            id: route.query.id
        }),
      },{
        path: 'shouye',
        name: 'shouye',
        component: shouye,
      }]
    }
    // ,{
    //   path: '/',
    //   name: 'bind',
    //   component: bind,
    // }
  ]
})
