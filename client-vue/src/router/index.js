// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/video/:id',
      name: 'video-detail',
      component: () => import('../views/VideoDetail.vue')
    },
    {
      path: '/options',
      name: 'options',
      component: { template: '<div style="padding:2rem;color:white;text-align:center;"><h1>Options</h1><p>Coming soon...</p></div>' }
    },
    {
      path: '/manage/videos',
      name: 'manage-videos',
      component: () => import('../views/ManageVideos.vue')
    }
  ]
})

export default router