import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入你的路由配置文件
import './style.css'

const app = createApp(App)
app.use(router) // 这行代码必须有！
app.mount('#app')