import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'
import './styles/Home/app.css'
import './styles/Home/scroll-reveal.css'
import './styles/Home/login-fallback.css'

createApp(App).use(router).mount('#app')
