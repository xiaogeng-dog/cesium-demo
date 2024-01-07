import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: 'cesiumView',
    },

    {
      path: '/cesiumView',
      name: 'cesiumView',
      component: () => import('@/views/CesiumView.vue'),
    },
  ],
})

export default router
