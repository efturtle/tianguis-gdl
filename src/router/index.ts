import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../views/Inicio.vue'
import NuevoTianguis from '../views/NuevoTianguis.vue'
import Contacto from '../views/Contacto.vue'

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
      component: NuevoTianguis
    },
    {
      path: '/contactanos',
      name: 'Contacto',
      component: Contacto
    },
  ]
})

export default router
