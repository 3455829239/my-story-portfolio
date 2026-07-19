import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClueWallView from '../views/ClueWallView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/clue-wall/:track', name: 'clue-wall', component: ClueWallView, props: true },
  ],
})

export default router