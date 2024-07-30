import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/excel',
    name: 'Excel',
    component: () => import('@/views/excelT.vue')
  },
  {
    path: '/edit-tb',
    name: 'Editable',
    component: () => import('@/views/editable-table.vue')
  },
  {
    path: '/edit-tb-v2',
    name: 'EditableV2',
    component: () => import('@/views/editable-table-v2.vue')
  },
  {
    path: '/edit-tb-v2-setup',
    name: 'EditableV2Setup',
    component: () => import('@/views/editable-table-v2-setup.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
