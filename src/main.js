import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'
import './styles/home/app.css'
import './styles/home/scroll-reveal.css'
import './styles/home/login-fallback.css'

createApp(App).use(router).mount('#app')
