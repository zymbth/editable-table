import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/index.vue'
import VueEleTable from '@/views/VueEleTable'
import VueEleTable_v2 from '@/views/VueEleTable_v2'
import ExcelT from '@/views/excelT'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },{
      path: '/excel',
      name: 'excel',
      component: ExcelT
    },{
      path: '/editable',
      name: 'editable',
      component: VueEleTable
    },{
      path: '/editable_v2',
      name: 'editable_v2',
      component: VueEleTable_v2
    },
  ]
})
