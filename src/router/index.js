import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClueWallView from '../views/ClueWallView.vue'
import ComputerView from '../views/ComputerView.vue'
import PhotoView from '../views/PhotoView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/clue-wall/:track', name: 'clue-wall', component: ClueWallView, props: true },
    { path: '/computer', name: 'computer', component: ComputerView },
    { path: '/photo-board', name: 'photo-board', component: PhotoView },
  ],
})

export default router
