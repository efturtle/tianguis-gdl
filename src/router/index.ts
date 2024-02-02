import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../views/Inicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio
    },
    {
      path: '/nuevo-tianguis',
      name: 'Nuevo Tianguis',
      component: () => import('../views/NuevoTianguis.vue')
    },
    {
      path: '/contacto',
      name: 'Contacto',
      component: () => import('../views/Contacto.vue')
    },
  ]
})

export default router
